import { getPostBySlug, getPosts } from "./content";
import type { RouteMeta } from "./types";

const siteDescription =
  "Portfolio and writing from Hubert Deng.";

export function getAllRoutes() {
  return [
    "/",
    "/experience/",
    "/work/",
    "/blog/",
    "/writing/",
    ...getPosts().flatMap((post) => [`/blog/${post.slug}/`, `/writing/${post.slug}/`]),
    "/about/",
    "/404.html"
  ];
}

export function getRouteMeta(pathname: string): RouteMeta {
  const path = normalizePath(pathname);

  if (path === "/") {
    return {
      title: "Hubert Deng",
      description: siteDescription,
      canonicalPath: "/"
    };
  }

  if (path === "/experience" || path === "/work") {
    return {
      title: "Experience - Hubert Deng",
      description: "Work experience overview for Hubert Deng.",
      canonicalPath: "/experience/"
    };
  }

  if (path === "/blog" || path === "/writing") {
    return {
      title: "Blog - Hubert Deng",
      description: "Writing by Hubert Deng.",
      canonicalPath: "/blog/"
    };
  }

  if (path.startsWith("/blog/") || path.startsWith("/writing/")) {
    const post = getPostBySlug(path.replace(/^\/(blog|writing)\//, ""));
    return {
      title: post ? `${post.title} - Hubert Deng` : "Blog - Hubert Deng",
      description: post?.description ?? "Writing by Hubert Deng.",
      canonicalPath: post ? `/blog/${post.slug}/` : "/blog/"
    };
  }

  if (path === "/about") {
    return {
      title: "About - Hubert Deng",
      description: "About Hubert Deng, software engineer in Seattle.",
      canonicalPath: "/about/"
    };
  }

  return {
    title: "Page Not Found - Hubert Deng",
    description: "The requested page could not be found.",
    canonicalPath: "/404.html"
  };
}

function normalizePath(pathname: string) {
  if (pathname !== "/" && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }
  return pathname;
}
