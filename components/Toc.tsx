"use client";

import { useEffect, useState } from "react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export default function Toc({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -70% 0px" }
    );

    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <aside className="w-48 shrink-0 hidden xl:block">
      <div className="sticky top-20 py-6 pl-4">
        <h4 className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-3">
          目录
        </h4>
        <nav className="space-y-1">
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`toc-link block text-xs py-1 border-l-2 pl-3 transition-colors ${
                item.level === 3 ? "pl-6" : "pl-3"
              } ${
                activeId === item.id
                  ? "toc-active border-l-[var(--color-primary)]"
                  : "text-[var(--color-muted)] border-l-transparent"
              }`}
            >
              {item.text}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}
