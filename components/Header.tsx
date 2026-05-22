"use client";

import Link from "next/link";
import { useState } from "react";
import { useTheme } from "./ThemeProvider";

const categories = [
  { slug: "courses", name: "课程与学术" },
  { slug: "campus", name: "校园生活" },
  { slug: "tech", name: "技术与项目" },
  { slug: "community", name: "社团与活动" },
];

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="p-1.5 rounded-md text-[var(--color-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface)] transition-colors"
      aria-label={resolvedTheme === "dark" ? "切换到亮色模式" : "切换到暗色模式"}
      title={resolvedTheme === "dark" ? "切换到亮色模式" : "切换到暗色模式"}
    >
      {resolvedTheme === "dark" ? (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
    </button>
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-background)] border-b border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="text-[var(--color-primary)]">HDU</span>
          <span>Wiki</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              className="text-sm text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors"
            >
              {cat.name}
            </Link>
          ))}
          <Link
            href="/vim"
            className="text-sm text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors font-mono"
            title="Vim Mode"
          >
            Vim
          </Link>
          <ThemeToggle />
        </nav>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-1">
          <ThemeToggle />
          <button
            className="p-2 text-[var(--color-muted)]"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="菜单"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="md:hidden border-t border-[var(--color-border)] bg-[var(--color-background)]">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              className="block px-4 py-3 text-sm text-[var(--color-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-primary)]"
              onClick={() => setMenuOpen(false)}
            >
              {cat.name}
            </Link>
          ))}
          <Link
            href="/vim"
            className="block px-4 py-3 text-sm text-[var(--color-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-primary)] font-mono"
            onClick={() => setMenuOpen(false)}
          >
            Vim Mode
          </Link>
        </nav>
      )}
    </header>
  );
}
