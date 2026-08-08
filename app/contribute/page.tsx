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
          <div className="section-heading">
            <div>
              <span className="section-kicker">共同记录</span>
              <h1>谈谈你想说的</h1>
              <p>用 Markdown 格式来写，写完以后会由管理员进行审核。</p>
            </div>
          </div>

          <div className="contribute-tips">
            <strong>投稿须知</strong>
            <ol>
              <li>摘要必填，长度 20–160 字符；正文长度 20–60,000 字符</li>
              <li>正文从二级标题开始，不支持图片、raw HTML 或脚本</li>
              <li>代码示例请放进带语言标记的代码块</li>
            </ol>
          </div>

          <ContributeEditor />
        </div>
      </section>
    </div>
  );
}
