import type { Metadata } from "next";
import ContributeEditor from "@/components/ContributeEditor";

export const metadata: Metadata = {
  title: "投稿",
  description: "在网页端直接写一篇 Markdown 投稿，审核通过后发布到 HDU Wiki。",
};

export default function ContributePage() {
  return (
    <div className="contribute-page">
      <section className="home-section">
        <div className="site-container">
          <div className="section-heading contribute-heading">
            <div>
              <span className="section-kicker">✍️ 一起共建</span>
              <h1>谈谈你想说的</h1>
              <p>写一篇 Markdown，配几张图——审核通过后就发布给全校的杭电er ✨</p>
            </div>
          </div>

          <div className="contribute-steps" aria-label="投稿步骤">
            <span className="contribute-step"><strong>1</strong>填写信息</span>
            <span className="contribute-step-arrow" aria-hidden="true">→</span>
            <span className="contribute-step"><strong>2</strong>写正文 · 配图</span>
            <span className="contribute-step-arrow" aria-hidden="true">→</span>
            <span className="contribute-step"><strong>3</strong>提交审核</span>
          </div>

          <div className="contribute-tips">
            <strong>投稿须知</strong>
            <ol>
              <li>摘要必填，长度 20–160 字符；正文长度 20–60,000 字符</li>
              <li>正文从二级标题开始，可插入图片（支持粘贴截图，单张 ≤1MB、最多 9 张）</li>
              <li>代码示例请放进带语言标记的代码块</li>
            </ol>
          </div>

          <ContributeEditor />
        </div>
      </section>
    </div>
  );
}
