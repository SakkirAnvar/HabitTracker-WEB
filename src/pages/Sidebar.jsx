import { NavLink } from "react-router-dom";

const Sidebar = () => {
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
          className="w-5 h-5"
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
          className="w-5 h-5"
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
          className="w-5 h-5"
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
          className="w-5 h-5"
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
          className="w-5 h-5"
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
          className="w-5 h-5"
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
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.8"
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.4 15a1.7 1.7 0 00.34 1.88l.06.06-1.9 1.9-.06-.06a1.7 1.7 0 00-1.88-.34 1.7 1.7 0 00-1.03 1.56V20h-2.7v-.08a1.7 1.7 0 00-1.03-1.56 1.7 1.7 0 00-1.88.34l-.06.06-1.9-1.9.06-.06A1.7 1.7 0 007.8 15a1.7 1.7 0 00-1.56-1.03H6v-2.7h.08A1.7 1.7 0 007.64 10a1.7 1.7 0 00-.34-1.88l-.06-.06 1.9-1.9.06.06a1.7 1.7 0 001.88.34 1.7 1.7 0 001.03-1.56V5h2.7v.08a1.7 1.7 0 001.03 1.56 1.7 1.7 0 001.88-.34l.06-.06 1.9 1.9-.06.06a1.7 1.7 0 00-.34 1.88 1.7 1.7 0 001.56 1.03H20v2.7h-.08A1.7 1.7 0 0019.4 15z"
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
          className="w-5 h-5"
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

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 ${
      isActive
        ? "bg-[#EEF2FF] text-[#243DB8] font-semibold"
        : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#172554]"
    }`;

  return (
    <aside className="hidden md:flex w-64 lg:w-68 pt-4 h-[calc(100vh-2rem)] flex-col bg-base-100 border-r border-base-200">
      {/* ================= NAVIGATION ================= */}

      <div className="flex-1 px-4 overflow-y-auto">
        {/* Main navigation */}

        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path} className={linkClass}>
              <span className="shrink-0">{item.icon}</span>

              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Divider */}

        <div className="my-7 border-t border-base-200" />

        {/* Account */}

        <nav className="space-y-1">
          {accountItems.map((item) => (
            <NavLink key={item.path} to={item.path} className={linkClass}>
              <span className="shrink-0">{item.icon}</span>

              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* ================= BOTTOM PROMO ================= */}

      <div className="p-5">
        <div className="relative overflow-hidden rounded-2xl bg-[#E8F7F2] p-5 min-h-48">
          {/* Decorative circle */}

          <div className="absolute -bottom-12 -right-12 w-36 h-36 rounded-full bg-[#CDEFE4]" />

          <div className="absolute bottom-[-30px] left-[-30px] w-24 h-24 rounded-full bg-[#DDF3F1]" />

          {/* Plant */}

          <div className="absolute right-5 top-7 text-5xl">🌱</div>

          <div className="relative z-10">
            <h3 className="text-xl font-bold leading-tight text-[#172554]">
              Small
              <br />
              Steps
              <br />
              Big Changes
            </h3>

            <p className="mt-4 text-sm leading-5 text-[#64748B] max-w-36">
              Consistency creates a better you.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
