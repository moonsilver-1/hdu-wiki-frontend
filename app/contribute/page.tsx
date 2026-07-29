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
              <h1>写一篇文章</h1>
              <p>用 Markdown 写下你的经验，提交后管理员会审核，通过后自动发布到全站。</p>
            </div>
          </div>

          <div className="contribute-tips">
            <strong>投稿须知</strong>
            <ul>
              <li>支持 GFM 表格、代码高亮、数学公式（<code>$E=mc^2$</code>、<code>$$\int_0^1 x dx$$</code>）。</li>
              <li>分类、作者、正文必填；摘要和标签建议填，能让文章更容易被发现。</li>
              <li>提交后会生成一个 GitHub PR，管理员审核 diff 后合并即可上线。</li>
              <li>请勿插入 <code>&lt;script&gt;</code> 等脚本或可疑外链，这类投稿会被拒。</li>
            </ul>
          </div>

          <ContributeEditor />
        </div>
      </section>
    </div>
  );
}
