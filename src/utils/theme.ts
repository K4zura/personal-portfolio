export type Theme = "light" | "dark";

export interface ThemeConfig {
  theme: Theme;
  systemPreference: Theme;
}

export function getCurrentTheme(): Theme {
  if (typeof window === "undefined") {
    return "light"; // Default for SSR
  }

  const stored = localStorage.getItem("theme") as Theme | null;
  if (stored && (stored === "light" || stored === "dark")) {
    return stored;
  }

  // Check system preference
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function setTheme(theme: Theme): void {
  if (typeof window === "undefined") {
    return;
  }

  // Update DOM
  document.documentElement.setAttribute("data-theme", theme);

  // Persist to localStorage
  localStorage.setItem("theme", theme);

  // Dispatch custom event for components to listen to
  window.dispatchEvent(
    new CustomEvent("theme-changed", {
      detail: { theme },
    })
  );
}

export function toggleTheme(): Theme {
  const current = getCurrentTheme();
  const newTheme = current === "light" ? "dark" : "light";
  setTheme(newTheme);
  return newTheme;
}
