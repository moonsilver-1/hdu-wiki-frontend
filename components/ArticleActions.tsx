"use client";

import { useState } from "react";

export default function ArticleActions() {
  const [message, setMessage] = useState("");
  const copyLink = async () => {
    const url = new URL(window.location.href);
    url.search = "";
    try {
      await navigator.clipboard.writeText(url.href);
      setMessage("链接已复制");
    } catch {
      setMessage("复制失败，请从地址栏复制链接");
    }
  };
  return (
    <div className="article-actions" aria-label="文章工具">
      <button type="button" onClick={copyLink}>复制文章链接</button>
      <button type="button" onClick={() => window.print()}>打印 / 存为 PDF</button>
      <span role="status">{message}</span>
    </div>
  );
}
