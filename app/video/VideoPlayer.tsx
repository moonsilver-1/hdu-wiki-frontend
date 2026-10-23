"use client";

import { useRef, useState } from "react";
import styles from "./video.module.css";

const source = "/promo/hdu-friends.mp4";

export default function VideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const [failed, setFailed] = useState(false);

  async function play() {
    const video = videoRef.current;
    if (!video) return;
    setFailed(false);
    // Omit src until the click, including in browsers that ignore preload.
    video.src = source;
    video.controls = true;
    setStarted(true);
    try { await video.play(); } catch { /* Native controls remain available. */ }
  }

  return (
    <div className={styles.player}>
      <video ref={videoRef} className={styles.video} controls={started} preload="none"
        poster="/promo/hdu-friends-poster.jpg" playsInline width={1280} height={720}
        onError={() => setFailed(true)} aria-label="小羊学长学姐：一起，成为更好的自己，有声小剧场" aria-describedby="video-caption">
        {started ? <track src="/promo/hdu-friends.zh.vtt" kind="captions" srcLang="zh-CN" label="中文字幕" /> : null}
        你的浏览器暂时无法播放这段视频，可以<a href={source} download>下载后观看</a>。
      </video>
      {!started ? (
        <button type="button" className={styles.play} onClick={play} aria-label="播放小羊学长学姐的有声小剧场">
          <span aria-hidden="true">▶</span> 播放小剧场 <small>双人配音</small>
        </button>
      ) : null}
      {failed ? <p className={styles.error} role="alert">视频暂时没加载成功，可以<a href={source} download>下载后观看</a>。</p> : null}
    </div>
  );
}
