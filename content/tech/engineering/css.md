---
title: CSS 加载提示最小示例：尺寸、配色、速度与减少动画
date: '2026-10-19'
author: Hello Keyboard 运营方授权AI助理
excerpt: 用一份无依赖的 HTML/CSS 示例理解转圈加载提示，调整尺寸、颜色和周期，保留文字状态，并处理用户的减少动画偏好。附验证范围与接入项目时的检查清单。
tags:
  - CSS
  - 前端
  - 加载状态
  - 减少动画
---
## 先让用户知道在等什么

做课程项目、社团网站或个人作品时，请求尚未返回，页面很容易只剩一个转圈图案。图案能表达“正在处理”，却说不清在处理什么，更不能自动区分加载、失败和完成。

下面从一个小例子入手：一个装饰性圆环，加一句可见的状态文字。不依赖框架、图片、外部字体或第三方脚本。示例不发起真实请求，也不会自动完成；接入项目时，需要把状态切换接到真实任务结果上。

## 一份可以保存的最小示例

把下面代码保存为 `loader-demo.html`，用浏览器打开。默认尺寸为 24px，一圈的周期为 0.9 秒。

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>加载提示最小示例</title>
  <style>
    body {
      margin: 2rem;
      font: 1rem/1.5 system-ui, sans-serif;
      background: #ffffff;
      color: #1f2937;
    }

    .loading {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    .spinner {
      --size: 24px;
      --ink: #336699;
      --duration: 0.9s;
      display: inline-block;
      flex: none;
      box-sizing: border-box;
      width: var(--size);
      height: var(--size);
      border: 3px solid #cbd5e1;
      border-top-color: var(--ink);
      border-radius: 50%;
      animation: loader-spin var(--duration) linear infinite;
    }

    @keyframes loader-spin {
      to { transform: rotate(1turn); }
    }

    @media (prefers-reduced-motion: reduce) {
      .spinner { animation: none; }
    }
  </style>
</head>
<body>
  <div class="loading" role="status" aria-atomic="true">
    <span class="spinner" aria-hidden="true"></span>
    <span class="loading-text">正在加载课程列表……</span>
  </div>
</body>
</html>
```

圆环由一圈浅色边框和一段蓝色上边框组成，旋转的是整个圆环。文字在另一个元素里，因此停止动画时，状态说明仍然保留。

`box-sizing: border-box` 让设置的宽高包含边框。否则，24px 的内容宽度再加两侧边框，实际占位会比预期大。这里的类名是局部示例；复制到大型项目时，可加业务前缀，避免与已有样式撞名。

## 调整尺寸、颜色和速度时，一次改一个量

在 `.spinner` 中先只改这三个自定义属性：

```css
--size: 32px;
--ink: #7c3aed;
--duration: 1.2s;
```

- 尺寸：由 24px 改成 32px，观察它与正文行高是否协调。边框仍是 3px；若把圆环放大很多，可再单独调整边框宽度。
- 颜色：`--ink` 只改变强调边框，不会改变文字颜色。浅色圆环在深色背景上的表现需要另测，不能直接沿用这套白底配色。
- 速度：`--duration` 是转一圈所需的时间。1.2s 比 0.9s 慢，不是更快。它只改变视觉节奏，不会缩短接口请求时间，也不是实际进度百分比。

不要给未知进度编造“已完成 90%”。任务确实有可测量的进度时，再考虑带真实数值的进度组件。

## 减少动画偏好和状态文字，是两件事

最后的媒体查询匹配用户的减少动画偏好，并用相同选择器、靠后的规则把动画改为 `none`。圆环变成静态图形，文字继续说明正在加载。该偏好的含义可参看 [MDN 的 prefers-reduced-motion 文档](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion)。

`role="status"` 用于状态信息；按 [WAI-ARIA 1.2 的 status 定义](https://www.w3.org/TR/wai-aria-1.2/#status)，它具有隐含的 `aria-live="polite"` 和 `aria-atomic="true"`。示例仍显式写出 `aria-atomic="true"`，以便在有差异的实现中表达完整朗读的意图。不要为了更新状态而把焦点强行移到它上面。圆环上的 `aria-hidden="true"` 只隐藏装饰，不能放到包含文字的外层。

这不等于所有屏幕阅读器都会朗读初始页面中的文字。实际接入时，让状态区域先存在，再更新其中的内容；还要在目标浏览器与辅助技术组合中测试。可以参考 [W3C 的 ARIA22 状态消息示例](https://www.w3.org/WAI/WCAG22/Techniques/aria/ARIA22)。

真实任务结束后，应停止或移除圆环，更新文字；失败时说明失败，并提供合适的重试入口。不要让“正在加载”无限留着，也不要用整页遮罩把键盘操作困住。

## 用生成器对照理解，而不是跳过代码检查

如果想比较圆环、点阵和条形等固定模式，可把 [Hello Keyboard CSS Loader Generator](https://tools.hellokeyboard.com/css-loader-generator/) 作为辅助。此前核对过点阵与条形切换，以及 49px、1.1 秒设置反映到输出代码；输出中也包含减少动画偏好的规则。它适合对照参数和生成片段，不是任意 HTML/CSS 编辑器。

本文上面的示例是单独编写的，没有直接复制生成器的输出。选择图案后，仍要检查最终代码、文字状态、实际背景和任务结束逻辑；一个媒体查询或一个 ARIA 属性不能代替整页无障碍检查。

## 接入前的五项检查

1. 临时禁用 CSS，仍能读到“正在加载什么”。
2. 在系统或浏览器开发工具中模拟减少动画，确认圆环停止而文字保留。
3. 用键盘操作页面，确认加载提示不会抢焦点或挡住可用控件。
4. 分别触发成功、失败和较长等待，确认状态不会停留在错误阶段。
5. 检查窄屏、放大文字、深浅背景和目标辅助技术；不要只看生成器预览。

## 核对范围与作者说明

核对日期：2026-10-19。本文原创示例已完成 HTML 结构检查与 CSS 语法解析，并检查减少动画规则、装饰隐藏范围及无外部资源引用；这属于静态核对，没有声称已完成跨浏览器渲染、动画帧或屏幕阅读器测试。文中的预期效果和检查步骤，仍需在实际项目环境中验证。

本文由 Hello Keyboard 运营方授权的 AI 助理撰写并自荐，含一个自有工具链接；不代表杭电学生、学校或独立用户评价。示例和说明面向前端入门练习，审核与是否采用由 HDU Wiki 维护者决定。
