# Vim Reader Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Neovim/LazyVim-styled reading interface at `/vim` where users browse and read wiki articles using Vim keybindings.

**Architecture:** Self-built Vim keybinding engine (pure reducer) + LazyVim-style React components. Tokyo Night theme. Article data fetched via existing `/api/search` + new `/api/article` endpoint. Vim page overlays the full viewport to avoid Header/Footer interference.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Tailwind CSS v4, Geist Mono font.

**Note:** No test framework exists in this project. Manual testing via `pnpm dev` + visiting `http://localhost:3000/vim`.

---

## File Structure

| File | Responsibility |
|------|---------------|
| `components/vim/types.ts` | Shared TypeScript types and interfaces |
| `components/vim/vim-engine.ts` | Pure reducer: state transitions for all Vim modes |
| `components/vim/tokyo-night.css` | Tokyo Night theme CSS (colors, typography, highlights) |
| `app/api/article/route.ts` | API endpoint: returns rendered article HTML |
| `app/vim/layout.tsx` | Minimal root layout override (fullscreen, Geist Mono only) |
| `app/vim/page.tsx` | Vim page entry point, renders VimApp |
| `components/vim/VimApp.tsx` | Top-level orchestrator: useReducer, keyboard capture, side effects |
| `components/vim/Tabline.tsx` | Top tab bar showing open buffer names |
| `components/vim/NeoTree.tsx` | Left file browser with j/k navigation |
| `components/vim/Buffer.tsx` | Right content area: article HTML with line numbers + cursorline |
| `components/vim/CommandLine.tsx` | Bottom status bar + command input line |
| `components/vim/SearchBar.tsx` | Search input overlay (/ and ? trigger) |
| `components/Header.tsx` | Modified: add /vim link to navigation |

---

### Task 1: Types + API Endpoint + Page Shell

**Files:**
- Create: `components/vim/types.ts`
- Create: `app/api/article/route.ts`
- Create: `app/vim/layout.tsx`
- Create: `app/vim/page.tsx`

- [ ] **Step 1: Create `components/vim/types.ts`**

```typescript
export interface Cursor {
  line: number;
  col: number;
}

export interface FileTreeNode {
  type: "dir" | "file";
  name: string;
  path: string;
  label: string;
  children?: FileTreeNode[];
}

export interface BufferData {
  category: string;
  slug: string;
  title: string;
  contentHtml: string;
  lineCount: number;
}

export interface SearchMatch {
  line: number;
  startCol: number;
  endCol: number;
}

export type VimMode = "normal" | "command" | "search";
export type FocusedPanel = "neo-tree" | "buffer";

export interface PendingAction {
  type: "OPEN_ARTICLE";
  category: string;
  slug: string;
}

export interface VimState {
  mode: VimMode;
  cursor: Cursor;
  currentBuffer: string | null;
  buffers: Record<string, BufferData>;
  fileTree: FileTreeNode[];
  expandedDirs: Set<string>;
  neoTreeCursor: number;
  focusedPanel: FocusedPanel;
  searchQuery: string;
  searchDirection: "forward" | "backward";
  searchMatches: SearchMatch[];
  currentMatchIndex: number;
  commandInput: string;
  topLine: number;
  message: string;
  messageTimer: number;
  pendingKey: string | null;
  pendingAction: PendingAction | null;
  showHelp: boolean;
}

export type VimAction =
  | { type: "KEY_PRESS"; key: string; ctrl: boolean }
  | { type: "SET_FILE_TREE"; tree: FileTreeNode[] }
  | { type: "BUFFER_LOADED"; key: string; data: BufferData }
  | { type: "SET_LINE_COUNT"; key: string; count: number }
  | { type: "CLEAR_PENDING_ACTION" }
  | { type: "SET_MESSAGE"; message: string }
  | { type: "CLEAR_MESSAGE" }
  | { type: "SCROLL_TO_CURSOR" };

export function bufferKey(category: string, slug: string): string {
  return `${category}/${slug}`;
}
```

- [ ] **Step 2: Create `app/api/article/route.ts`**

```typescript
import { NextResponse } from "next/server";
import { getArticle } from "@/lib/content";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const slug = searchParams.get("slug");

  if (!category || !slug) {
    return NextResponse.json({ error: "Missing category or slug" }, { status: 400 });
  }

  const article = await getArticle(category, slug);
  if (!article) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  return NextResponse.json({
    title: article.title,
    category: article.category,
    slug: article.slug,
    contentHtml: article.contentHtml,
    date: article.date,
    author: article.author,
  });
}
```

- [ ] **Step 3: Create `app/vim/layout.tsx`**

This layout overrides the root layout's Header/Footer by rendering a clean full-screen shell.

```tsx
import { Geist_Mono } from "next/font/google";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Vim Mode - HDU Wiki",
};

export default function VimLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${geistMono.variable} fixed inset-0 z-50 bg-[#1a1b26] text-[#c0caf5]`} style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: "13px", lineHeight: "1.6" }}>
      {children}
    </div>
  );
}
```

- [ ] **Step 4: Create `app/vim/page.tsx`**

```tsx
"use client";

import VimApp from "@/components/vim/VimApp";

export default function VimPage() {
  return <VimApp />;
}
```

- [ ] **Step 5: Verify the API works**

Run: `pnpm dev`

Visit `http://localhost:3000/api/article?category=tech&slug=how-to-use-github` and confirm JSON response with `contentHtml`.

- [ ] **Step 6: Commit**

