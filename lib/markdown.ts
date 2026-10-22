import { isSafeMarkdownUrl } from "./markdown-url";
import { unified } from "unified";
import remarkParse from "remark-parse";
import gfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import rehypeStringify from "rehype-stringify";

type MarkdownNode = {
  type: string;
  value?: string;
  children?: MarkdownNode[];
  position?: { start: { offset?: number }; end: { offset?: number } };
  data?: Record<string, unknown>;
};

// Convert only a standalone $$...$$ paragraph. Code, YAML, links and inline
// formulas must never be rewritten by a regular expression over the source.
function remarkDisplayMath() {
  return (tree: unknown, file: { value: unknown }) => {
    const source = String(file.value);
    function visit(node: MarkdownNode) {
      const math = node.type === "paragraph" && node.children?.length === 1
        ? node.children[0] : undefined;
      if (math?.type === "inlineMath" && math.position) {
        const raw = source.slice(math.position.start.offset, math.position.end.offset);
        if (/^\$\$(?!\$)[\s\S]*\$\$$/.test(raw)) {
          node.type = "math";
          node.value = math.value;
          delete node.children;
          node.data = {
            hName: "pre",
            hChildren: [{
              type: "element", tagName: "code",
              properties: { className: ["language-math", "math-display"] },
              children: [{ type: "text", value: math.value ?? "" }],
            }],
          };
        }
      }
      node.children?.forEach(visit);
    }
    visit(tree as MarkdownNode);
  };
}

function rehypeArticleElements() {
  return (tree: unknown) => {
    const visit = (node: unknown, inTable = false): void => {
      if (!node || typeof node !== "object") return;
      const element = node as {
        type?: string; tagName?: string;
        properties?: Record<string, unknown>; children?: unknown[];
      };
      if (element.type === "element") {
        const props = element.properties ??= {};
        for (const property of ["href", "src"]) {
          const value = props[property];
          if (typeof value === "string" && !isSafeMarkdownUrl(value, property === "src")) {
            delete props[property];
          }
        }
        if (element.tagName === "img") {
          props.loading = "lazy";
          props.decoding = "async";
        }
      }
      const table = (inTable || element.tagName === "td" || element.tagName === "th") && element.tagName !== "code";
      element.children?.forEach((child) => visit(child, table));
      if (table && element.children) {
        element.children = element.children.flatMap((child) => {
          const text = child as { type?: string; value?: string };
          if (text.type !== "text" || !text.value || !/<br\s*\/?>/i.test(text.value)) return [child];
          // Legacy imports encode line breaks as &lt;br&gt;. Turn only that text
          // into a safe element inside table cells, never enable raw HTML.
          return text.value.split(/<br\s*\/?>/i).flatMap((value, index) => [
            ...(index ? [{ type: "element", tagName: "br", properties: {}, children: [] }] : []),
            { type: "text", value },
          ]);
        });
      }
    };
    visit(tree);
  };
}

// A single server-side pipeline for articles, author profiles and previews.
// Raw HTML stays disabled. Unknown code languages fall back to escaped text.
export const markdownProcessor = unified()
  .use(remarkParse)
  .use(gfm)
  .use(remarkMath)
  .use(remarkDisplayMath)
  .use(remarkRehype)
  .use(rehypeSlug)
  .use(rehypeAutolinkHeadings, { behavior: "wrap" })
  .use(rehypeHighlight)
  .use(rehypeKatex, { throwOnError: false, strict: false })
  .use(rehypeArticleElements)
  .use(rehypeStringify);

export function preprocessMarkdown(raw: string): string {
  return raw.replace(/\r\n?/g, "\n");
}

export function excerptFromMarkdown(body: string): string {
  const tree = markdownProcessor.parse(body) as MarkdownNode;
  const textOf = (node: MarkdownNode): string => {
    if (node.type === "html" || node.type === "image") return "";
    return node.value ?? (node.children ?? []).map(textOf).join("");
  };
  const text = (tree.children ?? [])
    .filter((node) => node.type === "paragraph")
    .map((node) => textOf(node).replace(/\s+/g, " ").trim())
    .find((paragraph) => paragraph.length >= 20) ?? "";
  return text.length > 150 ? `${text.slice(0, 149)}…` : text;
}
