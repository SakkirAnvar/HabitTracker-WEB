import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../redux/userSlice";
import { AVEN_LOGO, BACKEND_URL } from "../utils/constants";
import { applyTheme } from "../utils/theme";

const DEFAULT_PROFILE_PHOTO =
  "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp";

const NavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.user.user);

  const profilePhoto = user?.profilePhoto
    ? `${BACKEND_URL}${user.profilePhoto}`
    : DEFAULT_PROFILE_PHOTO;

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();

      applyTheme("system");

      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="w-full">
      <div
        className="
          navbar
          min-h-16
          bg-base-100
          border-b
          border-base-300
          px-4
          shadow-sm
          lg:px-6
        "
      >
        {/* ================= LOGO ================= */}

        <div className="flex-1">
          <Link
            to="/dashboard"
            className="flex items-center rounded-lg transition-opacity hover:opacity-90"
          >
            <img
              src={AVEN_LOGO}
              alt="Aven"
              className="w-36.25 h-auto object-contain"
            />
          </Link>
        </div>

        {/* ================= RIGHT SECTION ================= */}

        <div className="ml-2 flex flex-none items-center gap-2">
          {/* ================= USER DROPDOWN ================= */}

          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="
                btn
                btn-ghost
                h-12
                gap-2
                rounded-xl
                px-2
                text-base-content
                hover:bg-base-200
              "
            >
              {/* Avatar */}

              <div className="avatar">
                <div className="w-9 rounded-full ring-1 ring-base-300">
                  <img src={profilePhoto} alt="Profile" />
                </div>
              </div>

              {/* User name */}

              <div className="hidden text-left md:block">
                <p className="text-sm font-semibold leading-tight text-base-content">
                  {user?.firstName} {user?.lastName}
                </p>

                <p className="text-xs text-base-content/60">View profile</p>
              </div>

              {/* Arrow */}

              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="h-4 w-4 text-base-content/60"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m6 9 6 6 6-6"
                />
              </svg>
            </div>

            {/* ================= DROPDOWN ================= */}

            <ul
              tabIndex={0}
              className="
                menu
                menu-sm
                dropdown-content
                z-50
                mt-3
                w-64
                rounded-2xl
                border
                border-base-300
                bg-base-100
                p-3
                text-base-content
                shadow-lg
              "
            >
              {/* ================= USER INFORMATION ================= */}

              <li className="mb-2">
                <div className="flex items-center gap-3 px-2 py-3 hover:bg-transparent">
                  <div className="avatar">
                    <div className="w-11 rounded-full ring-1 ring-base-300">
                      <img src={profilePhoto} alt="Profile" />
                    </div>
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-semibold text-base-content">
                      {user?.firstName} {user?.lastName}
                    </p>

                    <p className="truncate text-xs text-base-content/60">
                      {user?.emailId}
                    </p>
                  </div>
                </div>
              </li>

              <div className="divider my-1" />

              {/* ================= PROFILE ================= */}

              <li>
                <Link
                  to="/profile"
                  className="text-base-content hover:bg-base-200"
                >
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
                      d="M15.75 6.75a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a7.5 7.5 0 0115 0"
                    />
                  </svg>
                  Profile
                </Link>
              </li>

              {/* ================= SETTINGS ================= */}

              <li>
                <Link
                  to="/settings"
                  className="text-base-content hover:bg-base-200"
                >
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
                      d="M10.5 6h9M4.5 6h1.5M4.5 12h15M4.5 18h15M10.5 6a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zM12 12a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zM15 18a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                    />
                  </svg>
                  Settings
                </Link>
              </li>

              <div className="divider my-1" />

              {/* ================= LOGOUT ================= */}

              <li>
                <button
                  onClick={handleLogout}
                  className="
                    text-error
                    hover:bg-error/10
                  "
                >
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
                      d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 15l3-3m0 0l-3-3m3 3H3"
                    />
                  </svg>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
