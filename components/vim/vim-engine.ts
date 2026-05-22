import {
  type VimState,
  type VimAction,
  type SearchMatch,
  type FileTreeNode,
  bufferKey,
} from "./types";

const VISIBLE_LINES = 40;
const HALF_PAGE = 20;

export function initialVimState(): VimState {
  return {
    mode: "normal",
    cursor: { line: 0, col: 0 },
    currentBuffer: null,
    buffers: {},
    fileTree: [],
    expandedDirs: new Set(),
    neoTreeCursor: 0,
    focusedPanel: "neo-tree",
    searchQuery: "",
    searchDirection: "forward",
    searchMatches: [],
    currentMatchIndex: -1,
    commandInput: "",
    topLine: 0,
    message: "",
    messageTimer: 0,
    pendingKey: null,
    pendingAction: null,
    showHelp: false,
  };
}

export function vimReducer(state: VimState, action: VimAction): VimState {
  switch (action.type) {
    case "KEY_PRESS":
      return handleKeyPress(state, action.key, action.ctrl);
    case "SET_FILE_TREE":
      return { ...state, fileTree: action.tree };
    case "BUFFER_LOADED": {
      const buffers = { ...state.buffers, [action.key]: action.data };
      const s: VimState = { ...state, buffers };
      if (!state.currentBuffer || state.currentBuffer !== action.key) {
        s.currentBuffer = action.key;
        s.cursor = { line: 0, col: 0 };
        s.topLine = 0;
        s.message = action.data.title;
      }
      return s;
    }
    case "SET_LINE_COUNT": {
      const buf = state.buffers[action.key];
      if (!buf) return state;
      const buffers = { ...state.buffers, [action.key]: { ...buf, lineCount: action.count } };
      return { ...state, buffers };
    }
    case "CLEAR_PENDING_ACTION":
      return { ...state, pendingAction: null };
    case "SET_MESSAGE":
      return { ...state, message: action.message };
    case "CLEAR_MESSAGE":
      return { ...state, message: "" };
    case "SCROLL_TO_CURSOR":
      return scrollToCursor(state);
    default:
      return state;
  }
}

function handleKeyPress(state: VimState, key: string, ctrl: boolean): VimState {
  switch (state.mode) {
    case "normal":
      return handleNormalMode(state, key, ctrl);
    case "command":
      return handleCommandMode(state, key);
    case "search":
      return handleSearchMode(state, key);
    default:
      return state;
  }
}

// ─── Normal Mode ────────────────────────────────────────────────

function handleNormalMode(state: VimState, key: string, ctrl: boolean): VimState {
  // Handle pending keys (for 'gg' and '<leader>')
  if (state.pendingKey === "g") {
    if (key === "g") {
      return scrollToCursor({ ...state, cursor: { line: 0, col: 0 }, topLine: 0, pendingKey: null });
    }
    return { ...state, pendingKey: null };
  }
  if (state.pendingKey === "leader") {
    if (key === "w" || key === "e") {
      return {
        ...state,
        pendingKey: null,
        focusedPanel: state.focusedPanel === "neo-tree" ? "buffer" : "neo-tree",
      };
    }
    return { ...state, pendingKey: null };
  }

  if (ctrl) {
    return handleCtrlKey(state, key);
  }

  const buf = getCurrentBuffer(state);
  const totalLines = buf?.lineCount ?? 1;

  switch (key) {
    // Movement - handle NeoTree focus separately
    case "j": {
      if (state.focusedPanel === "neo-tree") {
        const flat = flattenTree(state.fileTree, state.expandedDirs);
        const neoTreeCursor = Math.min(state.neoTreeCursor + 1, flat.length - 1);
        return { ...state, neoTreeCursor };
      }
      const line = Math.min(state.cursor.line + 1, totalLines - 1);
      return scrollToCursor({ ...state, cursor: { ...state.cursor, line } });
    }
    case "k": {
      if (state.focusedPanel === "neo-tree") {
        const neoTreeCursor = Math.max(state.neoTreeCursor - 1, 0);
        return { ...state, neoTreeCursor };
      }
      const line = Math.max(state.cursor.line - 1, 0);
      return scrollToCursor({ ...state, cursor: { ...state.cursor, line } });
    }
    case "h": {
      if (state.focusedPanel === "neo-tree") {
        const flat = flattenTree(state.fileTree, state.expandedDirs);
        const node = flat[state.neoTreeCursor];
        if (node?.type === "dir" && state.expandedDirs.has(node.path)) {
          const expandedDirs = new Set(state.expandedDirs);
          expandedDirs.delete(node.path);
          return { ...state, expandedDirs };
        }
        return state;
      }
      return { ...state, cursor: { ...state.cursor, col: Math.max(state.cursor.col - 1, 0) } };
    }
    case "l": {
      if (state.focusedPanel === "neo-tree") {
        return neoTreeActivate(state);
      }
      return { ...state, cursor: { ...state.cursor, col: state.cursor.col + 1 } };
    }

    // Tab switching
    case "L":
      return switchBuffer(state, {}, 1);
    case "H":
      return switchBuffer(state, {}, -1);

    // Word movement (simplified: move by line for HTML content)
    case "w": {
      const line = Math.min(state.cursor.line + 1, totalLines - 1);
      return scrollToCursor({ ...state, cursor: { line, col: 0 } });
    }
    case "b": {
      const line = Math.max(state.cursor.line - 1, 0);
      return scrollToCursor({ ...state, cursor: { line, col: 0 } });
    }

    // Line jumps
    case "g":
      return { ...state, pendingKey: "g" };
    case "G": {
      const line = totalLines - 1;
      return scrollToCursor({ ...state, cursor: { line, col: 0 }, topLine: Math.max(0, line - VISIBLE_LINES + 5) });
    }
    case "0":
      return { ...state, cursor: { ...state.cursor, col: 0 } };
    case "$":
      return { ...state, cursor: { ...state.cursor, col: 999 } };

    // Search navigation
    case "n":
      return jumpToNextMatch(state, 1);
    case "N":
      return jumpToNextMatch(state, -1);

    // Mode transitions
    case ":":
      return { ...state, mode: "command", commandInput: ":" };
    case "/":
      return { ...state, mode: "search", searchQuery: "/", searchDirection: "forward" };
    case "?":
      return { ...state, mode: "search", searchQuery: "?", searchDirection: "backward" };

    // Leader key (Space)
    case " ":
      return { ...state, pendingKey: "leader" };

    // NeoTree activate (Enter or l)
    case "Enter":
      if (state.focusedPanel === "neo-tree") {
        return neoTreeActivate(state);
      }
      return state;

    // Help
    case "F1":
      return { ...state, showHelp: !state.showHelp };

    default:
      return state;
  }
}

