# 文章分享按钮实施方案

## 目标
在文章页"上一篇/下一篇"下方加一个分享按钮，点击复制文章链接到剪贴板。**纯前端，零后端，零数据库，永远不会撞额度墙。**

## 实现方式
- 用浏览器原生 `navigator.clipboard.writeText()` 复制完整 URL。
- 复制成功后按钮短暂显示"已复制 ✓"反馈，2 秒后恢复。
- 纯客户端组件，无 API、无 KV、无任何外部依赖。

## 文件清单（新增 1 个，改 2 个）

### 新增
1. **`components/ShareButton.tsx`** — `"use client"` 分享按钮。
   - 点击：`navigator.clipboard.writeText(window.location.href)` 复制当前页 URL。
   - 复制后切到"已复制 ✓"状态，2 秒后恢复"分享"。
   - 兼容旧浏览器：clipboard API 不可用时，降级用临时 textarea + `document.execCommand('copy')`。

### 修改
2. **`app/[category]/[slug]/page.tsx`** — 在 `<nav className="article-pagination">` 后面、`</main>` 前面加 `<ShareButton />`（你最初要求的位置：上一篇/下一篇下面）。
3. **`app/globals.css`** — 新增 `.share-button`、`.share-button.copied` 样式 + 移动端适配。

## 为什么这个方案好
- **零维护成本**：没有数据库要管，没有额度会超，部署后永远能用。
- **零性能影响**：一个轻量客户端组件，文章页仍是静态生成。
- **真正有用**：学生看到好文章，点一下就能把链接发给同学，比点赞数字实际得多。
- **无新依赖**：用 React + lucide-react（`Share2` 或 `Link2` 图标）+ 浏览器原生 API。

## 实施步骤
1. 写 `components/ShareButton.tsx`
2. 接入文章页（上一篇/下一篇下方）
3. 加 CSS
4. `tsc` + `eslint` + 浏览器验证（点击复制、反馈动画、降级）