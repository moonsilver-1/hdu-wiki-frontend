"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// 文章详情页的键盘翻页：← 跳上一篇，→ 跳下一篇。
// 放在客户端是因为需要监听全局 keydown 事件；href 由服务端页面算好后传下来。
export default function ArticleKeyboardNav({
  previousHref,
  nextHref,
}: {
  previousHref: string | null;
  nextHref: string | null;
}) {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      // 带修饰键的组合（Ctrl/⌘/Alt/Shift）交给浏览器或系统处理，避免误触。
      if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;

      const target = event.target as HTMLElement | null;
      const tag = target?.tagName;
      // 在输入框、文本域、下拉框或可编辑区域里，左右键用于移动光标，不要翻页。
      if (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        target?.isContentEditable
      ) {
        return;
      }
      // 弹层（如搜索对话框）打开时，左右键交给弹层处理。
      if (document.querySelector('[aria-modal="true"]')) return;

      const href = event.key === "ArrowLeft" ? previousHref : nextHref;
      if (!href) return;

      event.preventDefault();
      router.push(href);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [previousHref, nextHref, router]);

  return null;
}
