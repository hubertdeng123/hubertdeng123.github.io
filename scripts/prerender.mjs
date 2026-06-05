import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const serverEntry = path.join(dist, "server", "entry-server.js");
const template = await readFile(path.join(dist, "index.html"), "utf8");
const { render, routes, metadata, generateFeed, generateSitemap } = await import(
  `${pathToFileUrl(serverEntry)}?t=${Date.now()}`
);

for (const route of routes()) {
  const meta = metadata(route);
  const html = template
    .replace("<!--app-html-->", render(route))
    .replace("<!--page-title-->", escapeHtml(meta.title))
    .replace("<!--page-description-->", escapeHtml(meta.description))
    .replace("<!--canonical-url-->", `https://hubertdeng.com${meta.canonicalPath}`);

  const outPath =
    route === "/"
      ? path.join(dist, "index.html")
      : route.endsWith(".html")
        ? path.join(dist, route)
        : path.join(dist, route, "index.html");

  await mkdir(path.dirname(outPath), { recursive: true });
  await writeFile(outPath, html);
}

await writeFile(path.join(dist, "feed.xml"), generateFeed());
await writeFile(path.join(dist, "sitemap.xml"), generateSitemap());
await rm(path.join(dist, "server"), { recursive: true, force: true });

function pathToFileUrl(filePath) {
  return new URL(`file://${filePath}`).href;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
