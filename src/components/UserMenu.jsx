import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function UserMenu() {
  const { user, isOwner, logout } = useAuth?.() || {};
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
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
    .map((s) => s?.[0]?.toUpperCase())
    .slice(0, 2)
    .join("");

  const go = (path) => {
    setOpen(false);
    navigate(path);
  };

  const handleLogout = async () => {
    try {
      await logout?.();
    } finally {
      setOpen(false);
      navigate("/");
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden ring-2 ring-transparent hover:ring-blue-400 transition"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Open user menu"
      >
        {user.photoURL ? (
          <img src={user.photoURL} alt="User avatar" className="w-full h-full object-cover" />
        ) : (
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">{initials}</span>
        )}
      </button>

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

          <button onClick={() => go("/profile")} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700">
            Profile
          </button>
          <button onClick={() => go("/liked")} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700">
            Liked
          </button>
          {isOwner && (
            <button onClick={() => go("/dashboard")} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700">
              Owner Dashboard
            </button>
          )}
          <button onClick={() => go("/settings")} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700">
            Settings
          </button>

          <div className="h-px bg-gray-100 dark:bg-gray-700" />

          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
