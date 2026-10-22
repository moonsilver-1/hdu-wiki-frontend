"use client";

import { useRef, useState } from "react";
import styles from "./video.module.css";

const source = "/promo/hdu-wiki-tour.mp4";

export default function VideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const [failed, setFailed] = useState(false);

  async function play() {
    const video = videoRef.current;
    if (!video) return;
    // Omit src until the click, including in browsers that ignore preload.
    video.src = source;
    video.controls = true;
    setStarted(true);
    try { await video.play(); } catch { /* Native controls remain available. */ }
  }

  return (
    <div className={styles.player}>
      <video ref={videoRef} className={styles.video} controls={started} preload="none"
        poster="/promo/hdu-wiki-tour-poster.jpg" playsInline width={1280} height={720}
        onError={() => setFailed(true)} aria-label="杭电 Wiki 网站操作演示" aria-describedby="video-caption">
        {started ? <track src="/promo/hdu-wiki-tour.zh.vtt" kind="subtitles" srcLang="zh-CN" label="中文字幕" /> : null}
        你的浏览器暂时无法播放这段视频，可以<a href={source} download>下载后观看</a>。
      </video>
      {!started ? (
        <button type="button" className={styles.play} onClick={play} aria-label="播放约 60 秒的网站介绍">
          <span aria-hidden="true">▶</span> 播放介绍 <small>约 60 秒</small>
        </button>
      ) : null}
      {failed ? <p className={styles.error} role="alert">视频暂时没加载成功，可以<a href={source} download>下载后观看</a>。</p> : null}
    </div>
  );
}