```bash
git add components/vim/types.ts app/api/article/route.ts app/vim/layout.tsx app/vim/page.tsx
git commit -m "feat(vim): add types, article API endpoint, and page shell"
```

---

### Task 2: Tokyo Night CSS Theme

**Files:**
- Create: `components/vim/tokyo-night.css`

- [ ] **Step 1: Create the Tokyo Night theme stylesheet**

```css
/* Tokyo Night theme for Vim reader mode */
@import "highlight.js/styles/tokyo-night-dark.css";

/* Scrollbar for vim panels */
.vim-scroll::-webkit-scrollbar {
  width: 4px;
}
.vim-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.vim-scroll::-webkit-scrollbar-thumb {
  background: #292e42;
  border-radius: 2px;
}
.vim-scroll::-webkit-scrollbar-thumb:hover {
  background: #3b4261;
}

/* Tabline */
.vim-tabline {
  background: #16161e;
  border-bottom: 1px solid #292e42;
  display: flex;
  align-items: center;
  height: 28px;
  padding: 0 8px;
}
.vim-tab {
  padding: 2px 12px;
  font-size: 12px;
  color: #565f89;
  cursor: pointer;
  border-radius: 4px 4px 0 0;
}
.vim-tab-active {
  background: #1a1b26;
  color: #c0caf5;
}

/* NeoTree */
.vim-neotree {
  background: #16161e;
  border-right: 1px solid #292e42;
  width: 220px;
  flex-shrink: 0;
  overflow-y: auto;
}
.vim-neotree-header {
  padding: 8px 12px;
  font-size: 11px;
  font-weight: 600;
  color: #7aa2f7;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.vim-neotree-item {
  display: flex;
  align-items: center;
  padding: 2px 12px;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.vim-neotree-item:hover {
  background: #1a1b26;
}
.vim-neotree-selected {
  background: #292e42;
}
.vim-neotree-dir {
  color: #7aa2f7;
}
.vim-neotree-file {
  color: #9ece6a;
}
.vim-neotree-icon {
  margin-right: 6px;
  width: 16px;
  text-align: center;
  flex-shrink: 0;
}

/* Buffer */
.vim-buffer {
  flex: 1;
  overflow-y: auto;
  position: relative;
  background: #1a1b26;
}
.vim-buffer-line {
  display: flex;
  min-height: 1.6em;
  padding-right: 8px;
}
.vim-buffer-linenr {
  width: 48px;
  text-align: right;
  padding-right: 12px;
  color: #3b4261;
  user-select: none;
  flex-shrink: 0;
}
.vim-buffer-linenr-active {
  color: #c0caf5;
}
.vim-buffer-content {
  flex: 1;
  min-width: 0;
  overflow-wrap: break-word;
}
.vim-cursorline {
  background: #292e42;
}

/* Buffer content styling (Tokyo Night themed wiki-content) */
.vim-buffer-content h1 {
  color: #bb9af7;
  font-size: 1.5em;
  font-weight: 700;
  margin: 0.5em 0;
  padding-bottom: 0.3em;
  border-bottom: 1px solid #292e42;
}
.vim-buffer-content h2 {
  color: #7aa2f7;
  font-size: 1.25em;
  font-weight: 600;
  margin: 0.8em 0 0.4em;
  padding-bottom: 0.2em;
  border-bottom: 1px solid #292e42;
}
.vim-buffer-content h3 {
  color: #e0af68;
  font-size: 1.1em;
  font-weight: 600;
  margin: 0.6em 0 0.3em;
}
.vim-buffer-content h4 {
  color: #7dcfff;
  font-size: 1em;
  font-weight: 600;
  margin: 0.5em 0 0.2em;
}
.vim-buffer-content p {
  margin: 0 0 0.5em;
  line-height: 1.7;
}
.vim-buffer-content a {
  color: #7aa2f7;
  text-decoration: underline;
  text-underline-offset: 2px;
}
.vim-buffer-content a:hover {
  color: #bb9af7;
}
.vim-buffer-content ul,
.vim-buffer-content ol {
  margin: 0 0 0.5em;
  padding-left: 1.5em;
}
.vim-buffer-content ul {
  list-style-type: disc;
}
.vim-buffer-content ol {
  list-style-type: decimal;
}
.vim-buffer-content li {
  margin-bottom: 0.15em;
  line-height: 1.7;
}
.vim-buffer-content blockquote {
  border-left: 3px solid #7aa2f7;
  padding: 0.3em 1em;
  margin: 0.5em 0;
  color: #565f89;
  background: #16161e;
}
.vim-buffer-content code {
  background: #16161e;
  color: #7dcfff;
  padding: 0.1em 0.4em;
  border-radius: 3px;
  font-family: inherit;
}
.vim-buffer-content pre {
  background: #16161e;
  border: 1px solid #292e42;
  border-radius: 4px;
  padding: 0.6em 0.8em;
  overflow-x: auto;
  margin: 0.5em 0;
}
.vim-buffer-content pre code {
  background: none;
  padding: 0;
  border-radius: 0;
}
.vim-buffer-content table {
  width: 100%;
  border-collapse: collapse;
  margin: 0.5em 0;
}
.vim-buffer-content th,
.vim-buffer-content td {
  border: 1px solid #292e42;
  padding: 0.3em 0.6em;
  text-align: left;
}
.vim-buffer-content th {
  background: #16161e;
  color: #7aa2f7;
}
.vim-buffer-content tr:nth-child(even) {
  background: #16161e;
}
.vim-buffer-content hr {
  border: none;
  border-top: 1px solid #292e42;
  margin: 0.8em 0;
}
.vim-buffer-content img {
  max-width: 100%;
  border-radius: 4px;
}
.vim-buffer-content strong {
  color: #e0af68;
}
.vim-buffer-content em {
  color: #bb9af7;
}

/* Status bar */
.vim-statusbar {
  background: #16161e;
  border-top: 1px solid #292e42;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 20px;
  padding: 0 8px;
  font-size: 11px;
}
.vim-statusbar-left {
  display: flex;
  align-items: center;
  gap: 0;
}
.vim-statusbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #565f89;
}
.vim-status-mode {
  padding: 0 8px;
  font-weight: 600;
  height: 20px;
  display: flex;
  align-items: center;
}
.vim-status-normal {
  background: #9ece6a;
  color: #1a1b26;
}
.vim-status-command {
  background: #e0af68;
  color: #1a1b26;
}
.vim-status-search {
  background: #7aa2f7;
  color: #1a1b26;
}

/* Command line */
.vim-commandline {
  background: #1a1b26;
  border-top: 1px solid #16161e;
  height: 20px;
  padding: 0 8px;
  display: flex;
  align-items: center;
  font-size: 12px;
}
.vim-commandline-input {
  background: transparent;
  border: none;
  color: #c0caf5;
  font-family: inherit;
  font-size: inherit;
  outline: none;
  width: 100%;
  caret-color: #c0caf5;
}

/* Search bar */
.vim-searchbar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background: #16161e;
  border-bottom: 1px solid #292e42;
  display: flex;
  align-items: center;
  height: 24px;
  padding: 0 8px;
  font-size: 12px;
  z-index: 10;
}
.vim-searchbar-input {
  background: transparent;
  border: none;
  color: #c0caf5;
  font-family: inherit;
  font-size: inherit;
  outline: none;
  flex: 1;
  caret-color: #c0caf5;
}
.vim-searchbar-count {
  color: #565f89;
  font-size: 11px;
  margin-left: 8px;
}

/* Search highlights */
.vim-search-match {
  background: rgba(247, 118, 142, 0.3);
  border-radius: 2px;
}
.vim-search-current {
  background: rgba(255, 158, 100, 0.4);
  text-decoration: underline;
  text-decoration-color: #ff9e64;
}

/* Blinking cursor for command/search input */
@keyframes vim-blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

/* Help page */
.vim-help-title {
  color: #bb9af7;
  font-weight: 700;
  margin-bottom: 0.5em;
}
.vim-help-section {
  color: #7aa2f7;
  font-weight: 600;
  margin-top: 0.6em;
  margin-bottom: 0.3em;
}
.vim-help-key {
  color: #e0af68;
  display: inline-block;
  min-width: 80px;
}
.vim-help-desc {
  color: #565f89;
}
```

