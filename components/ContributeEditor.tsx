"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Bold,
  Code,
  Code2,
  Eye,
  Heading2,
  Heading3,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Minus,
  Quote,
  Sigma,
  SquareFunction,
  Table as TableIcon,
} from "lucide-react";
import { contributeCategories, getContributeCategory } from "@/lib/contribute-meta";
import { validateSubmissionFields } from "@/lib/content-validation";

// 客户端版 slug 预览：与 lib/contribute.ts 的 slugifyTitle 保持一致的规则，
// 让用户实时看到将生成的文章链接。纯中文标题会回退成 submission-xxx，提示明显。
function previewSlug(title: string): string {
  const slug = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return slug || "submission-…";
}

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

// 工具栏格式定义：prefix/suffix 包裹选中文本，block 表示块级（前面加换行），placeholder 是无选中时的占位文本。
interface FormatAction {
  prefix?: string;
  suffix?: string;
  block?: boolean;
  wrap?: boolean; // 是否包裹（行内格式）
  placeholder?: string;
  // 自定义插入文本（用于表格、分割线、代码块等固定内容）
  insert?: string;
}

// 在 textarea 当前选区处应用格式：选中文字则包裹，无选中则插入占位。
function applyFormat(
  textarea: HTMLTextAreaElement,
  currentValue: string,
  action: FormatAction
): string {
  const { selectionStart, selectionEnd } = textarea;
  const selected = currentValue.slice(selectionStart, selectionEnd);

  // 固定插入内容（表格、分割线、代码块）
  if (action.insert !== undefined) {
    const before = currentValue.slice(0, selectionStart);
    const after = currentValue.slice(selectionEnd);
    const needNewline = before.length > 0 && !before.endsWith("\n");
    const prefix = action.block && needNewline ? "\n" : "";
    return before + prefix + action.insert + after;
  }

  const inner = selected || action.placeholder || "";
  const replacement = `${action.prefix ?? ""}${inner}${action.suffix ?? ""}`;
  const before = currentValue.slice(0, selectionStart);
  const after = currentValue.slice(selectionEnd);
  const needNewline = action.block && before.length > 0 && !before.endsWith("\n");
  return before + (needNewline ? "\n" : "") + replacement + after;
}

// 公式助手分组：覆盖学生 wiki 常见数学表达，用户不用背 LaTeX，点一下即插入。
// 每个 chip 的 label 显示中文/符号，code 显示原始 LaTeX，让用户边用边学。
const MATH_GROUPS: { title: string; items: { label: string; insert: string }[] }[] = [
  {
    title: "基本运算",
    items: [
      { label: "分数", insert: "\\frac{a}{b}" },
      { label: "上标", insert: "x^{2}" },
      { label: "下标", insert: "x_{i}" },
      { label: "根号", insert: "\\sqrt{x}" },
      { label: "n次根", insert: "\\sqrt[n]{x}" },
      { label: "绝对值", insert: "|x|" },
      { label: "乘号", insert: "\\times" },
      { label: "除号", insert: "\\div" },
      { label: "正负", insert: "\\pm" },
      { label: "省略号", insert: "\\cdots" },
    ],
  },
  {
    title: "微积分",
    items: [
      { label: "求和", insert: "\\sum_{i=1}^{n}" },
      { label: "连乘", insert: "\\prod_{i=1}^{n}" },
      { label: "积分", insert: "\\int_{a}^{b}" },
      { label: "二重积分", insert: "\\iint" },
      { label: "偏导", insert: "\\frac{\\partial f}{\\partial x}" },
      { label: "梯度", insert: "\\nabla" },
      { label: "极限", insert: "\\lim_{x\\to\\infty}" },
      { label: "对数", insert: "\\log_{a}{b}" },
      { label: "自然对数", insert: "\\ln{x}" },
      { label: "指数", insert: "e^{x}" },
    ],
  },
  {
    title: "线性代数",
    items: [
      { label: "矩阵", insert: "\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}" },
      { label: "行列式", insert: "\\det(A)" },
      { label: "转置", insert: "A^{T}" },
      { label: "逆矩阵", insert: "A^{-1}" },
      { label: "向量", insert: "\\vec{a}" },
      { label: "点乘", insert: "\\cdot" },
      { label: "叉乘", insert: "\\times" },
      { label: "范数", insert: "\\|x\\|" },
    ],
  },
  {
    title: "集合与逻辑",
    items: [
      { label: "属于", insert: "\\in" },
      { label: "子集", insert: "\\subset" },
      { label: "包含", insert: "\\supset" },
      { label: "交集", insert: "\\cap" },
      { label: "并集", insert: "\\cup" },
      { label: "空集", insert: "\\emptyset" },
      { label: "任意", insert: "\\forall" },
      { label: "存在", insert: "\\exists" },
      { label: "否定", insert: "\\neg" },
      { label: "等价", insert: "\\Leftrightarrow" },
    ],
  },
  {
    title: "关系与箭头",
    items: [
      { label: "约等于", insert: "\\approx" },
      { label: "不等于", insert: "\\neq" },
      { label: "小于等于", insert: "\\leq" },
      { label: "大于等于", insert: "\\geq" },
      { label: "正无穷", insert: "\\infty" },
      { label: "右箭头", insert: "\\to" },
      { label: "推导", insert: "\\Rightarrow" },
      { label: "双箭头", insert: "\\Leftrightarrow" },
      { label: "映射", insert: "\\mapsto" },
    ],
  },
];

