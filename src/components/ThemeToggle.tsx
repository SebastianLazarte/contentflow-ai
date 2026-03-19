"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    if (currentTheme === "dark" || currentTheme === "light") {
      setTheme(currentTheme);
    }
    setReady(true);
  }, []);

  const nextTheme: Theme = theme === "dark" ? "light" : "dark";

  return (
    <div className="theme-toggle" aria-live="polite">
      <span>{ready ? (theme === "dark" ? "Dark" : "Light") : "Theme"}</span>
      <button
        type="button"
        onClick={() => {
          applyTheme(nextTheme);
          setTheme(nextTheme);
        }}
      >
        Cambiar a {nextTheme}
      </button>
    </div>
  );
}