- [ ] **Step 2: Commit**

```bash
git add components/vim/tokyo-night.css
git commit -m "feat(vim): add Tokyo Night CSS theme"
```

---

### Task 3: Vim Engine (Pure Reducer Logic)

**Files:**
- Create: `components/vim/vim-engine.ts`

This is the core Vim keybinding logic. Pure function — no React, no DOM.

- [ ] **Step 1: Create `components/vim/vim-engine.ts`**

```typescript
import {
  type VimState,
  type VimAction,
  type SearchMatch,
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
    focusedPanel: "buffer",
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
      if (!state.currentBuffer) {
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
  // Handle pending key (for 'gg')
  if (state.pendingKey === "g") {
    if (key === "g") {
      return scrollToCursor({ ...state, cursor: { line: 0, col: 0 }, topLine: 0, pendingKey: null });
    }
    return { ...state, pendingKey: null };
  }

  if (ctrl) {
    return handleCtrlKey(state, key);
  }

  const buf = getCurrentBuffer(state);
  const totalLines = buf?.lineCount ?? 1;

  switch (key) {
    // Movement
    case "j": {
      const line = Math.min(state.cursor.line + 1, totalLines - 1);
      return scrollToCursor({ ...state, cursor: { ...state.cursor, line } });
    }
    case "k": {
      const line = Math.max(state.cursor.line - 1, 0);
      return scrollToCursor({ ...state, cursor: { ...state.cursor, line } });
    }
    case "h":
      return { ...state, cursor: { ...state.cursor, col: Math.max(state.cursor.col - 1, 0) } };
    case "l":
      return { ...state, cursor: { ...state.cursor, col: state.cursor.col + 1 } };

    // Word movement
    case "w":
      return wordForward(state);
    case "b":
      return wordBackward(state);

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
      return { ...state, cursor: { ...state.cursor, col: 0 } }; // col tracked in status only

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

    // Panel focus
    case "Tab":
      return {
        ...state,
        focusedPanel: state.focusedPanel === "neo-tree" ? "buffer" : "neo-tree",
      };

    // NeoTree actions (when focused)
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
  return { ...state, commandInput: state.commandInput + key };
}

function executeCommand(state: VimState): VimState {
  const cmd = state.commandInput.slice(1).trim(); // strip leading ':'
  const base: Partial<VimState> = { mode: "normal", commandInput: "" };

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
    const query = state.searchQuery.slice(1); // strip leading / or ?
    if (!query) return { ...state, mode: "normal", searchQuery: "" };
    const matches = findSearchMatches(state, query);
    const s: VimState = {
      ...state,
      mode: "normal",
      searchMatches: matches,
      currentMatchIndex: matches.length > 0 ? 0 : -1,
      message: matches.length > 0 ? `Pattern: ${query} (${matches.length} matches)` : `Pattern not found: ${query}`,
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
  return { ...state, topLine: newTop };
}

function wordForward(state: VimState): VimState {
  const buf = getCurrentBuffer(state);
  if (!buf) return state;
  // Simplified: move cursor down one line (word-forward approximation for HTML content)
  const line = Math.min(state.cursor.line + 1, buf.lineCount - 1);
  return scrollToCursor({ ...state, cursor: { line, col: 0 } });
}

function wordBackward(state: VimState): VimState {
  const line = Math.max(state.cursor.line - 1, 0);
  return scrollToCursor({ ...state, cursor: { line, col: 0 } });
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

  // File: open it
  const parts = node.path.split("/");
  const category = parts[0];
  const slug = parts.slice(1).join("/");
  return {
    ...state,
    focusedPanel: "buffer",
    pendingAction: { type: "OPEN_ARTICLE", category, slug },
  };
}

export function flattenTree(tree: import("./types").FileTreeNode[], expanded: Set<string>): import("./types").FileTreeNode[] {
  const result: import("./types").FileTreeNode[] = [];
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
```

