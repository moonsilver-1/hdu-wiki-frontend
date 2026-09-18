"use client";

import Link from "next/link";
import { LogOut, Menu, Monitor, Moon, PenSquare, Smartphone, Sun, TerminalSquare, X } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import SearchButton from "./SearchButton";
import { useTheme } from "./ThemeProvider";
import WikiMascot from "./WikiMascot";

interface WatchaUser {
  uid: string;
  nick: string;
  avatar: string;
}

// 登录失败/取消后，观猹回跳会带 login_error 参数：显示一次轻提示。
// setState 放在 setTimeout 回调里，避免在 effect 内同步触发级联渲染。
function LoginNotice() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const error = new URLSearchParams(window.location.search).get("login_error");
    if (!error) return;
    window.history.replaceState(null, "", window.location.pathname);
    const show = window.setTimeout(
      () => setMessage(error === "cancelled" ? "已取消登录" : "登录没有成功，请再试一次"),
      0,
    );
    const hide = window.setTimeout(() => setMessage(""), 4200);
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(hide);
    };
  }, []);

  if (!message) return null;
  return <div className="login-notice" role="status">{message}</div>;
}

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
  const [watchaUser, setWatchaUser] = useState<WatchaUser | null>(null);
  const [watchaLoaded, setWatchaLoaded] = useState(false);

  // 登录态只在客户端拉取：页面保持静态预生成，登录不影响 SSG。
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data: { user: WatchaUser | null }) => setWatchaUser(data.user ?? null))
      .catch(() => undefined)
      .finally(() => setWatchaLoaded(true));
  }, []);

  const logout = () => {
    fetch("/api/auth/logout", { method: "POST" })
      .then(() => setWatchaUser(null))
      .catch(() => undefined);
  };

  if (pathname?.startsWith("/welcome")) return null;
  const isHome = pathname === null || pathname === "/";

  return (
    <header className="site-header">
      <LoginNotice />
      <div className="site-container header-inner">
        <Link href="/" className="site-brand" onClick={() => setMenuOpen(false)}>
          <span className="brand-avatar" aria-hidden="true">
            <WikiMascot />
          </span>
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
          {watchaUser ? (
            <span className="user-chip" title={`观猹用户 ${watchaUser.uid}`}>
              {watchaUser.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={watchaUser.avatar} alt="" referrerPolicy="no-referrer" />
              ) : (
                <span className="user-chip-fallback">{watchaUser.nick.slice(0, 1)}</span>
              )}
              <span className="user-chip-nick">{watchaUser.nick}</span>
              <button type="button" onClick={logout} aria-label="退出登录" title="退出登录">
                <LogOut aria-hidden="true" size={14} />
              </button>
            </span>
          ) : watchaLoaded ? (
            // 跳转到 API 路由再 302 到观猹授权页，必须用原生 <a> 走完整导航
            // eslint-disable-next-line @next/next/no-html-link-for-pages
            <a className="watcha-login" href="/api/auth/login" title="使用观猹账号登录">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/watcha-logo.png" alt="" width={16} height={16} />
              观猹登录
            </a>
          ) : null}
          <a
            href="https://github.com/moonsilver-1/dudu-app/releases/latest/download/dudu-release.apk"
            className="header-icon-button"
            download
            aria-label="下载安卓 App"
            title="下载安卓 App"
          >
            <Smartphone aria-hidden="true" size={18} />
          </a>
          <a
            href="https://github.com/moonsilver-1/hdu-wiki-desktop/releases/latest/download/HDU-Wiki-Setup.exe"
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
              href="https://github.com/moonsilver-1/dudu-app/releases/latest/download/dudu-release.apk"
              onClick={() => window.setTimeout(() => setMenuOpen(false), 0)}
              download
            >
              <Smartphone aria-hidden="true" size={17} />
              下载安卓 App
            </a>
            {watchaUser ? (
              <button
                type="button"
                className="mobile-nav-logout"
                onClick={() => {
                  logout();
                  window.setTimeout(() => setMenuOpen(false), 0);
                }}
              >
                <LogOut aria-hidden="true" size={17} />
                退出登录（{watchaUser.nick}）
              </button>
            ) : (
              // eslint-disable-next-line @next/next/no-html-link-for-pages
              <a href="/api/auth/login" onClick={() => window.setTimeout(() => setMenuOpen(false), 0)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/watcha-logo.png" alt="" width={17} height={17} />
                观猹登录
              </a>
            )}
            <a
              href="https://github.com/moonsilver-1/hdu-wiki-desktop/releases/latest/download/HDU-Wiki-Setup.exe"
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
