import { searchArticles } from "@/lib/search";

// 「问小羊」AI 问答的后端逻辑：站内检索 + 可配置的 OpenAI 兼容模型调用。
// 当前接入千问 MaaS（compatible-mode），通过 CHAT_API_URL / CHAT_API_KEY /
// CHAT_MODEL 配置（见 .env.local，线上在 Vercel 环境变量设置，勿提交 key）；
// 未配置或调用失败时优雅降级为"相关文章推荐"。

export interface ChatSource {
  title: string;
  href: string;
  category: string;
}

export interface ChatAnswer {
  answer: string;
  sources: ChatSource[];
}

// 简单内存限流：每 IP 每分钟最多 6 问（Serverless 实例间各自计数，够防滥用）
const RATE_LIMIT = 6;
const RATE_WINDOW_MS = 60_000;
const hits = new Map<string, number[]>();

export function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (list.length >= RATE_LIMIT) {
    hits.set(ip, list);
    return true;
  }
  list.push(now);
  hits.set(ip, list);
  return false;
}

function buildContext(question: string): { sources: ChatSource[]; context: string } {
  const { results } = searchArticles(question, 4);
  const sources: ChatSource[] = results.map((r) => ({
    title: r.title,
    href: `/${r.category}/${r.slug}`,
    category: r.category,
  }));
  const context = results
    .map((r, i) => `[${i + 1}]《${r.title}》：${r.excerpt || r.snippet}`)
    .join("\n");
  return { sources, context };
}

function fallbackAnswer(question: string, sources: ChatSource[]): string {
  if (sources.length === 0) {
    return "小羊暂时没有找到和这个问题相关的文章。换个说法试试，或者去「投稿」页把你的经验分享给大家～";
  }
  const lines = sources.map((s, i) => `${i + 1}. 《${s.title}》`).join("\n");
  return `小羊在 wiki 里找到了几篇可能帮到你的文章：\n${lines}\n\n（AI 暂时开小差了，以上为站内检索结果）`;
}

async function askModel(
  question: string,
  context: string
): Promise<string | null> {
  const apiUrl = process.env.CHAT_API_URL;
  const apiKey = process.env.CHAT_API_KEY;
  if (!apiUrl || !apiKey) return null;

  const model = process.env.CHAT_MODEL ?? "deepseek-chat";
  const system = [
    "你是「小羊」，杭电百科 HDU Wiki（www.hdu-wiki.cn）的吉祥物助手，语气活泼友好，回答简洁实用。",
    "请优先根据下面的站内文章内容回答用户关于杭电的问题，并自然地建议用户阅读对应文章。",
    "如果文章内容不足以回答，就基于常识简短回答，并建议用户在站内搜索或投稿分享。",
    "一律使用中文回答，控制在 200 字以内。",
    "",
    "站内相关文章：",
    context,
  ].join("\n");

  const response = await fetch(`${apiUrl.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: system },
        { role: "user", content: question },
      ],
      temperature: 0.6,
      max_tokens: 500,
    }),
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) return null;
  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  return data.choices?.[0]?.message?.content?.trim() || null;
}

export async function answerQuestion(question: string, ip: string): Promise<
  ChatAnswer & { limited?: boolean }
> {
  if (isRateLimited(ip)) {
    return {
      answer: "小羊有点忙不过来啦，一分钟后再问我吧 🐑",
      sources: [],
      limited: true,
    };
  }
  const { sources, context } = buildContext(question);
  const modelAnswer = await askModel(question, context);
  return {
    answer: modelAnswer ?? fallbackAnswer(question, sources),
    sources,
  };
}
