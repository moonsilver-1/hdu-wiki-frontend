"use client";

import Link from "next/link";
import { Menu, Monitor, Moon, PenSquare, Smartphone, Sun, TerminalSquare, X } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import SearchButton from "./SearchButton";
import { useTheme } from "./ThemeProvider";

const categories = [
  { slug: "courses", name: "课程与学术" },
  { slug: "campus", name: "校园生活" },
  { slug: "tech", name: "技术与项目" },
  { slug: "community", name: "社团与活动" },
];

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const nextTheme = resolvedTheme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(nextTheme)}
      className="header-icon-button"
      aria-label={nextTheme === "light" ? "切换到亮色模式" : "切换到暗色模式"}
      title={nextTheme === "light" ? "亮色模式" : "暗色模式"}
    >
      {resolvedTheme === "dark" ? (
        <Sun aria-hidden="true" size={18} />
      ) : (
        <Moon aria-hidden="true" size={18} />
      )}
    </button>
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === null || pathname === "/";

  return (
    <header className="site-header">
      <div className="site-container header-inner">
        <Link href="/" className="site-brand" onClick={() => setMenuOpen(false)}>
          <span><strong>HDU</strong> Wiki</span>
        </Link>

        <nav className="desktop-nav" aria-label="主导航">
          {!isHome ? <Link href="/" className="home-nav-link">HOME</Link> : null}
          {categories.map((category) => (
            <Link key={category.slug} href={`/${category.slug}`}>
              {category.name}
            </Link>
          ))}
          <Link href="/vim" className="vim-link" title="Vim 阅读模式">
            <TerminalSquare aria-hidden="true" size={16} />
            Vim
          </Link>
          <Link href="/contribute" className="contribute-link" title="我要投稿">
            <PenSquare aria-hidden="true" size={16} />
            投稿
          </Link>
        </nav>

        <div className="header-actions">
          <SearchButton variant="compact" />
          <a
            href="https://github.com/moonsilver-1/dudu-app/releases/download/v1.0.3/dudu-release.apk"
            className="header-icon-button"
            download
            aria-label="下载安卓 App"
            title="下载安卓 App"
          >
            <Smartphone aria-hidden="true" size={18} />
          </a>
          <a
            href="https://github.com/moonsilver-1/hdu-wiki-frontend/releases/download/v0.1.0-desktop/hdu-wiki-desktop-setup.exe"
            className="header-icon-button"
            target="_blank"
            rel="noreferrer"
            aria-label="下载桌面版"
            title="下载桌面版"
          >
            <Monitor aria-hidden="true" size={18} />
          </a>
          <ThemeToggle />
          <button
            type="button"
            className="header-icon-button mobile-menu-button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "关闭菜单" : "打开菜单"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <nav className="mobile-nav" aria-label="移动端导航">
          <div className="site-container">
            {!isHome ? (
              <Link href="/" className="home-nav-link" onClick={() => window.setTimeout(() => setMenuOpen(false), 0)}>
                HOME
              </Link>
            ) : null}
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/${category.slug}`}
                onClick={() => window.setTimeout(() => setMenuOpen(false), 0)}
              >
                {category.name}
              </Link>
            ))}
            <Link href="/vim" onClick={() => window.setTimeout(() => setMenuOpen(false), 0)}>
              <TerminalSquare aria-hidden="true" size={17} />
              Vim 阅读模式
            </Link>
            <Link href="/contribute" onClick={() => window.setTimeout(() => setMenuOpen(false), 0)}>
              <PenSquare aria-hidden="true" size={17} />
              我要投稿
            </Link>
            <a
              href="https://github.com/moonsilver-1/dudu-app/releases/download/v1.0.3/dudu-release.apk"
              onClick={() => window.setTimeout(() => setMenuOpen(false), 0)}
              download
            >
              <Smartphone aria-hidden="true" size={17} />
              下载安卓 App
            </a>
            <a
              href="https://github.com/moonsilver-1/hdu-wiki-frontend/releases/download/v0.1.0-desktop/hdu-wiki-desktop-setup.exe"
              onClick={() => window.setTimeout(() => setMenuOpen(false), 0)}
              target="_blank"
              rel="noreferrer"
            >
              <Monitor aria-hidden="true" size={17} />
              下载桌面版
            </a>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
