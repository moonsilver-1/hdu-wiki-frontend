"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import HistoryLetter from "./HistoryLetter";
import WelcomeCheckin from "./WelcomeCheckin";
import { spriteStyle } from "@/lib/welcome-sprites";
import { libraryRoute, type RoomPoint } from "@/lib/welcome-library-path";
import { campusRoute, type MapPoint } from "@/lib/welcome-path";
import type { CSSProperties } from "react";

const places = [
  { name: "数字杭电", note: "通知 · 服务", href: "https://i.hdu.edu.cn/", x: 23, y: 48 },
  { name: "教务处", note: "课程 · 考试", href: "https://https-jwcin-hdu-edu-cn-443.webvpn.hdu.edu.cn/", x: 77, y: 48 },
  { name: "自动化学院", note: "学院 · 通知", href: "https://https-auto-hdu-edu-cn-443.webvpn.hdu.edu.cn/", x: 23, y: 78 },
  { name: "HDU Wiki", note: "经验 · 指南", href: "/", x: 77, y: 78 },
];

// 湖面区域（百分比坐标，与 .pw-water 的 CSS 保持一致）；中缝 |x-50|<=BRIDGE_HALF 是桥，可以走
const LAKE = { left: 39, top: 25, width: 22, height: 17 };
const BRIDGE_HALF = 4;
const SHELF_X = [17, 50, 83];

