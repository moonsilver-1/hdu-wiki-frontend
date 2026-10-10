# Vim Reader Mode Design

## Overview

Add a Vim-mode reading interface at `/vim` that simulates a Neovim + LazyVim experience for browsing and reading wiki articles. Users can navigate articles using Vim keybindings in a terminal-like UI.

## Approach

Self-built lightweight Vim keybinding engine + LazyVim-style UI (Tokyo Night theme). No heavy editor dependencies (CodeMirror/Monaco) since this is a read-only scenario.

## Architecture

### Route

- `/vim` — standalone client-side page, independent from existing wiki pages

### Component Structure

```
app/vim/page.tsx              — Vim mode page entry ("use client")
components/vim/
  ├── VimApp.tsx              — Top-level container, manages global state
  ├── Tabline.tsx             — Top tab bar, shows open file names
  ├── NeoTree.tsx             — Left file browser, j/k navigation
  ├── Buffer.tsx              — Right main content area, renders article + cursor
  ├── CommandLine.tsx         — Bottom command line + status bar
  ├── SearchBar.tsx           — Search bar (triggered by / and ?)
  └── vim-engine.ts           — Vim keybinding engine (pure logic, no UI)
```

### Data Flow

- `VimApp` holds global state via `useReducer`: mode, currentBuffer, buffers, cursor, etc.
- `vim-engine.ts` is a pure functional key handler: receives key sequence + current state, returns new state + side-effect commands
- Article data reuses existing `lib/content.ts`, fetched via API endpoints

### API

- Reuse `/api/search` for article list
- New endpoint `/api/article?category=tech&slug=xxx` returns rendered article HTML

## State

```typescript
interface VimState {
  mode: 'normal' | 'insert' | 'command' | 'search';
  cursor: { line: number; col: number };
  currentBuffer: string | null;
  buffers: Map<string, BufferData>;
  fileTree: FileTreeNode[];
  expandedDirs: Set<string>;
  focusedPanel: 'neo-tree' | 'buffer';
  searchQuery: string;
  searchMatches: SearchMatch[];
  currentMatchIndex: number;
  commandInput: string;
  topLine: number;
}
```

## Vim Engine

### Mode State Machine

```
Normal ──i/a/o/O──→ Insert (shows readonly message, auto-returns to Normal)
Normal ──:────────→ Command
Normal ──/────────→ Search (forward)
Normal ──?────────→ Search (backward)
Command ──Enter───→ Execute → Normal
Command ──Esc─────→ Normal
Search ──Enter────→ Normal (highlight matches, jump to first)
Search ──Esc──────→ Normal
```

### Normal Mode Keybindings

| Key | Action |
|-----|--------|
| `h/j/k/l` | Move cursor left/down/up/right |
| `w/b` | Jump forward/backward by word |
| `gg/G` | Jump to file start/end |
| `0/$` | Jump to line start/end |
| `Ctrl+d/Ctrl+u` | Scroll half page down/up |
| `Ctrl+f/Ctrl+b` | Scroll full page down/up |
| `n/N` | Jump to next/previous search match |
| `Enter` | Open article (in NeoTree) |
| `Tab` | Toggle focus (NeoTree ↔ Buffer) |
| `:` | Enter command mode |
| `/` / `?` | Enter search mode |

### Ex Commands

| Command | Action |
|---------|--------|
| `:q` / `:q!` | Exit Vim mode, return to normal wiki page |
| `:e <path>` | Open article, e.g. `:e tech/how-to-use-github.md` |
| `:help` | Show help (keybinding reference) |
| `:ls` | List open buffers |
| `:bn` / `:bp` | Switch to next/previous buffer |

### Search

- `/pattern` forward search, `?pattern` backward search
- Matches highlighted, `n/N` to cycle through them
- `Enter` confirms, `Esc` cancels

## Visual Design

### Layout (fullscreen, 100vh, no page scroll)

```
┌─ Tabline ───────────────────────────────────────────────┐
│  [  how-to-use-github.md  ]                             │
├─ NeoTree ──────┬─ Buffer ───────────────────────────────┤
│  📁 courses    │  # 如何使用 GitHub                       │
│  📁 campus     │  GitHub 是全球最大的代码托管平台...        │
│    main-guide  │  ████████████████████████▒ (cursor)     │
│  📁 tech       │                                        │
│    how-to-...  │                                        │
├────────────────┴────────────────────────────────────────┤
│  NORMAL  │  utf-8  │  markdown  │  30%  ln:12,col:8    │
├─────────────────────────────────────────────────────────┤
│  :e tech/how-to-use-llm.md █                           │
└─────────────────────────────────────────────────────────┘
```

### Tokyo Night Color Palette

| Element | Color | Usage |
|---------|-------|-------|
| `bg` | `#1a1b26` | Main background |
| `bg-dark` | `#16161e` | Tabline/NeoTree background |
| `bg-highlight` | `#292e42` | Selected line / highlight |
| `fg` | `#c0caf5` | Main text |
| `fg-muted` | `#565f89` | Comments / line numbers |
| `blue` | `#7aa2f7` | Keywords / links / directory icons |
| `green` | `#9ece6a` | Strings / file icons |
| `purple` | `#bb9af7` | Status bar / active tab |
| `cyan` | `#7dcfff` | Functions / search matches |
| `red` | `#f7768e` | Errors / search highlight bg |
| `yellow` | `#e0af68` | Headings / warnings |
| `orange` | `#ff9e64` | Numbers / current match underline |

### Typography

- Font: `Geist Mono` (already in project)
- Size: 13px
- Line height: 1.6

### Visual Details

- Cursor: block style in Normal mode (overlays character bg color), blinking animation
- Status bar: LazyVim style — left segment shows mode name (NORMAL green / COMMAND yellow / SEARCH blue), right segment shows file info
- NeoTree: directory nodes with collapse icons, file type icons, selected row has `bg-highlight` background
- Search matches: matched text highlighted with semi-transparent `red` bg, current match with `orange` underline
- Line numbers: left gutter in `fg-muted`, current line number highlighted in `fg`

## Technical Details

### Cursor & Scrolling

- Virtual cursor (line + col), no DOM selection dependency
- Cursor line kept visible via viewport window adjustment (not browser scroll)
- `Ctrl+d/u/f/b` adjust the visible window's starting line number
- Article content pre-split into a line array, cursor moves on the array

### NeoTree File Tree

- Reuses `lib/content.ts` data via `/api/search` endpoint
- Tree structure: categories as directory nodes, articles as file nodes
- `Enter` to expand/collapse directories or open files, `j/k` to navigate, `h` to collapse/go up

### Article Rendering

- Article HTML reuses existing unified pipeline rendering
- New API `/api/article?category=tech&slug=xxx` returns rendered HTML
- Buffer component parses HTML into line array, overlays line numbers + cursor + search highlights

### State Management

- All state managed in `VimApp` via `useReducer`, no external state library
