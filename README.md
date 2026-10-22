# HDU Wiki

我们的网址是 **[www.hdu-wiki.cn](https://www.hdu-wiki.cn)** ，欢迎大家加入我们！

## 📱 多端下载

| 平台 | 下载 |
|---|---|
| 🌐 网页版 | [hdu-wiki.cn](https://www.hdu-wiki.cn) |
| 📱 安卓 App「dudu百科」 | [下载 APK](https://github.com/moonsilver-1/dudu-app/releases/latest) |
| 💻 Windows 桌面版 | [下载 exe](https://github.com/moonsilver-1/hdu-wiki-desktop/releases/latest) |

## 🗂️ 相关仓库

- 📦 **本项目（网站）**：[hdu-wiki-frontend](https://github.com/moonsilver-1/hdu-wiki-frontend)
- 📱 手机 App：[dudu-app](https://github.com/moonsilver-1/dudu-app)
- 💻 桌面客户端：[hdu-wiki-desktop](https://github.com/moonsilver-1/hdu-wiki-desktop)
- 🏠 多端工作区：[newsheep2goat](https://github.com/moonsilver-1/newsheep2goat)

---

## 本地开发与质量检查

使用 Node.js 20.9+ 和项目指定的 pnpm 10.33.2。以 `pnpm-lock.yaml` 为安装依据；仓库中的旧 `package-lock.json` 尚未与现有依赖同步，不用于 CI 安装。

```sh
pnpm install --frozen-lockfile
pnpm dev
```

提交前运行 `pnpm check`，依次执行内容规范检查、全部 Markdown 渲染检查、回归测试、ESLint 和生产构建。单独检查类型可运行 `pnpm typecheck`；生产预览使用 `pnpm build` 和 `pnpm start`。

文章格式与投稿要求见 [CONTRIBUTING.md](CONTRIBUTING.md)。本轮修复、验证结果及后续上线验收项见 [质量改进记录](docs/quality-improvements.md)。
