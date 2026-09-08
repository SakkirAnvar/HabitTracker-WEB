import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../redux/userSlice";

const NavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.user.user);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };


  return (
    <div className="w-full ">
      <div className="navbar bg-base-100  shadow-sm border border-base-200 px-4 lg:px-6">
        {/* ================= LOGO ================= */}

        <div className="flex-1">
          <Link to="/dashboard" className="flex items-center gap-2">
            {/* Logo */}
            <div className="w-10 h-10 rounded-full bg-[#9ADFCB] flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-6 h-6 text-[#243DB8]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21C7 18 4 14.5 4 10.5A4.5 4.5 0 018.5 6c1.4 0 2.7.65 3.5 1.7A4.5 4.5 0 0115.5 6 4.5 4.5 0 0120 10.5C20 14.5 17 18 12 21z"
                />
              </svg>
            </div>

            <span className="text-2xl font-bold text-[#172554]">Habitly</span>
          </Link>
        </div>

        {/* ================= RIGHT SECTION ================= */}

        <div className="flex-none flex items-center gap-2 ml-2">
          {/* Search */}

          <div className="hidden xl:flex items-center">
            <label className="input input-bordered w-64 h-11 rounded-xl bg-base-100 border-base-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-5 h-5 text-[#64748B]"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-4-4" />
              </svg>

              <input type="search" placeholder="Search users..." />
            </label>
          </div>

          {/* Notifications */}

          <button type="button" className="btn btn-ghost btn-circle relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.8"
              stroke="currentColor"
              className="w-6 h-6 text-[#475569]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9a6 6 0 00-12 0v.75a8.967 8.967 0 01-2.31 6.022c1.733.64 3.56 1.08 5.454 1.31m5.713 0a24.255 24.255 0 01-5.713 0m5.713 0a3 3 0 11-5.713 0"
              />
            </svg>

            {/* Notification dot */}
            <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white" />
          </button>

          {/* ================= USER DROPDOWN ================= */}

          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost h-12 px-2 rounded-xl gap-2"
            >
              {/* Avatar */}

              <div className="avatar">
                <div className="w-9 rounded-full ring-1 ring-base-300">
                  <img
                    src={
                      user?.photoUrl ||
                      "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                    }
                    alt="Profile"
                  />
                </div>
              </div>

              {/* User name */}

              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-[#172554] leading-tight">
                  {user?.firstName} {user?.lastName}
                </p>

                <p className="text-xs text-[#64748B]">View profile</p>
              </div>

              {/* Arrow */}

              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-4 h-4 text-[#64748B]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m6 9 6 6 6-6"
                />
              </svg>
            </div>

            {/* Dropdown */}

            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-2xl z-50 mt-3 w-64 p-3 shadow-lg border border-base-200"
            >
              {/* User information */}

              <li className="mb-2">
                <div className="flex items-center gap-3 px-2 py-3 hover:bg-transparent">
                  <div className="avatar">
                    <div className="w-11 rounded-full">
                      <img
                        src={
                          user?.photoUrl ||
                          "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                        }
                        alt="Profile"
                      />
                    </div>
                  </div>

                  <div>
                    <p className="font-semibold text-[#172554]">
                      {user?.firstName} {user?.lastName}
                    </p>

                    <p className="text-xs text-[#64748B]">{user?.emailId}</p>
                  </div>
                </div>
              </li>

              <div className="divider my-1" />

              {/* Profile */}

              <li>
                <Link to="/profile">
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
                      d="M15.75 6.75a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a7.5 7.5 0 0115 0"
                    />
                  </svg>
                  Profile
                </Link>
              </li>

              {/* Settings */}

              <li>
                <Link to="/settings">
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
                      d="M10.5 6h9M4.5 6h1.5M4.5 12h15M4.5 18h15M10.5 6a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zM12 12a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zM15 18a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                    />
                  </svg>
                  Settings
                </Link>
              </li>

              <div className="divider my-1" />

              {/* Logout */}

              <li>
                <button
                  onClick={handleLogout}
                  className="text-red-500 hover:bg-red-50"
                >
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
