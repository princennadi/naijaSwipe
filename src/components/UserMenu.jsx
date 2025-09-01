import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * A11y-friendly user avatar + dropdown.
 * Shows: Profile, Liked, Dashboard (if owner), Settings (stub), Logout.
 */
export default function UserMenu() {
  const { user, isOwner, logout } = useAuth(); // assumes these exist in your AuthContext
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Close on outside click or ESC
  useEffect(() => {
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  if (!user) return null;

  const initials = (user.displayName || user.email || "U")
    .split(" ")
    .map((s) => s[0]?.toUpperCase())
    .slice(0, 2)
    .join("");

  const handleLogout = async () => {
    try {
      await logout?.(); // optional chaining in case logout is not wired yet
    } finally {
      setOpen(false);
      navigate("/"); // redirect after logout
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden ring-2 ring-transparent hover:ring-blue-400 transition"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="User menu"
      >
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt="User avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">
            {initials}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-48 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg overflow-hidden"
        >
          <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">Signed in as</p>
            <p className="text-sm font-medium truncate text-gray-800 dark:text-gray-100">
              {user.displayName || user.email}
            </p>
          </div>

          <button
            onClick={() => { setOpen(false); navigate("/profile"); }}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
            role="menuitem"
          >
            Profile
          </button>
          <button
            onClick={() => { setOpen(false); navigate("/liked"); }}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
            role="menuitem"
          >
            Liked
          </button>

          {isOwner && (
            <button
              onClick={() => { setOpen(false); navigate("/dashboard"); }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
              role="menuitem"
            >
              Owner Dashboard
            </button>
          )}

          <button
            onClick={() => { setOpen(false); navigate("/settings"); }}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
            role="menuitem"
          >
            Settings
          </button>

          <div className="h-px bg-gray-100 dark:bg-gray-700" />

          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
            role="menuitem"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
