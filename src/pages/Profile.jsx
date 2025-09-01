import React, { useState } from "react";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const initials = (user?.displayName || user?.email || "U")
    .split(" ")
    .map((s) => s[0]?.toUpperCase())
    .slice(0, 2)
    .join("");

  const onSave = async (e) => {
    e.preventDefault();
    setMsg("");
    setSaving(true);
    try {
      if (typeof updateProfile === "function") {
        await updateProfile({
          displayName: displayName.trim(),
          photoURL: photoURL.trim() || null,
        });
        setMsg("Profile updated ✅");
      } else {
        setMsg("Demo only: wire updateProfile() in AuthContext to persist.");
      }
    } catch {
      setMsg("Failed to update profile. Try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-200/60 dark:border-gray-700 mt-8">
        <div className="p-6 sm:p-8 border-b border-gray-100 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Your Profile</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your account info and avatar.
          </p>
        </div>

        <form onSubmit={onSave} className="p-6 sm:p-8 space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex items-center justify-center">
              {photoURL ? (
                <img src={photoURL} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-lg font-semibold text-gray-700 dark:text-gray-200">{initials}</span>
              )}
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Avatar URL</label>
              <input
                type="url"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                placeholder="https://example.com/me.jpg"
                className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Paste a direct link to your profile photo (optional).
              </p>
            </div>
          </div>

          {/* Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
                className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Email</label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full p-2 rounded-md border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-800/60 text-gray-500 dark:text-gray-400"
              />
            </div>
          </div>

          {/* Save */}
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            {msg && <span className="text-sm text-gray-600 dark:text-gray-300">{msg}</span>}
          </div>
        </form>
      </div>
    </div>
  );
}
