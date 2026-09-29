const THEME_KEY = "aven-theme";

export const getStoredTheme = () => {
  return localStorage.getItem(THEME_KEY) || "light";
};

export const applyTheme = (theme, save = false) => {
  const root = document.documentElement;

  if (theme === "system") {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    root.setAttribute("data-theme", isDark ? "aven-dark" : "aven-light");
  } else {
    root.setAttribute(
      "data-theme",
      theme === "dark" ? "aven-dark" : "aven-light",
    );
  }

  if (save) {
    localStorage.setItem(THEME_KEY, theme);
  }
};

export const initializeTheme = () => {
  const theme = getStoredTheme();
  applyTheme(theme);
};
