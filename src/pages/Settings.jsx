import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changePassword } from "../redux/userSlice";

const Settings = () => {
  const dispatch = useDispatch();

  const { status, error } = useSelector((store) => store.user);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
  const [formError, setFormError] = useState("");

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
              <span className="label-text font-medium">
                Current Password
              </span>
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