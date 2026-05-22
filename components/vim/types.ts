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
