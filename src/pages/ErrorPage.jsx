import { Link, useLocation } from "react-router-dom";
import { AVEN_LOGO } from "../utils/constants";

const ErrorPage = () => {
  const location = useLocation();

  const is404 = location.pathname !== "/error";

  return (
    <div className="flex min-h-screen items-center justify-center bg-base-200 px-4 text-base-content">
      <div className="w-full max-w-lg text-center">
        {/* ================= BRAND ================= */}

        <Link
          to="/"
          className="inline-flex items-center transition-opacity hover:opacity-90"
        >
          <img
            src={AVEN_LOGO}
            alt="Aven - Build your better days"
            className="w-36.25 h-auto object-contain"
          />
        </Link>

        {/* ================= ERROR ================= */}

        <div className="mt-12">
          <p className="text-7xl font-bold tracking-tight text-primary sm:text-8xl">
            {is404 ? "404" : "500"}
          </p>

          <h1 className="mt-5 text-2xl font-bold text-base-content sm:text-3xl">
            {is404 ? "Page not found" : "Something went wrong"}
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-base-content/60 sm:text-base">
            {is404
              ? "The page you're looking for doesn't exist or may have been moved."
              : "Something unexpected happened. Please try again in a moment."}
          </p>

          {/* ================= ACTIONS ================= */}

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="btn btn-outline"
            >
              Go Back
            </button>

            <Link to="/dashboard" className="btn btn-primary">
              Go to Dashboard
            </Link>
          </div>
        </div>

        {/* ================= FOOTER ================= */}

        <p className="mt-16 text-xs text-base-content/40">
          Aven · Build your better days.
        </p>
      </div>
    </div>
  );
};

export default ErrorPage;
