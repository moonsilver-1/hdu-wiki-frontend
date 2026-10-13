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
