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
