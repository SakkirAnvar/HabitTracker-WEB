import { Link } from "react-router-dom";
import { AVEN_LOGO } from "../utils/constants";

const Footer = () => {
  return (
    <footer className="w-full border-t border-base-300 bg-base-100">
      <div className="flex min-h-16 items-center justify-between gap-4 px-6 lg:px-8">
        {/* Left - Logo */}
        <Link
          to="/dashboard"
          className="shrink-0 transition-opacity hover:opacity-80"
          aria-label="Aven"
        >
          <img
            src={AVEN_LOGO}
            alt="Aven"
            className="h-7 w-auto object-contain"
          />
        </Link>

        {/* Center - Copyright */}
        <p className="text-xs text-base-content/50">
          © {new Date().getFullYear()} Aven. All rights reserved.
        </p>

        {/* Right - Tagline */}
        <p className="hidden text-xs font-medium text-primary/70 sm:block">
          Build your better days.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
