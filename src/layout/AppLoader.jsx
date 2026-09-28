import { useEffect, useState } from "react";
import { AVEN_LIGHT_LOGO, AVEN_DARK_LOGO } from "../utils/constants";

const AppLoading = () => {
  const [isDark, setIsDark] = useState(
    () => window.matchMedia("(prefers-color-scheme: dark)").matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleThemeChange = (event) => {
      setIsDark(event.matches);
    };

    mediaQuery.addEventListener("change", handleThemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleThemeChange);
    };
  }, []);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-base-100">
      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute
          left-1/2 top-1/2
          h-64 w-64
          -translate-x-1/2 -translate-y-1/2
          rounded-full
          bg-primary/[0.035]
          blur-3xl
        "
      />

      <div className="relative flex flex-col items-center">
        {/* Logo */}
        <div className="flex h-14 items-center justify-center sm:h-16">
          <img
            src={isDark ? AVEN_DARK_LOGO : AVEN_LIGHT_LOGO}
            alt="Aven"
            className="
              h-11 w-auto
              object-contain
              opacity-95
              sm:h-13
            "
          />
        </div>

        <div className="mt-9 h-px w-32 overflow-hidden rounded-full bg-base-300">
          <div
            className="
              h-full w-1/3
              animate-[loading_1.5s_ease-in-out_infinite]
              rounded-full
              bg-primary/70
            "
          />
        </div>

        <p className="mt-5 text-[11px] font-medium tracking-[0.2em] text-base-content/40">
          GETTING THINGS READY
        </p>
      </div>

      <p
        className="
          absolute bottom-7 left-1/2
          -translate-x-1/2
          whitespace-nowrap
          text-[10px]
          font-medium
          tracking-[0.18em]
          text-base-content/25
        "
      >
        BUILD YOUR BETTER DAYS
      </p>

      <style>
        {`
          @keyframes loading {
            0% {
              transform: translateX(-120%);
            }
            50% {
              transform: translateX(210%);
            }
            100% {
              transform: translateX(400%);
            }
          }
        `}
      </style>
    </main>
  );
};

export default AppLoading;
