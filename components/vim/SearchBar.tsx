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
