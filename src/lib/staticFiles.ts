import { getPosts } from "./content";
import { markdownToHtml } from "./markdown";

const siteUrl = "https://hubertdeng.com";

function xmlEscape(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function generateFeed() {
  const posts = getPosts();
  const updated = posts[0]?.date ?? "2026-06-05";

  return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Hubert Deng</title>
  <subtitle>Writing from Hubert Deng.</subtitle>
  <link href="${siteUrl}/feed.xml" rel="self" />
  <link href="${siteUrl}/" />
  <updated>${updated}T00:00:00Z</updated>
  <id>${siteUrl}/</id>
  <author>
    <name>Hubert Deng</name>
    <email>hubertdeng123@gmail.com</email>
  </author>
${posts
  .map(
    (post) => `  <entry>
    <title>${xmlEscape(post.title)}</title>
    <link href="${siteUrl}/blog/${post.slug}/" />
    <updated>${post.date}T00:00:00Z</updated>
    <id>${siteUrl}/blog/${post.slug}/</id>
    <summary>${xmlEscape(post.description)}</summary>
    <content type="html">${xmlEscape(markdownToHtml(post.body))}</content>
  </entry>`
  )
  .join("\n")}
</feed>
`;
}

export function generateSitemap() {
  const urls = [
    "/",
    "/experience/",
    "/blog/",
    ...getPosts().map((post) => `/blog/${post.slug}/`),
    "/about/"
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>${siteUrl}${url}</loc></url>`).join("\n")}
</urlset>
`;
}
