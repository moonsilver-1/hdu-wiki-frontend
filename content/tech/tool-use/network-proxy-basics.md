---
title: "代理基础知识"
date: "2026-09-20"
author: "洛洛"
excerpt: "代理（Proxy）是一个中间服务器，你的网络请求先发给代理服务器，再由代理服务器转发到目标网站。"
tags: ["luoluo", "迁移"]
---

## 什么是代理？

代理（Proxy）是一个中间服务器，你的网络请求先发给代理服务器，再由代理服务器转发到目标网站。

```
你的设备 → 代理服务器 → 目标网站
```

## 代理 vs VPN

| 特性   | 代理                   | VPN        |
| ---- | -------------------- | ---------- |
| 工作层级 | 应用层（通常只代理浏览器或指定 App） | 系统层（所有流量）  |
| 加密   | 取决于协议                | 通常全程加密     |
| 速度   | 通常更快                 | 略慢（全程加密开销） |
| 配置   | 灵活，可分流               | 简单，一键连接    |

## 常见协议

### Shadowsocks (SS)

最早流行的代理协议之一，轻量、快速。

### VMess / VLESS

V2Ray 生态的协议。VMess 自带加密，VLESS 更轻量需要配合 TLS。

### Trojan

伪装成正常的 HTTPS 流量，隐蔽性好。

### Hysteria / Hysteria2

基于 QUIC 的高速协议，适合高延迟、高丢包环境。

### WireGuard

现代 VPN 协议，代码简洁、速度快、安全性高。

## 关键概念

### 节点

一台配置好代理服务的远程服务器，通常按地区分类（美国、日本、香港等）。

### 订阅链接

机场（代理服务商）提供的一个 URL，客户端通过它自动获取和更新节点列表。

### 分流规则

决定哪些流量走代理、哪些直连。比如：

* 国内网站 → 直连
* Google、YouTube → 代理
* 局域网 → 直连

### PAC / 规则模式

* **全局模式**：所有流量都走代理
* **规则模式**：按规则分流（推荐日常使用）
* **直连模式**：关闭代理

## 参考来源

* Project X（Xray）官方文档：[https://xtls.github.io/（查阅于](https://xtls.github.io/（查阅于) 2026-09-14）
* sing-box 出站协议文档：[https://sing-box.sagernet.org/configuration/outbound/（查阅于](https://sing-box.sagernet.org/configuration/outbound/（查阅于) 2026-09-14）
* Hysteria 2 官方文档：[https://v2.hysteria.network/（查阅于](https://v2.hysteria.network/（查阅于) 2026-09-14）
* WireGuard 官方网站：[https://www.wireguard.com/（查阅于](https://www.wireguard.com/（查阅于) 2026-09-14）
