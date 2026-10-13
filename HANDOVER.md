# /watcha 文化墙专题页面 — 交接文档

## 一、项目背景

### 1.1 项目信息
- **项目名称**: HDU Wiki（杭电百科）
- **项目路径**: `d:\杭电wiki\hdu-wiki-frontend-main\hdu-wiki-frontend-main`
- **线上地址**: [www.hdu-wiki.cn](https://www.hdu-wiki.cn)
- **技术栈**: Next.js 16 + React 19 + TypeScript 5 + Tailwind CSS v4 + pnpm 10
- **Git**: 已在内层文件夹初始化（`git init` + `git add .` 已执行，但尚未做初始提交）

### 1.2 任务目标
基于飞书文档「杭州电子科技大学 × 观猹｜文化墙设计 V0.1」的内容，创建一个类似 `/welcome` 的专题页面，放在 `/watcha` 路由下（线上路径 `https://www.hdu-wiki.cn/watcha`）。

### 1.3 飞书文档
- **链接**: https://kcn65h9934go.feishu.cn/docx/XyUgdEHMDoCUYLxbRgCcc3VYnTf
- **标题**: 杭州电子科技大学 × 观猹｜文化墙设计 V0.1
- **内容**: 杭电与观猹合作的文化墙设计方案，包含四大墙面模块

---

## 二、飞书文档内容摘要

文化墙分为四大墙面模块：

### 模块1：杭电 × 观猹共建 AI 育人生态
- **主题**: 时间线叙事，从 2020 年到 2026 年
- **关键节点**:
  - 2020: 仲泰入学杭电
  - 未央学社成立
  - 育人基金设立
  - 特工宇宙金奖
  - 领导调研
  - 2026: 捐赠 2020 亿 Tokens
- **展示形式**: 纵向时间轴，节点逐个揭示

### 模块2：玩 AI，上观猹
- **主题**: 观猹平台生态介绍
- **五大生态板块**:
  1. 观猹平台
  2. TokenDance
  3. 猹与猹
  4. 特工宇宙
  5. 环球黑客松
- **活动合集**: 十几个活动（需从文档中提取完整列表）
- **展示形式**: 卡片网格 + 滚动错位入场

### 模块3：好用产品馆
- **主题**: 7 款精选 AI 产品展示
- **产品列表**:
  1. Paper2Galgame
  2. WorkBuddy
  3. 佛脚AI
  4. Trae
  5. （其余产品需从文档中提取）
- **展示形式**: 每款产品独占一屏，滚动翻页揭示

### 模块4：互动展区
- **主题**: 5 种互动形式
- **互动形式**:
  1. 产品集合墙
  2. Good/Bad 评分墙
  3. 答题站
  4. 名片墙
  5. Token 领取
- **展示形式**: 前端交互组件

> **注意**: 接手后需要重新读取飞书文档获取完整内容，以上仅为摘要。读取方式: 使用 lark-doc skill 或 WebFetch 读取飞书文档 URL。

---

## 三、设计方向讨论结论

### 3.1 已排除的方案
1. **WebXR/VR**: 成本太高，内容本质是信息展示型，不适合 3D 沉浸
2. **双向滚动（横向切模块 + 纵向看内容）**: 用户认为现有库（fullPage.js、Swiper 等）演示效果太简陋
3. **Active Theory 风格 WebGL**: 不开源，闭源商业引擎，成本过高

### 3.2 用户倾向的方向
用户想要**新颖的动态网页**，对以下风格感兴趣：
- **Scrollytelling（滚动叙事）**: Porsche Motorsport 风格的时间线
- **Apple 式产品展示**: 每款产品独占一屏的电影级滚动
- **动态排版 + 滚动响应**: 大字标语随滚动变形
- **Active Theory 风格**: 几何体随交互变形有深度感（但不开源）

### 3.3 推荐技术方案（尚未最终敲定）

| 模块 | 展示方式 | 参考案例 |
|------|---------|---------|
| Hero 入口 | 全屏 Canvas/SVG 动画 + 大标题 | Lusion / Epic 风格 |
| 模块1 时间线 | 滚动驱动的纵向时间轴，节点逐个揭示 | [Porsche Motorsport](https://racing.porsche.com/) |
| 模块2 生态板块 | 卡片网格 + 滚动错位入场 + hover 交互 | Uncommon Studio 风格 |
| 模块3 产品馆 | 每款产品独占一屏，滚动翻页揭示 | [Apple iPhone](https://www.apple.com/iphone/) |
| 模块4 互动区 | 投票/答题等前端交互组件 | 自定义 React 组件 |

**推荐技术栈**（均 MIT 许可，Next.js 兼容）：
- **GSAP ScrollTrigger** — 滚动驱动动画引擎
- **Lenis** — 平滑滚动
- **Framer Motion** — React 组件动画
- **React Three Fiber**（可选）— 如果需要 3D Hero 效果

### 3.4 参考网站列表
- [Porsche Motorsport](https://racing.porsche.com/) — 3D 车库 + 时间线
- [The Boat](https://sbs.com.au/theboat/) — 震动式滚动叙事
- [Universe to You](https://scrollytelling.ai/universe-to-you/) — 纯 CSS 滚动叙事
- [Apple iPhone](https://www.apple.com/iphone/) — 电影级产品展示
- [Epic](https://www.epic.net/en/) — 动态排版
- [Dropbox Brand](https://brand.dropbox.com/) — 品牌系统动画
- [Lusion](https://lusion.co/) — 实时 3D + 光标响应
- [Active Theory](https://activetheory.net/) — WebGL 几何变形（不开源，仅供灵感参考）
- [Rive](https://rive.app/) — 角色互动动画
- [Uncommon Studio](https://uncommonstudio.com.au/) — 错位动画节奏

---

## 四、现有项目结构要点

### 4.1 参考 `/welcome` 页面
`/welcome` 是现有的迎新专题页面，`/watcha` 应参考其实现方式：
- `app/welcome/page.tsx` — 主页面
- `app/welcome/layout.tsx` — 布局
- `app/welcome/welcome.css` — 样式
- `app/welcome/CampusMap.tsx` — 校园地图组件
- `app/welcome/HistoryLetter.tsx` — 历史信件组件
- `app/welcome/WelcomeCheckin.tsx` — 签到组件

### 4.2 新建文件位置
```
app/watcha/
  ├── page.tsx          # 主页面
  ├── layout.tsx        # 布局（可选）
  └── watcha.css        # 样式（可选，也可用 Tailwind）
```

### 4.3 关键配置文件
- `package.json` — 依赖管理（pnpm）
- `next.config.ts` — Next.js 配置
- `tsconfig.json` — TypeScript 配置
- `tailwind.config.ts` — Tailwind 配置
- `app/globals.css` — 全局样式

---

## 五、AGENTS.md 规则

项目根目录 `AGENTS.md` 已添加两条工作规范：

1. **每一次更改都需要创建对应的 git commit。**
2. **每一次编写或更新相关测试，交付给用户前都需要保证测试通过。**

> 注意：AGENTS.md 顶部还有 Next.js 自动生成的规则块（`<!-- BEGIN:nextjs-agent-rules -->`），说明这是 Next.js 16 有破坏性变更，写代码前要查看 `node_modules/next/dist/docs/` 中的文档。

---

## 六、已完成的工作

1. ✅ Git 仓库初始化（`d:\杭电wiki\hdu-wiki-frontend-main\hdu-wiki-frontend-main`）
   - `git init` + `git add .` 已执行
   - **尚未做初始提交**，接手后应先创建初始提交
2. ✅ AGENTS.md 更新（添加两条工作规范）
3. ✅ 飞书文档已读取（内容见上方摘要）
4. ✅ WebXR 可行性评估（结论：不推荐）
5. ✅ 开源双轴滚动库调研（结论：效果太简陋，用户不满意）
6. ✅ 新颖动态网页案例调研（见参考网站列表）
7. ✅ Active Theory 开源情况调研（结论：不开源）

---

## 七、待完成的工作

### 7.1 下一步
1. **创建初始 git 提交**（当前所有文件已 staged 但未提交）
2. **重新读取飞书文档**，提取完整内容（特别是模块2的活动列表、模块3的完整产品列表、模块4的互动细节）
3. **与用户敲定最终设计方案**（scrollytelling 方向已推荐但用户未最终确认）
4. **安装依赖**（如需 GSAP、Lenis、Framer Motion 等）
5. **创建 `/watcha` 页面**，参考 `/welcome` 的实现模式
6. **实现各模块内容和动画**
7. **测试**（确保 `pnpm build` 和 `pnpm check` 通过）
8. **每次更改创建 git commit**（按 AGENTS.md 规则）

### 7.2 注意事项
- 用户对设计质量要求较高，认为 fullPage.js 等库的效果"太简陋"
- 用户对 Active Theory 的几何变形 + 深度感风格感兴趣，但该引擎不开源
- 可考虑用 React Three Fiber + GSAP 做简化版 3D 效果
- 项目是学生维护的非商业项目，GPL 许可证理论上可用但建议优先 MIT
- 飞书文档中的图片素材需要确认是否可下载使用

---

## 八、常用命令

```bash
pnpm install    # 安装依赖
pnpm dev        # 启动开发服务器
pnpm build      # 构建生产版本
pnpm check      # 完整校验（内容+测试+lint+构建）
pnpm lint       # 代码检查
```

---

## 九、关键文件路径

| 文件 | 路径 |
|------|------|
| 项目根目录 | `d:\杭电wiki\hdu-wiki-frontend-main\hdu-wiki-frontend-main` |
| AGENTS.md | `AGENTS.md` |
| /welcome 页面 | `app/welcome/` |
| /watcha 页面（待创建） | `app/watcha/` |
| 全局样式 | `app/globals.css` |
| 布局组件 | `app/layout.tsx` |
| 首页 | `app/page.tsx` |
| package.json | `package.json` |
| next.config.ts | `next.config.ts` |
