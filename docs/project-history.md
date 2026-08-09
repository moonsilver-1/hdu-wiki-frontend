# HDU Wiki 建设历史与记录规范

> 本文是仓库的项目建设档案。它记录已经进入 GitHub 的主要建设节点，也规定以后如何留下可追溯的记录。
>
> 记录基准：2026-08-09。完整的逐提交记录仍以 [GitHub commits](https://github.com/moonsilver-1/hdu-wiki-frontend/commits/main) 为准；本文只整理对网站、内容、工程和协作方式有明显影响的节点。

## 一、怎样看这份档案

项目历史有三层：

1. **Commit**：最小改动单元，能看到作者、日期、提交说明和具体 diff。
2. **Pull Request**：一次可审核的工作单元，能看到目标、范围、检查结果、讨论和合并记录。
3. **文件历史**：可以查看某个文件的全部变化，或用 blame 追踪每一行最后由谁修改。

因此，“某个人做了什么”不能只看贡献者数量。应当把 PR 描述、提交 diff、`Co-authored-by` 和文件历史一起看。早期有些提交说明比较简略，例如“修复了 Bug”，这类记录必须以实际 diff 为准。

常用入口：

- [主分支提交记录](https://github.com/moonsilver-1/hdu-wiki-frontend/commits/main)
- [全部 Pull Request](https://github.com/moonsilver-1/hdu-wiki-frontend/pulls?q=is%3Apr+is%3Aclosed)
- [贡献者统计](https://github.com/moonsilver-1/hdu-wiki-frontend/graphs/contributors)
- [主指南文件历史](https://github.com/moonsilver-1/hdu-wiki-frontend/commits/main/content/campus/campus-life/main-guide.md)
- [主指南逐行归属](https://github.com/moonsilver-1/hdu-wiki-frontend/blame/main/content/campus/campus-life/main-guide.md)

## 二、建设时间线

### 2026-05：项目启动与 Vim 阅读模式

- [初始化仓库](https://github.com/moonsilver-1/hdu-wiki-frontend/commit/f07d06d)：`moonsilver-1` 创建空仓库。
- [初始项目](https://github.com/moonsilver-1/hdu-wiki-frontend/commit/e00718e)：`JohnLin`（GitHub：`Lin-Jiong-HDU`）搭建 Next.js、文章内容和基础配置。
- [Vim 阅读模式](https://github.com/moonsilver-1/hdu-wiki-frontend/commit/8ac7d2b)：`JohnLin` 连续完成 Vim 页面外壳、文件树、缓冲区、命令行、快捷键和主题等功能。
- [文章与 Vim 入口](https://github.com/moonsilver-1/hdu-wiki-frontend/commit/8507d29)：补充“如何使用 Wiki”和 Vim 模式说明。

这一阶段解决的是“网站能运行、文章能读、Vim 模式有完整交互”这三个基础问题。

### 2026-05-22 至 2026-07-22：主题、文章和内容生态

- [暗色模式](https://github.com/moonsilver-1/hdu-wiki-frontend/commit/5c72847)：`JohnLin` 增加系统偏好、时间自动切换、手动切换和代码高亮。
- [嵌入式文章](https://github.com/moonsilver-1/hdu-wiki-frontend/commit/e4aedd2)：`moonsilver-1` 开始补充技术内容。
- [文章导航与搜索](https://github.com/moonsilver-1/hdu-wiki-frontend/commit/d06d0a6)：调整文章标题、作者、日期，并加入搜索和定位效果。
- [ROS 学习路线](https://github.com/moonsilver-1/hdu-wiki-frontend/commit/a06067e)：`soyorin` 补充自动化嵌入式方向内容。
- [文档写作和求职指南](https://github.com/moonsilver-1/hdu-wiki-frontend/commit/75db9a0)：`soyorin` 增加文档写作、求职指南和 workspace 配置。

这一阶段从“技术 Demo”转向“校园知识库”：网站开始同时承载技术文章、校园经验和贡献入口。

### 2026-07-23 至 2026-07-30：版式、课程系列和投稿系统

- [新网站版式](https://github.com/moonsilver-1/hdu-wiki-frontend/commit/5c15a99)：重新调整页面布局和视觉结构。
- [作者系统](https://github.com/moonsilver-1/hdu-wiki-frontend/commit/498ef0f)：增加作者信息和作者介绍页。
- [从零开始学深度学习](https://github.com/moonsilver-1/hdu-wiki-frontend/commit/36fef12)：整理并重写 15 篇深度学习系列，同时调整分类目录。
- [深度学习分卷](https://github.com/moonsilver-1/hdu-wiki-frontend/commit/566a7f7)：完成深度学习系列收束。
- [算法内容](https://github.com/moonsilver-1/hdu-wiki-frontend/commit/c1fbe94)：补充 RoPE 和时间复杂度等内容。
- [投稿系统最终版本](https://github.com/moonsilver-1/hdu-wiki-frontend/commit/ec6cb97)：形成网页投稿到 GitHub PR 的主要流程。
- [作者贡献排序](https://github.com/moonsilver-1/hdu-wiki-frontend/commit/137fcfb)：修复作者页进入问题并按贡献数量排序。

这一阶段确定了目前网站的基本信息架构：分类、文章、作者、课程系列和投稿流程互相连接。

### 2026-08-06 至 2026-08-08：上线与 V1.1 工程化

- [HDU Wiki 正式上线](https://github.com/moonsilver-1/hdu-wiki-frontend/pull/10)：完成上线公告投稿。
- [校园生活投稿](https://github.com/moonsilver-1/hdu-wiki-frontend/pull/11)：加入弗雷德广场美食推荐。
- [HDU Wiki V1.1](https://github.com/moonsilver-1/hdu-wiki-frontend/pull/12)：`TNHTH` 完成内容契约、校验器、CI、投稿安全、搜索、SEO 和生存手册合并等工程化工作。
- [生存手册重写](https://github.com/moonsilver-1/hdu-wiki-frontend/pull/13)：将《HDUER FROM SHEEP TO GOAT》整理为更连贯的学生指南风格。

这一阶段的重点是把“能用的网站”变成“可以持续维护的网站”：内容有规则，投稿有校验，改动有 CI，敏感输入有安全边界。

### 2026-08-09：阅读体验、课程入口和 AI 教程

- [缩略章节导航](https://github.com/moonsilver-1/hdu-wiki-frontend/pull/14)：增加文章阅读进度和章节轨道。
- [右侧紧凑浮层](https://github.com/moonsilver-1/hdu-wiki-frontend/pull/15)：将章节导航改为右侧居中、小尺寸浮层。
- [章节点击卡死修复](https://github.com/moonsilver-1/hdu-wiki-frontend/pull/16)：避免原生 dialog 和同步状态更新阻塞点击事件。
- [章节跳转再次修复](https://github.com/moonsilver-1/hdu-wiki-frontend/pull/17)：将滚动、hash 更新和关闭动作延迟到点击事件完成后。
- [导航与接口安全审计](https://github.com/moonsilver-1/hdu-wiki-frontend/pull/18)：修复 Logo、分类、搜索、移动端菜单、Vim 目录等交互卡死问题，并强化 API、Markdown 链接和请求体限制。
- [课程系列与文章评论](https://github.com/moonsilver-1/hdu-wiki-frontend/pull/19)：增加“从零开始学”入口和本地文章句子评论功能。
- [首页渐进加载](https://github.com/moonsilver-1/hdu-wiki-frontend/pull/20)：首页文章列表改为首屏少量展示、按需加载。
- [加载更多控件优化](https://github.com/moonsilver-1/hdu-wiki-frontend/pull/21)：简化按钮文案并调整布局。
- [飞书 AI 编程教程](https://github.com/moonsilver-1/hdu-wiki-frontend/pull/22)：将 Cursor、Trae、Claude Code、Codex、Kiro、Windsurf、OpenClaw 等教程整理为多篇文章，并用官方资料核验关键事实。
- [主指南版本整理](https://github.com/moonsilver-1/hdu-wiki-frontend/pull/23)：恢复原主指南，同时把重写稿作为独立文章提交，避免历史版本混在同一个文件里。

## 三、参与者与主要贡献方向

以下是根据公开提交和 PR 归纳出的工作方向，不等同于正式职位或永久分工：

| 参与者 | 主要贡献方向 |
|---|---|
| `moonsilver-1` | 仓库维护、早期网站结构、文章系统、内容整理、上线和投稿审核 |
| `Lin-Jiong-HDU` / JohnLin | 初始 Next.js 项目、Vim 阅读模式、暗色主题和相关文档 |
| `TNHTH` | V1.1 工程化、主指南整理、阅读交互、评论、课程入口、接口安全和 AI 教程 |
| `soyorin` | ROS、求职、文档写作等技术与经验内容 |
| `yellowhcj` | 机器学习相关内容 |

GitHub 的贡献者统计按已关联的账号和邮箱计算。出现同一作者有多个显示名、或提交中带 `Co-authored-by` 时，应以提交详情和 PR 记录为准，不要只按贡献者排行榜下结论。

## 四、以后每次建设必须留下什么

### 1. Commit 记录规范

一次提交只表达一个清楚的意图。标题建议使用：

```text
type(scope): 简短、可检索的改动说明
```

推荐的 `type`：

| type | 使用场景 |
|---|---|
| `feat` | 新功能或新入口 |
| `fix` | 修复用户可感知的问题 |
| `content` | 新增、合并或修订文章 |
| `security` | 安全边界、权限、输入校验 |
| `docs` | 文档、规范和项目记录 |
| `refactor` | 不改变功能的代码整理 |
| `test` | 测试新增或修正 |
| `chore` | 依赖、构建和工具维护 |

提交标题要回答“改了什么”，正文要回答“为什么改、如何验证”。不要使用无法检索的描述，例如“改一下”“修复 bug”“大更新”。

推荐格式：

```text
fix(search): prevent stale requests from replacing current results

问题：快速输入时旧请求可能覆盖新查询。
处理：为请求增加 AbortController，并在响应前确认查询仍然有效。
验证：pnpm test、pnpm lint、pnpm build。
```

### 2. Pull Request 记录规范

每个 PR 描述至少包含以下内容：

```markdown
## 做了什么
- 用 1–5 条说明用户能看到的变化。

## 为什么做
- 说明问题、背景或对应 issue。

## 影响范围
- 页面、接口、内容目录、依赖、配置和数据迁移。

## 内容与来源
- 文章来源、作者授权、适用日期、时间敏感事实的核验方式。

## 安全与隐私
- 是否涉及用户输入、令牌、邮箱、文件路径、外部请求或权限。

## 验证
- pnpm validate:content
- pnpm test
- pnpm lint
- pnpm build
- 必要时补充浏览器验收页面和结果。

## 回滚方式
- 说明可 revert 的提交，或写明需要恢复的配置。
```

PR 标题应与提交类型一致。大功能拆成可以单独审核的 PR；内容合并、视觉改动、安全修复和依赖升级不要无理由混在一起。

### 3. 合并后历史记录规范

只有以下情况需要把新条目补到本文“建设时间线”：

- 新增用户可见的主要功能；
- 修改文章体系、分类、投稿或搜索等核心流程；
- 发生安全、数据、权限或部署策略变化；
- 完成一组有明确目标的内容建设；
- 影响未来开发方式的架构或工程规则变化。

补充条目时使用绝对日期 `YYYY-MM-DD`，并同时写出：

1. PR 编号和链接；
2. 主要参与者；
3. 解决的问题；
4. 对用户或后续开发的影响。

零散的拼写修正、单个依赖升级和重复提交不需要逐条复制到本文，GitHub 提交记录已经是它们的完整档案。

### 4. 内容文章的额外记录规范

涉及校规、奖助、推免、课程、体育、就业和平台功能时，PR 必须写明：

- 适用年级或适用时间；
- 原始通知日期；
- 官方来源或可复核链接；
- 是否经过学院或部门执行口径确认；
- 与旧文章发生冲突时采用哪一版，以及原因。

作者、整理者和改写者要明确区分。AI 可以用于整理和校对，但不能代替事实核验、作者授权和最终署名责任。

### 5. 发布和回滚记录规范

发布到 Preview 或 Production 后，PR 或部署记录中应补充：

- 环境和部署时间；
- 部署 commit；
- CI、构建和浏览器验收结果；
- 已知问题和后续任务；
- 回滚所需的 commit、配置或操作。

如果部署平台状态与 GitHub CI 不一致，要分别记录，不能用“部署成功”概括所有结果。

## 五、维护清单

每次准备合并前，维护者按下面顺序检查：

1. 提交标题能否看出改动意图；
2. PR 是否写清范围、来源、验证和回滚；
3. 内容是否有作者授权、日期边界和官方来源；
4. `pnpm check` 是否通过；
5. 是否需要在本文件增加一条建设节点；
6. 合并后把 PR、commit 和部署状态补齐；
7. 每季度检查一次本文件中的链接、作者归属和时间线是否仍然准确。

本文件不替代 Git 历史，也不要求维护者重复粘贴全部 diff。它的作用是让新成员先看懂项目怎样走到今天，再通过 PR 和 commit 深入核对每一个具体改动。
