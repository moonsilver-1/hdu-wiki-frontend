# 视频和表情包

- `/video` 展示已有的 60 秒网站介绍；`/tour` 永久跳转到新地址。
- `/stickers` 展示学长、学姐各 20 张表情，搜索、人物和主题筛选组合生效，每页最多 24 张。
- PNG 文件保存在 `public/stickers/boy/` 和 `public/stickers/girl/`；每个文件只有一个表情，两个目录各 20 张。
- `lib/sticker-captions.json` 是配字清单，沿用素材的原始编号。`lib/stickers.ts` 中 `STICKER_PACK_URL` 和 `STICKER_PACK_SIZE` 配置完整 ZIP 的下载地址和展示大小。完整包放在 `public/stickers/sheep-stickers-40.zip`，通过网站同域下载。

表情原图使用内置 ImageGen 逐张生成，保留透明通道。最终 40 条提示词和已批准的两张人物参考保存在 `scripts/media/stickers/`，后续补图可沿用。未使用代码绘制或替换人物画面。

媒体组件和配字只被对应路由引用。首页、页脚及两页之间的入口使用 `prefetch={false}`，不会提前请求路由或媒体。表情页只挂载当前一页的图，并使用 Next Image 的缩略图优化和原生延迟加载；下载链接直接指向独立 PNG。ZIP 只由普通下载链接触发，不预取、不在浏览器内临时打包。

视频初始 HTML 没有 `src` 或 `<source>`，`preload="none"`。点击播放后才绑定 MP4 地址并挂载可选字幕轨道，内嵌中文字幕仍保留。海报只在视频页面出现。

发布核验：

1. 首页和文章页不出现 `/promo/`、`/stickers/boy/`、`/stickers/girl/` 的资源请求。
2. 进入 `/video` 后 MP4 没有被请求，点击播放后可正常播放，旧地址跳转正常。
3. 表情页人物/主题/搜索/翻页正常，单 PNG 下载有正确文件名。
4. ZIP 包含两个人物各 20 张；下载文件完整，展示大小对应最终文件。
5. 手机宽度、暗色主题和键盘操作可用。
