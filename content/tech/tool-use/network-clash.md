---
title: "Clash 使用指南"
date: "2026-09-20"
author: "洛洛"
excerpt: "* 基于 Tauri（Rust + Web），比 Electron 方案更轻量"
tags: ["luoluo", "迁移"]
---

Clash 是目前最流行的代理客户端框架之一，支持多种协议和灵活的分流规则。

> 原版 Clash 内核已停止维护，社区分支 **mihomo**（原 Clash Meta）是目前的主流选择。

截至 2026-09-14，Clash Verge Rev 最新正式版是 v2.5.2（2026-07-19），Clash Meta for Android 最新是 v2.11.33（2026-08-16），两个仓库都还在持续更新。

## 客户端选择

| 平台      | 推荐客户端                      | 说明                  |
| ------- | -------------------------- | ------------------- |
| macOS   | **Clash Verge Rev**        | Tauri 框架，轻量快速       |
| Windows | **Clash Verge Rev**        | 同上，跨平台一致体验          |
| Linux   | **Clash Verge Rev**        | 同上                  |
| iOS     | **Stash** / Shadowrocket   | Stash 原生支持 Clash 配置 |
| Android | **Clash Meta for Android** | 社区维护                |

### Clash Verge Rev 特性

* 基于 Tauri（Rust + Web），比 Electron 方案更轻量
* 内核使用 mihomo，支持所有主流协议
* 可视化规则编辑
* Profile 增强（JavaScript 脚本预处理订阅）
* TUN 模式一键开启
* 系统代理自动配置

## 安装 Clash Verge Rev

### macOS

从 GitHub Releases 下载 `.dmg` 安装包（Apple Silicon 选 `aarch64`，Intel 选 `x64`），拖入 Applications 即可。

首次打开可能提示安全警告：

```bash
## 移除隔离属性
sudo xattr -r -d com.apple.quarantine /Applications/Clash\ Verge.app
```

### Windows

下载 `x64-setup.exe` 安装包（ARM 电脑选 `arm64-setup.exe`），双击安装。文件名带 `fixed_webview2` 的是内置固定版 WebView2 的安装包，系统 WebView2 有问题时再用。

### Linux

下载 `.deb`（Debian / Ubuntu）或 `.rpm`（Fedora / RHEL）包。截至 2026-09-14，正式版 Releases 里没有 AppImage。

## 基础使用

### 1. 导入订阅

1. 打开 Clash Verge Rev
2. 进入「Profiles / 配置」页面
3. 在顶部输入框粘贴订阅 URL
4. 点击「Import / 导入」
5. 点击导入的配置使其生效（高亮选中）

### 2. 选择节点

进入「Proxies / 代理」页面：

* **延迟测试**：点击⚡图标测试所有节点延迟
* **选择节点**：点击延迟低的节点
* **策略组**：通常有「自动选择」「手动选择」「负载均衡」等
* 推荐延迟 \< 200ms 的节点

### 3. 开启代理

* 打开「System Proxy / 系统代理」开关
* 选择「Rule / 规则模式」

### 4. TUN 模式（推荐）

TUN 模式在系统层面接管所有流量，比系统代理更彻底：

1. 进入「Settings / 设置」
2. 开启「TUN Mode」
3. macOS/Linux 需要输入密码授权

TUN 模式优势：

* 所有应用流量都被接管（包括终端）
* 不需要额外配置终端代理
* 游戏等 UDP 流量也能代理

## 配置文件详解

Clash 使用 YAML 配置，核心结构：

```yaml
## 基础设置
mixed-port: 7890        # HTTP/SOCKS 混合端口
allow-lan: false         # 是否允许局域网连接
mode: rule               # rule / global / direct

## DNS 设置
dns:
  enable: true
  enhanced-mode: fake-ip  # fake-ip 性能更好
  nameserver:
    - 223.5.5.5           # 阿里 DNS
    - 119.29.29.29        # 腾讯 DNS
  fallback:
    - tls://8.8.8.8       # Google DNS
    - tls://1.1.1.1       # Cloudflare DNS

## 节点列表
proxies:
  - name: "香港01"
    type: vmess
    server: hk1.example.com
    port: 443
    uuid: "xxx"
    alterId: 0
    cipher: auto
    tls: true
    network: ws
    ws-opts:
      path: /ws

## 策略组
proxy-groups:
  - name: "🚀 节点选择"
    type: select
    proxies: [自动选择, 香港01, 日本01, 美国01]

  - name: "自动选择"
    type: url-test
    proxies: [香港01, 日本01]
    url: http://www.gstatic.com/generate_204
    interval: 300

## 分流规则
rules:
  - DOMAIN-SUFFIX,google.com,🚀 节点选择
  - DOMAIN-SUFFIX,github.com,🚀 节点选择
  - DOMAIN-SUFFIX,baidu.com,DIRECT
  - GEOIP,CN,DIRECT
  - MATCH,🚀 节点选择
```

## Profile 增强（脚本预处理）

Clash Verge Rev 支持用 JS 脚本对订阅配置进行预处理：

```javascript
// 示例：在订阅规则最前面插入一条自定义规则
function main(config, profileName) {
  // 修改规则
  config.rules = [
    "DOMAIN-SUFFIX,openai.com,🚀 节点选择",
    ...config.rules
  ];
  return config;
}
```

1. 进入「Profiles」页面
2. 点击配置右侧的「增强」图标
3. 选择「Script」类型
4. 编写预处理脚本（只支持 JavaScript，入口函数是 `main(config, profileName)`，返回修改后的配置）

## DNS 配置

### fake-ip vs redir-host

| 模式             | 优势           | 劣势         |
| -------------- | ------------ | ---------- |
| **fake-ip**    | 响应快，防 DNS 泄漏 | 部分应用可能不兼容  |
| **redir-host** | 兼容性好         | 有 DNS 泄漏风险 |

推荐日常使用 `fake-ip` 模式。

## 常见问题

### 系统代理不生效？

1. 确认端口未被占用：`lsof -i :7890`
2. 尝试重启客户端
3. 检查防火墙设置

### 节点全部超时？

1. 更新订阅
2. 检查订阅是否过期
3. 检查本地网络是否正常
4. 尝试切换订阅链接（HTTP → HTTPS 或反之）

### 某些网站打不开？

1. 检查分流规则是否正确
2. 尝试切换不同节点
3. 清除浏览器 DNS 缓存：`chrome://net-internals/#dns`

### 如何让终端也走代理？

方式一：开启 TUN 模式（推荐）

方式二：手动设置环境变量

```bash
export https_proxy=http://127.0.0.1:7890
export http_proxy=http://127.0.0.1:7890
```

## 参考来源

* Clash Verge Rev GitHub 仓库：[https://github.com/clash-verge-rev/clash-verge-rev（查阅于](https://github.com/clash-verge-rev/clash-verge-rev（查阅于) 2026-09-14）
* Clash Verge Rev Releases（v2.5.2，2026-07-19）：[https://github.com/clash-verge-rev/clash-verge-rev/releases（查阅于](https://github.com/clash-verge-rev/clash-verge-rev/releases（查阅于) 2026-09-14）
* Clash Verge Rev 扩展脚本文档：[https://www.clashverge.dev/guide/script.html（查阅于](https://www.clashverge.dev/guide/script.html（查阅于) 2026-09-14）
* Clash Meta for Android Releases：[https://github.com/MetaCubeX/ClashMetaForAndroid/releases（查阅于](https://github.com/MetaCubeX/ClashMetaForAndroid/releases（查阅于) 2026-09-14）
