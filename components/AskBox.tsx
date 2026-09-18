"use client";

import Link from "next/link";
import { Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface ChatSource {
  title: string;
  href: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  sources?: ChatSource[];
}

const SUGGESTED_QUESTIONS = [
  "杭电新生选课有什么要注意的？",
  "下沙哪里的好吃的多？",
  "怎么加入 hdu-wiki 一起共建？",
];

export default function AskBox() {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState("");

  return (
    <>
      <div className="ask-box">
        <input
          className="ask-box-input"
          value={pending}
          onChange={(event) => setPending(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && pending.trim()) {
              setOpen(true);
            }
          }}
          placeholder="问小羊：关于杭电的一切……"
          maxLength={300}
          aria-label="向小羊提问"
        />
        <button
          type="button"
          className="ask-box-submit"
          onClick={() => setOpen(true)}
        >
          问小羊
        </button>
      </div>
      {open ? (
        <AskDialog
          initialQuestion={pending.trim()}
          onClose={() => {
            setOpen(false);
            setPending("");
          }}
        />
      ) : null}
    </>
  );
}

function AskDialog({
  initialQuestion,
  onClose,
}: {
  initialQuestion: string;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const ask = async (question: string) => {
    const trimmed = question.trim();
    if (!trimmed || loading) return;
    setInput("");
    setLoading(true);
    setMessages((current) => [...current, { role: "user", content: trimmed }]);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmed }),
      });
      const data = (await res.json()) as {
        answer?: string;
        sources?: ChatSource[];
        error?: string;
      };
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: data.answer ?? data.error ?? "小羊开小差了，再问一次试试～",
          sources: data.sources ?? [],
        },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        { role: "assistant", content: "网络开小差了，请再问一次～" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // 初始问题自动发出（setTimeout 避免在 effect 内同步 setState）
  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (initialQuestion) ask(initialQuestion);
      inputRef.current?.focus();
    }, 0);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 新消息自动滚动到底
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="search-dialog-shell">
      <button
        type="button"
        className="search-dialog-backdrop"
        aria-label="关闭对话"
        onClick={onClose}
      />
      <div className="ask-dialog-panel">
        <div className="ask-dialog-head">
          <span className="ask-dialog-title">🐑 问小羊</span>
          <button
            type="button"
            className="dialog-close"
            aria-label="关闭对话"
            onClick={onClose}
          >
            <X aria-hidden="true" size={16} />
          </button>
        </div>

        <div className="ask-dialog-messages" ref={listRef}>
          {messages.length === 0 ? (
            <div className="ask-dialog-empty">
              <p>你好呀，我是小羊 🐑 关于杭电的问题尽管问！</p>
              {SUGGESTED_QUESTIONS.map((question) => (
                <button
                  key={question}
                  type="button"
                  className="hot-chip"
                  onClick={() => ask(question)}
                >
                  {question}
                </button>
              ))}
            </div>
          ) : (
            messages.map((message, index) => (
              <div key={index} className={`ask-msg ask-msg-${message.role}`}>
                <div className="ask-msg-bubble">{message.content}</div>
                {message.sources && message.sources.length > 0 ? (
                  <div className="ask-msg-sources">
                    相关文章：
                    {message.sources.map((source) => (
                      <Link key={source.href} href={source.href} onClick={onClose}>
                        《{source.title}》
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ))
          )}
          {loading ? (
            <div className="ask-msg ask-msg-assistant">
              <div className="ask-msg-bubble ask-msg-loading">小羊思考中…</div>
            </div>
          ) : null}
        </div>

        <form
          className="ask-dialog-input-row"
          onSubmit={(event) => {
            event.preventDefault();
            ask(input);
          }}
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="继续问点什么……"
            maxLength={300}
            aria-label="输入问题"
          />
          <button
            type="submit"
            className="ask-dialog-send"
            disabled={loading || !input.trim()}
            aria-label="发送"
          >
            <Send aria-hidden="true" size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
