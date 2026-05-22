"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "system",
  resolvedTheme: "light",
  setTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getTimeTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  const hour = new Date().getHours();
  return hour >= 18 || hour < 6 ? "dark" : "light";
}

function resolveTheme(theme: Theme): "light" | "dark" {
  if (theme !== "system") return theme;
  const systemDark = getSystemTheme();
  if (systemDark === "dark") return "dark";
  return getTimeTheme();
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  const applyTheme = useCallback((t: Theme) => {
    const resolved = resolveTheme(t);
    setResolvedTheme(resolved);
    const root = document.documentElement;
    if (resolved === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    localStorage.setItem("wiki-theme", t);
    applyTheme(t);
  }, [applyTheme]);

  useEffect(() => {
    const saved = localStorage.getItem("wiki-theme") as Theme | null;
    const initial = saved === "light" || saved === "dark" || saved === "system" ? saved : "system";
    setThemeState(initial);
    applyTheme(initial);

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemChange = () => {
      const current = localStorage.getItem("wiki-theme") as Theme | null;
      const t = current === "light" || current === "dark" || current === "system" ? current : "system";
      applyTheme(t);
    };
    mq.addEventListener("change", onSystemChange);

    const interval = setInterval(() => {
      const current = localStorage.getItem("wiki-theme") as Theme | null;
      const t = current === "light" || current === "dark" || current === "system" ? current : "system";
      applyTheme(t);
    }, 60000);

    return () => {
      mq.removeEventListener("change", onSystemChange);
      clearInterval(interval);
    };
  }, [applyTheme]);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
