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
              <li>不支持图片</li>
              <li>请勿插入 <code>&lt;script&gt;</code> 等脚本或可疑外链</li>
            </ol>
          </div>

          <ContributeEditor />
        </div>
      </section>
    </div>
  );
}
