import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { getDailyReminder } from "../utils/dailyReminder";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem("aven-sidebar-collapsed") === "true";
  });

  useEffect(() => {
    localStorage.setItem("aven-sidebar-collapsed", String(isCollapsed));
  }, [isCollapsed]);

  const dailyReminder = getDailyReminder();

  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.8"
          stroke="currentColor"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 12l9-9 9 9M5.25 10.5v9.75h5.25v-6h3v6h5.25V10.5"
          />
        </svg>
      ),
    },

    {
      name: "Habits",
      path: "/habits",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.8"
          stroke="currentColor"
          className="h-5 w-5"
        >
          <circle cx="12" cy="12" r="9" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 12l2.5 2.5L16 9"
          />
        </svg>
      ),
    },

    {
      name: "Goals",
      path: "/goals",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.8"
          stroke="currentColor"
          className="h-5 w-5"
        >
          <circle cx="12" cy="12" r="8.5" />
          <circle cx="12" cy="12" r="4.5" />
          <circle cx="12" cy="12" r="1" />
        </svg>
      ),
    },

    {
      name: "Analytics",
      path: "/analytics",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.8"
          stroke="currentColor"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 19.5V12M9.5 19.5V7M14.5 19.5V10M19.5 19.5V4.5"
          />
        </svg>
      ),
    },

    {
      name: "Journal",
      path: "/journal",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.8"
          stroke="currentColor"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 4.5h9a3 3 0 013 3V19.5H9a3 3 0 01-3-3V4.5z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 4.5v12a3 3 0 003 3"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10 8h5M10 11.5h5"
          />
        </svg>
      ),
    },
  ];

  const accountItems = [
    {
      name: "Profile",
      path: "/profile",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.8"
          stroke="currentColor"
          className="h-5 w-5"
        >
          <circle cx="12" cy="8" r="3.5" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 20a7 7 0 0114 0"
          />
        </svg>
      ),
    },

    {
      name: "Settings",
      path: "/settings",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          className="h-5 w-5"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M11.0175 19C10.6601 19 10.3552 18.7347 10.297 18.373C10.2434 18.0804 10.038 17.8413 9.76171 17.75C9.53658 17.6707 9.31645 17.5772 9.10261 17.47C8.84815 17.3365 8.54289 17.3565 8.30701 17.522C8.02156 17.7325 7.62943 17.6999 7.38076 17.445L6.41356 16.453C6.15326 16.186 6.11944 15.7651 6.33361 15.458C6.49878 15.2105 6.52257 14.8914 6.39601 14.621C6.31262 14.4332 6.23906 14.2409 6.17566 14.045C6.08485 13.7363 5.8342 13.5051 5.52533 13.445C5.15287 13.384 4.8779 13.0559 4.87501 12.669V11.428C4.87303 10.9821 5.18705 10.6007 5.61601 10.528C5.94143 10.4645 6.21316 10.2359 6.33751 9.921C6.37456 9.83233 6.41356 9.74433 6.45451 9.657C6.61989 9.33044 6.59705 8.93711 6.39503 8.633C6.1424 8.27288 6.18119 7.77809 6.48668 7.464L7.19746 6.735C7.54802 6.37532 8.1009 6.32877 8.50396 6.625L8.52638 6.641C8.82735 6.84876 9.21033 6.88639 9.54428 6.741C9.90155 6.60911 10.1649 6.29424 10.2375 5.912L10.2473 5.878C10.3275 5.37197 10.7536 5.00021 11.2535 5H12.1115C12.6248 4.99976 13.0629 5.38057 13.1469 5.9L13.1625 5.97C13.2314 6.33617 13.4811 6.63922 13.8216 6.77C14.1498 6.91447 14.5272 6.87674 14.822 6.67L14.8707 6.634C15.2842 6.32834 15.8528 6.37535 16.2133 6.745L16.8675 7.417C17.1954 7.75516 17.2366 8.28693 16.965 8.674C16.7522 8.99752 16.7251 9.41325 16.8938 9.763L16.9358 9.863C17.0724 10.2045 17.3681 10.452 17.7216 10.521C18.1837 10.5983 18.5235 11.0069 18.525 11.487V12.6C18.5249 13.0234 18.2263 13.3846 17.8191 13.454C17.4842 13.5199 17.2114 13.7686 17.1083 14.102C17.0628 14.2353 17.0121 14.3687 16.9562 14.502C16.8261 14.795 16.855 15.1364 17.0323 15.402C17.2662 15.7358 17.2299 16.1943 16.9465 16.485L16.0388 17.417C15.7792 17.6832 15.3698 17.7175 15.0716 17.498C14.8226 17.3235 14.5001 17.3043 14.2331 17.448C14.0428 17.5447 13.8475 17.6305 13.6481 17.705C13.3692 17.8037 13.1636 18.0485 13.1099 18.346C13.053 18.7203 12.7401 18.9972 12.3708 19H11.0175Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M13.9747 12C13.9747 13.2885 12.9563 14.333 11.7 14.333C10.4437 14.333 9.42533 13.2885 9.42533 12C9.42533 10.7115 10.4437 9.66699 11.7 9.66699C12.9563 9.66699 13.9747 10.7115 13.9747 12Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },

    {
      name: "Help & Support",
      path: "/help",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.8"
          stroke="currentColor"
          className="h-5 w-5"
        >
          <circle cx="12" cy="12" r="9" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.75 9a2.25 2.25 0 114.13 1.3c-.55.76-1.88 1.2-1.88 2.7"
          />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5h.01" />
        </svg>
      ),
    },
  ];

  const linkClass = ({ isActive }) => `
    group flex w-full items-center rounded-xl
    py-3
    transition-all duration-300 ease-in-out
    ${isCollapsed ? "justify-center px-0" : "gap-3 px-4"}
    ${
      isActive
        ? "bg-primary/10 font-semibold text-primary"
        : "text-base-content/60 hover:bg-base-200 hover:text-base-content"
    }
  `;

  const renderNavItems = (items) =>
    items.map((item) => (
      <NavLink
        key={item.path}
        to={item.path}
        className={linkClass}
        title={isCollapsed ? item.name : undefined}
        aria-label={isCollapsed ? item.name : undefined}
      >
        {/* Icon */}
        <span className="flex h-5 w-5 shrink-0 items-center justify-center">
          {item.icon}
        </span>

        {/* Label */}
        <span
          className={`
            overflow-hidden whitespace-nowrap
            transition-all duration-300 ease-in-out
            ${
              isCollapsed
                ? "w-0 translate-x-[-8px] opacity-0"
                : "w-auto translate-x-0 opacity-100"
            }
          `}
        >
          {item.name}
        </span>
      </NavLink>
    ));

  return (
    <aside
      className={`
        sticky top-16 hidden
        h-[calc(100vh-4rem)]
        shrink-0
        flex-col
        border-r border-base-300
        bg-base-100
        transition-[width] duration-300 ease-in-out
        md:flex
        ${isCollapsed ? "w-[72px]" : "w-64"}
      `}
    >
      {/* ================= SIDEBAR HEADER ================= */}

      <div
        className={`
          flex h-14 shrink-0 items-center border-b border-base-300
          px-3
          ${isCollapsed ? "justify-center" : "justify-end"}
        `}
      >
        <button
          type="button"
          onClick={() => setIsCollapsed((prev) => !prev)}
          className="
            flex h-9 w-9 items-center justify-center
            rounded-lg
            text-base-content/50
            transition-all duration-200
            hover:bg-base-200
            hover:text-base-content
          "
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.8"
            stroke="currentColor"
            className={`
              h-5 w-5
              transition-transform duration-300 ease-in-out
              ${isCollapsed ? "rotate-180" : "rotate-0"}
            `}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 6l-6 6 6 6"
            />
          </svg>
        </button>
      </div>

      {/* ================= NAVIGATION ================= */}

      <div className="flex-1 overflow-y-auto px-3 py-4">
        {/* Main navigation */}
        <nav className="space-y-1">{renderNavItems(navItems)}</nav>

        {/* Divider */}
        <div className="my-7 border-t border-base-300" />

        {/* Account */}
        <nav className="space-y-1">{renderNavItems(accountItems)}</nav>
      </div>
      {/* ================= DAILY REMINDER ================= */}

      <div
        className={`
    shrink-0 overflow-hidden
    px-3
    transition-all duration-300 ease-in-out
    ${isCollapsed ? "pb-4" : "pb-2"}
  `}
      >
        <div
          className={`
      relative w-full overflow-hidden rounded-2xl
      border border-primary/10 bg-primary/10
      transition-[height,border-radius] duration-300 ease-in-out
      ${isCollapsed ? "h-12 rounded-xl" : "h-40 rounded-2xl"}
    `}
        >
          {/* Decorative circles */}
          <div
            className={`
        absolute -bottom-10 -right-10
        h-32 w-32 rounded-full
        bg-primary/10
        transition-opacity duration-300
        ${isCollapsed ? "opacity-0" : "opacity-100"}
      `}
          />

          <div
            className={`
        absolute -bottom-8 -left-8
        h-24 w-24 rounded-full
        bg-secondary/10
        transition-opacity duration-300
        ${isCollapsed ? "opacity-0" : "opacity-100"}
      `}
          />

          {/* Sparkle Icon */}
          <div
            className={`
        absolute
        flex items-center justify-center
        rounded-full
        bg-primary/10
        text-primary
        transition-all duration-300 ease-in-out
        ${isCollapsed ? "inset-0 m-auto h-10 w-10" : "right-5 top-5 h-10 w-10"}
      `}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3l1.1 4.2L17 8.5l-3.9 1.3L12 14l-1.1-4.2L7 8.5l3.9-1.3L12 3z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 14l.6 2.1L21.5 17l-1.9.9L19 20l-.6-2.1-1.9-.9 1.9-.9L19 14z"
              />
            </svg>
          </div>

          {/* Content */}
          <div
            className={`
        absolute inset-0 p-5
        transition-all duration-300 ease-in-out
        ${
          isCollapsed
            ? "pointer-events-none translate-y-2 opacity-0"
            : "translate-y-0 opacity-100"
        }
      `}
          >
            <div className="relative z-10 max-w-[170px]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary/65">
                Daily Reminder
              </p>

              <p className="mt-3 text-[15px] font-semibold leading-5 text-base-content">
                {dailyReminder}
              </p>

              <p className="mt-3 text-xs text-base-content/50">
                Build your better days.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= COPYRIGHT ================= */}

      <div
        className={`
    shrink-0 overflow-hidden
    border-t border-base-300
    transition-all duration-300 ease-in-out
    ${isCollapsed ? "max-h-0 py-0 opacity-0" : "max-h-10 py-3 opacity-100"}
  `}
      >
        <p className="text-center text-[10px] text-base-content/40">
          © {new Date().getFullYear()} Aven. All rights reserved.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