function handleCtrlKey(state: VimState, key: string): VimState {
  const totalLines = getCurrentBuffer(state)?.lineCount ?? 1;
  switch (key) {
    case "d": {
      const line = Math.min(state.cursor.line + HALF_PAGE, totalLines - 1);
      return scrollToCursor({ ...state, cursor: { ...state.cursor, line } });
    }
    case "u": {
      const line = Math.max(state.cursor.line - HALF_PAGE, 0);
      return scrollToCursor({ ...state, cursor: { ...state.cursor, line } });
    }
    case "f": {
      const line = Math.min(state.cursor.line + VISIBLE_LINES, totalLines - 1);
      return scrollToCursor({ ...state, cursor: { ...state.cursor, line } });
    }
    case "b": {
      const line = Math.max(state.cursor.line - VISIBLE_LINES, 0);
      return scrollToCursor({ ...state, cursor: { ...state.cursor, line } });
    }
    default:
      return state;
  }
}

// ─── Command Mode ───────────────────────────────────────────────

function handleCommandMode(state: VimState, key: string): VimState {
  if (key === "Escape") {
    return { ...state, mode: "normal", commandInput: "" };
  }
  if (key === "Enter") {
    return executeCommand(state);
  }
  if (key === "Backspace") {
    const input = state.commandInput;
    if (input.length <= 1) {
      return { ...state, mode: "normal", commandInput: "" };
    }
    return { ...state, commandInput: input.slice(0, -1) };
  }
  // Ignore control keys
  if (key.startsWith("Arrow") || key === "Shift" || key === "Control" || key === "Alt" || key === "Meta") {
    return state;
  }
  return { ...state, commandInput: state.commandInput + key };
}

function executeCommand(state: VimState): VimState {
  const cmd = state.commandInput.slice(1).trim();
  const base: Partial<VimState> = { mode: "normal" as const, commandInput: "" };

  if (cmd === "q" || cmd === "q!") {
    window.location.href = "/";
    return { ...state, ...base };
  }
  if (cmd === "help") {
    return { ...state, ...base, showHelp: true, message: ":help - press F1 to close" };
  }
  if (cmd === "ls") {
    const bufs = Object.entries(state.buffers);
    const lines = bufs.map(([k, b], i) => `  ${i + 1} ${b.title}  [${k}]`).join("\n");
    return { ...state, ...base, message: lines || "No buffers" };
  }
  if (cmd === "bn") {
    return switchBuffer(state, base, 1);
  }
  if (cmd === "bp") {
    return switchBuffer(state, base, -1);
  }
  if (cmd.startsWith("e ")) {
    const path = cmd.slice(2).trim();
    const parts = path.split("/");
    if (parts.length >= 2) {
      const category = parts[0];
      const slug = parts.slice(1).join("/").replace(/\.md$/, "");
      return {
        ...state,
        ...base,
        pendingAction: { type: "OPEN_ARTICLE", category, slug },
      };
    }
    return { ...state, ...base, message: `E492: Not an editor command: ${cmd}` };
  }
  return { ...state, ...base, message: `E492: Not an editor command: ${cmd}` };
}

