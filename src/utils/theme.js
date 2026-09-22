const THEME_KEY = "aven-theme";

export const getStoredTheme = () => {
  return localStorage.getItem(THEME_KEY) || "system";
};

export const applyTheme = (theme, save = false) => {
  const root = document.documentElement;

  if (theme === "system") {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    root.setAttribute("data-theme", isDark ? "dark" : "light");
  } else {
    root.setAttribute("data-theme", theme);
  }
  if (save) {
    localStorage.setItem(THEME_KEY, theme);
  }
};

export const initializeTheme = () => {
  const theme = getStoredTheme();
  applyTheme(theme);
};
