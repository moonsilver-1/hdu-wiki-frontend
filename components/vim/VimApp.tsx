"use client";

import { useReducer, useEffect, useCallback } from "react";
import type { FileTreeNode, BufferData, VimState } from "./types";
import { bufferKey } from "./types";
import { vimReducer, initialVimState } from "./vim-engine";
import Tabline from "./Tabline";
import NeoTree from "./NeoTree";
import Buffer from "./Buffer";
import CommandLine from "./CommandLine";
import SearchBar from "./SearchBar";
import "./tokyo-night.css";

export default function VimApp() {
  const [state, dispatch] = useReducer(vimReducer, undefined, initialVimState);

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

      // Already loaded — switch to it
      if (state.buffers[key]) {
        dispatch({ type: "CLEAR_PENDING_ACTION" });
        dispatch({ type: "BUFFER_LOADED", key, data: state.buffers[key] });
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
  }, [state.pendingAction]);

  // Keyboard handler
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const ctrl = e.ctrlKey || e.metaKey;
    const key = e.key;

    dispatch({ type: "KEY_PRESS", key, ctrl });
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [handleKeyDown]);

  const buffer = state.currentBuffer ? state.buffers[state.currentBuffer] : null;

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      <Tabline buffers={state.buffers} currentBuffer={state.currentBuffer} />

      <div className="flex flex-1 overflow-hidden">
        <NeoTree
          fileTree={state.fileTree}
          expandedDirs={state.expandedDirs}
          cursor={state.neoTreeCursor}
          visible={state.focusedPanel === "neo-tree"}
        />

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
      <div><span className="vim-help-key">Space w / Space e</span> <span className="vim-help-desc">Toggle NeoTree / Buffer focus</span></div>
      <div><span className="vim-help-key">l / Enter</span> <span className="vim-help-desc">Open/expand in NeoTree</span></div>
      <div><span className="vim-help-key">h</span> <span className="vim-help-desc">Collapse directory in NeoTree</span></div>
      <div><span className="vim-help-key">F1</span> <span className="vim-help-desc">Toggle help</span></div>
      <div><span className="vim-help-key">Esc</span> <span className="vim-help-desc">Cancel / Return to Normal</span></div>
    </div>
  );
}

function buildFileTree(articles: { category: string; slug: string; title: string }[]): FileTreeNode[] {
  const dirMap: Record<string, FileTreeNode[]> = {};

  for (const a of articles) {
    if (!dirMap[a.category]) dirMap[a.category] = [];
    dirMap[a.category].push({
      type: "file",
      name: a.slug,
      path: `${a.category}/${a.slug}`,
      label: a.slug,
    });
  }

  return Object.entries(dirMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([cat, files]) => ({
      type: "dir" as const,
      name: cat,
      path: cat,
      label: cat,
      children: files,
    }));
}
