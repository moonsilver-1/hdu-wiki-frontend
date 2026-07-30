开一个新课程《从零开始学算法》（作者 huang，11 卷约 96 篇），本次会话搭好骨架 + 写第一批（导读 + 卷一 9 篇）。分代码重构、配置、内容、验证四块。

## 一、代码重构：把分卷机制通用化（lib/content.ts）

目标：`deepLearningVolumes` 那套分卷/编号/排序逻辑从「只认 deep-learning」改成「按 section 注册的多课程」，让算法课享有同等体验。这是等价改写，不动深度学习已有行为，最后用 build 验证。

1. **重命名数据结构为 section 感知注册表**（约 99–280 行）：
   - 新增 `export const courseVolumes: Record<string, {key;label;slugs[]}[]>`，把现有 `deepLearningVolumes` 内容移到 `courseVolumes["deep-learning"]` 下。
   - 保留 `export const deepLearningVolumes = courseVolumes["deep-learning"]` 作为别名，避免破坏 `lib/contribute.ts` 现有 import（等价）。
   - 新增 `courseVolumes["algorithm"]` = 全部 11 卷定义（key "0".."11"，label 按你给的中文名，slugs 见第三节）。
2. **placement 改 section 感知**（约 260–280 行）：
   - `deepLearningPlacement` → `coursePlacement: Map<section, Map<slug, Placement>>`，globalIndex 改为**每课程内独立计数**（更正确，避免跨课程串扰；反正各 section 独立排序）。
   - `getArticleVolume(slug)` → `getArticleVolume(section, slug)`。
3. **更新两处调用点**（约 498、558 行，在 getArticleUncached / getArticleMeta）：
   - 先算 `const section = data.section || getArticleSection(category, filePath)`，再 `getArticleVolume(section, slug)`，section 复用到返回对象里。
4. **sortArticles**（约 388–397 行）：`deepLearningPlacement.get(a.slug)` → `getArticleVolume(a.section, a.slug)`（ArticleMeta 已有 section 字段）。
5. **groupArticlesForDisplay 的 gate 与子组查找**（约 440–464 行）：
   - gate `section === "deep-learning" || ...` → `courseVolumes[section]`。
   - 子组 label/排序里 `deepLearningVolumes` → `courseVolumes[section]`。
6. **改签名前先 grep 确认 `getArticleVolume` / `deepLearningVolumes` 无其他外部调用点**（已知仅 content.ts 内部 + contribute.ts）。

## 二、配置补充

- `lib/content.ts` `sectionMap`（81–93 行）：加 `"algorithm": "从零开始学算法"`。
- `sidebarSectionOrder`（401 行）：`["fundamentals", "deep-learning", "algorithm"]`。
- `lib/contribute.ts`（130 行）：`reservedSlugs` 由 `deepLearningVolumes.flatMap` 改为 `Object.values(courseVolumes).flatMap(vols => vols.flatMap(v => v.slugs))`，把算法课 slug 也纳入投稿黑名单（算法课是 huang 精排的，不开放投稿，与深度学习同处理）。

## 三、内容：0.0 导读 + 卷一 9 篇

**文件夹** `content/courses/algorithm/`。**slug 全局唯一**，已核对不与深度学习附录（algo-dfs-bfs/algo-shortest-path/algo-genetic/algo-simulated-annealing/algo-swarm/math-*）冲突。

**0.0-algorithm-roadmap.md**（导读）：模仿深度学习 0.0 结构——§1 主线、§2 十一卷分别讲什么（带每卷核心目标，用你给的那几段）、§3 五个学习阶段（你给的阶段表）、§4 怎么读。作者 huang，日期 2026-07-30。

**卷一·算法基础与分析语言**（9 篇，文件名 `N.M-slug.md`，frontmatter author=huang，口语化+直觉+完整推导+练习题+小结，对齐深度学习风格）：

| 文件 | slug | 日期 | 标题 |
|---|---|---|---|
| 1.1-insertion-sort.md | insertion-sort | 2026-07-30 | 插入排序 |
| 1.2-merge-sort.md | merge-sort | 2026-07-31 | 归并排序 |
| 1.3-binary-search.md | binary-search | 2026-07-31 | 二分查找 |
| 1.4-heap-sort.md | heap-sort | 2026-07-31 | 堆排序 |
| 1.5-hashing.md | hashing | 2026-08-01 | 哈希算法 |
| 1.6-bfs.md | bfs | 2026-08-01 | 广度优先搜索 |
| 1.7-dfs.md | dfs | 2026-08-02 | 深度优先搜索 |
| 1.8-asymptotic-complexity.md | asymptotic-complexity | 2026-08-02 | 渐近复杂度分析 |
| 1.9-loop-invariant.md | loop-invariant | 2026-08-03 | 循环不变量 |

日期按「一天 1–3 篇」从今天（2026-07-30）往前排。1.8 渐近复杂度分析会比深度学习 1.7 那篇速成更系统（含 Θ/Ω、最好/最坏/平均、递归复杂度，为卷四主定理铺垫），两篇 slug 不同、定位不同，不冲突。卷一结尾收束到「排序/查找/遍历共享分治与不变量结构」，承上卷二。

## 四、验证

1. `npm run build` 确认无回归、两门课页面均正常生成（重点确认深度学习编号/分卷未坏）。
2. `npm run lint`。
3. grep 复查：slug 无重复、`getArticleVolume`/`deepLearningVolumes` 无遗漏调用点、`courseVolumes["algorithm"]` 的 slug 与实际文件一一对应。
4. （只读核验）dev server 起来后确认 `/courses` 页侧边栏出现「从零开始学算法」及其卷分组与编号——如环境不便跑 dev，则依赖 build 静态生成产物 + 代码走查代替。

注：本次不提交 git；改动留在工作区，和之前两处缺口（RoPE、复杂度）的未提交改动并列。要我提交时另说。