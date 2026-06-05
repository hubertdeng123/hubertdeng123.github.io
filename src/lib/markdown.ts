import { marked } from "marked";

marked.use({
  gfm: true,
  breaks: false
});

export function markdownToHtml(markdown: string) {
  return marked.parse(markdown, { async: false }) as string;
}
