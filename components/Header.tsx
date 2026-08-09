"use client";

import Link from "next/link";
import { Menu, Moon, PenSquare, Sun, TerminalSquare, X } from "lucide-react";
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
          </div>
        </nav>
      ) : null}
    </header>
  );
}
