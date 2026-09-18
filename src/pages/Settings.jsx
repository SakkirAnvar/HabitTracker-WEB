import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SettingsShimmer } from "../layout/Shimmer";
import { changePassword, changeTheme } from "../redux/userSlice";
import { applyTheme } from "../utils/theme";
import AlertMessage from "../layout/AlertMessage";

const Settings = () => {
  const dispatch = useDispatch();

  const { user, status, error } = useSelector((store) => store.user);

  const [theme, setTheme] = useState(user?.theme || "system");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
  const [formError, setFormError] = useState("");

  const handleThemeChange = async (newTheme) => {
    const previousTheme = theme;

    try {
      setFormError("");
      setSuccessMessage("");

      setTheme(newTheme);
      applyTheme(newTheme);

      await dispatch(changeTheme(newTheme)).unwrap();
    } catch (err) {
      setTheme(previousTheme);
      applyTheme(previousTheme);

      setFormError(
        typeof err === "string"
          ? err
          : err?.message || "Failed to update theme.",
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccessMessage("");
    setFormError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setFormError("Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 6) {
      setFormError("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setFormError("New passwords do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      setFormError(
        "New password must be different from your current password.",
      );
      return;
    }

    try {
      await dispatch(
        changePassword({
          currentPassword,
          newPassword,
        }),
      ).unwrap();

      setSuccessMessage("Password changed successfully.");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setFormError(
        typeof err === "string"
          ? err
          : err?.message || "Failed to change password.",
      );
    }
  };

  const isLoading = status === "loading";
  if (!user && status === "loading") {
    return <SettingsShimmer />;
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 pb-8">
      <section>
        {/* Breadcrumb */}

        <div className="mb-3 flex items-center gap-2 text-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-base-content/35"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>

          <span className="font-medium text-base-content/45">Account</span>

          <span className="text-base-content/20">/</span>

          <span className="font-medium text-primary">Settings</span>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-primary/10 bg-primary/5 px-6 py-7 sm:px-8 sm:py-8">
          <div className="relative z-10 max-w-2xl">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              Personalize Aven
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-base-content sm:text-4xl">
              Settings
            </h1>

            <p className="mt-2 text-sm leading-6 text-base-content/55 sm:text-base">
              Manage your account, security, and Aven preferences.
            </p>
          </div>

          {/* Decorative leaves */}

          <div className="pointer-events-none absolute -right-8 -top-10 opacity-20">
            <div className="relative h-36 w-36">
              <span className="absolute right-6 top-2 h-20 w-10 rotate-[30deg] rounded-full bg-secondary" />
              <span className="absolute right-12 top-14 h-24 w-12 -rotate-[38deg] rounded-full bg-primary" />
              <span className="absolute bottom-0 right-3 h-16 w-8 rotate-[52deg] rounded-full bg-secondary" />
            </div>
          </div>
        </div>
      </section>

      {(formError || error) && (
        <AlertMessage
          type="error"
          message={formError || error}
          duration={3000}
          onClose={() => {
            setFormError("");
          }}
        />
      )}

      <section className="overflow-hidden rounded-3xl border border-base-300 bg-base-100 shadow-sm">
        {/* Section Header */}

        <div className="border-b border-base-300 px-6 py-5 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-lg">
              🔐
            </div>

            <div>
              <h2 className="text-lg font-semibold text-base-content">
                Account
              </h2>

              <p className="mt-0.5 text-sm text-base-content/50">
                Update your password and manage your account security.
              </p>
            </div>
          </div>
        </div>

        {/* Password Form */}

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-6 sm:px-8">
            <div className="mb-6">
              <h3 className="text-base font-semibold text-base-content">
                Change Password
              </h3>

              <p className="mt-1 text-sm text-base-content/50">
                Keep your account secure with a strong password.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Current Password */}

              <div>
                <label
                  htmlFor="currentPassword"
                  className="mb-2 block text-sm font-semibold text-base-content"
                >
                  Current Password
                </label>

                <input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value);
                    setFormError("");
                    setSuccessMessage("");
                  }}
                  placeholder="Enter current password"
                  autoComplete="current-password"
                  className="input h-11 w-full rounded-xl border-base-300 bg-base-100 text-sm text-base-content placeholder:text-base-content/35 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
                />
              </div>

              {/* New Password */}

              <div>
                <label
                  htmlFor="newPassword"
                  className="mb-2 block text-sm font-semibold text-base-content"
                >
                  New Password
                </label>

                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setFormError("");
                    setSuccessMessage("");
                  }}
                  placeholder="Enter new password"
                  autoComplete="new-password"
                  className="input h-11 w-full rounded-xl border-base-300 bg-base-100 text-sm text-base-content placeholder:text-base-content/35 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
                />

                <p className="mt-2 text-xs text-base-content/40">
                  Minimum 6 characters.
                </p>
              </div>

              {/* Confirm Password */}

              <div className="md:col-span-2">
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-semibold text-base-content"
                >
                  Confirm New Password
                </label>

                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setFormError("");
                    setSuccessMessage("");
                  }}
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                  className="input h-11 w-full rounded-xl border-base-300 bg-base-100 text-sm text-base-content placeholder:text-base-content/35 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
                />
              </div>
            </div>

            {/* Success */}

            {successMessage && (
              <div className="mt-5">
                <AlertMessage
                  type="success"
                  message={successMessage}
                  duration={3000}
                  onClose={() => setSuccessMessage("")}
                />
              </div>
            )}
          </div>

          {/* Action */}

          <div className="flex justify-end border-t border-base-300 px-6 py-4 sm:px-8">
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary min-w-40 rounded-xl px-5"
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-sm" />
                  Updating...
                </>
              ) : (
                <>
                  <span>🔒</span>
                  Change Password
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      <section className="overflow-hidden rounded-3xl border border-base-300 bg-base-100 shadow-sm">
        {/* Header */}

        <div className="border-b border-base-300 px-6 py-5 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10 text-lg">
              🎨
            </div>

            <div>
              <h2 className="text-lg font-semibold text-base-content">
                Appearance
              </h2>

              <p className="mt-0.5 text-sm text-base-content/50">
                Customize how Aven looks on your device.
              </p>
            </div>
          </div>
        </div>

        {/* Theme Options */}

        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <button
              type="button"
              onClick={() => handleThemeChange("light")}
              className={`group rounded-2xl border p-4 text-left transition-all duration-200 ${
                theme === "light"
                  ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                  : "border-base-300 hover:border-primary/30 hover:bg-base-200/40"
              }`}
            >
              {/* Preview */}

              <div className="mb-4 overflow-hidden rounded-xl border border-base-300 bg-[#f7f9f8]">
                <div className="h-24 p-3">
                  <div className="h-2 w-1/3 rounded-full bg-[#dce8e4]" />

                  <div className="mt-2 h-2 w-2/3 rounded-full bg-[#dce8e4]" />

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div className="h-8 rounded-lg bg-white shadow-sm" />
                    <div className="h-8 rounded-lg bg-white shadow-sm" />
                  </div>
                </div>
              </div>

              {/* Label */}

              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-base-content">Light</p>

                  <p className="mt-0.5 text-xs text-base-content/50">
                    Clean and bright
                  </p>
                </div>

                <ThemeIndicator selected={theme === "light"} />
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleThemeChange("dark")}
              className={`group rounded-2xl border p-4 text-left transition-all duration-200 ${
                theme === "dark"
                  ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                  : "border-base-300 hover:border-primary/30 hover:bg-base-200/40"
              }`}
            >
              <div className="mb-4 overflow-hidden rounded-xl border border-[#263b35] bg-[#071512]">
                <div className="h-24 p-3">
                  <div className="h-2 w-1/3 rounded-full bg-[#263b35]" />

                  <div className="mt-2 h-2 w-2/3 rounded-full bg-[#263b35]" />

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div className="h-8 rounded-lg bg-[#0d211c]" />
                    <div className="h-8 rounded-lg bg-[#0d211c]" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-base-content">Dark</p>

                  <p className="mt-0.5 text-xs text-base-content/50">
                    Easy on the eyes
                  </p>
                </div>

                <ThemeIndicator selected={theme === "dark"} />
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleThemeChange("system")}
              className={`group rounded-2xl border p-4 text-left transition-all duration-200 ${
                theme === "system"
                  ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                  : "border-base-300 hover:border-primary/30 hover:bg-base-200/40"
              }`}
            >
              <div className="mb-4 overflow-hidden rounded-xl border border-base-300 bg-base-200">
                <div className="flex h-24 items-center justify-center">
                  <div className="flex h-11 w-20 overflow-hidden rounded-lg border border-base-300">
                    <div className="w-1/2 bg-[#f7f9f8]" />
                    <div className="w-1/2 bg-[#0d211c]" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-base-content">System</p>

                  <p className="mt-0.5 text-xs text-base-content/50">
                    Follow device settings
                  </p>
                </div>

                <ThemeIndicator selected={theme === "system"} />
              </div>
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-lg">
            🛡️
          </div>

          <div>
            <h2 className="text-lg font-semibold text-base-content">
              Account Security
            </h2>

            <p className="mt-0.5 text-sm text-base-content/50">
              Keep your password private and protect your account.
            </p>
          </div>
        </div>

        {/* Security Info */}

        <div className="mt-5 flex items-start gap-4 rounded-2xl border border-primary/10 bg-primary/5 p-4 sm:p-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-base-100 text-lg shadow-sm">
            🔐
          </div>

          <div>
            <p className="text-sm font-semibold text-base-content">
              Password security
            </p>

            <p className="mt-1 max-w-2xl text-xs leading-5 text-base-content/55 sm:text-sm">
              Use a strong password that is difficult for others to guess and
              avoid reusing passwords across accounts.
            </p>
          </div>
        </div>
      </section>

      <div className="pb-2 text-center">
        <p className="text-xs text-base-content/35">
          Aven · Build your better days.
        </p>
      </div>
    </div>
  );
};

const ThemeIndicator = ({ selected }) => {
  return (
    <span
      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
        selected
          ? "border-primary bg-primary text-primary-content"
          : "border-base-300 bg-base-100"
      }`}
    >
      {selected && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3.5 w-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="3"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m5 12 4 4L19 6"
          />
        </svg>
      )}
    </span>
  );
};

export default Settings;
