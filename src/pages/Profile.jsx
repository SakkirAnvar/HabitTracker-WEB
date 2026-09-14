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

  const getProfilePhotoUrl = (photo) => {
    if (!photo) {
      return "/default-avatar.png";
    }

    if (photo.startsWith("http")) {
      return photo;
    }

    return `${import.meta.env.VITE_API_URL}${photo}`;
  };

  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const [photoPreview, setPhotoPreview] = useState(() =>
    getProfilePhotoUrl(user?.profilePhoto),
  );

  if (!user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-2xl">
          👤
        </div>

        <p className="font-medium text-base-content">
          Unable to load profile.
        </p>

        <p className="text-sm text-base-content/40">
          User information is not available.
        </p>
      </div>
    );
  }

  // =========================
  // Submit
  // =========================

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
      const formData = new FormData();

      formData.append("firstName", trimmedFirstName);
      formData.append("lastName", trimmedLastName);

      if (selectedPhoto) {
        formData.append("profilePhoto", selectedPhoto);
      }

      await dispatch(updateProfile(formData)).unwrap();

      setSuccessMessage("Profile updated successfully.");
      setSelectedPhoto(null);
    } catch (err) {
      setFormError(
        typeof err === "string"
          ? err
          : err?.message || "Failed to update profile.",
      );
    }
  };

  // =========================
  // Photo change
  // =========================

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setFormError("Only JPG, PNG and WebP images are allowed.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setFormError("Profile photo must be smaller than 2MB.");
      return;
    }

    setFormError("");
    setSuccessMessage("");

    setSelectedPhoto(file);

    const previewUrl = URL.createObjectURL(file);

    setPhotoPreview(previewUrl);
  };

  const isUpdating = status === "loading";

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      {/* ================= HEADER ================= */}

      <section>
        <div className="mb-2 flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-lg">
            👤
          </span>

          <span className="text-sm font-medium text-primary">
            Account
          </span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-base-content sm:text-3xl">
          Profile
        </h1>

        <p className="mt-1 text-sm leading-6 text-base-content/60 sm:text-base">
          Manage your personal information and profile photo.
        </p>
      </section>

      {/* ================= PROFILE CARD ================= */}

      <section className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm">
        {/* Card Header */}

        <div className="border-b border-base-300 p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-base-content">
            Personal Information
          </h2>

          <p className="mt-1 text-sm text-base-content/60">
            Update the information associated with your Aven account.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* ================= MESSAGES ================= */}

          {(formError || error) && (
            <div className="mx-5 mt-5 flex items-center gap-3 rounded-xl border border-error/20 bg-error/10 px-4 py-3 text-sm font-medium text-error sm:mx-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m0 3.75h.008M10.29 3.86l-7.5 13A2 2 0 004.52 20h14.96a2 2 0 001.73-3.14l-7.5-13a2 2 0 00-3.46 0z"
                />
              </svg>

              <span>{formError || error}</span>
            </div>
          )}

          {successMessage && (
            <div className="mx-5 mt-5 flex items-center gap-3 rounded-xl border border-success/20 bg-success/10 px-4 py-3 text-sm font-medium text-success sm:mx-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m5 12 4 4L19 6"
                />
              </svg>

              <span>{successMessage}</span>
            </div>
          )}

          {/* ================= PROFILE PHOTO ================= */}

          <div className="border-b border-base-300 p-5 sm:p-6">
            <h3 className="font-semibold text-base-content">
              Profile Photo
            </h3>

            <p className="mt-1 text-sm text-base-content/60">
              Choose a profile photo that represents you.
            </p>

            <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center">
              {/* Avatar */}

              <div className="avatar shrink-0">
                <div className="w-24 rounded-full ring-2 ring-primary/20 ring-offset-2 ring-offset-base-100">
                  <img
                    src={photoPreview}
                    alt="Profile"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/default-avatar.png";
                    }}
                  />
                </div>
              </div>

              {/* Upload */}

              <div>
                <label
                  htmlFor="profilePhoto"
                  className="btn btn-outline btn-sm"
                >
                  Choose Photo
                </label>

                <input
                  id="profilePhoto"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handlePhotoChange}
                  className="hidden"
                />

                <p className="mt-2 text-xs text-base-content/50">
                  JPG, PNG or WebP · Maximum 2MB
                </p>

                {selectedPhoto && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-success" />

                    <p className="max-w-xs truncate text-xs font-medium text-primary">
                      {selectedPhoto.name}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ================= FORM FIELDS ================= */}

          <div className="space-y-5 p-5 sm:p-6">
            {/* Names */}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="firstName"
                  className="mb-2 block text-sm font-medium text-base-content"
                >
                  First Name
                </label>

                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="input w-full border-base-300 bg-base-100 text-base-content placeholder:text-base-content/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
                  maxLength={50}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="mb-2 block text-sm font-medium text-base-content"
                >
                  Last Name
                </label>

                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="input w-full border-base-300 bg-base-100 text-base-content placeholder:text-base-content/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
                  maxLength={50}
                  required
                />
              </div>
            </div>

            {/* Email */}

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-base-content"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={user.emailId || ""}
                className="input w-full border-base-300 bg-base-200 text-base-content/60"
                disabled
              />

              <p className="mt-1.5 text-xs text-base-content/50">
                Your email address cannot be changed here.
              </p>
            </div>
          </div>

          {/* ================= ACTIONS ================= */}

          <div className="flex justify-end border-t border-base-300 px-5 py-4 sm:px-6">
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
      </section>

      {/* ================= ACCOUNT INFORMATION ================= */}

      <section className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10 text-lg">
            ℹ️
          </div>

          <div>
            <h2 className="text-lg font-semibold text-base-content">
              Account Information
            </h2>

            <p className="text-sm text-base-content/50">
              Basic information about your Aven account.
            </p>
          </div>
        </div>

        <div className="mt-5 divide-y divide-base-300 rounded-xl border border-base-300">
          {/* Email */}

          <div className="flex flex-col gap-1 p-4 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm text-base-content/60">
              Email
            </span>

            <span className="text-sm font-medium text-base-content">
              {user.emailId}
            </span>
          </div>

          {/* Member Since */}

          {user.createdAt && (
            <div className="flex flex-col gap-1 p-4 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm text-base-content/60">
                Member since
              </span>

              <span className="text-sm font-medium text-base-content">
                {new Date(user.createdAt).toLocaleDateString(undefined, {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          )}
        </div>
      </section>

      {/* ================= FOOTER ================= */}

      <div className="pb-4 text-center">
        <p className="text-xs text-base-content/40">
          Aven · Build your better days.
        </p>
      </div>
    </div>
  );
};

export default Profile;
