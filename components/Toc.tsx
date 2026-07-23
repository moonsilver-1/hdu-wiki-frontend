"use client";

import { ListTree } from "lucide-react";
import { useEffect, useState } from "react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export default function Toc({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: "-96px 0px -70% 0px" }
    );

    for (const item of items) {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    }

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <aside className="toc-sidebar">
      <div className="toc-inner">
        <h2><ListTree aria-hidden="true" size={16} />本页目录</h2>
        <nav aria-label="文章目录">
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`${item.level === 3 ? "toc-level-3" : ""} ${
                activeId === item.id ? "toc-active" : ""
              }`}
              aria-current={activeId === item.id ? "location" : undefined}
            >
              {item.text}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}
