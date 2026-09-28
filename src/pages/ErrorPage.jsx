import { Link, useLocation } from "react-router-dom";

const ErrorPage = () => {
  const location = useLocation();

  const is404 = location.pathname !== "/error";

  const content = is404
    ? {
        code: "404",
        eyebrow: "Page not found",
        title: "This page has moved on.",
        description:
          "The page you're looking for doesn't exist or may have been moved somewhere else.",
      }
    : {
        code: "500",
        eyebrow: "Unexpected error",
        title: "Something didn't go as planned.",
        description:
          "We ran into an unexpected problem. Please try again or head back to your dashboard.",
      };

  return (
    <div className="">
      {/* Subtle brand accent */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-1/2
          top-0
          h-[420px]
          w-[720px]
          -translate-x-1/2
          rounded-full
          bg-primary/[0.035]
          blur-[120px]
        "
      />

      <div className="relative flex min-h-screen flex-col">
        {/* ================= MAIN ================= */}

        <main className="flex flex-1 items-center justify-center px-5 py-12 sm:px-8">
          <section className="w-full max-w-2xl">
            {/* Error code */}

            <div className="overflow-hidden">
              <p
                aria-hidden="true"
                className="
                  select-none
                  text-[clamp(7rem,22vw,15rem)]
                  font-black
                  leading-[0.75]
                  tracking-[-0.09em]
                  text-base-content/[0.045]
                "
              >
                {content.code}
              </p>
            </div>

            {/* Content */}

            <div className="relative -mt-5 max-w-xl sm:-mt-8">
              {/* Eyebrow */}

              <div className="mb-5 flex items-center gap-3">
                <span className="h-px w-8 bg-primary/60" />

                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
                  {content.eyebrow}
                </span>
              </div>

              {/* Heading */}

              <h1
                className="
                  max-w-lg
                  text-3xl
                  font-bold
                  leading-[1.12]
                  tracking-[-0.035em]
                  sm:text-4xl
                  lg:text-5xl
                "
              >
                {content.title}
              </h1>

              {/* Description */}

              <p className="mt-5 max-w-md text-sm leading-6 text-base-content/55 sm:text-base">
                {content.description}
              </p>

              {/* Actions */}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/dashboard"
                  className="
                    btn
                    btn-primary
                    h-11
                    min-h-11
                    rounded-xl
                    px-6
                    font-semibold
                    shadow-sm
                    transition-all
                    duration-200
                    hover:-translate-y-0.5
                    hover:shadow-md
                  "
                >
                  Go to dashboard
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-4 w-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 12h14m-6-6 6 6-6 6"
                    />
                  </svg>
                </Link>

                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="
                    btn
                    btn-ghost
                    h-11
                    min-h-11
                    rounded-xl
                    px-5
                    font-medium
                    text-base-content/60
                    hover:bg-base-200
                    hover:text-base-content
                  "
                >
                  Go back
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default ErrorPage;
