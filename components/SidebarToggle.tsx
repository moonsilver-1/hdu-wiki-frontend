"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

const STORAGE_KEY = "wiki-sidebar";

function readHidden(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "hidden";
  } catch {
    return false;
  }
}

function apply(hidden: boolean): void {
  document.documentElement.dataset.sidebar = hidden ? "hidden" : "visible";
}

// 侧栏收起按钮：放在侧栏顶部；点击后侧栏隐藏，出现浮动展开按钮。
// 显隐完全由 html[data-sidebar] + CSS 驱动，组件内部不维护状态。
export default function SidebarCollapseButton() {
  return (
    <button
      type="button"
      className="sidebar-collapse"
      aria-label="收起侧栏"
      title="收起侧栏"
      onClick={() => {
        const next = !readHidden();
        try {
          localStorage.setItem(STORAGE_KEY, next ? "hidden" : "visible");
        } catch {}
        apply(next);
      }}
    >
      <PanelLeftClose aria-hidden="true" size={15} />
    </button>
  );
}

// 侧栏收起后的浮动展开按钮：只在隐藏态显示（CSS 控制）。
export function SidebarExpandButton() {
  return (
    <button
      type="button"
      className="sidebar-expand"
      aria-label="展开侧栏"
      title="展开侧栏"
      onClick={() => {
        try {
          localStorage.setItem(STORAGE_KEY, "visible");
        } catch {}
        apply(false);
      }}
    >
      <PanelLeftOpen aria-hidden="true" size={16} />
    </button>
  );
}
