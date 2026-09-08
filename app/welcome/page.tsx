"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import HistoryLetter from "./HistoryLetter";
import WelcomeCheckin from "./WelcomeCheckin";
import CampusMap from "./CampusMap";
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
  return <span className={"pw-sprite" + (moon ? " pw-moonsilver-sprite" : "")} style={spriteStyle(girl, facing, moon)} data-facing={facing} aria-hidden="true"><span className="pw-sprite-crop pw-sprite-body" /></span>;
}
export default function WelcomePage() {
  const router = useRouter();

  // 站内目的地（如 HDU Wiki）走客户端路由；挂载时预取 wiki 首页，点过去不整页重载
  function goTo(href: string) {
    if (href.startsWith("/")) router.push(href);
    else window.location.assign(href);
  }

  useEffect(() => {
    router.prefetch("/");
  }, [router]);

  const [girl, setGirl] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [active, setActive] = useState<number | null>(null);
  const [phase, setPhase] = useState<"idle" | "walking" | "door">("idle");
  const [quiet, setQuiet] = useState(false);
  const [story, setStory] = useState(false);
  const [library, setLibrary] = useState(false);
  const [night, setNight] = useState(false);
  const [ripple, setRipple] = useState(0);
  const [facing, setFacing] = useState("down");
  const [chat, setChat] = useState(false);
  const [chatStep, setChatStep] = useState(0);
  const knowledge = [
    "HDU Wiki 由杭电同学共同维护，选课、考试和校园生活都能在这里找到经验。",
    "杭电创建于 1956 年，学校一路从电子工业学校发展到今天的电子信息特色高校。",
    "月雅湖是下沙校区的标志性景观，沿湖走一圈，是许多杭电人的日常路线。",
    "图书馆里的 IEEE、ScienceDirect 和知网入口，都可以通过校园 WebVPN 访问。",
    "第一次选课别急着全凭感觉，可以先看看 Wiki 里的课程评价和学长学姐的经验。",
    "下沙校区的教学楼以信字楼、信诚楼、信雅楼等命名，初来时记住主路和桥会更容易找路。",
    "绍兴校区的芯越楼设有图书中心，青越学生活动中心则是校园活动的重要空间。",
    "杭电的电子信息、自动化和计算机相关专业都很有特色，实验室和竞赛资源值得早点了解。",
    "如果你在校园里迷路，先找最近的桥或主干道，再沿着学林街、文泽路慢慢定位。",
    "新生生活不只有赶课，也可以去湖边散步、参加社团，给自己留一点认识新朋友的时间。",
    "刚进电专的你会遇到陌生环境和一大堆生僻名词，这份新生指南就是学长学姐留下的说明书。",
    "这份指南不是引路牌，每个人都有自己的路，走好自己的路才是最重要的。",
    "奖学金、竞赛、转专业、推免和体育要求可能随年级变化，办事前一定要看学校和学院的最新通知。",
    "大学不是高中时间上的延长版，而是绩点、竞赛、科研、项目、实习和学生工作的多维拓展。",
    "先记住一句话：绩点作为必选项，在此基础上其他再选一两条。",
    "大一是试错的好机会，多尝试总归没有错，听别人说不如自己去试试。",
    "如果想保研，绩点是底盘，六级、竞赛、论文和专利也要提前规划。",
    "如果想考研，专业课、数学、英语和院校选择都需要时间，尽早判断、尽早准备。",
    "竞赛能练能力、拿成果、认识队友，但不要把报名当作参加过，真正有用的是你负责了什么。",
    "一支好的竞赛队伍需要负责人、产品经理、研发、美工和答辩手，也可以一人身兼数职。",
    "智能车是杭电很有特色的竞赛，如果你喜欢小车和钻研，可以先去相关社团了解。",
    "科研大致是一个 loop：调研、读论文、复现、想创新点、产出。",
    "做科研不一定要有光环，本科生也可以从一个感兴趣的方向开始积累自己的想法。",
    "读论文可以先用工具快速了解，再挑真正重要的文章精读，不必每篇都从头看到尾。",
    "产出不一定是论文，也可以是一个开源项目，让更多人使用你的想法。",
    "在杭电这个大家庭里，愿意帮助你的同学和老师很多，也希望你把这份善意继续传下去。",
    "每个人给出的建议可能不同，你不必急着判断谁对谁错，找到适合自己的路就好。",
    "无论做什么，首先要无愧于心，先成为一个正大光明的人，再去追赶自己的目标。",
    "HDU-WIKI 不是只放公告的地方，而是把杭电里零散但重要的信息慢慢整理起来。",
    "网站分成课程与学术、校园生活、技术与项目、社团与活动四个模块。",
    "搜索会同时覆盖标题、摘要、标签和正文，想查绩点、选课、社团或竞赛都可以直接搜。",
    "HDU-WIKI 支持网页端、安卓端和 Windows 桌面端，三个入口使用的是同一套内容。",
    "投稿内容可以是课程经验、校园办事流程、竞赛科研经历、社团体验或技术文章。",
    "moonsilver 也参与过数学建模和智能车比赛，平时最喜欢收集杭电周边的美食。",
  ];
  const [campusMap, setCampusMap] = useState<"xiasha" | "shaoxing" | null>(null);
  const [arrival, setArrival] = useState(true);
  const [bgmOn, setBgmOn] = useState(false);
  const bgmRef = useRef<HTMLAudioElement>(null);
  const dayBgm = process.env.NEXT_PUBLIC_WELCOME_BGM_URL || "/welcome/bgm.mp3";
  const nightBgm = "https://cdn.freesafemusic.com/audio/vb0r.mp3";

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

  // 夜间切换到雨天氛围音乐，白天恢复原曲；如果音乐本来在播放，切换时保持播放状态。
  useEffect(() => {
    const audio = bgmRef.current;
    if (!audio) return;
    const nextSrc = night ? nightBgm : dayBgm;
    if (audio.src === new URL(nextSrc, window.location.href).href) return;
    const wasPlaying = !audio.paused;
    audio.src = nextSrc;
    audio.load();
    if (wasPlaying || bgmOn) {
      audio.volume = 0.45;
      audio.play().catch(() => {});
    }
  }, [night, bgmOn, dayBgm]);

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
      progress = Math.min(1, progress + (delta / 1000) * 10.5 / length);
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
    if (quiet) { stop(); goTo(destination.href); return; }
    walkTo({ x: destination.x, y: destination.y }, () => {
      setPhase("door");
      timers.current.push(setTimeout(() => goTo(destination.href), 1000));
    }, i);
  }

  function talk() {
    if (chat) { setChatStep(step => (step + 1) % (knowledge.length + 1)); return; }
    walkTo({ x: 50, y: 48 }, () => { setFacing("right"); setChatStep(0); setChat(true); });
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
    const face = (dir: string) => { if (sprite) { sprite.dataset.facing = dir; Object.entries(spriteStyle(girl, dir)).forEach(([key,value]) => sprite.style.setProperty(key,String(value))); } };
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
    if (sprite) { sprite.dataset.facing = dir; Object.entries(spriteStyle(girl, dir)).forEach(([key,value]) => sprite.style.setProperty(key,String(value))); }
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
      libAnimate(point, distance / 10.5 * 1000, next);
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
  const bgm = <audio ref={bgmRef} src={dayBgm} loop preload="none" />;
  const libraryView = (<main key="library" className="pixel-welcome pw-library-page"><svg width="0" height="0" className="pw-filter-defs" aria-hidden="true"><defs><filter id="pw-remove-paper" colorInterpolationFilters="sRGB"><feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  -10 -10 -10 0 27.4" /><feComposite in2="SourceGraphic" operator="in" /></filter></defs></svg><header className="pw-header"><Link href="/" className="pw-brand"><b>H</b> HDU WIKI</Link><button className="pw-back" onClick={exitLibrary}>← 返回校园</button></header><div className="pw-library-heading"><p className="pw-eyebrow">LEVEL 02 · THE LIBRARY</p><h1>知识，向你敞开。</h1><p>图书馆 · 文献阅览室</p></div><section className="pw-library-room" aria-label="图书馆室内地图" onClick={onLibraryClick}><div className="pw-library-windows" aria-hidden="true"><i /><i /><i /></div><nav className="pw-research" aria-label="文献数据库">{[
    { title: "IEEE", sub: "IEEE Xplore", note: "电子 · 电气 · 计算机", href: "https://webvpn.hdu.edu.cn/_webvpn_/https://ieeexplore.ieee.org/" },
    { title: "Elsevier", sub: "ScienceDirect", note: "科学 · 技术 · 医学", href: "https://webvpn.hdu.edu.cn/_webvpn_/https://www.sciencedirect.com/" },
    { title: "中国知网", sub: "CNKI", note: "中文期刊 · 学位论文", href: "https://webvpn.hdu.edu.cn/_webvpn_/https://www.cnki.net" },
  ].map((item, i) => <a key={item.title} href={item.href} className={"pw-bookcase pw-shelf-" + i} onClick={e => { if (!e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey) { e.preventDefault(); openResearch(item.href, i); } }}><span className="pw-books" aria-hidden="true">{Array.from({ length: 18 }, (_, n) => <i key={n} style={{ "--book": n } as CSSProperties} />)}</span><span className="pw-shelf-label"><strong>{item.title} ↗</strong><small>{item.sub}</small></span><span className="pw-shelf-note">{item.note}</span></a>)}</nav><div className="pw-reading-table" aria-hidden="true"><span>▤</span><i /><span>▤</span></div><div className="pw-library-player" ref={libPlayerRef} style={{ left: "50%", bottom: "12%" }}><Player girl={girl} facing="up" /><span title={playerName || "YOU"}>{playerName || "YOU"}</span></div><button className="pw-library-exit" onClick={exitLibrary}>↓ 回到校园</button></section><p className="pw-vpn-note">文献入口通过杭电 WebVPN 访问，可能需要校园账号登录。</p></main>);

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
          {[{ x: 12, y: 16 }, { x: 88, y: 16 }, { x: 5, y: 58 }, { x: 95, y: 58 }, { x: 5, y: 92 }, { x: 95, y: 92 }, { x: 41, y: 67 }, { x: 59, y: 67 }].map((p, i) => <span key={i} className="pw-tree" style={{ left: p.x + "%", top: p.y + "%" }} aria-hidden="true"><svg viewBox="0 0 24 32" shapeRendering="crispEdges"><path fill="#816849" d="M10 21h4v10h-4z" /><path fill="#516c46" d="M6 3h12v3h3v4h2v10h-4v4H5v-4H1V10h2V6h3z" /><path fill="#75925a" d="M6 4h10v3h4v7h-4v5H4v-9h2z" /><path fill="#91a96b" d="M7 5h7v3H7zM4 10h4v5H4z" /></svg></span>)}
          {places.map((p, i) => <button key={p.name} className={"pw-building pw-building-" + i + " " + (active === i ? "is-active" : "")} style={{ left: p.x + "%", top: p.y + "%", "--building": i } as CSSProperties} onClick={() => travel(i)} aria-label={"走到" + p.name + "并打开网站"}><span className="pw-building-art" aria-hidden="true" /><span className={"pw-door " + (active === i && phase === "door" ? "open" : "")} aria-hidden="true" /><span className="pw-building-label"><small>0{i + 1}</small>{p.name}<i>↗</i></span></button>)}
          <button className="pw-building pw-library-building" style={{ left: "50%", top: "23%" }} onClick={enterLibrary} aria-label="进入图书馆"><svg className="pw-library-art" viewBox="20 335 395 225" preserveAspectRatio="xMidYMax meet" aria-hidden="true"><defs><clipPath id="pw-library-crop"><rect x="20" y="335" width="395" height="225" /></clipPath></defs><image clipPath="url(#pw-library-crop)" href="/welcome/assets.png" width="1536" height="1024" /></svg><span className="pw-building-label">图书馆 <i>↗</i></span></button>
          <div className={"pw-player " + phase + (chat ? " is-chatting" : "")} ref={playerRef} style={{ left: "50%", top: "82%" }} aria-hidden="true"><span className="pw-player-name" title={playerName || "YOU"}>{playerName || "YOU"}</span><Player girl={girl} facing={facing} /></div>
          <button className="pw-envelope" aria-label="打开杭电校史来信" onClick={() => { stop(); setStory(true); }}><span className="pw-envelope-flap" /><span className="pw-envelope-seal">H</span></button>
          <button className="pw-map-gift" aria-label="打开礼物，领取祝福" onClick={() => { stop(); setChat(false); window.dispatchEvent(new Event("wiki-open-checkin")); }}><span aria-hidden="true" /><small>领取祝福</small></button><button className="pw-moonsilver" onClick={talk} aria-label={chat ? "向 moonsilver 获取神秘知识" : "走到湖边和 moonsilver 聊天"}><span>moonsilver <b>···</b></span><Player moon facing={chat ? "left" : "down"} /></button>
          <div className="pw-signposts">{(["xiasha", "shaoxing"] as const).map(campus => <button key={campus} className="pw-signpost" aria-label={campus === "xiasha" ? "下沙校区地图" : "绍兴校区地图"} onClick={() => { stop(); setChat(false); setCampusMap(campus); }}><span className="pw-signpost-art" aria-hidden="true" /><span className={"pw-signpost-map " + campus} aria-hidden="true" /><svg className="pw-signpost-label" viewBox="0 0 100 100" aria-hidden="true"><text x="50" y="80" textAnchor="middle" dominantBaseline="middle">{campus === "xiasha" ? "下沙校区" : "绍兴校区"}</text></svg></button>)}</div><span className="pw-start">从这里出发</span>
          
        </div>
        {chat && <div className="pw-chat" role="region" aria-label="与 moonsilver 对话"><div className="pw-chat-avatar"><Player moon /></div><div><strong>moonsilver <small>湖边的学长</small></strong><p>{chatStep === 0 ? "hellohello，欢迎大家来到杭电！" : knowledge[chatStep - 1]}</p><button onClick={() => setChatStep(step => (step + 1) % (knowledge.length + 1))}>{chatStep === 0 ? "获取神秘知识 ✦" : "再听一条 ↗"}</button></div><button className="pw-chat-close" aria-label="结束对话" onClick={() => setChat(false)}>×</button></div>}
        <div className="pw-status" role="status"><b>✦</b><p>{active === null ? (phase === "walking" ? "漫游中…" : "探索杭电") : phase === "door" ? "即将抵达 · " + places[active].name + "…" : "前往 · " + places[active].name + "…"}</p>{phase !== "idle" ? <button onClick={stop}>取消</button> : <span>点选 · 出发</span>}</div>
      </section>
    </div>
    <nav className="pw-shortcuts" aria-label="校园入口">{places.map((p, i) => <a key={p.name} href={p.href} onClick={e => { if (!e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey) { e.preventDefault(); travel(i); } }}><span>0{i + 1} / DISCOVER</span><strong>{p.name} ↗</strong><small>{p.note}</small></a>)}</nav>
    {campusMap && <CampusMap campus={campusMap} onClose={() => setCampusMap(null)} />}
    {story && <HistoryLetter onClose={() => setStory(false)} />}
    <footer className="pw-footer"><span>HDU WIKI · 学长学姐留给你的校园指南</span><span>愿你的每一步，都走向热爱。 ✦</span></footer>
  </main>);

  return (<div className={"pw-weather-page" + (night ? " is-rainy-night" : "")}>
    {night && <div className="pw-rain-scene" aria-hidden="true"><div className="pw-rain-haze" /><div className="pw-rain-far" /><div className="pw-rain-near" /></div>}
    {bgm}
    <WelcomeCheckin onNameChange={setPlayerName} />
    {library ? libraryView : campusView}
  </div>);
}













