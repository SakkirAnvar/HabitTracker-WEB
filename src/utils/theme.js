const getSystemTheme = () => {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export const applyTheme = (theme) => {
  const root = document.documentElement;

  if (theme === "system") {
    root.setAttribute("data-theme", getSystemTheme());
  } else {
    root.setAttribute("data-theme", theme);
  }
};