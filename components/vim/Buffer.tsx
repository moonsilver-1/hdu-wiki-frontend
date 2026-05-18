"use client";

import { useMemo, useEffect, useRef } from "react";
import type { BufferData, SearchMatch, VimAction } from "./types";

interface BufferProps {
  buffer: BufferData;
  cursor: { line: number; col: number };
  topLine: number;
  searchMatches: SearchMatch[];
  currentMatchIndex: number;
  dispatch: React.Dispatch<VimAction>;
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
      el.scrollIntoView({ block: "center", behavior: "instant" as ScrollBehavior });
    }
  }, [cursor.line]);

  // Build search match lookup
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
                <code>{line.text || " "}</code>
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
