"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function CampusMap({ campus, onClose }: { campus: "xiasha" | "shaoxing"; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [zoom, setZoom] = useState(false);
  useEffect(() => {
    ref.current?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, []);
  return <dialog ref={ref} className="pw-campus-dialog" onCancel={onClose} onClick={e => { if (e.target === e.currentTarget) onClose(); }} aria-labelledby="campus-map-title">
    <header><div><small>HDU / CAMPUS MAP</small><h2 id="campus-map-title">{campus === "xiasha" ? "下沙" : "绍兴"}校区</h2></div><nav aria-label="地图查看工具"><button className="pw-atlas-zoom" onClick={() => setZoom(!zoom)} aria-pressed={zoom}>{zoom ? "− 缩回" : "＋ 放大"}</button><button onClick={onClose} aria-label="关闭校区地图">×</button></nav></header>
    <div className="pw-atlas-scroll"><Image className={zoom ? "is-zoomed" : ""} src={campus === "xiasha" ? "/welcome/xiasha-map-v4.png" : "/welcome/shaoxing-map-v2.png"} alt={`杭州电子科技大学${campus === "xiasha" ? "下沙" : "绍兴"}校区手绘地图，标有教学楼、宿舍、食堂、图书馆及校门`} width={campus === "xiasha" ? 1132 : 1536} height={campus === "xiasha" ? 1389 : 1024} unoptimized /></div>
  </dialog>;
}





