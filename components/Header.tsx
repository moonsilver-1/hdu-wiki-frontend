"use client";

import Link from "next/link";
import { useState } from "react";

const categories = [
  { slug: "courses", name: "课程与学术" },
  { slug: "campus", name: "校园生活" },
  { slug: "tech", name: "技术与项目" },
  { slug: "community", name: "社团与活动" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[var(--color-border)]">
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
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 text-[var(--color-muted)]"
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

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="md:hidden border-t border-[var(--color-border)] bg-white">
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
