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
          <span style={{ color: "#565f89", padding: "0 8px" }}>
            {focusedPanel === "neo-tree" ? "NeoTree" : buffer ? buffer.title : "[No Name]"}
          </span>
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
            value={commandInput}
            readOnly
          />
        ) : (
          <span style={{ color: "#565f89" }}>{message}</span>
        )}
      </div>
    </>
  );
}