function switchBuffer(state: VimState, base: Partial<VimState>, dir: 1 | -1): VimState {
  const keys = Object.keys(state.buffers);
  if (keys.length === 0) return { ...state, ...base };
  const idx = keys.indexOf(state.currentBuffer || "");
  const next = (idx + dir + keys.length) % keys.length;
  const key = keys[next];
  return scrollToCursor({
    ...state,
    ...base,
    currentBuffer: key,
    cursor: { line: 0, col: 0 },
    topLine: 0,
    message: state.buffers[key].title,
  });
}

// ─── Search Mode ────────────────────────────────────────────────

function handleSearchMode(state: VimState, key: string): VimState {
  if (key === "Escape") {
    return { ...state, mode: "normal", searchQuery: "" };
  }
  if (key === "Enter") {
    const query = state.searchQuery.slice(1);
    if (!query) return { ...state, mode: "normal", searchQuery: "" };
    const matches = findSearchMatches(state, query);
    const s: VimState = {
      ...state,
      mode: "normal",
      searchMatches: matches,
      currentMatchIndex: matches.length > 0 ? 0 : -1,
      message: matches.length > 0
        ? `Pattern: ${query} (${matches.length} matches)`
        : `Pattern not found: ${query}`,
    };
    if (matches.length > 0) {
      return scrollToCursor({ ...s, cursor: { line: matches[0].line, col: matches[0].startCol } });
    }
    return s;
  }
  if (key === "Backspace") {
    const q = state.searchQuery;
    if (q.length <= 1) {
      return { ...state, mode: "normal", searchQuery: "" };
    }
    return { ...state, searchQuery: q.slice(0, -1) };
  }
  if (key.startsWith("Arrow") || key === "Shift" || key === "Control" || key === "Alt" || key === "Meta") {
    return state;
  }
  return { ...state, searchQuery: state.searchQuery + key };
}

function findSearchMatches(state: VimState, query: string): SearchMatch[] {
  const buf = getCurrentBuffer(state);
  if (!buf) return [];
  const matches: SearchMatch[] = [];
  const regex = new RegExp(escapeRegex(query), "gi");

  const div = document.createElement("div");
  div.innerHTML = buf.contentHtml;
  const text = div.textContent || "";
  const lines = text.split("\n");

  lines.forEach((line, i) => {
    let m;
    while ((m = regex.exec(line)) !== null) {
      matches.push({ line: i, startCol: m.index, endCol: m.index + m[0].length });
    }
  });

  return matches;
}

function jumpToNextMatch(state: VimState, dir: 1 | -1): VimState {
  if (state.searchMatches.length === 0) return state;
  const next = (state.currentMatchIndex + dir + state.searchMatches.length) % state.searchMatches.length;
  const match = state.searchMatches[next];
  return scrollToCursor({
    ...state,
    currentMatchIndex: next,
    cursor: { line: match.line, col: match.startCol },
  });
}

// ─── Helpers ────────────────────────────────────────────────────

function getCurrentBuffer(state: VimState) {
  if (!state.currentBuffer) return null;
  return state.buffers[state.currentBuffer] ?? null;
}

function scrollToCursor(state: VimState): VimState {
  const { cursor, topLine } = state;
  let newTop = topLine;
  if (cursor.line < topLine) {
    newTop = Math.max(0, cursor.line - 3);
  } else if (cursor.line >= topLine + VISIBLE_LINES - 3) {
    newTop = cursor.line - VISIBLE_LINES + 5;
  }
  return { ...state, topLine: Math.max(0, newTop) };
}

function neoTreeActivate(state: VimState): VimState {
  const flat = flattenTree(state.fileTree, state.expandedDirs);
  const node = flat[state.neoTreeCursor];
  if (!node) return state;

  if (node.type === "dir") {
    const newExpanded = new Set(state.expandedDirs);
    if (newExpanded.has(node.path)) {
      newExpanded.delete(node.path);
    } else {
      newExpanded.add(node.path);
    }
    return { ...state, expandedDirs: newExpanded };
  }

  const parts = node.path.split("/");
  const category = parts[0];
  const slug = parts.slice(1).join("/");
  return {
    ...state,
    focusedPanel: "buffer",
    pendingAction: { type: "OPEN_ARTICLE", category, slug },
  };
}

export function flattenTree(tree: FileTreeNode[], expanded: Set<string>): FileTreeNode[] {
  const result: FileTreeNode[] = [];
  for (const node of tree) {
    result.push(node);
    if (node.type === "dir" && expanded.has(node.path) && node.children) {
      result.push(...flattenTree(node.children, expanded));
    }
  }
  return result;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
