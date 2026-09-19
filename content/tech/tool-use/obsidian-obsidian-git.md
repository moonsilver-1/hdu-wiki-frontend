---
title: "Obsidian Git 版本管理"
date: "2026-09-20"
author: "洛洛"
excerpt: "* 版本历史 — 每次修改都有记录，可以回滚"
tags: ["luoluo", "迁移"]
---

**Obsidian Git** 插件让你用 Git 管理 Vault 的版本历史，实现自动备份和多设备同步。

## 为什么用 Git？

* **版本历史** — 每次修改都有记录，可以回滚
* **免费备份** — 推送到 GitHub Private Repo
* **多设备同步** — 配合 GitHub 在多台电脑间同步
* **不丢数据** — 即使误删，git 里还有

## 初始化

### 1. 创建 GitHub 私有仓库

```bash
gh repo create my-vault --private
```

### 2. 初始化 Vault 的 Git

```bash
cd /path/to/your/vault
git init
git remote add origin https://github.com/yourname/my-vault.git
```

### 3. 创建 .gitignore

```
.obsidian/workspace.json
.obsidian/workspace-mobile.json
.obsidian/plugins/*/data.json
.trash/
```

### 4. 首次提交

```bash
git add -A
git commit -m "init vault"
git push -u origin main
```

### 5. 安装 Obsidian Git 插件

社区插件搜索 "Git"（截至 2026-09-14 插件在市场里的名字是「Git」，作者 Vinzent03）→ 安装 → 启用。

## 配置

| 设置                                      | 推荐值                      | 说明             |
| --------------------------------------- | ------------------------ | -------------- |
| Auto commit-and-sync interval (minutes) | 10                       | 每 10 分钟自动提交并同步 |
| Auto pull interval (minutes)            | 10                       | 每 10 分钟自动拉取    |
| Commit message on auto commit-and-sync  | `vault backup: {{date}}` | 自动提交信息         |
| Pull on startup                         | 开启                       | 启动时拉取最新        |
| Push on commit-and-sync                 | 开启                       | 提交后自动推送        |

## 日常使用

配置好后，完全自动化：

1. 你正常使用 Obsidian 写笔记
2. 每 10 分钟自动提交 + 推送
3. 启动时自动拉取最新内容
4. 有冲突时会提示你处理

### 手动操作

命令面板中搜索：

* `Git: Commit` — 手动提交
* `Git: Push` — 手动推送
* `Git: Pull` — 手动拉取
* `Git: Open diff view` — 查看变更

## 多设备同步

### 电脑 ↔ 电脑

两台电脑都安装 Obsidian Git，指向同一个 GitHub Repo。自动拉取和推送即可。

### 电脑 ↔ 手机

手机端也能装 Git 插件（基于 isomorphic-git），但截至 2026-09-14 官方 README 标注为实验性、非常不稳定，不支持 SSH 认证，作者不推荐在手机上使用。替代方案：

* **iOS**：使用 Working Copy App + Obsidian
* **Android**：使用 Termux + Git
* 或使用 Obsidian Sync（官方付费）
* 或使用 Remotely Save 插件

## 注意事项

1. **不要把 Vault 放在 iCloud/OneDrive 同步文件夹** — 和 Git 冲突
2. **合并冲突** — 两台设备同时修改同一文件会冲突，Obsidian Git 会提示
3. **大文件** — 避免把大的 PDF/视频放进 Vault，用 `.gitignore` 排除
4. **隐私** — 确保 GitHub 仓库是 **Private**

## 参考来源

* Git 插件仓库（含移动端说明）：[https://github.com/Vinzent03/obsidian-git](https://github.com/Vinzent03/obsidian-git) （查阅日期 2026-09-14）
* Git 插件文档：[https://publish.obsidian.md/git-doc](https://publish.obsidian.md/git-doc) （查阅日期 2026-09-14）
* Obsidian Sync：[https://obsidian.md/help/sync](https://obsidian.md/help/sync) （查阅日期 2026-09-14）
