import { unified } from "unified";
import remarkParse from "remark-parse";
import gfm from "remark-gfm";
import remarkMath from "remark-math";
import { isSafeMarkdownUrl } from "./markdown-url";
import type { ContentValidationIssue } from "./content-validation";

type Node = {
  type: string; depth?: number; url?: string; identifier?: string;
  children?: Node[];
  position?: { start: { line: number; offset?: number }; end: { offset?: number } };
};
const parser = unified().use(remarkParse).use(gfm).use(remarkMath);

export function validateMarkdownBody(body: string): ContentValidationIssue[] {
  const tree = parser.parse(body) as Node;
  const issues: ContentValidationIssue[] = [];
  const definitions = new Map<string, string>();
  let previousLevel = 0;
  let hasH2 = false;
  const walk = (node: Node, fn: (node: Node) => void) => {
    fn(node);
    node.children?.forEach((child) => walk(child, fn));
  };
  walk(tree, (node) => {
    if (node.type === "definition" && node.identifier) definitions.set(node.identifier, node.url ?? "");
  });
  walk(tree, (node) => {
    const add = (code: string, message: string, hint: string, level: "error" | "warning" = "error") => {
      issues.push({ code, message, hint, level, line: node.position?.start.line });
    };
    if (node.type === "heading") {
      const level = node.depth ?? 2;
      if (level === 1) add("V012", "正文禁止 H1", "页面标题由站点模板提供，正文从 H2 开始。");
      if (level === 2) hasH2 = true;
      if (previousLevel && level > previousLevel + 1) add("V015", "标题层级跳级", "将标题逐级组织，便于目录和屏幕阅读器理解。", "warning");
      previousLevel = level;
    }
    if (node.type === "html") add("V014", "正文禁止 raw HTML", "改写为标准 Markdown 或代码块。");
    if (["image", "imageReference", "link", "linkReference"].includes(node.type)) {
      const url = node.url ?? definitions.get(node.identifier ?? "");
      if (url !== undefined) {
        const image = node.type.startsWith("image");
        if (image && !/^(?:local:\d+$|https?:\/\/|\/)/i.test(url)) {
          add("V013", "图片链接不受支持", "请上传图片、使用站内路径或 https:// 图片链接。");
        }
        if (!isSafeMarkdownUrl(url, image)) add("V017", "正文禁止不安全链接协议", "仅使用 http(s)、邮件、电话或站内链接。");
      }
    }
    if (node.type === "code" && node.position) {
      const raw = body.slice(node.position.start.offset, node.position.end.offset);
      const lines = raw.split("\n");
      const opening = /^(`{3,}|~{3,})/.exec(lines[0]);
      if (opening) {
        const closing = /^\s*(?:>\s*)*(`{3,}|~{3,})\s*$/.exec(lines.at(-1) ?? "");
        if (lines.length < 2 || !closing || closing[1][0] !== opening[1][0] || closing[1].length < opening[1].length) {
          add("V018", "代码围栏未闭合", "使用与开头相同字符、长度不少于开头的围栏结束代码块。");
        }
      }
    }
  });
  if (body.length >= 20 && !hasH2) issues.push({ level: "warning", code: "V016", message: "正文没有 H2", hint: "长文建议从 H2 开始组织章节。" });
  return issues;
}
