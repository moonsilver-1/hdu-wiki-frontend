"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Eye, Pencil, Send } from "lucide-react";
import { contributeCategories, getContributeCategory } from "@/lib/contribute-meta";

type Status = "idle" | "submitting" | "success" | "error";

interface SubmitResponse {
  ok: boolean;
  prUrl?: string;
  filePath?: string;
  branch?: string;
  markdown?: string;
  dryRun?: boolean;
  error?: string;
}

export default function ContributeEditor() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [section, setSection] = useState("");
  const [author, setAuthor] = useState("");
  const [email, setEmail] = useState("");
  const [tags, setTags] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [view, setView] = useState<"edit" | "preview">("edit");
  const [previewHtml, setPreviewHtml] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [result, setResult] = useState<SubmitResponse | null>(null);

  const previewAbort = useRef<AbortController | null>(null);

  // 选了分类后，子分类联动：默认取该分类下第一个 section。
  // 直接在切分类时重置，避免在 effect 里 setState 触发级联渲染。
  const sections = useMemo(
    () => (category ? getContributeCategory(category)?.sections ?? [] : []),
    [category]
  );

  // 正文变化时 debounce 后请求预览，带 AbortController 防竞态（仿 SearchDialog 范式）。
  useEffect(() => {
    if (view !== "preview") return;
    previewAbort.current?.abort();
    const controller = new AbortController();
    previewAbort.current = controller;
    const handle = setTimeout(() => {
      fetch("/api/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
        signal: controller.signal,
      })
        .then((res) => res.json())
        .then((data: { html?: string }) => setPreviewHtml(data.html ?? ""))
        .catch((error) => {
          if (error instanceof Error && error.name !== "AbortError") {
            console.error("预览失败", error);
          }
        });
    }, 400);
    return () => {
      clearTimeout(handle);
      controller.abort();
    };
  }, [body, view]);

  const handleSubmit = useCallback(async () => {
    setStatus("submitting");
    setErrorMsg("");
    setResult(null);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, category, section, author, email, excerpt, tags, body }),
      });
      const data = (await res.json()) as SubmitResponse;
      if (res.ok && data.ok) {
        setResult(data);
        setStatus("success");
      } else {
        setErrorMsg(data.error ?? "提交失败，请稍后重试");
        setStatus("error");
      }
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : "网络错误");
      setStatus("error");
    }
  }, [title, category, section, author, email, excerpt, tags, body]);

  // 提交成功后展示结果面板。
  if (status === "success" && result) {
    return (
      <div className="contribute-success">
        <div className="contribute-success-card">
          <span className="contribute-success-icon">✓</span>
          <h3>投稿已提交，等待审核</h3>
          <p>
            {result.dryRun
              ? "当前是试运行模式，未实际创建 PR。下面是将会生成的文件内容："
              : "你的文章已经作为一个 Pull Request 提交到仓库。管理员审核通过后会自动发布到全站。"}
          </p>
          {result.prUrl ? (
            <a href={result.prUrl} target="_blank" rel="noreferrer" className="contribute-pr-link">
              查看审核进度（GitHub PR）
              <ArrowRight aria-hidden="true" size={16} />
            </a>
          ) : null}
          {result.filePath ? <p className="contribute-file-path">将生成文件：{result.filePath}</p> : null}
          {result.markdown ? (
            <details className="contribute-md-preview">
              <summary>查看将要生成的 Markdown</summary>
              <pre>{result.markdown}</pre>
            </details>
          ) : null}
          <button
            type="button"
            className="button button-outline"
            onClick={() => {
              setStatus("idle");
              setResult(null);
            }}
          >
            再写一篇
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="contribute-editor">
      <form
        className="contribute-form"
        onSubmit={(event) => {
          event.preventDefault();
          if (status === "submitting") return;
          handleSubmit();
        }}
      >
        <label className="contribute-field">
          <span>标题 *</span>
          <input
            className="contribute-input"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="一句话说清这篇文章讲什么"
            maxLength={80}
            required
          />
        </label>

        <div className="contribute-field-row">
          <label className="contribute-field">
            <span>分类 *</span>
            <select
              className="contribute-input"
              value={category}
              onChange={(event) => {
                setCategory(event.target.value);
                const next = getContributeCategory(event.target.value)?.sections[0];
                setSection(next?.slug ?? "");
              }}
              required
            >
              <option value="">请选择</option>
              {contributeCategories.map((cat) => (
                <option key={cat.slug} value={cat.slug}>{cat.name}</option>
              ))}
            </select>
          </label>

          <label className="contribute-field">
            <span>子分类 *</span>
            <select
              className="contribute-input"
              value={section}
              onChange={(event) => setSection(event.target.value)}
              required
              disabled={sections.length === 0}
            >
              {sections.length === 0 ? (
                <option value="">先选分类</option>
              ) : (
                sections.map((sec) => (
                  <option key={sec.slug} value={sec.slug}>{sec.name}</option>
                ))
              )}
            </select>
          </label>
        </div>

        <div className="contribute-field-row">
          <label className="contribute-field">
            <span>作者署名 *</span>
            <input
              className="contribute-input"
              type="text"
              value={author}
              onChange={(event) => setAuthor(event.target.value)}
              placeholder="多个作者用逗号分隔"
              maxLength={40}
              required
            />
          </label>

          <label className="contribute-field">
            <span>联系邮箱（可选）</span>
            <input
              className="contribute-input"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="审核需要时联系你"
            />
          </label>
        </div>

        <label className="contribute-field">
          <span>标签（可选）</span>
          <input
            className="contribute-input"
            type="text"
            value={tags}
            onChange={(event) => setTags(event.target.value)}
            placeholder="用逗号分隔，如：Vue, 前端, 入门"
          />
        </label>

        <label className="contribute-field">
          <span>摘要（可选）</span>
          <input
            className="contribute-input"
            type="text"
            value={excerpt}
            onChange={(event) => setExcerpt(event.target.value)}
            placeholder="一句话简介，会显示在文章卡片上"
            maxLength={120}
          />
        </label>

        <div className="contribute-body">
          <div className="contribute-body-toolbar">
            <span>正文（Markdown）*</span>
            <div className="contribute-view-toggle">
              <button
                type="button"
                className={view === "edit" ? "active" : ""}
                onClick={() => setView("edit")}
              >
                <Pencil aria-hidden="true" size={15} /> 编辑
              </button>
              <button
                type="button"
                className={view === "preview" ? "active" : ""}
                onClick={() => setView("preview")}
              >
                <Eye aria-hidden="true" size={15} /> 预览
              </button>
            </div>
          </div>
          {view === "edit" ? (
            <textarea
              className="contribute-textarea"
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder={"支持 GFM 表格、代码高亮、数学公式 $E=mc^2$。\n\n# 一级标题\n\n正文从这里开始……"}
              required
            />
          ) : (
            <div
              className="contribute-preview wiki-content"
              dangerouslySetInnerHTML={{ __html: previewHtml }}
            />
          )}
        </div>

        {status === "error" ? (
          <div className="contribute-error" role="alert">{errorMsg}</div>
        ) : null}

        <div className="contribute-actions">
          <button type="submit" className="contribute-submit" disabled={status === "submitting"}>
            <Send aria-hidden="true" size={16} />
            {status === "submitting" ? "提交中…" : "提交审核"}
          </button>
          <span className="contribute-hint">提交后进入审核队列，通过后自动发布</span>
        </div>
      </form>
    </div>
  );
}
