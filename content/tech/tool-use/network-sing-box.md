---
title: "sing-box"
date: "2026-09-20"
author: "洛洛"
excerpt: "* 统一配置格式 — JSON 配置，结构清晰"
tags: ["luoluo", "迁移"]
---

**sing-box** 是由 SagerNet 开发者维护的新一代通用代理平台，定位为 Xray 和 Clash 的统一替代方案。

## 为什么选择 sing-box？

* **统一配置格式** — JSON 配置，结构清晰
* **全协议支持** — SS、VMess、VLESS、Trojan、Hysteria2、TUIC、WireGuard、Reality
* **高性能** — Go 语言编写，内存占用低
* **全平台客户端** — 官方提供各平台 GUI 客户端
* **活跃开发** — 越来越多机场开始提供 sing-box 订阅

## 客户端

| 平台      | 客户端                                           | 说明                                         |
| ------- | --------------------------------------------- | ------------------------------------------ |
| Android | **SFA** (sing-box for Android)                | 官方客户端                                      |
| iOS     | **SFI** (sing-box for Apple platforms)        | 官方客户端，App Store 可下载，需要非中国大陆 Apple 账号       |
| macOS   | **SFM** (sing-box for Apple platforms)        | 官方客户端，App Store、GitHub Releases 或 Homebrew |
| Windows | **SFW** (sing-box for Desktop)                | 官方客户端                                      |
| Linux   | **SFL** (sing-box for Desktop) / sing-box CLI | 官方客户端或命令行                                  |

截至 2026-09-14，sing-box 最新正式版是 v1.14.0（2026-08-31）。官方文档提示 App Store 上的 sing-box 应用暂时无法更新，TestFlight 只对赞助者开放。

## 配置文件结构

sing-box 使用 JSON 配置，核心结构如下。示例按 1.12 之后的写法：TUN 地址用 `address`，DNS 服务器写明 `type`，地理分流用远程规则集，拦截用路由动作 `reject`。旧教程里的 `inet4_address`、`geosite` / `geoip`、`block` 出站和旧式 DNS 地址写法已在 1.12.0 到 1.14.0 之间陆续移除，新版本不再支持。

```json
{
  "log": {
    "level": "info"
  },
  "dns": {
    "servers": [
      {
        "type": "tls",
        "tag": "google",
        "server": "8.8.8.8"
      },
      {
        "type": "udp",
        "tag": "local",
        "server": "223.5.5.5"
      }
    ],
    "rules": [
      {
        "rule_set": "geosite-cn",
        "server": "local"
      }
    ]
  },
  "inbounds": [
    {
      "type": "tun",
      "address": ["172.19.0.1/30"],
      "auto_route": true,
      "strict_route": true
    }
  ],
  "outbounds": [
    {
      "type": "vless",
      "tag": "proxy",
      "server": "example.com",
      "server_port": 443,
      "uuid": "your-uuid",
      "tls": {
        "enabled": true,
        "server_name": "example.com"
      },
      "transport": {
        "type": "ws",
        "path": "/ws"
      }
    },
    {
      "type": "direct",
      "tag": "direct"
    }
  ],
  "route": {
    "rule_set": [
      {
        "tag": "geosite-cn",
        "type": "remote",
        "url": "https://raw.githubusercontent.com/SagerNet/sing-geosite/rule-set/geosite-cn.srs",
        "format": "binary"
      },
      {
        "tag": "geoip-cn",
        "type": "remote",
        "url": "https://raw.githubusercontent.com/SagerNet/sing-geoip/rule-set/geoip-cn.srs",
        "format": "binary"
      },
      {
        "tag": "geosite-category-ads-all",
        "type": "remote",
        "url": "https://raw.githubusercontent.com/SagerNet/sing-geosite/rule-set/geosite-category-ads-all.srs",
        "format": "binary"
      }
    ],
    "rules": [
      {
        "rule_set": ["geosite-cn", "geoip-cn"],
        "outbound": "direct"
      },
      {
        "rule_set": "geosite-category-ads-all",
        "action": "reject"
      }
    ],
    "default_domain_resolver": "local",
    "final": "proxy"
  }
}
```

## 核心概念

### Inbounds（入站）

接收本地流量的方式：

* **tun** — 系统级接管所有流量（推荐）
* **mixed** — HTTP/SOCKS5 混合代理
* **http** — HTTP 代理
* **socks** — SOCKS5 代理

### Outbounds（出站）

流量的出口方式，就是你的代理节点配置。拦截流量不再用 `block` 出站（1.13.0 已移除），改在路由规则里写 `"action": "reject"`。

### Route（路由）

分流规则，决定流量走 proxy 还是 direct。旧的 `geosite` / `geoip` 字段已在 1.12.0 移除，现在用规则集（`rule_set`）匹配：

```json
{
  "route": {
    "rules": [
      { "rule_set": "geosite-cn", "outbound": "direct" },
      { "rule_set": "geoip-cn", "outbound": "direct" },
      { "rule_set": "geosite-google", "outbound": "proxy" }
    ],
    "final": "proxy"
  }
}
```

### Rule Set（规则集）

支持远程规则集，自动更新：

```json
{
  "route": {
    "rule_set": [
      {
        "tag": "geosite-cn",
        "type": "remote",
        "url": "https://example.com/geosite-cn.srs",
        "format": "binary"
      }
    ]
  }
}
```

## 使用订阅

大部分机场已支持 sing-box 订阅格式：

1. 在机场控制面板找到 sing-box 订阅链接
2. 在客户端导入订阅 URL
3. 选择节点，启动代理

## sing-box vs Clash vs Xray

| 特性      | sing-box | Clash (mihomo) | Xray |
| ------- | -------- | -------------- | ---- |
| 配置格式    | JSON     | YAML           | JSON |
| 协议支持    | 全面       | 全面             | 全面   |
| GUI 客户端 | 官方多平台    | 第三方            | 第三方  |
| 性能      | 优秀       | 良好             | 优秀   |
| 学习曲线    | 中等       | 低              | 高    |
| 规则系统    | 强大       | 强大             | 基础   |
| 社区生态    | 快速增长     | 成熟             | 成熟   |

## 参考来源

* sing-box 废弃与移除功能列表：[https://sing-box.sagernet.org/deprecated/（查阅于](https://sing-box.sagernet.org/deprecated/（查阅于) 2026-09-14）
* sing-box 迁移指南：[https://sing-box.sagernet.org/migration/（查阅于](https://sing-box.sagernet.org/migration/（查阅于) 2026-09-14）
* sing-box 官方客户端：[https://sing-box.sagernet.org/clients/（查阅于](https://sing-box.sagernet.org/clients/（查阅于) 2026-09-14）
* sing-box Releases（v1.14.0，2026-08-31）：[https://github.com/SagerNet/sing-box/releases（查阅于](https://github.com/SagerNet/sing-box/releases（查阅于) 2026-09-14）
