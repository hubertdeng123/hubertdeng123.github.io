import type { PropsWithChildren } from "react";

const navItems = [
  { href: "/experience/", label: "Experience" },
  { href: "/blog/", label: "Blog" },
  { href: "/about/", label: "About" }
];

export function Layout({ children, pathname }: PropsWithChildren<{ pathname: string }>) {
  return (
    <>
      <header className="site-header">
        <a className="site-mark" href="/" aria-label="Hubert Deng home">
          HD
        </a>
        <nav className="site-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <a
              href={item.href}
              key={item.href}
              aria-current={isActive(pathname, item.href) ? "page" : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </header>
      <main>{children}</main>
      <footer className="site-footer">
        <p>&copy; 2026 Hubert Deng. Built from Markdown and a little React.</p>
        <div>
          <a href="mailto:hubertdeng123@gmail.com">Email</a>
          <a href="https://github.com/hubertdeng123">GitHub</a>
          <a href="https://www.linkedin.com/in/hubert-deng-b3354311b/">LinkedIn</a>
          <a href="/feed.xml">RSS</a>
        </div>
      </footer>
    </>
  );
}

function isActive(pathname: string, href: string) {
  if (pathname.startsWith(href)) return true;
  if (href === "/experience/" && pathname.startsWith("/work/")) return true;
  if (href === "/blog/" && pathname.startsWith("/writing/")) return true;
  return false;
}
