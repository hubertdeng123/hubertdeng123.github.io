import type { Post } from "../lib/types";

export function PostRow({ post }: { post: Post }) {
  return (
    <article className="post-row">
      <a href={`/blog/${post.slug}/`}>
        <span>{formatDate(post.date)}</span>
        <strong>{post.title}</strong>
        <em>{post.description}</em>
      </a>
    </article>
  );
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC"
  }).format(new Date(`${date}T00:00:00Z`));
}
