import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { updateProfile } from "../redux/userSlice";

const Profile = () => {
  const dispatch = useDispatch();

  const { user, status, error } = useSelector((store) => store.user);

  const [firstName, setFirstName] = useState(user?.firstName || "");

  const [lastName, setLastName] = useState(user?.lastName || "");

  const [successMessage, setSuccessMessage] = useState("");
  const [formError, setFormError] = useState("");

  if (!user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <p className="text-base-content/60">Unable to load profile.</p>

        <p className="text-sm text-base-content/40">
          User information is not available.
        </p>
      </div>
    );
  }


  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccessMessage("");
    setFormError("");

    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();

    if (!trimmedFirstName || !trimmedLastName) {
      setFormError("First name and last name are required.");
      return;
    }

    try {
      await dispatch(
        updateProfile({
          firstName: trimmedFirstName,
          lastName: trimmedLastName,
        }),
      ).unwrap();

      setSuccessMessage("Profile updated successfully.");
    } catch (err) {
      setFormError(
        typeof err === "string"
          ? err
          : err?.message || "Failed to update profile.",
      );
    }
  };

  const isUpdating = status === "loading";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Profile</h1>

        <p className="mt-1 text-sm text-base-content/60">
          Manage your personal information.
        </p>
      </div>

      {/* Profile Card */}
      <div className="rounded-xl border border-base-300 bg-base-100 shadow-sm">
        <div className="border-b border-base-300 p-5">
          <h2 className="text-lg font-semibold">Personal Information</h2>

          <p className="mt-1 text-sm text-base-content/60">
            Update the name associated with your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-5">
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

          {/* Names */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="firstName"
                className="mb-2 block text-sm font-medium"
              >
                First Name
              </label>

              <input
                id="firstName"
                name="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="input input-bordered w-full"
                maxLength={50}
                required
              />
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="mb-2 block text-sm font-medium"
              >
                Last Name
              </label>

              <input
                id="lastName"
                name="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="input input-bordered w-full"
                maxLength={50}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              Email
            </label>

            <input
              id="email"
              type="email"
              value={user.emailId || ""}
              className="input input-bordered w-full bg-base-200"
              disabled
            />

            <p className="mt-1 text-xs text-base-content/50">
              Your email address cannot be changed here.
            </p>
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <span className="loading loading-spinner loading-sm" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Account Information */}
      <div className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm">
        <h2 className="text-lg font-semibold">Account Information</h2>

        <div className="mt-4 space-y-3 text-sm">
          <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
            <span className="text-base-content/60">Email</span>

            <span className="font-medium">{user.emailId}</span>
          </div>

          {user.createdAt && (
            <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
              <span className="text-base-content/60">Member since</span>

              <span className="font-medium">
                {new Date(user.createdAt).toLocaleDateString(undefined, {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