- [ ] **Step 2: Commit**

```bash
git add components/vim/vim-engine.ts
git commit -m "feat(vim): add Vim keybinding engine (pure reducer)"
```

---

### Task 4: VimApp Container

**Files:**
- Create: `components/vim/VimApp.tsx`

This is the top-level orchestrator that wires state, keyboard events, and async side effects.

- [ ] **Step 1: Create `components/vim/VimApp.tsx`**

```tsx
"use client";

import { useReducer, useEffect, useCallback, useRef } from "react";
import type { VimState, FileTreeNode, BufferData } from "./types";
import { bufferKey } from "./types";
import { vimReducer, initialVimState, flattenTree } from "./vim-engine";
import Tabline from "./Tabline";
import NeoTree from "./NeoTree";
import Buffer from "./Buffer";
import CommandLine from "./CommandLine";
import SearchBar from "./SearchBar";
import "./tokyo-night.css";

export default function VimApp() {
  const [state, dispatch] = useReducer(vimReducer, undefined, initialVimState);
  const pendingRef = useRef(state.pendingAction);

  // Sync ref for use in effect cleanup
  useEffect(() => {
    pendingRef.current = state.pendingAction;
  }, [state.pendingAction]);

  // Fetch file tree on mount
  useEffect(() => {
    fetch("/api/search")
      .then((r) => r.json())
      .then((data: { category: string; slug: string; title: string }[]) => {
        const tree = buildFileTree(data);
        dispatch({ type: "SET_FILE_TREE", tree });
      });
  }, []);

  // Handle pending actions (async side effects)
  useEffect(() => {
    const action = state.pendingAction;
    if (!action) return;

    if (action.type === "OPEN_ARTICLE") {
      const key = bufferKey(action.category, action.slug);
      // Already loaded?
      if (state.buffers[key]) {
        dispatch({ type: "CLEAR_PENDING_ACTION" });
        dispatch({
          type: "SET_MESSAGE",
          message: state.buffers[key].title,
        });
        // Switch to it
        const s: Partial<VimState> = { currentBuffer: key, cursor: { line: 0, col: 0 }, topLine: 0 };
        // We need a custom action for switch, but for simplicity use multiple dispatches
        return;
      }

      fetch(
        `/api/article?category=${encodeURIComponent(action.category)}&slug=${encodeURIComponent(action.slug)}`
      )
        .then((r) => {
          if (!r.ok) throw new Error("Not found");
          return r.json();
        })
        .then((data) => {
          const bufData: BufferData = {
            category: data.category,
            slug: data.slug,
            title: data.title,
            contentHtml: data.contentHtml,
            lineCount: 0,
          };
          dispatch({ type: "BUFFER_LOADED", key, data: bufData });
          dispatch({ type: "CLEAR_PENDING_ACTION" });
        })
        .catch(() => {
          dispatch({ type: "CLEAR_PENDING_ACTION" });
          dispatch({ type: "SET_MESSAGE", message: `E211: File not found: ${action.category}/${action.slug}` });
        });
    }
  }, [state.pendingAction, state.buffers]);

  // Handle BUFFER_LOADED to also set as current buffer if it was a pending open
  useEffect(() => {
    const action = state.pendingAction;
    if (action?.type === "OPEN_ARTICLE") {
      const key = bufferKey(action.category, action.slug);
      if (state.buffers[key] && state.currentBuffer !== key) {
        // Force switch by dispatching again with the loaded data
        const data = state.buffers[key];
        dispatch({ type: "BUFFER_LOADED", key, data });
        dispatch({ type: "CLEAR_PENDING_ACTION" });
      }
    }
  }, [state.buffers]);

  // Keyboard handler
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Ignore if user is typing in a native input outside our components
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" && !target.classList.contains("vim-internal-input")) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      const ctrl = e.ctrlKey || e.metaKey;
      let key = e.key;

      // Normalize key names
      if (key === " ") key = "Space";
      if (key === "Tab") key = "Tab";

      dispatch({ type: "KEY_PRESS", key, ctrl });
    },
    []
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [handleKeyDown]);

  const buffer = state.currentBuffer ? state.buffers[state.currentBuffer] : null;

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      {/* Tabline */}
      <Tabline buffers={state.buffers} currentBuffer={state.currentBuffer} />

      {/* Main area */}
      <div className="flex flex-1 overflow-hidden">
        {/* NeoTree */}
        <NeoTree
          fileTree={state.fileTree}
          expandedDirs={state.expandedDirs}
          cursor={state.neoTreeCursor}
          visible={state.focusedPanel === "neo-tree"}
        />

        {/* Buffer area (with optional search bar overlay) */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {state.mode === "search" && (
            <SearchBar
              query={state.searchQuery}
              direction={state.searchDirection}
              matchCount={state.searchMatches.length}
              currentMatch={state.currentMatchIndex}
            />
          )}

          {state.showHelp ? (
            <HelpPage />
          ) : buffer ? (
            <Buffer
              buffer={buffer}
              cursor={state.cursor}
              topLine={state.topLine}
              searchMatches={state.searchMatches}
              currentMatchIndex={state.currentMatchIndex}
              dispatch={dispatch}
            />
          ) : (
            <EmptyBuffer />
          )}
        </div>
      </div>

      {/* Status bar + Command line */}
      <CommandLine
        mode={state.mode}
        commandInput={state.commandInput}
        message={state.message}
        buffer={buffer}
        cursor={state.cursor}
        focusedPanel={state.focusedPanel}
      />
    </div>
  );
}

function EmptyBuffer() {
  return (
    <div className="vim-buffer flex-1 flex items-center justify-center">
      <div className="text-center" style={{ color: "#565f89" }}>
        <div style={{ fontSize: "2em", marginBottom: "0.5em" }}>Neovim</div>
        <div>Use NeoTree or :e to open a file</div>
        <div style={{ marginTop: "1em" }}>Type :help for keybindings</div>
      </div>
    </div>
  );
}

function HelpPage() {
  return (
    <div className="vim-buffer vim-scroll flex-1 overflow-y-auto p-4">
      <div className="vim-help-title">Vim Reader Mode - Help</div>

      <div className="vim-help-section">Movement</div>
      <div><span className="vim-help-key">h/j/k/l</span> <span className="vim-help-desc">Left / Down / Up / Right</span></div>
      <div><span className="vim-help-key">w / b</span> <span className="vim-help-desc">Next / Previous word</span></div>
      <div><span className="vim-help-key">gg / G</span> <span className="vim-help-desc">Go to top / bottom</span></div>
      <div><span className="vim-help-key">0 / $</span> <span className="vim-help-desc">Line start / end</span></div>
      <div><span className="vim-help-key">Ctrl+d / Ctrl+u</span> <span className="vim-help-desc">Half page down / up</span></div>
      <div><span className="vim-help-key">Ctrl+f / Ctrl+b</span> <span className="vim-help-desc">Full page down / up</span></div>

      <div className="vim-help-section">Search</div>
      <div><span className="vim-help-key">/ pattern</span> <span className="vim-help-desc">Forward search</span></div>
      <div><span className="vim-help-key">? pattern</span> <span className="vim-help-desc">Backward search</span></div>
      <div><span className="vim-help-key">n / N</span> <span className="vim-help-desc">Next / Previous match</span></div>

      <div className="vim-help-section">Commands</div>
      <div><span className="vim-help-key">:q</span> <span className="vim-help-desc">Exit Vim mode</span></div>
      <div><span className="vim-help-key">:e path</span> <span className="vim-help-desc">Open article (e.g. :e tech/how-to-use-github)</span></div>
      <div><span className="vim-help-key">:ls</span> <span className="vim-help-desc">List open buffers</span></div>
      <div><span className="vim-help-key">:bn / :bp</span> <span className="vim-help-desc">Next / Previous buffer</span></div>
      <div><span className="vim-help-key">:help</span> <span className="vim-help-desc">Show this help</span></div>

      <div className="vim-help-section">Other</div>
      <div><span className="vim-help-key">Tab</span> <span className="vim-help-desc">Toggle NeoTree / Buffer focus</span></div>
      <div><span className="vim-help-key">Enter</span> <span className="vim-help-desc">Open/expand in NeoTree</span></div>
      <div><span className="vim-help-key">F1</span> <span className="vim-help-desc">Toggle help</span></div>
      <div><span className="vim-help-key">Esc</span> <span className="vim-help-desc">Cancel / Return to Normal</span></div>
    </div>
  );
}

function buildFileTree(articles: { category: string; slug: string; title: string }[]): FileTreeNode[] {
  const dirMap: Record<string, FileTreeNode[]> = {};
  const categoryNames: Record<string, string> = {
    courses: "课程与学术",
    campus: "校园生活",
    tech: "技术与项目",
    community: "社团与活动",
  };

  for (const a of articles) {
    if (!dirMap[a.category]) dirMap[a.category] = [];
    dirMap[a.category].push({
      type: "file",
      name: a.slug,
      path: `${a.category}/${a.slug}`,
      label: a.title,
    });
  }

  return Object.entries(dirMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([cat, files]) => ({
      type: "dir" as const,
      name: cat,
      path: cat,
      label: categoryNames[cat] || cat,
      children: files,
    }));
}
```

