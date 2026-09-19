---
title: "实用技巧"
date: "2026-09-20"
author: "洛洛"
excerpt: "很多命令行工具默认不走系统代理，需要手动配置。"
tags: ["luoluo", "迁移"]
---

## 终端代理

很多命令行工具默认不走系统代理，需要手动配置。

### 临时设置

```bash
export https_proxy=http://127.0.0.1:7890
export http_proxy=http://127.0.0.1:7890
export all_proxy=socks5://127.0.0.1:7891
```

### 写入配置文件

在 `~/.zshrc` 或 `~/.bashrc` 中添加：

```bash
## 代理开关
proxy_on() {
  export https_proxy=http://127.0.0.1:7890
  export http_proxy=http://127.0.0.1:7890
  export all_proxy=socks5://127.0.0.1:7891
  echo "代理已开启"
}

proxy_off() {
  unset https_proxy http_proxy all_proxy
  echo "代理已关闭"
}
```

然后用 `proxy_on` 和 `proxy_off` 切换。

## Git 代理

```bash
## 设置
git config --global http.proxy http://127.0.0.1:7890
git config --global https.proxy http://127.0.0.1:7890

## 取消
git config --global --unset http.proxy
git config --global --unset https.proxy
```

只对 GitHub 设置代理：

```bash
git config --global http.https://github.com.proxy http://127.0.0.1:7890
```

## npm / pnpm 代理

```bash
npm config set proxy http://127.0.0.1:7890
npm config set https-proxy http://127.0.0.1:7890
```

或使用镜像源替代：

```bash
npm config set registry https://registry.npmmirror.com
```

## DNS 泄漏

即使开了代理，DNS 请求可能还是走默认 DNS，导致：

* 访问速度不理想
* 隐私泄漏

解决方案：

* 开启 Clash 的 TUN 模式接管 DNS
* 或手动配置 DNS 为 `1.1.1.1` / `8.8.8.8`

## 选择节点的技巧

1. **日常浏览**：选延迟低的（\< 150ms），香港、日本节点通常最快
2. **看视频**：选带宽大的节点，不一定延迟最低
3. **下载文件**：选负载低的节点
4. **ChatGPT / Claude**：部分节点 IP 可能被封，多试几个
5. **游戏**：选延迟最低且稳定的节点，开启 UDP 转发

## 机场选择建议

* 看稳定性而非节点数量
* 关注高峰期（晚 8-11 点）的速度
* 备一个备用机场，主力挂了能应急
* 月付试用，别一上来就年付

## 参考来源

* Git 官方文档 git-config：[https://git-scm.com/docs/git-config（查阅于](https://git-scm.com/docs/git-config（查阅于) 2026-09-14）
* npm 官方文档 npm config：[https://docs.npmjs.com/cli/commands/npm-config（查阅于](https://docs.npmjs.com/cli/commands/npm-config（查阅于) 2026-09-14）
* npmmirror 镜像站：[https://npmmirror.com/（查阅于](https://npmmirror.com/（查阅于) 2026-09-14）
