import { useEffect } from "react";

const AuthTheme = ({ children }) => {
  useEffect(() => {
    const root = document.documentElement;

    // Store the current theme state
    const previousTheme = root.getAttribute("data-theme");

    // Force light theme for auth pages
    root.setAttribute("data-theme", "light");

    return () => {
      // Restore previous theme when leaving auth pages
      if (previousTheme) {
        root.setAttribute("data-theme", previousTheme);
      } else {
        root.removeAttribute("data-theme");
      }
    };
  }, []);

  return children;
};

export default AuthTheme;
