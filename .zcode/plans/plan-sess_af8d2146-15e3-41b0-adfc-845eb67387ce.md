# 网页端 Markdown 投稿功能实施方案（GitHub PR 流）

## 目标
任何人免登录在 `/contribute` 页面写 markdown 投稿 → serverless 函数往 GitHub 开 PR → 管理员在 GitHub 上 review 合并 → Vercel 自动重新部署 → 全站可见。**公共站点维持 100% 静态，零性能影响。**

## 架构总览
```
用户在 /contribute 写 md（带实时预览）
   │ POST /api/submit {title,category,section,author,excerpt,tags,body}
   ↓
/api/submit（serverless）：
   1. 校验 + 生成合法 frontmatter md
   2. 生成唯一 slug + 分支名
   3. GitHub API: 在新分支提交文件 + 开 PR
   ↓
返回 PR 链接给用户 → 用户看到"已提交，等待审核"
   ↓
管理员在 GitHub review diff（人工把关 HTML 注入）→ 合并
   ↓
Vercel 自动构建 → 新页面 + 搜索索引同步可见（约 1-3 分钟）
```

## 文件清单（新增 6 个文件，改 2 个）

### 新增
1. **`app/contribute/page.tsx`** — 投稿页（薄 server component）。套 `.home-section` + `.site-container` + `.section-heading`，渲染一个 `<ContributeEditor/>` 子组件。提供 `generateMetadata`。
2. **`components/ContributeEditor.tsx`** — `"use client"` 编辑器（核心 UI）。参照 `SearchDialog.tsx` 的 client 范式：`useState` 存表单、`useMemo`/`useEffect` 派生、`useRouter` 跳转。字段：标题/分类/子分类(section)/作者/邮箱(可选)/标签/摘要/正文。含"编辑/预览"双栏切换、提交 loading/error/成功态。
3. **`app/api/submit/route.ts`** — `POST` handler。校验入参 → 生成 md → 调 GitHub API 开 PR → 返回 PR 链接。**站内首个 POST**，结构仿 `app/api/article/route.ts`。
4. **`app/api/preview/route.ts`** — `POST` handler。接收 md 正文，复用 `lib/content.ts` 的 `markdownProcessor` 渲染成 HTML 返回。保证预览与正式页 100% 一致，且不让 unified 全家桶进 client bundle。
5. **`lib/contribute.ts`** — 服务端纯逻辑模块：slug 生成、slug 冲突校验（含 `deepLearningVolumes` 保留 slug 黑名单）、frontmatter md 拼装、category/section 白名单、GitHub API 调用封装。把逻辑从 route handler 抽出来便于测试。
6. **`app/contribute/success/page.tsx`**（或 query 参数态）— 提交成功页，显示 PR 链接 + "等待审核"说明。

### 修改
7. **`app/page.tsx`** — 首页底部 `.contribute-section` 那个 CTA 的"了解如何加入"按钮，加一个"投稿写文章"入口指向 `/contribute`。
8. **`app/globals.css`** — 新增 `.contribute-form`、`.contribute-field`、`.contribute-input`、`.contribute-textarea`、`.editor-pane`/`.preview-pane`（双栏）、`.submit-status` 等样式。复用 `var(--*)` token，`input/textarea` 仿 `.article-filter select` 的边框/圆角。

## 关键技术决策

### A. 提交流（`lib/contribute.ts` + `/api/submit`）
- **环境变量**：`GITHUB_TOKEN`（fine-grained，只给内容写权限）、`GITHUB_OWNER`、`GITHUB_REPO`（从现有 GitHub 链接 `moonsilver-1/hdu-wiki-frontend` 推导，但做成可配置）。全部 server-only。
- **流程**（用 GitHub Contents API 一步到位）：
  1. 校验：title/author/category 非空；category ∈ 四大分类；section ∈ 白名单（**排除 `deep-learning`**）；body 非空。
  2. 生成 slug：标题 kebab-case 化；撞名（查目标 category 现有文件 + `deepLearningVolumes` 保留 slug）则加 `-2`/`-3` 后缀。
  3. 生成分支名：`submission/<slug>-<短哈希>`。
  4. **调 GitHub Contents API**（`PUT /repos/{owner}/{repo}/contents/content/{cat}/{section}/{slug}.md`），body 里带 `message`、`content`(base64)、`branch`（新分支名）。GitHub 会自动创建该分支（基于默认分支）。→ 一步完成"建分支+提交文件"。
  5. **调 PR API**（`POST /repos/{owner}/{repo}/pulls`），`head`=新分支、`base`=`main`、`title`=`[投稿] {标题}`、`body`=作者/邮箱/摘要/section 信息。
  6. 返回 `{ ok, prUrl }`。
