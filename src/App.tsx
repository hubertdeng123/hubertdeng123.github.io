import { Layout } from "./components/Layout";
import { PostRow } from "./components/PostRow";
import { getPostBySlug, getPosts } from "./lib/content";
import { markdownToHtml } from "./lib/markdown";
import type { Post } from "./lib/types";

type AppProps = {
  pathname: string;
};

function normalizePath(pathname: string) {
  if (pathname !== "/" && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

export function App({ pathname }: AppProps) {
  const path = normalizePath(pathname);

  if (path === "/") {
    return (
      <Layout pathname={pathname}>
        <Home />
      </Layout>
    );
  }

  if (path === "/experience" || path === "/work") {
    return (
      <Layout pathname={pathname}>
        <ExperiencePage />
      </Layout>
    );
  }

  if (path === "/blog" || path === "/writing") {
    return (
      <Layout pathname={pathname}>
        <BlogIndex />
      </Layout>
    );
  }

  if (path.startsWith("/blog/") || path.startsWith("/writing/")) {
    const slug = path.replace(/^\/(blog|writing)\//, "");
    const post = getPostBySlug(slug);
    return (
      <Layout pathname={pathname}>
        {post ? <PostPage post={post} /> : <NotFound />}
      </Layout>
    );
  }

  if (path === "/about") {
    return (
      <Layout pathname={pathname}>
        <About />
      </Layout>
    );
  }

  return (
    <Layout pathname={pathname}>
      <NotFound />
    </Layout>
  );
}

function Home() {
  const latestPosts = getPosts().slice(0, 3);

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Software engineer</p>
          <h1 className="hero-name">Hubert Deng</h1>
          <p className="lede">
            I&apos;m a software engineer who&apos;s been around computers for as long as I can
            remember. I got into coding by modding video games, and these days I work on developer
            tools that help engineering teams move faster. Outside of work I spend my time playing
            tennis, running, lifting, and cooking.
          </p>
        </div>
      </section>

      <section className="section-block home-writing">
        <SectionHeading eyebrow="Blog" title="Latest writing" />
        {latestPosts.length > 0 ? (
          <PostList posts={latestPosts} compact />
        ) : (
          <div className="empty-state writing-soon">
            <p>Posts coming soon.</p>
          </div>
        )}
      </section>
    </>
  );
}

function ExperiencePage() {
  return (
    <>
      <PageHeader
        eyebrow="Experience"
        title="Work experience"
        description="A short overview of the roles and systems I have worked on."
      />
      <ExperienceList />
    </>
  );
}

function BlogIndex() {
  const posts = getPosts();

  return (
    <>
      <PageHeader
        eyebrow="Blog"
        title="Blog"
        description="Notes, ideas, and longer thoughts."
      />
      <PostList posts={posts} />
    </>
  );
}

function About() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="Hi, I'm Hubert."
        description="I am a software engineer in Seattle."
      />
      <div className="about-grid">
        <article className="prose">
          <h2>Current focus</h2>
          <p>
            I work on developer infrastructure: dev environments, CI/CD, and coding-agent tooling.
          </p>
          <p>
            Outside work I play tennis, run, lift, cook, and follow new technology.
          </p>
          <h2>Background</h2>
          <p>
            I studied Computer Engineering at the University of Illinois Urbana-Champaign and
            have worked across developer infrastructure, statistical analysis products, and
            full-stack systems.
          </p>
        </article>
        <aside className="profile-panel">
          <h2>Contact</h2>
          <a href="mailto:hubertdeng123@gmail.com">hubertdeng123@gmail.com</a>
          <a href="https://github.com/hubertdeng123">GitHub</a>
          <a href="https://www.linkedin.com/in/hubert-deng-b3354311b/">LinkedIn</a>
          <h2>Skills</h2>
          <p>Python, TypeScript, Rust, C++, C</p>
          <p>Docker, Kubernetes, AWS, CI/CD, GitHub Actions, Terraform, Postgres, Redis, Kafka, ClickHouse</p>
        </aside>
      </div>
      <ExperienceSection />
    </>
  );
}

function ExperienceSection() {
  return (
    <section className="section-block">
      <SectionHeading eyebrow="Experience" title="Experience" href="/experience/" linkLabel="More" />
      <ExperienceList compact />
    </section>
  );
}

function ExperienceList({ compact = false }: { compact?: boolean }) {
  const roles = [
    {
      company: "Sentry",
      role: "Senior Software Engineer",
      dates: "2022 - Present",
      summary:
        "Developer infrastructure: dev environments, CI/CD, and coding-agent tooling.",
      details: [
        "Build and maintain the developer environments engineers use day to day.",
        "Work on CI/CD, service orchestration, and typed configuration.",
        "Explore coding-agent tooling that can run against real repo context and commands."
      ]
    },
    {
      company: "Qualtrics",
      role: "Software Engineer",
      dates: "2020 - 2022",
      summary:
        "Stats and product work for Statwing and Predict iQ.",
      details: [
        "Built product and analysis features across full-stack systems.",
        "Worked on statistical workflows, production data paths, and user-facing tools."
      ]
    }
  ];

  return (
    <div className={compact ? "timeline compact" : "timeline"}>
      {roles.map((role) => (
        <article className="timeline-item" key={role.company}>
          <div>
            <h3>{role.company}</h3>
            <p>{role.role}</p>
          </div>
          <div>
            <p className="meta">{role.dates}</p>
            <p>{role.summary}</p>
            {!compact ? (
              <ul className="timeline-details">
                {role.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}

function PostPage({ post }: { post: Post }) {
  return (
    <article className="article">
      <a className="back-link" href="/blog/">
        Blog
      </a>
      <p className="eyebrow">{formatDate(post.date)}</p>
      <h1>{post.title}</h1>
      <p className="lede">{post.description}</p>
      <div className="tag-list">
        {post.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
      <div className="prose" dangerouslySetInnerHTML={{ __html: markdownToHtml(post.body) }} />
    </article>
  );
}

function PostList({ posts, compact = false }: { posts: Post[]; compact?: boolean }) {
  if (posts.length === 0) {
    return (
      <div className={compact ? "empty-state compact" : "empty-state"}>
        <p>No posts yet.</p>
        <a href="/feed.xml">RSS</a>
      </div>
    );
  }

  return (
    <div className={compact ? "post-list compact" : "post-list"}>
      {posts.map((post) => (
        <PostRow key={post.slug} post={post} />
      ))}
    </div>
  );
}

function NotFound() {
  return (
    <PageHeader
      eyebrow="404"
      title="Page not found."
      description="The page may have moved, or the link may be out of date."
    />
  );
}

function PageHeader({
  eyebrow,
  title,
  description
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <header className="page-header">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p>{description}</p>
    </header>
  );
}

function SectionHeading({
  eyebrow,
  title,
  href,
  linkLabel
}: {
  eyebrow: string;
  title: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="section-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      {href && linkLabel ? <a href={href}>{linkLabel}</a> : null}
    </div>
  );
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC"
  }).format(new Date(`${date}T00:00:00Z`));
}
