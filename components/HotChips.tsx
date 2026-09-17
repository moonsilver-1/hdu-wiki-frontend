"use client";

import Link from "next/link";
import { RefreshCw } from "lucide-react";
import { useState } from "react";

export type HotChip = {
  href: string;
  label: string;
};

// 首页热词胶囊：像 luoluo 的「推荐问题」一样每次展示一批，
// 点「换一批」向后翻页，循环播放。
export default function HotChips({ chips, step = 8 }: { chips: HotChip[]; step?: number }) {
  const [offset, setOffset] = useState(0);

  if (chips.length === 0) return null;

  const visible: HotChip[] = [];
  const showCount = Math.min(step, chips.length);
  for (let index = 0; index < showCount; index += 1) {
    visible.push(chips[(offset + index) % chips.length]);
  }

  const rotate = () => setOffset((current) => (current + step) % chips.length);

  return (
    <div className="hot-chips" role="group" aria-label="大家在看">
      {visible.map((chip, index) => (
        <Link
          key={`${chip.href}-${index}`}
          href={chip.href}
          className="hot-chip"
        >
          {chip.label}
        </Link>
      ))}
      {chips.length > showCount ? (
        <button type="button" className="hot-chip hot-chip-refresh" onClick={rotate}>
          <RefreshCw aria-hidden="true" size={14} />
          换一批
        </button>
      ) : null}
    </div>
  );
}