- **frontmatter 生成**（用 `gray-matter.stringify`）：
  ```yaml
  ---
  title: "用户填的"
  date: "2026-07-29"          # 服务端取当天
  author: "用户填的"
  excerpt: "用户填的"
  tags: ["a", "b"]            # 服务端规整成数组
  ---
  ```
  **不写** category/section/featured/volumeKey（系统字段，避免污染）。section 靠目录推导（文件落在 `content/<cat>/<section>/`）。

### B. 预览流（`/api/preview`）
- `POST`，body `{ body: string }` → 复用 `markdownProcessor.process(readMarkdown(body))` → 返回 `{ html }`。
- 客户端 `useEffect` 监听正文变化，**debounce 400ms** 后 fetch（带 `AbortController` 防竞态，照 `SearchDialog` 范式）。
- 预览区 `<div className="wiki-content" dangerouslySetInnerHTML={{__html}} />`，复用现成正文排版（标题/代码/KaTeX/表格全有）。

### C. 分类与 section 白名单
- 四大 category 全开。
- section 下拉**动态联动**：选了 category 后，只列该 category 下 `sectionMap` 里的合法 section。**`courses` 下隐藏 `deep-learning`**（只露 `fundamentals`）。其余 category 的 section 全露。
- 这套白名单写死在 `lib/contribute.ts`，前后端共享（client 通过一个 `/api/meta` 拿，或直接 import 一个共享常量——因 `lib/content.ts` 不能进 client，会把白名单单独放一个无 `fs` 依赖的 `lib/contribute-meta.ts`）。

### D. 安全（核心风险：HTML 注入）
- 渲染管线开了 `allowDangerousHtml` + `rehype-raw`，用户能塞任意 HTML/`<script>`。
- **缓解**：① 提交时记录作者/邮箱（免登录但留痕）；② PR 标题强制 `[投稿]` 前缀，body 模板里**高亮提醒管理员检查 HTML/脚本**；③ **绝不自动合并**，必须人工 review diff。
- 这点会在 PR body 模板和 README 里写明，作为对管理员的操作守则。
- **不引入** HTML 净化（sanitize）库——会和现有正文渲染管线冲突（现有正文页也靠 raw HTML），且审核环节已覆盖。如后续要加可再议。

### E. 性能影响（验证你的核心关切）
- **公共站点零变化**：所有文章页/分类页/搜索仍是构建时 SSG，访客读文章的路径完全不变，加载速度/SEO 不受影响。
- **新增的两个 serverless 函数**：只在有人投稿/预览时跑，跑完即释放。Vercel 免费额度下完全够用（Hobby 计划每月 100GB-hours 函数执行）。
- **首屏 JS 不变**：预览走 serverless，unified 管线不进 client bundle。投稿页本身是按需加载的路由，不投就不加载。
- 唯一新增的包：无（`gray-matter`、`unified` 全家桶都已装）。GitHub API 调用用原生 `fetch`（Node 18+/Vercel 内置）。

## 实施步骤（建议顺序）
1. 先做 `lib/contribute-meta.ts`（共享白名单）+ `lib/contribute.ts`（slug/md/github 逻辑）——纯逻辑，可单独验证。
2. `app/api/preview/route.ts` —— 简单，先通预览。
3. `app/api/submit/route.ts` —— 核心提交。
4. `components/ContributeEditor.tsx` —— UI。
5. `app/contribute/page.tsx` + 成功态 —— 串起来。
6. `app/page.tsx` 入口 + `globals.css` 样式 —— 收尾。
7. 浏览器端到端验证（含免 token 的 dry-run 模式，见下）。

## 你需要准备的东西（部署前）
- 一个 **GitHub fine-grained token**：权限只给 `Contents: Write`（目标仓库），有效期建议 90 天可滚动。存到 Vercel 环境变量 `GITHUB_TOKEN`，本地开发存 `.env.local`（已加 `.gitignore`）。
- 确认仓库默认分支是 `main`（当前是）。

## 本地验证策略（无 token 也能跑）
`/api/submit` 加一个 `CONTRIBUTE_DRY_RUN` 环境变量（或 `GITHUB_TOKEN` 缺失时自动进入）：不调 GitHub，直接返回"将会生成的 md 内容 + 假 PR 链接"，方便本地/审核时端到端测试 UI 与逻辑，不实际开 PR。

## 风险与取舍
- **HTML 注入**：靠人工审核兜底（见 D）。这是免登录方案的本质代价。
- **滥用/垃圾投稿**：免登录意味着可能被刷。后续可加 Vercel 内置的 bot 防护或简单的频率限制（本期不做，先看实际流量）。
- **slug 冲突边角**：深度学习保留 slug ~100 个，已在黑名单覆盖；极端情况下两个投稿同时用同 slug，第二个会在 PR 阶段失败，用户会收到友好错误提示重试。