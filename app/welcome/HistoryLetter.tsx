"use client";
import { useEffect, useRef, useState } from "react";

const chapters = [
  {year:"1956",title:"故事，从这里开始",body:"杭州航空工业财经学校创建。一所学校的理想，在这个春天启程。",symbol:"✉"},
  {year:"1980",title:"向更远处求知",body:"学校改建为杭州电子工业学院。新的名字，承载新的探索。",symbol:"▤"},
  {year:"2004",title:"你好，杭州电子科技大学",body:"学校更名为杭州电子科技大学。求知的路，继续向前。",symbol:"⌂"},
  {year:"2026",title:"下一页，写下你的名字",body:"七十年的故事，与你的大学第一天相遇。欢迎来到杭电。",symbol:"✦"},
];
export default function HistoryLetter({onClose}:{onClose:()=>void}){
  const dialog=useRef<HTMLDialogElement>(null);
  const [page,setPage]=useState(0);
  useEffect(()=>{const element=dialog.current;element?.showModal();return()=>element?.close();},[]);
  const chapter=chapters[page];
  return <dialog ref={dialog} className="pw-letter-dialog" aria-label="一封来自杭电的信" onCancel={onClose} onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
    <div className="pw-letter-sheet"><button className="pw-letter-close" onClick={onClose} aria-label="合上信件">×</button><div className="pw-postmark" aria-hidden="true"><span>HANGZHOU</span><b>HDU</b><small>1956 — 2026</small></div><p className="pw-letter-kicker">一封，跨越时间的来信</p><p className="pw-letter-to">亲爱的新同学：</p>
      <div key={page} className="pw-letter-chapter"><span className="pw-letter-count">CHAPTER 0{page+1} / 04</span><strong>{chapter.year}</strong><h2>{chapter.title}</h2><div className="pw-letter-prose">{chapter.body.split("。").filter(Boolean).map(sentence=><p key={sentence}>{sentence}。</p>)}</div></div>
      <p className="pw-letter-signature">此去四年，愿你尽兴。<span>杭电百科 · 敬上</span></p><nav className="pw-letter-years" aria-label="校史年份">{chapters.map((c,i)=><button key={c.year} onClick={()=>setPage(i)} aria-current={page===i?"step":undefined}>{c.year}</button>)}</nav>
      <div className="pw-letter-actions"><a href="https://www.hdu.edu.cn/_t30/664/list.htm" target="_blank" rel="noreferrer">校史来源 ↗</a><button onClick={()=>page<3?setPage(page+1):onClose()}>{page<3?"下一页 →":"收好这封信"}</button></div>
    </div>
  </dialog>;
}