function Player({ girl = false, facing = "down", moon = false }: { girl?: boolean; facing?: string; moon?: boolean }) {
  return <span className="pw-sprite" style={spriteStyle(girl, facing, moon)} aria-hidden="true"><span className="pw-sprite-crop" /></span>;
}
export default function WelcomePage() {
  const [girl, setGirl] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const [phase, setPhase] = useState<"idle" | "walking" | "door">("idle");
  const [quiet, setQuiet] = useState(false);
  const [story, setStory] = useState(false);
  const [library, setLibrary] = useState(false);
  const [night, setNight] = useState(false);
  const [ripple, setRipple] = useState(0);
  const [facing, setFacing] = useState("down");
  const [chat, setChat] = useState(false);
  const [arrival, setArrival] = useState(true);
  const [bgmOn, setBgmOn] = useState(false);
  const bgmRef = useRef<HTMLAudioElement>(null);

  const currentPos = useRef<MapPoint>({ x: 50, y: 82 });
  const playerRef = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const busy = useRef(false);
  const libPlayerRef = useRef<HTMLDivElement>(null);
  const libFrame = useRef(0);
  const libPos = useRef({ x: 50, b: 12 });

  // 位置直接写 DOM，不走 React 状态：走路时每帧不再重渲染整张地图
  function applyPos(point: MapPoint) {
    const el = playerRef.current;
    if (el) {
      el.style.left = point.x + "%";
      el.style.top = point.y + "%";
    }
  }

  function stop() {
    cancelAnimationFrame(frame.current);
    timers.current.forEach(clearTimeout);
    timers.current = [];
    busy.current = false;
    setPhase("idle");
    setActive(null);
  }

  useEffect(() => {
    const restore = () => { busy.current = false; setPhase("idle"); setActive(null); };
    window.addEventListener("pageshow", restore);
    return () => {
      cancelAnimationFrame(frame.current);
      timers.current.forEach(clearTimeout);
      window.removeEventListener("pageshow", restore);
    };
  }, []);

  // 浏览器要求有用户交互后才能出声：进页面后第一次点按就响起背景音乐（手动关过则不打扰）
  useEffect(() => {
    const kick = (e: Event) => {
      if ((e.target as HTMLElement).closest?.(".pw-bgm")) return;
      const audio = bgmRef.current;
      if (!audio || localStorage.getItem("wiki-bgm") === "off") { detach(); return; }
      audio.volume = 0.45;
      audio.play().then(() => { setBgmOn(true); detach(); }).catch(() => { /* 手势不被认可时等下一次点击 */ });
    };
    const detach = () => {
      window.removeEventListener("pointerdown", kick);
      window.removeEventListener("touchend", kick);
      window.removeEventListener("click", kick);
    };
    window.addEventListener("pointerdown", kick);
    window.addEventListener("touchend", kick);
    window.addEventListener("click", kick);
    return detach;
  }, []);

  function toggleBgm() {
    const audio = bgmRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.volume = 0.45;
      audio.play().catch(() => {});
      localStorage.setItem("wiki-bgm", "on");
      setBgmOn(true);
    } else {
      audio.pause();
      localStorage.setItem("wiki-bgm", "off");
      setBgmOn(false);
    }
  }

  function walkTo(target: MapPoint, onArrival?: () => void, index: number | null = null) {
    stop();
    setChat(false);
    setActive(index);
    const points = campusRoute(currentPos.current, target);
    if (points.length < 2) { onArrival?.(); return; }
    busy.current = true;
    setPhase("walking");
    let segment = 0, progress = 0, last = 0, lastFacing = "";
    const tick = (now: number) => {
      if (!busy.current) return;
      const delta = last ? Math.min(now - last, 40) : 0;
      last = now;
      const from = points[segment], to = points[segment + 1];
      const length = Math.max(Math.hypot(to.x - from.x, to.y - from.y), 0.01);
      const heading = to.x > from.x ? "right" : to.x < from.x ? "left" : to.y < from.y ? "up" : "down";
      if (heading !== lastFacing) { lastFacing = heading; setFacing(heading); }
      progress = Math.min(1, progress + (delta / 1000) * 18 / length);
      const next = { x: from.x + (to.x - from.x) * progress, y: from.y + (to.y - from.y) * progress };
      currentPos.current = next;
      applyPos(next);
      if (progress === 1) {
        segment++;
        progress = 0;
        if (segment === points.length - 1) {
          busy.current = false;
          setPhase("idle");
          onArrival?.();
          return;
        }
      }
      frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
  }

  function travel(i: number) {
    const destination = places[i];
    if (quiet) { stop(); window.location.assign(destination.href); return; }
    walkTo({ x: destination.x, y: destination.y }, () => {
      setPhase("door");
      timers.current.push(setTimeout(() => window.location.assign(destination.href), 1000));
    }, i);
  }

  function talk() {
    walkTo({ x: 50, y: 48 }, () => { setFacing("right"); setChat(true); });
  }

  function enterLibrary() {
    walkTo({ x: 50, y: 23 }, () => {
      setPhase("door");
      timers.current.push(setTimeout(() => { setLibrary(true); setPhase("idle"); }, 650));
    });
  }

  // 图书馆内的走动与室外一样逐帧写 DOM：入场从门口走到书桌，点书架先走过去再打开。
  // 朝向与走路动画也直接写样式，图书馆场景内零 React 重渲染。
  const libAnimate = useCallback(function (target: { x?: number; b?: number }, duration: number, done?: () => void, facing?: string) {
    cancelAnimationFrame(libFrame.current);
    const el = libPlayerRef.current;
    const sprite = el?.querySelector<HTMLElement>(".pw-sprite");
    const face = (dir: string) => { if (sprite) Object.entries(spriteStyle(girl, dir)).forEach(([key,value]) => sprite.style.setProperty(key,String(value))); };
    const walk = (on: boolean) => { el?.classList.toggle("is-walking", on); };
    
    const from = { ...libPos.current };
    const to = { x: target.x ?? from.x, b: target.b ?? from.b };
    const dx = to.x - from.x, db = to.b - from.b;
    face(Math.abs(dx) > Math.abs(db) ? (dx > 0 ? "right" : "left") : (db > 0 ? "up" : db < 0 ? "down" : facing ?? "up"));
    const apply = (x: number, b: number) => {
      libPos.current = { x, b };
      if (el) { el.style.left = x + "%"; el.style.bottom = b + "%"; }
    };
    if (!el || quiet || duration <= 0) {
      apply(to.x, to.b);
      walk(false);
      done?.();
      return;
    }
    walk(true);
    let elapsed = 0, last = 0;
    const tick = (now: number) => {
      elapsed += last ? Math.min(now - last, 40) : 0; last = now;
      const p = Math.min(1, elapsed / duration);
      apply(from.x + (to.x - from.x) * p, from.b + (to.b - from.b) * p);
      if (p < 1) { libFrame.current = requestAnimationFrame(tick); return; }
      walk(false);
      done?.();
    };
    libFrame.current = requestAnimationFrame(tick);
  }, [girl, quiet]);

  // 静止时面向某方向（比如走到书架后面向书架）
  const faceLib = useCallback((dir: string) => {
    const sprite = libPlayerRef.current?.querySelector<HTMLElement>(".pw-sprite");
    if (sprite) Object.entries(spriteStyle(girl, dir)).forEach(([key,value]) => sprite.style.setProperty(key,String(value)));
  }, [girl]);

  // 进入图书馆：从画面下方的门口走进到书桌前
  useEffect(() => {
    if (!library) { applyPos(currentPos.current); return; }
    const el = libPlayerRef.current;
    libPos.current = { x: 50, b: -8 };
    if (el) { el.style.left = "50%"; el.style.bottom = "-8%"; }
    libAnimate({ b: 12 }, 1400, undefined, "up");
    return () => cancelAnimationFrame(libFrame.current);
  }, [library, libAnimate]);

  function walkLibraryTo(target: RoomPoint, done?: () => void) {
    cancelAnimationFrame(libFrame.current);
    timers.current.forEach(clearTimeout);
    timers.current = [];
    const points = libraryRoute(libPos.current, target);
    let segment = 1;
    const next = () => {
      if (segment >= points.length) { libPlayerRef.current?.classList.remove("is-walking"); done?.(); return; }
      const point = points[segment++];
      const distance = Math.hypot(point.x - libPos.current.x, point.b - libPos.current.b);
      libAnimate(point, distance / 22 * 1000, next);
    };
    next();
  }

  function openResearch(href: string, shelf: number) {
    walkLibraryTo({ x: SHELF_X[shelf], b: 44 }, () => {
      faceLib("up");
      timers.current.push(setTimeout(() => window.location.assign(href), 500));
    });
  }

  function onLibraryClick(e: React.MouseEvent<HTMLElement>) {
    if ((e.target as Element).closest("a,button")) return;
    const rect = e.currentTarget.getBoundingClientRect();
    walkLibraryTo({ x: (e.clientX - rect.left) / rect.width * 100, b: 100 - (e.clientY - rect.top) / rect.height * 100 });
  }
  function exitLibrary() {
    cancelAnimationFrame(libFrame.current);
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setLibrary(false);
  }

  // 点路即走；湖面（非桥面）只起涟漪；桥面归马路管
  function onMapClick(e: React.MouseEvent<HTMLDivElement>) {
    if ((e.target as HTMLElement).closest("button,a")) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width * 100;
    const y = (e.clientY - rect.top) / rect.height * 100;
    const inLake = x >= LAKE.left && x <= LAKE.left + LAKE.width && y >= LAKE.top && y <= LAKE.top + LAKE.height;
    if (inLake && Math.abs(x - 50) > BRIDGE_HALF) { setRipple(r => r + 1); return; }
    walkTo({ x, y });
  }

  // BGM：Evan Call - To The Ends of Our World（外部提供的音频文件；公开站点使用请注意版权授权）
  // 挂在两个视图共用处，进图书馆音乐不中断
  const bgm = <audio ref={bgmRef} src="/welcome/bgm.mp3" loop preload="none" />;
  const libraryView = (<main key="library" className="pixel-welcome pw-library-page"><svg width="0" height="0" className="pw-filter-defs" aria-hidden="true"><defs><filter id="pw-remove-paper" colorInterpolationFilters="sRGB"><feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  -10 -10 -10 0 27.4" /><feComposite in2="SourceGraphic" operator="in" /></filter></defs></svg><header className="pw-header"><Link href="/" className="pw-brand"><b>H</b> HDU WIKI</Link><button className="pw-back" onClick={exitLibrary}>← 返回校园</button></header><div className="pw-library-heading"><p className="pw-eyebrow">LEVEL 02 · THE LIBRARY</p><h1>知识，向你敞开。</h1><p>图书馆 · 文献阅览室</p></div><section className="pw-library-room" aria-label="图书馆室内地图" onClick={onLibraryClick}><div className="pw-library-windows" aria-hidden="true"><i /><i /><i /></div><nav className="pw-research" aria-label="文献数据库">{[
    { title: "IEEE", sub: "IEEE Xplore", note: "电子 · 电气 · 计算机", href: "https://webvpn.hdu.edu.cn/_webvpn_/https://ieeexplore.ieee.org/" },
    { title: "Elsevier", sub: "ScienceDirect", note: "科学 · 技术 · 医学", href: "https://webvpn.hdu.edu.cn/_webvpn_/https://www.sciencedirect.com/" },
    { title: "中国知网", sub: "CNKI", note: "中文期刊 · 学位论文", href: "https://webvpn.hdu.edu.cn/_webvpn_/https://www.cnki.net" },
  ].map((item, i) => <a key={item.title} href={item.href} className={"pw-bookcase pw-shelf-" + i} onClick={e => { if (!e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey) { e.preventDefault(); openResearch(item.href, i); } }}><span className="pw-books" aria-hidden="true">{Array.from({ length: 18 }, (_, n) => <i key={n} style={{ "--book": n } as CSSProperties} />)}</span><span className="pw-shelf-label"><strong>{item.title} ↗</strong><small>{item.sub}</small></span><span className="pw-shelf-note">{item.note}</span></a>)}</nav><div className="pw-reading-table" aria-hidden="true"><span>▤</span><i /><span>▤</span></div><div className="pw-library-player" ref={libPlayerRef} style={{ left: "50%", bottom: "12%" }}><Player girl={girl} facing="up" /><span>YOU</span></div><button className="pw-library-exit" onClick={exitLibrary}>↓ 回到校园</button></section><p className="pw-vpn-note">文献入口通过杭电 WebVPN 访问，可能需要校园账号登录。</p></main>);

  const campusView = (<main key="campus" className="pixel-welcome">
    <svg width="0" height="0" className="pw-filter-defs" aria-hidden="true"><defs><filter id="pw-remove-paper" colorInterpolationFilters="sRGB"><feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  -10 -10 -10 0 27.4" /><feComposite in2="SourceGraphic" operator="in" /></filter></defs></svg>
    {arrival && <div className="pw-arrival" aria-hidden="true" onAnimationEnd={e => { if (e.target === e.currentTarget) setArrival(false); }}><span>初见杭电<small>HELLO, NEW ADVENTURE</small></span></div>}
    <header className="pw-header"><Link href="/" className="pw-brand"><b>H</b> HDU WIKI <span>/ 新生序章</span></Link><span className="pw-edition">AUTUMN 2026 · 新生季</span></header>
    <div className="pw-layout">
      <section className="pw-intro">
        <p className="pw-eyebrow">LEVEL 01 · HELLO, HDU</p>
        <h1>初见杭电<span>你的故事，<br />从这里开始。</span></h1>
        <p className="pw-lead">九月，与你相逢。</p>
        <fieldset className="pw-characters" disabled={phase !== "idle"}>
          <legend>选择角色 <small>PLAYER</small></legend>
          {[false, true].map(v => <button key={String(v)} aria-pressed={girl === v} className={girl === v ? "selected" : ""} onClick={() => setGirl(v)}><Player girl={v} /><span>{v ? "女生" : "男生"}<small>{girl === v ? "READY TO GO" : "SELECT"}</small></span><b>{girl === v ? "✓" : "+"}</b></button>)}
        </fieldset>
        <div className="pw-instructions">↗ 点路漫游 · 桥通两岸</div>
        <label className="pw-motion"><input type="checkbox" checked={quiet} onChange={e => setQuiet(e.target.checked)} /> 跳过动画</label>
        <p className="pw-coordinate">HANGZHOU · CHINA <span>在杭电，遇见可能。</span></p>
      </section>
      <section className={"pw-game " + (night ? "pw-night" : "")} aria-label="交互校园地图">
        <div className="pw-game-bar"><span>▪ 杭电 · 新生村</span><span className="pw-game-bar-right"><button className="pw-bgm" onClick={toggleBgm} aria-pressed={bgmOn} aria-label={bgmOn ? "关闭背景音乐" : "播放背景音乐"}>{bgmOn ? "♪ 音乐开" : "♪ 音乐关"}</button><button className="pw-time" onClick={() => setNight(!night)} aria-label={night ? "切换白天" : "切换夜晚"} aria-pressed={night}>{night ? "☾ 月色 / 宜漫游" : "☀ 晴 / 宜探索"}</button></span></div>
        <div className="pw-map" onClick={onMapClick}>
          <svg className="pw-terrain" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><defs><pattern id="grass" width="4" height="4" patternUnits="userSpaceOnUse"><path d="M1 1h.5v.5H1zM3 3h.3v.3H3z" fill="#94ab7e" opacity=".35" /></pattern></defs><path fill="#b9c99c" d="M0 0h100v100H0z" /><path fill="url(#grass)" d="M0 0h100v100H0z" /><path d="M50 100V23M23 55h54M23 85h54M23 48v7M77 48v7M23 78v7M77 78v7" stroke="#e8dcb7" strokeWidth="6" strokeLinejoin="round" strokeLinecap="square" fill="none" /><path d="M50 100V23M23 55h54M23 85h54M23 48v7M77 48v7M23 78v7M77 78v7" stroke="#e8dcb7" strokeWidth="5" fill="none" /><g transform="translate(0 16)"><path d="M40 8h22v3h5v12h-5v3H39v-4h-4V12h5z" fill="#7ca99d" /><path d="M42 13h9m3 6h8m-23 2h8" stroke="#bad6bd" strokeWidth=".5" /><path d="M47 7h7v22h-7z" fill="#d5bd8c" /><path d="M47 11h7m-7 3h7m-7 3h7m-7 3h7m-7 3h7" stroke="#af9368" strokeWidth=".5" /></g><path d="M46 23h8v21h-8z" fill="#d9b877" /><path d="M46 26h8m-8 4h8m-8 4h8m-8 4h8m-8 4h8" stroke="#a5854e" strokeWidth="1.2" /></svg>
          <div className="pw-motes" aria-hidden="true">{Array.from({ length: 8 }, (_, i) => <i key={i} style={{ "--i": i } as CSSProperties} />)}</div>
          <span className="pw-water" aria-hidden="true">{ripple > 0 && <span key={ripple} className="pw-ripple" />}<span className="pw-duck">▰</span></span>
          {[{ x: 12, y: 16 }, { x: 88, y: 16 }, { x: 5, y: 58 }, { x: 95, y: 58 }, { x: 12, y: 92 }, { x: 88, y: 92 }, { x: 41, y: 67 }, { x: 59, y: 67 }].map((p, i) => <span key={i} className="pw-tree" style={{ left: p.x + "%", top: p.y + "%" }} aria-hidden="true"><svg viewBox="0 0 24 32" shapeRendering="crispEdges"><path fill="#816849" d="M10 21h4v10h-4z" /><path fill="#516c46" d="M6 3h12v3h3v4h2v10h-4v4H5v-4H1V10h2V6h3z" /><path fill="#75925a" d="M6 4h10v3h4v7h-4v5H4v-9h2z" /><path fill="#91a96b" d="M7 5h7v3H7zM4 10h4v5H4z" /></svg></span>)}
          {places.map((p, i) => <button key={p.name} className={"pw-building pw-building-" + i + " " + (active === i ? "is-active" : "")} style={{ left: p.x + "%", top: p.y + "%", "--building": i } as CSSProperties} onClick={() => travel(i)} aria-label={"走到" + p.name + "并打开网站"}><span className="pw-building-art" aria-hidden="true" /><span className={"pw-door " + (active === i && phase === "door" ? "open" : "")} aria-hidden="true" /><span className="pw-building-label"><small>0{i + 1}</small>{p.name}<i>↗</i></span></button>)}
          <button className="pw-building pw-library-building" style={{ left: "50%", top: "23%" }} onClick={enterLibrary} aria-label="进入图书馆"><svg className="pw-library-art" viewBox="20 335 395 225" preserveAspectRatio="xMidYMax meet" aria-hidden="true"><defs><clipPath id="pw-library-crop"><rect x="20" y="335" width="395" height="225" /></clipPath></defs><image clipPath="url(#pw-library-crop)" href="/welcome/assets.png" width="1536" height="1024" /></svg><span className="pw-building-label">图书馆 <i>↗</i></span></button>
          <div className={"pw-player " + phase} ref={playerRef} style={{ left: "50%", top: "82%" }} aria-hidden="true"><span className="pw-player-name">YOU</span><Player girl={girl} facing={facing} /></div>
          <button className="pw-envelope" aria-label="打开杭电校史来信" onClick={() => { stop(); setStory(true); }}><span className="pw-envelope-flap" /><span className="pw-envelope-seal">H</span></button>
          <button className="pw-moonsilver" onClick={talk} aria-label="走到湖边和 moonsilver 聊天"><span>moonsilver <b>···</b></span><Player moon /></button>
          <span className="pw-start">从这里出发</span>
          <span className="pw-map-note">校园意象地图 · 非实地导航</span>
        </div>
        {chat && <div className="pw-chat" role="region" aria-label="与 moonsilver 对话"><div className="pw-chat-avatar"><Player moon /></div><div><strong>moonsilver <small>湖边的学长</small></strong><p>hellohello，欢迎大家来到杭电！</p><button onClick={() => { setChat(false); setFacing("down"); }}>你好呀！继续逛逛 ↗</button></div><button className="pw-chat-close" aria-label="结束对话" onClick={() => setChat(false)}>×</button></div>}
        <div className="pw-status" role="status"><b>✦</b><p>{active === null ? (phase === "walking" ? "漫游中…" : "探索杭电") : phase === "door" ? "即将抵达 · " + places[active].name + "…" : "前往 · " + places[active].name + "…"}</p>{phase !== "idle" ? <button onClick={stop}>取消</button> : <span>点选 · 出发</span>}</div>
      </section>
    </div>
    <nav className="pw-shortcuts" aria-label="校园入口">{places.map((p, i) => <a key={p.name} href={p.href} onClick={e => { if (!e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey) { e.preventDefault(); travel(i); } }}><span>0{i + 1} / DISCOVER</span><strong>{p.name} ↗</strong><small>{p.note}</small></a>)}</nav>
    {story && <HistoryLetter onClose={() => setStory(false)} />}
    <footer className="pw-footer"><span>HDU WIKI · 学长学姐留给你的校园指南<button className="pw-bless-link" onClick={() => window.dispatchEvent(new Event("wiki-open-checkin"))}>🎁 领取祝福</button></span><span>愿你的每一步，都走向热爱。 ✦</span></footer>
  </main>);

  return (<>
    {bgm}
    <WelcomeCheckin />
    {library ? libraryView : campusView}
  </>);
}


