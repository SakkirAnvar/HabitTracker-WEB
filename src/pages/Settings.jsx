import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changePassword, changeTheme } from "../redux/userSlice";
import { applyTheme } from "../utils/theme";

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
      setTheme(newTheme);
      applyTheme(newTheme);

      await dispatch(changeTheme(newTheme)).unwrap();
    } catch (err) {
      setTheme(previousTheme);
      applyTheme(previousTheme);
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

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 pb-8">
      {/* =========================================
          HEADER
      ========================================= */}
      <div>
        <h1 className="text-2xl font-bold text-base-content sm:text-3xl">
          Settings
        </h1>

        <p className="mt-1 text-sm text-base-content/60">
          Manage your account and security preferences.
        </p>
      </div>

      {/* =========================================
          CHANGE PASSWORD
      ========================================= */}
      <section className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm">
        {/* Header */}
        <div className="border-b border-base-300 px-5 py-5 sm:px-6">
          <h2 className="text-lg font-semibold text-base-content">
            Change Password
          </h2>

          <p className="mt-1 text-sm text-base-content/60">
            Update your password to keep your account secure.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-6">
          {/* Current Password */}
          <div>
            <label className="label mb-1">
              <span className="label-text font-medium text-base-content">
                Current Password
              </span>
            </label>

            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              className="
                input
                w-full
                bg-base-100
                text-base-content
                placeholder:text-base-content/40
                border-base-300
                focus:border-primary
                focus:outline-none
              "
              autoComplete="current-password"
            />
          </div>

          {/* New Password */}
          <div>
            <label className="label mb-1">
              <span className="label-text font-medium text-base-content">
                New Password
              </span>
            </label>

            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="
                input
                w-full
                bg-base-100
                text-base-content
                placeholder:text-base-content/40
                border-base-300
                focus:border-primary
                focus:outline-none
              "
              autoComplete="new-password"
            />

            <p className="mt-1.5 text-xs text-base-content/50">
              Minimum 6 characters.
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="label mb-1">
              <span className="label-text font-medium text-base-content">
                Confirm New Password
              </span>
            </label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="
                input
                w-full
                bg-base-100
                text-base-content
                placeholder:text-base-content/40
                border-base-300
                focus:border-primary
                focus:outline-none
              "
              autoComplete="new-password"
            />
          </div>

          {/* Error */}
          {(formError || error) && (
            <div className="alert alert-error">
              <span>{formError || error}</span>
            </div>
          )}

          {/* Success */}
          {successMessage && (
            <div className="alert alert-success">
              <span>{successMessage}</span>
            </div>
          )}

          {/* Submit */}
          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="btn btn-primary min-w-40"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-sm" />
                  Updating...
                </>
              ) : (
                "Change Password"
              )}
            </button>
          </div>
        </form>
      </section>

      {/* =========================================
          APPEARANCE
      ========================================= */}
      <section className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm">
        {/* Header */}
        <div className="border-b border-base-300 px-5 py-5 sm:px-6">
          <h2 className="text-lg font-semibold text-base-content">
            Appearance
          </h2>

          <p className="mt-1 text-sm text-base-content/60">
            Customize how Aven looks on your device.
          </p>
        </div>

        {/* Theme Options */}
        <div className="p-5 sm:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* =====================================
                LIGHT
            ===================================== */}
            <button
              type="button"
              onClick={() => handleThemeChange("light")}
              className={`
                group rounded-2xl border p-4 text-left
                transition-all duration-200
                ${
                  theme === "light"
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-base-300 hover:border-primary/40 hover:bg-base-200"
                }
              `}
            >
              {/* Preview */}
              <div className="mb-4 overflow-hidden rounded-xl border border-[#dce8e4] bg-[#f7f9f8]">
                <div className="h-20 p-3">
                  <div className="mb-2 h-2 w-1/3 rounded-full bg-[#dce8e4]" />
                  <div className="h-2 w-2/3 rounded-full bg-[#dce8e4]" />

                  <div className="mt-3 flex gap-2">
                    <div className="h-7 flex-1 rounded-md bg-white shadow-sm" />
                    <div className="h-7 flex-1 rounded-md bg-white shadow-sm" />
                  </div>
                </div>
              </div>

              {/* Label */}
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-base-content">Light</p>

                  <p className="mt-0.5 text-xs text-base-content/60">
                    Clean and bright
                  </p>
                </div>

                <span
                  className={`
                    flex h-5 w-5 shrink-0 items-center justify-center
                    rounded-full border
                    ${
                      theme === "light"
                        ? "border-primary bg-primary text-primary-content"
                        : "border-base-300"
                    }
                  `}
                >
                  {theme === "light" && (
                    <span className="text-xs font-bold">✓</span>
                  )}
                </span>
              </div>
            </button>

            {/* =====================================
                DARK
            ===================================== */}
            <button
              type="button"
              onClick={() => handleThemeChange("dark")}
              className={`
                group rounded-2xl border p-4 text-left
                transition-all duration-200
                ${
                  theme === "dark"
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-base-300 hover:border-primary/40 hover:bg-base-200"
                }
              `}
            >
              {/* Preview */}
              <div className="mb-4 overflow-hidden rounded-xl border border-[#263b35] bg-[#071512]">
                <div className="h-20 p-3">
                  <div className="mb-2 h-2 w-1/3 rounded-full bg-[#263b35]" />
                  <div className="h-2 w-2/3 rounded-full bg-[#263b35]" />

                  <div className="mt-3 flex gap-2">
                    <div className="h-7 flex-1 rounded-md bg-[#0d211c]" />
                    <div className="h-7 flex-1 rounded-md bg-[#0d211c]" />
                  </div>
                </div>
              </div>

              {/* Label */}
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-base-content">Dark</p>

                  <p className="mt-0.5 text-xs text-base-content/60">
                    Easy on the eyes
                  </p>
                </div>

                <span
                  className={`
                    flex h-5 w-5 shrink-0 items-center justify-center
                    rounded-full border
                    ${
                      theme === "dark"
                        ? "border-primary bg-primary text-primary-content"
                        : "border-base-300"
                    }
                  `}
                >
                  {theme === "dark" && (
                    <span className="text-xs font-bold">✓</span>
                  )}
                </span>
              </div>
            </button>

            {/* =====================================
                SYSTEM
            ===================================== */}
            <button
              type="button"
              onClick={() => handleThemeChange("system")}
              className={`
                group rounded-2xl border p-4 text-left
                transition-all duration-200
                ${
                  theme === "system"
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-base-300 hover:border-primary/40 hover:bg-base-200"
                }
              `}
            >
              {/* Preview */}
              <div className="mb-4 overflow-hidden rounded-xl border border-base-300 bg-base-200">
                <div className="flex h-20 items-center justify-center">
                  <div className="flex h-10 w-16 overflow-hidden rounded-md border border-base-300">
                    <div className="w-1/2 bg-[#f7f9f8]" />
                    <div className="w-1/2 bg-[#0d211c]" />
                  </div>
                </div>
              </div>

              {/* Label */}
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-base-content">System</p>

                  <p className="mt-0.5 text-xs text-base-content/60">
                    Follow device settings
                  </p>
                </div>

                <span
                  className={`
                    flex h-5 w-5 shrink-0 items-center justify-center
                    rounded-full border
                    ${
                      theme === "system"
                        ? "border-primary bg-primary text-primary-content"
                        : "border-base-300"
                    }
                  `}
                >
                  {theme === "system" && (
                    <span className="text-xs font-bold">✓</span>
                  )}
                </span>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* =========================================
          ACCOUNT SECURITY
      ========================================= */}
      <section className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold text-base-content">
          Account Security
        </h2>

        <p className="mt-1 text-sm text-base-content/60">
          Keep your password private and avoid reusing it across different
          accounts.
        </p>

        <div className="mt-4 rounded-xl border border-base-300 bg-base-200 p-4">
          <p className="text-sm font-medium text-base-content">
            🔐 Password security
          </p>

          <p className="mt-1 text-xs leading-5 text-base-content/60">
            Use a strong password that is difficult for others to guess.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Settings;