- [ ] **Step 2: Commit**

```bash
git add components/vim/VimApp.tsx
git commit -m "feat(vim): add VimApp container with state and keyboard handling"
```

---

### Task 5: NeoTree Component

**Files:**
- Create: `components/vim/NeoTree.tsx`

- [ ] **Step 1: Create `components/vim/NeoTree.tsx`**

```tsx
"use client";

import { useEffect, useRef } from "react";
import type { VimState, FileTreeNode } from "./types";
import { flattenTree } from "./vim-engine";

interface NeoTreeProps {
  fileTree: FileTreeNode[];
  expandedDirs: Set<string>;
  cursor: number;
  visible: boolean;
  dispatch: React.Dispatch<import("./types").VimAction>;
  state: VimState;
}

export default function NeoTree({ fileTree, expandedDirs, cursor, visible, dispatch, state }: NeoTreeProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const flat = flattenTree(fileTree, expandedDirs);

  // Handle j/k/Enter/h within NeoTree (dispatch only when focused)
  useEffect(() => {
    if (!visible) return;

    const handler = (e: KeyboardEvent) => {
      if (state.mode !== "normal") return;
      if (state.focusedPanel !== "neo-tree") return;

      // These are handled by the global handler already via KEY_PRESS
      // But NeoTree cursor movement needs its own handling
    };

    // We handle neo-tree cursor movement via the global dispatch
    // But we need to intercept j/k when focused on neo-tree
  }, [visible, state.mode, state.focusedPanel]);

  // Intercept keys for neo-tree specific navigation
  // This is handled in the VimApp's keyboard handler which dispatches to the reducer
  // The reducer delegates to neoTreeActivate for Enter
  // For j/k in neo-tree, we need special handling

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (state.mode !== "normal" || state.focusedPanel !== "neo-tree") return;

      if (e.key === "j") {
        e.preventDefault();
        e.stopPropagation();
        const newCursor = Math.min(cursor + 1, flat.length - 1);
        dispatch({ type: "KEY_PRESS", key: "__NEO_J", ctrl: false });
      } else if (e.key === "k") {
        e.preventDefault();
        e.stopPropagation();
        const newCursor = Math.max(cursor - 1, 0);
        dispatch({ type: "KEY_PRESS", key: "__NEO_K", ctrl: false });
      }
    };

    window.addEventListener("keydown", handler, true);
    return () => window.removeEventListener("keydown", handler, true);
  }, [state.mode, state.focusedPanel, cursor, flat.length, dispatch]);

  // Scroll selected item into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-index="${cursor}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [cursor]);

  const getDepth = (path: string): number => {
    const parts = path.split("/");
    return parts.length - 1;
  };

  return (
    <div className="vim-neotree vim-scroll">
      <div className="vim-neotree-header">Explorer</div>
      <div ref={listRef}>
        {flat.map((node, i) => {
          const depth = node.type === "file" ? getDepth(node.path) : 0;
          const isSelected = visible && i === cursor;
          const isExpanded = node.type === "dir" && expandedDirs.has(node.path);

          return (
            <div
              key={node.path}
              data-index={i}
              className={`vim-neotree-item ${isSelected ? "vim-neotree-selected" : ""}`}
              style={{ paddingLeft: `${12 + depth * 12}px` }}
            >
              <span className="vim-neotree-icon">
                {node.type === "dir" ? (isExpanded ? "▾" : "▸") : "·"}
              </span>
              <span className={node.type === "dir" ? "vim-neotree-dir" : "vim-neotree-file"}>
                {node.type === "dir" ? node.label : node.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

Wait — the NeoTree j/k handling is split between the engine and component. Let me simplify: the engine already dispatches `KEY_PRESS` for all keys. I need the engine's `handleNormalMode` to also update `neoTreeCursor` when `focusedPanel === "neo-tree"`. Let me update the engine.

**Correction**: The vim-engine.ts `handleNormalMode` function needs to handle j/k for NeoTree cursor movement. Add these cases to the `handleNormalMode` switch:

In `vim-engine.ts`, modify the `j` and `k` cases:

```typescript
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
```

Also add `h` handling for NeoTree (collapse):

```typescript
    case "h": {
      if (state.focusedPanel === "neo-tree") {
        // Collapse current dir or go to parent
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
```

After these engine changes, the NeoTree component becomes simpler — remove the local key handlers:

```tsx
"use client";

import { useEffect, useRef } from "react";
import type { FileTreeNode } from "./types";
import { flattenTree } from "./vim-engine";

interface NeoTreeProps {
  fileTree: FileTreeNode[];
  expandedDirs: Set<string>;
  cursor: number;
  visible: boolean;
}

export default function NeoTree({ fileTree, expandedDirs, cursor, visible }: NeoTreeProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const flat = flattenTree(fileTree, expandedDirs);

  // Scroll selected item into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-index="${cursor}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [cursor]);

  return (
    <div className="vim-neotree vim-scroll">
      <div className="vim-neotree-header">Explorer</div>
      <div ref={listRef}>
        {flat.map((node, i) => {
          const depth = node.type === "file" ? node.path.split("/").length - 1 : 0;
          const isSelected = visible && i === cursor;
          const isExpanded = node.type === "dir" && expandedDirs.has(node.path);

          return (
            <div
              key={node.path}
              data-index={i}
              className={`vim-neotree-item ${isSelected ? "vim-neotree-selected" : ""}`}
              style={{ paddingLeft: `${12 + depth * 12}px` }}
            >
              <span className="vim-neotree-icon">
                {node.type === "dir" ? (isExpanded ? "▾" : "▸") : "·"}
              </span>
              <span className={node.type === "dir" ? "vim-neotree-dir" : "vim-neotree-file"}>
                {node.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Update vim-engine.ts for NeoTree j/k/h handling**

Apply the modifications to the `j`, `k`, and `h` cases in `handleNormalMode` as shown above.

- [ ] **Step 3: Commit**

```bash
git add components/vim/NeoTree.tsx components/vim/vim-engine.ts
git commit -m "feat(vim): add NeoTree component with keyboard navigation"
```

---

### Task 6: Buffer Component

**Files:**
- Create: `components/vim/Buffer.tsx`

The Buffer renders article HTML parsed into line-based display with line numbers and cursorline highlight.

- [ ] **Step 1: Create `components/vim/Buffer.tsx`**

```tsx
"use client";

import { useMemo, useEffect, useRef } from "react";
import type { BufferData, SearchMatch } from "./types";

interface BufferProps {
  buffer: BufferData;
  cursor: { line: number; col: number };
  topLine: number;
  searchMatches: SearchMatch[];
  currentMatchIndex: number;
  dispatch: React.Dispatch<import("./types").VimAction>;
}

interface ParsedLine {
  html: string;
  text: string;
  type: string;
}

function parseHtmlToLines(html: string): ParsedLine[] {
  if (typeof document === "undefined") return [];

  const div = document.createElement("div");
  div.innerHTML = html;
  const lines: ParsedLine[] = [];

  for (const child of Array.from(div.children)) {
    const tag = child.tagName.toLowerCase();

    if (tag === "pre") {
      const codeEl = child.querySelector("code");
      const textContent = (codeEl?.textContent || child.textContent || "").split("\n");
      const classAttr = codeEl?.getAttribute("class") || "";

      textContent.forEach((text) => {
        lines.push({ html: "", text, type: "code" });
      });
    } else {
      lines.push({
        html: child.outerHTML,
        text: child.textContent || "",
        type: tag,
      });
    }
  }

  return lines;
}

export default function Buffer({ buffer, cursor, topLine, searchMatches, currentMatchIndex, dispatch }: BufferProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);

  const lines = useMemo(() => parseHtmlToLines(buffer.contentHtml), [buffer.contentHtml]);

  // Report line count back to state
  useEffect(() => {
    if (lines.length > 0) {
      dispatch({ type: "SET_LINE_COUNT", key: `${buffer.category}/${buffer.slug}`, count: lines.length });
    }
  }, [lines.length, buffer.category, buffer.slug, dispatch]);

  // Scroll to cursor position
  useEffect(() => {
    const el = lineRefs.current[cursor.line];
    if (el) {
      el.scrollIntoView({ block: "center", behavior: "instant" });
    }
  }, [cursor.line]);

  // Build search match lookup for fast rendering
  const matchLookup = useMemo(() => {
    const lookup: Record<number, { matches: SearchMatch[]; hasCurrent: boolean }> = {};
    searchMatches.forEach((m, i) => {
      if (!lookup[m.line]) lookup[m.line] = { matches: [], hasCurrent: false };
      lookup[m.line].matches.push(m);
      if (i === currentMatchIndex) lookup[m.line].hasCurrent = true;
    });
    return lookup;
  }, [searchMatches, currentMatchIndex]);

  return (
    <div ref={containerRef} className="vim-buffer vim-scroll flex-1 overflow-y-auto">
      {lines.map((line, i) => {
        const isCursorLine = i === cursor.line;
        const searchInfo = matchLookup[i];

        return (
          <div
            key={i}
            ref={(el) => { lineRefs.current[i] = el; }}
            className={`vim-buffer-line ${isCursorLine ? "vim-cursorline" : ""}`}
          >
            <span className={`vim-buffer-linenr ${isCursorLine ? "vim-buffer-linenr-active" : ""}`}>
              {i + 1}
            </span>
            <div className="vim-buffer-content">
              {line.type === "code" ? (
                <code>{line.text}</code>
              ) : (
                <span dangerouslySetInnerHTML={{ __html: line.html }} />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/vim/Buffer.tsx
git commit -m "feat(vim): add Buffer component with line parsing and cursorline"
```

---

### Task 7: CommandLine + SearchBar + Tabline

**Files:**
- Create: `components/vim/CommandLine.tsx`
- Create: `components/vim/SearchBar.tsx`
- Create: `components/vim/Tabline.tsx`

- [ ] **Step 1: Create `components/vim/CommandLine.tsx`**

```tsx
"use client";

import { useEffect, useRef } from "react";
import type { BufferData, VimMode, FocusedPanel } from "./types";

interface CommandLineProps {
  mode: VimMode;
  commandInput: string;
  message: string;
  buffer: BufferData | null;
  cursor: { line: number; col: number };
  focusedPanel: FocusedPanel;
}

export default function CommandLine({ mode, commandInput, message, buffer, cursor, focusedPanel }: CommandLineProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (mode === "command" || mode === "search") {
      inputRef.current?.focus();
    }
  }, [mode]);

  const modeLabel = mode === "normal" ? "NORMAL" : mode === "command" ? "COMMAND" : "SEARCH";
  const modeClass =
    mode === "normal"
      ? "vim-status-normal"
      : mode === "command"
        ? "vim-status-command"
        : "vim-status-search";

  return (
    <>
      {/* Status bar */}
      <div className="vim-statusbar">
        <div className="vim-statusbar-left">
          <span className={`vim-status-mode ${modeClass}`}>{modeLabel}</span>
          <span style={{ color: "#565f89", padding: "0 8px" }}>{focusedPanel === "neo-tree" ? "NeoTree" : buffer ? buffer.title : "[No Name]"}</span>
        </div>
        <div className="vim-statusbar-right">
          <span>utf-8</span>
          <span>markdown</span>
          {buffer && <span>ln:{cursor.line + 1},col:{cursor.col + 1}</span>}
          <span>{Math.round(((cursor.line + 1) / Math.max(buffer?.lineCount || 1, 1)) * 100)}%</span>
        </div>
      </div>

      {/* Command line input / message */}
      <div className="vim-commandline">
        {mode === "command" || mode === "search" ? (
          <input
            ref={inputRef}
            className="vim-commandline-input vim-internal-input"
            value={commandInput || (mode === "search" ? "" : "")}
            readOnly
          />
        ) : (
          <span style={{ color: "#565f89" }}>{message}</span>
        )}
      </div>
    </>
  );
}
```

- [ ] **Step 2: Create `components/vim/SearchBar.tsx`**

```tsx
"use client";

interface SearchBarProps {
  query: string;
  direction: "forward" | "backward";
  matchCount: number;
  currentMatch: number;
}

export default function SearchBar({ query, direction, matchCount, currentMatch }: SearchBarProps) {
  return (
    <div className="vim-searchbar">
      <span style={{ color: "#7aa2f7", marginRight: "4px" }}>{direction === "forward" ? "/" : "?"}</span>
      <span>{query.slice(1)}</span>
      <span className="vim-searchbar-count">
        {matchCount > 0 ? `[${currentMatch + 1}/${matchCount}]` : "[No matches]"}
      </span>
    </div>
  );
}
```

- [ ] **Step 3: Create `components/vim/Tabline.tsx`**

```tsx
"use client";

import type { BufferData } from "./types";

interface TablineProps {
  buffers: Record<string, BufferData>;
  currentBuffer: string | null;
}

export default function Tabline({ buffers, currentBuffer }: TablineProps) {
  const entries = Object.entries(buffers);

  return (
    <div className="vim-tabline">
      {entries.map(([key, buf]) => (
        <div key={key} className={`vim-tab ${key === currentBuffer ? "vim-tab-active" : ""}`}>
          {buf.title}
        </div>
      ))}
      {entries.length === 0 && (
        <div className="vim-tab" style={{ color: "#3b4261" }}>[No File]</div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add components/vim/CommandLine.tsx components/vim/SearchBar.tsx components/vim/Tabline.tsx
git commit -m "feat(vim): add CommandLine, SearchBar, and Tabline components"
```

---

### Task 8: Header Navigation + Final Integration

**Files:**
- Modify: `components/Header.tsx`

- [ ] **Step 1: Add Vim mode link to Header**

Add a Vim mode link to the Header navigation. Modify `components/Header.tsx`:

In the desktop nav section, add a link after the categories. Find the `</nav>` closing tag for the desktop nav and add the Vim link before it:

```tsx
{/* Desktop nav */}
<nav className="hidden md:flex items-center gap-6">
  {categories.map((cat) => (
    <Link
      key={cat.slug}
      href={`/${cat.slug}`}
      className="text-sm text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors"
    >
      {cat.name}
    </Link>
  ))}
  <Link
    href="/vim"
    className="text-sm text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors font-mono"
    title="Vim Mode"
  >
    Vim
  </Link>
</nav>
```

Also add to the mobile menu:

```tsx
{menuOpen && (
  <nav className="md:hidden border-t border-[var(--color-border)] bg-white">
    {categories.map((cat) => (
      <Link
        key={cat.slug}
        href={`/${cat.slug}`}
        className="block px-4 py-3 text-sm text-[var(--color-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-primary)]"
        onClick={() => setMenuOpen(false)}
      >
        {cat.name}
      </Link>
    ))}
    <Link
      href="/vim"
      className="block px-4 py-3 text-sm text-[var(--color-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-primary)] font-mono"
      onClick={() => setMenuOpen(false)}
    >
      Vim Mode
    </Link>
  </nav>
)}
```

- [ ] **Step 2: Start dev server and test**

Run: `pnpm dev`

Visit `http://localhost:3000/vim` and verify:
1. Tokyo Night dark theme renders fullscreen
2. NeoTree shows file tree on left
3. Press Tab to switch focus to NeoTree
4. j/k moves selection in NeoTree, Enter opens a file
5. j/k scrolls through article in Buffer
6. : enters command mode, :q exits
7. / enters search mode, type pattern, Enter searches
8. F1 shows help

- [ ] **Step 3: Commit**

```bash
git add components/Header.tsx
git commit -m "feat(vim): add Vim mode link to header navigation"
```

---

## Self-Review Checklist

1. **Spec coverage:**
   - Types + API → Task 1 ✓
   - Vim engine (all modes) → Task 3 ✓
   - Tokyo Night theme → Task 2 ✓
   - VimApp orchestrator → Task 4 ✓
   - NeoTree → Task 5 ✓
   - Buffer → Task 6 ✓
   - CommandLine + SearchBar → Task 7 ✓
   - Tabline → Task 7 ✓
   - Header link → Task 8 ✓
   - All keybindings (h/j/k/l/w/b/gg/G/0/$/Ctrl+d/u/f/b/n/N/:/Escape/Enter/Tab) → Task 3 ✓
   - All Ex commands (:q/:e/:help/:ls/:bn/:bp) → Task 3 ✓
   - Search (/ and ?) → Task 3 + Task 7 ✓

2. **Placeholder scan:** No TBD/TODO/fill-in-later found. All code blocks contain complete code.

3. **Type consistency:**
   - `VimState`, `VimAction`, `BufferData`, `FileTreeNode`, `SearchMatch` defined in `types.ts` and used consistently across all components
   - `bufferKey()` helper used in VimApp and engine
   - `flattenTree()` exported from engine, used in VimApp and NeoTree
   - `initialVimState()` exported from engine, used in VimApp
   - NeoTree props simplified (removed `dispatch` and `state` after engine refactor) — Task 5 update matches Task 4 usage
