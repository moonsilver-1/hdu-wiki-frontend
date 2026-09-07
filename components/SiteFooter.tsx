"use client";

import Link from "next/link";
import { GitFork } from "lucide-react";
import { usePathname } from "next/navigation";

export default function SiteFooter() {
  const pathname = usePathname();
  if (pathname?.startsWith("/welcome")) return null;

  return (
    <footer className="site-footer">
      <div className="site-container footer-inner">
        <div>
          <Link href="/" className="footer-brand"><strong>HDU</strong> Wiki</Link>
          <span>杭州电子科技大学校园百科</span>
        </div>
        <div className="footer-links">
          <Link href="/community/how-to-join-us">参与共建</Link>
          <a
            href="https://github.com/moonsilver-1/hdu-wiki-frontend"
            target="_blank"
            rel="noreferrer"
            aria-label="HDU Wiki GitHub 仓库"
          >
            <GitFork aria-hidden="true" size={17} />
          </a>
        </div>
      </div>
    </footer>
  );
}
