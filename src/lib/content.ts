import type { Post } from "./types";

const postModules = import.meta.glob("../content/posts/*.md", {
  query: "?raw",
  import: "default",
  eager: true
}) as Record<string, string>;

function slugFromPath(path: string) {
  return path.split("/").pop()?.replace(/\.md$/, "") ?? "";
}

function parsePost(path: string, raw: string): Post {
  const { data, content } = parseFrontmatter(raw);
  return {
    slug: slugFromPath(path),
    title: String(data.title),
    description: String(data.description),
    date: String(data.date),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    body: content.trim()
  };
}

export function getPosts() {
  return Object.entries(postModules)
    .map(([path, raw]) => parsePost(path, raw))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPostBySlug(slug: string) {
  return getPosts().find((post) => post.slug === slug);
}

type FrontmatterData = Record<string, string | boolean | number | string[] | undefined>;

function parseFrontmatter(raw: string): { data: FrontmatterData; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    return { data: {}, content: raw };
  }

  const data: FrontmatterData = {};
  let listKey: string | undefined;

  for (const line of match[1].split(/\r?\n/)) {
    const listItem = line.match(/^\s*-\s+(.+)$/);
    if (listItem && listKey) {
      const existing = data[listKey];
      data[listKey] = [...(Array.isArray(existing) ? existing : []), parseString(listItem[1])];
      continue;
    }

    const pair = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!pair) {
      continue;
    }

    const [, key, value] = pair;
    if (value === "") {
      data[key] = [];
      listKey = key;
      continue;
    }

    data[key] = parseScalar(value);
    listKey = undefined;
  }

  return { data, content: match[2] };
}

function parseScalar(value: string) {
  const trimmed = parseString(value);
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) return Number(trimmed);
  return trimmed;
}

function parseString(value: string) {
  return value.trim().replace(/^["']|["']$/g, "");
}
