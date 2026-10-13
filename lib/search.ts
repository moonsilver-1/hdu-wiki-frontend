import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { Index } from "flexsearch";

export interface SearchResult {
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  snippet: string;
  date: string;
  tags: string[];
}

export interface SearchResponse {
  query: string;
  results: SearchResult[];
}

interface SearchDocument extends SearchResult {
  content: string;
  mtimeMs: number;
}

interface SearchState {
  fingerprint: string;
  documents: SearchDocument[];
  indexes: Record<"title" | "tags" | "excerpt" | "content", Index>;
}

let state: SearchState | null = null;

function markdownFiles(): string[] {
  const root = path.join(process.cwd(), "content");
  const walk = (directory: string): string[] => fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const filePath = path.join(directory, entry.name);
    if (entry.isDirectory()) return entry.name === "authors" ? [] : walk(filePath);
    return entry.isFile() && entry.name.endsWith(".md") ? [filePath] : [];
  });
  return walk(root);
}

function slugFromFile(filePath: string): string {
  return path.basename(filePath, ".md").replace(/^(\d+\.\d+|[A-Z]\.\d+|\d+)-/, "");
}

function plainText(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[>*_~]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function buildState(): SearchState {
  const files = markdownFiles();
  const fingerprints = files.map((file) => `${file}:${fs.statSync(file).mtimeMs}`).join("|");
  const documents: SearchDocument[] = files.map((filePath) => {
    const relative = path.relative(path.join(process.cwd(), "content"), filePath).split(path.sep);
    const parsed = matter(fs.readFileSync(filePath, "utf8"));
    const category = relative[0] ?? "";
    const data = parsed.data as Record<string, unknown>;
    const tags = Array.isArray(data.tags) ? data.tags.map(String) : [];
    return {
      title: String(data.title ?? slugFromFile(filePath)),
      slug: slugFromFile(filePath),
      category,
      excerpt: String(data.excerpt ?? ""),
      snippet: "",
      date: String(data.date ?? ""),
      tags,
      content: plainText(parsed.content),
      mtimeMs: fs.statSync(filePath).mtimeMs,
    };
  });
  const indexes = {
    title: new Index({ tokenize: "forward", cache: true }),
    tags: new Index({ tokenize: "forward", cache: true }),
    excerpt: new Index({ tokenize: "forward", cache: true }),
    content: new Index({ tokenize: "forward", cache: true }),
  };
  documents.forEach((document, id) => {
    indexes.title.add(id, document.title);
    indexes.tags.add(id, document.tags.join(" "));
    indexes.excerpt.add(id, document.excerpt);
    indexes.content.add(id, document.content);
  });
  return { fingerprint: fingerprints, documents, indexes };
}

function getState(): SearchState {
  if (process.env.NODE_ENV === "production" && state) return state;
  const next = buildState();
  if (!state || state.fingerprint !== next.fingerprint) state = next;
  return state;
}

function snippetFor(document: SearchDocument, query: string): string {
  const content = document.content || document.excerpt;
  const index = content.toLocaleLowerCase().indexOf(query.toLocaleLowerCase());
  if (index < 0) return content.slice(0, 180);
  return `${index > 70 ? "…" : ""}${content.slice(Math.max(0, index - 70), index + query.length + 110)}${index + query.length + 110 < content.length ? "…" : ""}`;
}

export function searchArticles(query: string, limit = 12): SearchResponse {
  const normalized = query.trim();
  const current = getState();
  if (!normalized) {
    return {
      query: "",
      results: [...current.documents]
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 5)
        .map((document) => ({ ...document, snippet: document.excerpt || document.content.slice(0, 180), content: undefined, mtimeMs: undefined } as unknown as SearchResult)),
    };
  }

  const scores = new Map<number, number>();
  const fields: Array<[keyof SearchState["indexes"], number]> = [["title", 100], ["tags", 60], ["excerpt", 30], ["content", 10]];
  for (const [field, weight] of fields) {
    const ids = current.indexes[field].search(normalized, { limit: current.documents.length }) as number[];
    ids.forEach((id, rank) => scores.set(id, (scores.get(id) ?? 0) + weight / (rank + 1)));
  }
  return {
    query: normalized,
    results: [...scores.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([id]) => {
        const document = current.documents[id];
        return { ...document, snippet: snippetFor(document, normalized), content: undefined, mtimeMs: undefined } as unknown as SearchResult;
      }),
  };
}
