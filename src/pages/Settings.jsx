import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changePassword } from "../redux/userSlice";
import { applyTheme, getStoredTheme } from "../utils/theme";

const Settings = () => {
  const dispatch = useDispatch();

  const { status, error } = useSelector((store) => store.user);

  const [theme, setTheme] = useState(() => getStoredTheme());

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
  const [formError, setFormError] = useState("");

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
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
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Settings</h1>

        <p className="mt-1 text-sm text-base-content/60">
          Manage your account and security preferences.
        </p>
      </div>

      {/* Change Password */}
      <section className="rounded-xl border border-base-300 bg-base-100 shadow-sm">
        <div className="border-b border-base-300 p-5">
          <h2 className="text-lg font-semibold">Change Password</h2>

          <p className="mt-1 text-sm text-base-content/60">
            Update your password to keep your account secure.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-5">
          {/* Current Password */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Current Password</span>
            </label>

            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              className="input input-bordered w-full"
              autoComplete="current-password"
            />
          </div>

          {/* New Password */}
          <div>
            <label className="label">
              <span className="label-text font-medium">New Password</span>
            </label>

            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="input input-bordered w-full"
              autoComplete="new-password"
            />

            <p className="mt-1 text-xs text-base-content/50">
              Minimum 6 characters.
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="label">
              <span className="label-text font-medium">
                Confirm New Password
              </span>
            </label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="input input-bordered w-full"
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
          <div className="flex justify-end">
            <button
              type="submit"
              className="btn btn-primary"
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

      {/* Appearance */}
      <section className="rounded-2xl border border-base-300 bg-base-100 shadow-sm">
        <div className="border-b border-base-300 p-5">
          <h2 className="text-lg font-semibold">Appearance</h2>

          <p className="mt-1 text-sm text-base-content/60">
            Customize how Aven looks on your device.
          </p>
        </div>

        <div className="p-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {/* Light */}
            <button
              type="button"
              onClick={() => handleThemeChange("light")}
              className={`group rounded-xl border p-4 text-left transition-all ${
                theme === "light"
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : "border-base-300 hover:border-primary/40 hover:bg-base-200"
              }`}
            >
              <div className="mb-4 overflow-hidden rounded-lg border border-base-300 bg-base-200">
                <div className="flex h-20 flex-col gap-2 p-3">
                  <div className="h-2 w-1/3 rounded bg-base-300" />
                  <div className="h-2 w-2/3 rounded bg-base-300" />

                  <div className="mt-1 flex gap-2">
                    <div className="h-7 flex-1 rounded bg-base-100 shadow-sm" />
                    <div className="h-7 flex-1 rounded bg-base-100 shadow-sm" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">Light</p>
                  <p className="mt-0.5 text-xs text-base-content/60">
                    Clean and bright
                  </p>
                </div>

                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                    theme === "light"
                      ? "border-primary bg-primary text-primary-content"
                      : "border-base-300"
                  }`}
                >
                  {theme === "light" && <span className="text-xs">✓</span>}
                </span>
              </div>
            </button>

            {/* Dark */}
            <button
              type="button"
              onClick={() => handleThemeChange("dark")}
              className={`group rounded-xl border p-4 text-left transition-all ${
                theme === "dark"
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : "border-base-300 hover:border-primary/40 hover:bg-base-200"
              }`}
            >
              <div className="mb-4 overflow-hidden rounded-lg border border-base-300 bg-neutral">
                <div className="flex h-20 flex-col gap-2 p-3">
                  <div className="h-2 w-1/3 rounded bg-neutral-content/20" />
                  <div className="h-2 w-2/3 rounded bg-neutral-content/20" />

                  <div className="mt-1 flex gap-2">
                    <div className="h-7 flex-1 rounded bg-neutral-content/10" />
                    <div className="h-7 flex-1 rounded bg-neutral-content/10" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">Dark</p>
                  <p className="mt-0.5 text-xs text-base-content/60">
                    Easy on the eyes
                  </p>
                </div>

                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                    theme === "dark"
                      ? "border-primary bg-primary text-primary-content"
                      : "border-base-300"
                  }`}
                >
                  {theme === "dark" && <span className="text-xs">✓</span>}
                </span>
              </div>
            </button>

            {/* System */}
            <button
              type="button"
              onClick={() => handleThemeChange("system")}
              className={`group rounded-xl border p-4 text-left transition-all ${
                theme === "system"
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : "border-base-300 hover:border-primary/40 hover:bg-base-200"
              }`}
            >
              <div className="mb-4 overflow-hidden rounded-lg border border-base-300 bg-base-200">
                <div className="flex h-20 items-center justify-center">
                  <div className="flex h-10 w-16 overflow-hidden rounded-md border border-base-300">
                    <div className="w-1/2 bg-base-100" />
                    <div className="w-1/2 bg-neutral" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">System</p>
                  <p className="mt-0.5 text-xs text-base-content/60">
                    Follow device settings
                  </p>
                </div>

                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                    theme === "system"
                      ? "border-primary bg-primary text-primary-content"
                      : "border-base-300"
                  }`}
                >
                  {theme === "system" && <span className="text-xs">✓</span>}
                </span>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Account Security */}
      <section className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm">
        <h2 className="text-lg font-semibold">Account Security</h2>

        <p className="mt-1 text-sm text-base-content/60">
          Keep your password private and avoid reusing it across different
          accounts.
        </p>

        <div className="mt-4 rounded-lg bg-base-200 p-4">
          <p className="text-sm font-medium">🔐 Password security</p>

          <p className="mt-1 text-xs text-base-content/60">
            Use a strong password that is difficult for others to guess.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Settings;