// 希腊字母大小写对照（点击插入符号本身，KaTeX 原生支持）。
const GREEK_LETTERS = [
  "α", "β", "γ", "δ", "ε", "ζ", "η", "θ", "λ", "μ", "ν", "ξ", "π", "ρ", "σ", "τ", "φ", "χ", "ψ", "ω",
  "Γ", "Δ", "Θ", "Λ", "Π", "Σ", "Φ", "Ψ", "Ω",
];

export default function ContributeEditor() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [section, setSection] = useState("");
  const [author, setAuthor] = useState("");
  const [tags, setTags] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [previewHtml, setPreviewHtml] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [result, setResult] = useState<SubmitResponse | null>(null);
  const [mathOpen, setMathOpen] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previewAbort = useRef<AbortController | null>(null);

  const sections = useMemo(
    () => (category ? getContributeCategory(category)?.sections ?? [] : []),
    [category]
  );

  // 客户端即时校验：镜像服务端规则，不满足时禁用提交按钮。
  const clientErrors = useMemo(() => {
    const issues = validateSubmissionFields({
      title,
      category,
      section,
      author,
      excerpt,
      tags: tags.split(/[,，、]/).map((tag) => tag.trim()).filter(Boolean),
      body,
      date: "2026-08-08",
    });
    return issues.filter((issue) => issue.level === "error").map((issue) => `${issue.message}${issue.hint ? `：${issue.hint}` : ""}`);
  }, [title, author, category, section, excerpt, tags, body]);

  const canSubmit = clientErrors.length === 0 && status !== "submitting";
  const slugPreview = title.trim() ? previewSlug(title) : "";

  // 正文变化时 debounce 后请求预览（双栏常驻显示）。
  useEffect(() => {
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
  }, [body]);

  // 点击工具栏按钮：应用格式并恢复光标。
  const handleFormat = useCallback(
    (action: FormatAction) => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      // 直接读 textarea 的实时 value，而非闭包里的 body 状态。
      // 这样连续点击多个按钮时，每次都基于最新内容定位，不会因状态异步更新导致光标错乱。
      const insertPos = textarea.selectionStart;
      const newValue = applyFormat(textarea, textarea.value, action);
      setBody(newValue);
      // 插入内容长度，用于把光标移到插入内容末尾。
      const insertedLen = action.insert?.length ?? (action.placeholder ?? "").length + (action.prefix ?? "").length + (action.suffix ?? "").length;
      // 等 React 把新 body 渲染进 textarea 后再设置光标（此时 value 已更新）。
      requestAnimationFrame(() => {
        textarea.focus();
        const pos = insertPos + insertedLen;
        textarea.setSelectionRange(pos, pos);
      });
    },
    []
  );

  const insertText = useCallback(
    (text: string) => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      const insertPos = textarea.selectionStart;
      const newValue = applyFormat(textarea, textarea.value, { insert: text });
      setBody(newValue);
      // 插入后把光标移到插入内容末尾，方便连续点选多个符号拼公式。
      // 不关闭面板——打公式通常要连续插入好几个符号。
      requestAnimationFrame(() => {
        textarea.focus();
        const pos = insertPos + text.length;
        textarea.setSelectionRange(pos, pos);
      });
    },
    []
  );

  const handleSubmit = useCallback(async () => {
    setStatus("submitting");
    setErrorMsg("");
    setResult(null);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, category, section, author, excerpt, tags, body }),
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
  }, [title, category, section, author, excerpt, tags, body]);

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
          if (!canSubmit) return;
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
          />
          {slugPreview ? (
            <small className="slug-preview">
              文章链接：<code>/{category || "分类"}/{slugPreview}</code>
            </small>
          ) : null}
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
          <span>摘要 *（{excerpt.length}/160）</span>
          <input
            className="contribute-input"
            type="text"
            value={excerpt}
            onChange={(event) => setExcerpt(event.target.value)}
            placeholder="20–160 字符，一句话说明文章解决什么问题"
            maxLength={160}
          />
        </label>

        <div className="contribute-body">
          <span className="contribute-body-label">正文（Markdown）* — 用工具栏一键插入格式，右侧实时预览</span>

          {/* 工具栏 */}
          <div className="contribute-toolbar" role="toolbar" aria-label="格式工具栏">
            <button type="button" title="二级标题" onClick={() => handleFormat({ prefix: "## ", block: true, placeholder: "二级标题" })}><Heading2 aria-hidden="true" size={17} /></button>
            <button type="button" title="三级标题" onClick={() => handleFormat({ prefix: "### ", block: true, placeholder: "三级标题" })}><Heading3 aria-hidden="true" size={17} /></button>
            <span className="toolbar-divider" />
            <button type="button" title="加粗" onClick={() => handleFormat({ prefix: "**", suffix: "**", wrap: true, placeholder: "加粗文字" })}><Bold aria-hidden="true" size={16} /></button>
            <button type="button" title="斜体" onClick={() => handleFormat({ prefix: "*", suffix: "*", wrap: true, placeholder: "斜体文字" })}><Italic aria-hidden="true" size={16} /></button>
            <button type="button" title="行内代码" onClick={() => handleFormat({ prefix: "`", suffix: "`", wrap: true, placeholder: "code" })}><Code aria-hidden="true" size={16} /></button>
            <span className="toolbar-divider" />
            <button type="button" title="引用" onClick={() => handleFormat({ prefix: "> ", block: true, placeholder: "引用内容" })}><Quote aria-hidden="true" size={16} /></button>
            <button type="button" title="无序列表" onClick={() => handleFormat({ prefix: "- ", block: true, placeholder: "列表项" })}><List aria-hidden="true" size={16} /></button>
            <button type="button" title="有序列表" onClick={() => handleFormat({ prefix: "1. ", block: true, placeholder: "列表项" })}><ListOrdered aria-hidden="true" size={16} /></button>
            <button type="button" title="分割线" onClick={() => handleFormat({ insert: "\n---\n", block: true })}><Minus aria-hidden="true" size={16} /></button>
            <span className="toolbar-divider" />
            <button type="button" title="链接" onClick={() => handleFormat({ prefix: "[", suffix: "](https://)", wrap: true, placeholder: "链接文字" })}><LinkIcon aria-hidden="true" size={16} /></button>
            <button type="button" title="代码块" onClick={() => handleFormat({ insert: "\n```\ncode\n```\n", block: true })}><Code2 aria-hidden="true" size={16} /></button>
            <button type="button" title="表格" onClick={() => handleFormat({ insert: "\n| 列1 | 列2 |\n| --- | --- |\n| 内容 | 内容 |\n", block: true })}><TableIcon aria-hidden="true" size={16} /></button>
            <span className="toolbar-divider" />
            <button type="button" title="行内公式" onClick={() => handleFormat({ prefix: "$", suffix: "$", wrap: true, placeholder: "E=mc^2" })}><SquareFunction aria-hidden="true" size={16} /></button>
            <button type="button" title="行间公式" onClick={() => handleFormat({ insert: "\n$$\n\\int_0^1 x\\,dx\n$$\n", block: true })}><Sigma aria-hidden="true" size={16} /></button>
            <button type="button" title="公式助手" className={mathOpen ? "active" : ""} onClick={() => setMathOpen((open) => !open)}><Eye aria-hidden="true" size={15} /> 公式</button>
          </div>

          {/* 公式助手面板 */}
          {mathOpen ? (
            <div className="math-popover" role="region" aria-label="公式助手">
              {MATH_GROUPS.map((group) => (
                <div key={group.title} className="math-popover-group">
                  <span className="math-popover-title">{group.title}</span>
                  <div className="math-popover-chips">
                    {group.items.map((item) => (
                      <button key={item.label} type="button" className="math-chip" onClick={() => insertText(item.insert)}>
                        {item.label}
                        <code>{item.insert}</code>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <div className="math-popover-group">
                <span className="math-popover-title">希腊字母</span>
                <div className="math-popover-letters">
                  {GREEK_LETTERS.map((letter) => (
                    <button key={letter} type="button" className="math-letter" onClick={() => insertText(letter)}>{letter}</button>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {/* 双栏：左编辑 + 右预览 */}
          <div className="contribute-split">
            <div className="editor-pane">
              <span className="pane-label">编辑</span>
              <textarea
                ref={textareaRef}
                className="contribute-textarea"
                value={body}
                onChange={(event) => setBody(event.target.value)}
                placeholder={"用上方工具栏插入格式、公式、表格……\n右侧会实时显示渲染效果。\n\n例如点「行间公式」插入一个积分模板。"}
                required
              />
            </div>
            <div className="preview-pane">
              <span className="pane-label"><Eye aria-hidden="true" size={14} /> 预览</span>
              <div
                className="contribute-preview wiki-content"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            </div>
          </div>
        </div>

        {clientErrors.length > 0 && status !== "submitting" ? (
          <div className="field-hint" role="status">还需完善：{clientErrors.join("、")}</div>
        ) : null}

        {status === "error" ? (
          <div className="contribute-error" role="alert">{errorMsg}</div>
        ) : null}

        <div className="contribute-actions">
          <button type="submit" className="contribute-submit" disabled={!canSubmit}>
            {status === "submitting" ? "提交中…" : "提交审核"}
          </button>
          <span className="contribute-hint">提交后进入审核队列，通过后自动发布</span>
        </div>
      </form>
    </div>
  );
}
