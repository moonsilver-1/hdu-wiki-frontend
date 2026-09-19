---
title: "V2Ray / Xray"
date: "2026-09-20"
author: "默子, 洛洛"
excerpt: "V2Ray 是功能强大的网络代理工具，支持多种协议。Xray 是 V2Ray 的社区分支，性能更好，支持更多新协议（如 VLESS、Reality、XTLS）。"
tags: ["洛洛", "转载"]
---

## 简介

**V2Ray** 是功能强大的网络代理工具，支持多种协议。**Xray** 是 V2Ray 的社区分支，性能更好，支持更多新协议（如 VLESS、Reality、XTLS）。

目前推荐使用 **Xray-core**（GitHub: `XTLS/Xray-core`）。截至 2026-09-14，最新正式版是 v26.3.27（2026-03-27），仓库仍在持续提交。

## 客户端推荐

| 平台      | 客户端                         | 特点                                               |
| ------- | --------------------------- | ------------------------------------------------ |
| macOS   | V2rayU / Clash Verge Rev    | V2rayU 原生支持 Xray                                 |
| Windows | **V2rayN**                  | 最流行的 Windows 客户端；截至 2026-09-14 也提供 Linux、macOS 版 |
| iOS     | Shadowrocket / Quantumult X | 见 [Shadowrocket 教程](/tech/tool-use/network-shadowrocket)  |
| Android | **V2rayNG**                 | 最流行的 Android 客户端                                 |
| Linux   | v2rayA（Web GUI）             | 浏览器管理                                            |

## 核心协议

### VMess

V2Ray 原生协议，自带加密：

* 需要**精确校准系统时间**（误差不超过 90 秒）
* 支持多种传输方式（TCP、WebSocket、gRPC、HTTP/2）
* 加密方式推荐 `auto` 或 `chacha20-poly1305`

```json
{
  "protocol": "vmess",
  "settings": {
    "vnext": [{
      "address": "server.example.com",
      "port": 443,
      "users": [{
        "id": "your-uuid",
        "alterId": 0,
        "security": "auto"
      }]
    }]
  }
}
```

### VLESS

VMess 的精简版，去掉了内置加密层：

* **性能更好**（减少一层加密开销）
* 必须配合 TLS 或 Reality 使用
* 推荐搭配 XTLS Vision 流控

```json
{
  "protocol": "vless",
  "settings": {
    "vnext": [{
      "address": "server.example.com",
      "port": 443,
      "users": [{
        "id": "your-uuid",
        "flow": "xtls-rprx-vision"
      }]
    }]
  }
}
```

### Trojan

伪装成正常 HTTPS 流量：

* 需要有效域名和 TLS 证书
* 隐蔽性好，看起来就是普通 HTTPS
* 配置相对简单

## Reality 协议详解

**Reality** 是 Xray 独创的新型传输协议，目前被认为是**抗检测能力最强的方案之一**。

### 核心优势

* **无需域名** — 不需要买域名、不需要 TLS 证书
* **无需备案** — 省去域名配置的麻烦
* **伪装真实** — "偷取"目标网站的 TLS 指纹，看起来像在访问真实大站
* **难以检测** — 从外部完全无法区分代理流量和正常流量

### 工作原理

```
客户端 → 服务器（伪装成访问 www.microsoft.com）→ 目标网站
         ↑ 外部观察者只能看到你在访问微软官网
```

### 服务端配置

```json
{
  "inbounds": [{
    "listen": "0.0.0.0",
    "port": 443,
    "protocol": "vless",
    "settings": {
      "clients": [{
        "id": "your-uuid",
        "flow": "xtls-rprx-vision"
      }],
      "decryption": "none"
    },
    "streamSettings": {
      "network": "tcp",
      "security": "reality",
      "realitySettings": {
        "dest": "www.microsoft.com:443",
        "serverNames": ["www.microsoft.com"],
        "privateKey": "your-private-key",
        "shortIds": ["abcdef1234"]
      }
    }
  }]
}
```

### 生成密钥对

```bash
xray x25519
## 较新版本的输出：
## PrivateKey: xxxxx（填服务端 privateKey）
## Password: xxxxx（这就是公钥，填客户端；部分版本显示为 Password (PublicKey)）
## 可能还会多一行 Hash32，REALITY 用不到
```

### 选择 dest 目标

`dest` 是伪装的目标网站（当前官方文档把这个字段叫 `target`，`dest` 是旧名，两者互为别名都能用），需要满足：

* 支持 TLS 1.3
* 支持 HTTP/2
* 是大型网站（不容易被封）

推荐选择：

* `www.microsoft.com:443`
* `www.apple.com:443`
* `www.amazon.com:443`
* `dl.google.com:443`

### 客户端配置要点

客户端需要填入以下信息：

| 字段                     | 说明                             |
| ---------------------- | ------------------------------ |
| 地址                     | 服务器 IP                         |
| 端口                     | 443                            |
| UUID                   | 你的 UUID                        |
| Flow                   | `xtls-rprx-vision`             |
| Security               | `reality`                      |
| SNI                    | `www.microsoft.com`            |
| Fingerprint            | `chrome`                       |
| Password（旧名 PublicKey） | 服务端生成的公钥；不少客户端界面仍显示为 PublicKey |
| ShortId                | 与服务端一致                         |

## 传输层配置

| 传输方式          | 特点        | 适用场景   |
| ------------- | --------- | ------ |
| **TCP**       | 延迟最低      | 默认选择   |
| **WebSocket** | 可套 CDN，稳定 | IP 被封时 |
| **gRPC**      | 多路复用，高并发  | 高性能需求  |
| **HTTP/2**    | 性能好       | 部分环境   |

### 常见搭配推荐

| 方案                      | 特点                  |
| ----------------------- | ------------------- |
| `VLESS + TCP + Reality` | **首选**，高性能，难检测，无需域名 |
| `VLESS + WS + TLS`      | 经典稳定，可套 CDN         |
| `VMess + WS + TLS`      | 兼容性最好               |
| `Trojan + TCP + TLS`    | 简单直接                |

## V2rayN 使用教程（Windows）

1. 从 GitHub Releases 下载最新版
2. 解压运行 `v2rayN.exe`
3. 右下角托盘图标 → 右键
4. 添加节点：「服务器」→「添加 \[VLESS] 服务器」
5. 或批量导入：「订阅分组」→ 粘贴订阅 URL → 更新
6. 选择节点，右键设为活动服务器
7. 系统代理 → 自动配置系统代理

## 注意事项

* VMess 对系统时间敏感，确保时间同步
* Reality 需要 Xray-core 1.8.0+ 版本
* 套 CDN 时选择 WebSocket 传输
* 服务器 IP 被封？试试套 Cloudflare CDN

## 参考来源

* Xray-core GitHub Releases（v26.3.27，2026-03-27）：[https://github.com/XTLS/Xray-core/releases（查阅于](https://github.com/XTLS/Xray-core/releases（查阅于) 2026-09-14）
* Project X REALITY 配置文档：[https://xtls.github.io/en/config/transports/reality.html（查阅于](https://xtls.github.io/en/config/transports/reality.html（查阅于) 2026-09-14）
* v2rayN Releases（7.24.9，2026-08-29）：[https://github.com/2dust/v2rayN/releases（查阅于](https://github.com/2dust/v2rayN/releases（查阅于) 2026-09-14）
* v2rayNG GitHub 仓库：[https://github.com/2dust/v2rayNG（查阅于](https://github.com/2dust/v2rayNG（查阅于) 2026-09-14）
