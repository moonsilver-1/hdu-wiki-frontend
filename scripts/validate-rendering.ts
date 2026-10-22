import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { markdownProcessor } from "../lib/markdown";

const files = (directory: string): string[] => fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  const file = path.join(directory, entry.name);
  return entry.isDirectory() ? files(file) : entry.name.endsWith(".md") ? [file] : [];
});

async function main() {
  const documents = files("content");
  let errors = 0;
  for (const file of documents) {
    try {
      const { content } = matter(fs.readFileSync(file, "utf8"));
      const result = await markdownProcessor.process(content);
      for (const message of result.messages) {
        if (message.source !== "rehype-katex") continue;
        errors++;
        console.error(`${file}:${message.line ?? 1} ${message.reason}`);
      }
      if (/class="katex-error"/.test(String(result)) && !result.messages.length) {
        errors++;
        console.error(`${file}: formula rendering failed`);
      }
    } catch (error) {
      errors++;
      console.error(`${file}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  console.log(`文章渲染：${documents.length} 篇（含作者介绍），${errors} errors`);
  if (errors) process.exitCode = 1;
}

void main();
