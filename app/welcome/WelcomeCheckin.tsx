"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { blessingByIndex, blessingFor, blessingIndexFor, fnv1a } from "@/lib/welcome-blessings";
import { ROSTER_HASHES, VOICE_INDEXES } from "@/lib/welcome-roster";
import { VOICES, voiceByIndex, type VoiceItem } from "@/lib/welcome-voices";

const STORAGE_KEY = "wiki-checkin";
const ROSTER_SET = new Set(ROSTER_HASHES);
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const CONFETTI_COLORS = ["#f2c14e", "#e26d5c", "#7ca99d", "#f6dc8d", "#fdf6e3", "#8fbf9f"];

type CheckinRecord = { n: string; b: number; v: number; mystery: boolean; md: string };
type Result = { name: string; h: string; blessing: string; index: number; v: number; mystery: boolean; md: string };

// 匹配名单的同学：按分配表取语音；神秘访客：随机一段
function voiceIndexFor(h: string, mystery: boolean): number {
  if (mystery) return parseInt(h, 16) % VOICES.length;
  const pos = ROSTER_HASHES.indexOf(h);
  return VOICE_INDEXES[pos] ?? 0;
}

function readCheckin(): CheckinRecord | "skipped" | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    if (raw === "skipped") return "skipped";
    const parsed = JSON.parse(raw) as CheckinRecord;
    if (parsed && typeof parsed.n === "string" && typeof parsed.b === "number") return parsed;
    return null;
  } catch {
    return null;
  }
}

function todayMd(): string {
  const now = new Date();
  return `${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

export default function WelcomeCheckin({ onNameChange }: { onNameChange: (name: string) => void }) {
  const [view, setView] = useState<"closed" | "form" | "result">("closed");
  const [bash, setBash] = useState(false);
  const [name, setName] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(0);
  const [result, setResult] = useState<Result | null>(null);


  // 挂载 1.4 秒后（等入场动画结束）：首次到访弹报到处；老同学恢复祝福卡；生日当天自动开派对
  useEffect(() => {
    const timer = setTimeout(() => {
      const record = readCheckin();
      onNameChange(record && record !== "skipped" ? record.n : "");
      if (!record) { setView("form"); return; }
      if (record !== "skipped") {
        setResult({ name: record.n, h: fnv1a(record.n), blessing: blessingByIndex(record.b), index: record.b, v: record.v ?? 0, mystery: record.mystery, md: record.md });
        if (record.md === todayMd()) setBash(true);
      }
    }, 1400);
    return () => clearTimeout(timer);
  }, [onNameChange]);

  // 页脚「领取祝福」入口
  useEffect(() => {
    const open = () => {
      const record = readCheckin();
      if (record && record !== "skipped") {
        setResult({ name: record.n, h: fnv1a(record.n), blessing: blessingByIndex(record.b), index: record.b, v: record.v ?? 0, mystery: record.mystery, md: record.md });
        setView("result");
      } else {
        setView("form");
      }
    };
    window.addEventListener("wiki-open-checkin", open);
    return () => window.removeEventListener("wiki-open-checkin", open);
  }, []);

  function submit() {
    const cleanName = name.trim();
    if (!cleanName) {
      setError("写上名字才能对上名单哦（也可以先逛逛）");
      setShake(s => s + 1);
      return;
    }
    const h = fnv1a(cleanName);
    const mystery = !ROSTER_SET.has(h);
    const record: CheckinRecord = { n: cleanName, b: blessingIndexFor(h), v: voiceIndexFor(h, mystery), mystery, md: month && day ? `${month.padStart(2, "0")}-${day.padStart(2, "0")}` : "" };
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(record)); } catch {}
    onNameChange(cleanName);
    setResult({ name: cleanName, h, blessing: blessingFor(h), index: record.b, v: record.v, mystery, md: record.md });
    setError("");
    setView("result");
  }

  function logout() {
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    setResult(null);
    setName("");
    setMonth("");
    setDay("");
    setError("");
    onNameChange("");
    setView("form");
  }

  function skip() {
    try { localStorage.setItem(STORAGE_KEY, "skipped"); } catch {}
    onNameChange("");
    setView("closed");
  }

  const isBirthday = !!result?.md && result.md === todayMd();

  if (view === "form") {
    return (
      <div className="pw-checkin-overlay" role="dialog" aria-label="新生报到登记">
        <div className={"pw-checkin-window" + (shake % 2 === 1 ? " pw-shake" : "")} key={shake}>
          <div className="pw-checkin-bar"><span>▪ 新生报到处 · CHECK-IN</span><button className="pw-checkin-close" onClick={skip} aria-label="关闭">×</button></div>
          <div className="pw-checkin-body">
            <p className="pw-checkin-title">报到登记</p>
            <p className="pw-checkin-lead">写下你的名字，领取你的专属祝福（每人的祝福都不一样）；顺便填个生日，生日当天有惊喜。</p>
            <label className="pw-checkin-field"><span>姓名</span>
              <input className="pw-checkin-input" value={name} onChange={e => setName(e.target.value)} placeholder="你的名字" maxLength={16} autoComplete="off" />
            </label>
            <div className="pw-checkin-field"><span>生日（选填，当天有惊喜）</span>
              <div className="pw-checkin-row">
                <select className="pw-checkin-select" value={month} onChange={e => setMonth(e.target.value)} aria-label="出生月份">
                  <option value="">月</option>{MONTHS.map(m => <option key={m} value={m}>{m} 月</option>)}
                </select>
                <select className="pw-checkin-select" value={day} onChange={e => setDay(e.target.value)} aria-label="出生日期">
                  <option value="">日</option>{DAYS.map(d => <option key={d} value={d}>{d} 日</option>)}
                </select>
              </div>
            </div>
            {error ? <p className="pw-checkin-error">{error}</p> : null}
            <div className="pw-checkin-actions">
              <button className="pw-checkin-submit" onClick={submit}>领取祝福</button>
              <button className="pw-checkin-skip" onClick={skip}>先逛逛</button>
            </div>
            <p className="pw-checkin-note">＊ 名字只用来在你的手机上比对名单，不会上传到任何地方。</p>
          </div>
        </div>
      </div>
    );
  }

  if (view === "result" && result) {
    const blessing = result.blessing;
    return (
      <>
        <div className="pw-checkin-overlay" role="dialog" aria-label="专属祝福">
          <div className="pw-checkin-window">
            <div className="pw-checkin-bar"><span>{result.mystery ? "▪ 神秘访客 · MYSTERY GUEST" : "▪ 报到成功 · WELCOME ABOARD"}</span><button className="pw-checkin-close" onClick={() => setView("closed")} aria-label="关闭">×</button></div>
            <div className="pw-checkin-body">
              {result.mystery ? (
                <p className="pw-checkin-lead">这位神秘同学：<br />虽然名单里还没有你，但杭电绍兴的风也吹到了你这里——祝你天天开心呀！</p>
              ) : (
                <p className="pw-checkin-lead">你好，{result.name}！报到完成，这是你的专属祝福——</p>
              )}
              <blockquote className="pw-bless-quote">
                <span className="pw-bless-no">专属祝福 · NO.{String(result.index + 1).padStart(2, "0")} / 50</span>
                <p className="pw-bless-text">{blessing}</p>
                <i className="pw-seal-mini" aria-hidden="true">福</i>
              </blockquote>
              {!result.mystery ? (
                <div className="pw-bless-hidden">
                  <p className="pw-bless-hidden-label">🎁 专属语音祝福 · 来自自动化学院的班助和老师</p>
                  <VoiceRow voice={voiceByIndex(result.v)} />
                </div>
              ) : null}
              {isBirthday ? <button className="pw-bless-bday" onClick={() => setBash(true)}>🎂 等等，今天好像还是你的生日？点这里 →</button> : null}
              <div className="pw-checkin-actions">
                <button className="pw-checkin-submit" onClick={() => setView("closed")}>收下啦，继续逛</button>
                <button className="pw-checkin-skip" onClick={logout}>退出登录</button>
              </div>
            </div>
          </div>
        </div>
        {bash && isBirthday ? <BirthdayBash name={result.name} blessing={blessing} onClose={() => setBash(false)} /> : null}
      </>
    );
  }

  return null;
}

function VoiceRow({ voice }: { voice: VoiceItem }) {
  const [playing, setPlaying] = useState(false);
  // 探测语音文件是否已上传：没有就显示「正在赶来」，不渲染点了没反应的按钮
  const [ready, setReady] = useState<boolean | null>(null);
  const ref = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    let alive = true;
    fetch(voice.file, { method: "HEAD" })
      .then(r => { if (alive) setReady(r.ok); })
      .catch(() => { if (alive) setReady(false); });
    return () => { alive = false; };
  }, [voice.file]);
  if (ready === false) return <p className="pw-voice-todo">来自{voice.from}的语音祝福正在赶来，记得回来看哦！</p>;
  return (
    <div className="pw-voice">
      <button
        className="pw-voice-play"
        disabled={ready === null}
        onClick={() => {
          const audio = ref.current;
          if (!audio) return;
          if (playing) { audio.pause(); setPlaying(false); }
          else { audio.play().then(() => setPlaying(true)).catch(() => setReady(false)); }
        }}
        aria-label={playing ? "暂停语音祝福" : "播放语音祝福"}
      >{playing ? "❚❚" : "▶"}</button>
      <div className="pw-voice-meta">
        <strong>{voice.from} · {voice.role}</strong>
        <p>{voice.text}</p>
      </div>
      <audio ref={ref} src={voice.file} preload="none" onEnded={() => setPlaying(false)} />
    </div>
  );
}

function BirthdayBash({ name, blessing, onClose }: { name: string; blessing: string; onClose: () => void }) {
  const confetti = useMemo(
    () =>
      Array.from({ length: 56 }, (_, i) => ({
        left: (i * 37) % 100,
        delay: ((i * 13) % 40) / 10,
        dur: 3.2 + ((i * 7) % 25) / 10,
        size: 5 + ((i * 11) % 5),
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      })),
    [],
  );
  return (
    <div className="pw-bash-overlay" role="dialog" aria-label="生日祝福">
      {confetti.map((c, i) => (
        <span key={i} className="pw-confetti" style={{ "--cx": c.left + "%", "--cdel": c.delay + "s", "--cdur": c.dur + "s", "--cc": c.color, "--cs": c.size + "px" } as React.CSSProperties} />
      ))}
      <div className="pw-bash-inner">
        <svg className="pw-bash-cake" viewBox="0 0 48 40" shapeRendering="crispEdges" aria-hidden="true">
          {[0, 1, 2, 3, 4].map(i => (
            <g key={i} className="pw-candle-flame" style={{ animationDelay: i * 0.17 + "s" }}>
              <rect x={10 + i * 6} y="6" width="2" height="2" fill="#f6dc8d" />
              <rect x={10.5 + i * 6} y="4.5" width="1" height="1.5" fill="#fdf6e3" />
              <rect x={10 + i * 6} y="8" width="2" height="4" fill={i % 2 ? "#e26d5c" : "#7ca99d"} />
            </g>
          ))}
          <rect x="4" y="12" width="40" height="2" fill="#fdf6e3" />
          <rect x="6" y="14" width="36" height="6" fill="#e8a355" />
          <rect x="6" y="16" width="36" height="1" fill="#d18a3f" />
          <rect x="4" y="20" width="40" height="2" fill="#fdf6e3" />
          <rect x="3" y="22" width="42" height="7" fill="#7ca99d" />
          <rect x="3" y="24" width="42" height="1" fill="#5f8a80" />
          <rect x="6" y="29" width="36" height="2" fill="#fdf6e3" />
          <rect x="2" y="31" width="44" height="6" fill="#e26d5c" />
          <rect x="2" y="33" width="44" height="1" fill="#c05a4b" />
          <rect x="0" y="37" width="48" height="2" fill="#d8d3c4" />
        </svg>
        <h2 className="pw-bash-title">🎂 {name}，生日快乐！</h2>
        <p className="pw-bash-sub">来到杭电绍兴的第一年，就撞上你的生日——<br />蛋糕、彩带和这句话，都是为你准备的。</p>
        <p className="pw-bash-bless">「{blessing}」</p>
        <button className="pw-bash-close" onClick={onClose}>许好愿了，继续逛 ↗</button>
      </div>
    </div>
  );
}

