import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import UserMenu from "./UserMenu";

/**
 * Reusable top header for ShortLet.
 * - Brand button -> "/"
 * - Browse button -> "/browse"
 * - Shows UserMenu if logged in; otherwise shows "Login"
 * - Optional `right` prop to inject extra controls (e.g., dark-mode toggle)
 */
export default function Header({ right, showBrowse = true }) {
  const navigate = useNavigate();
  const { user } = useAuth?.() || {};

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="text-xl font-bold text-blue-700 dark:text-blue-300 hover:opacity-80"
          aria-label="Go to landing page"
        >
          🏡 ShortLet
        </button>

        <div className="flex items-center gap-3">
          {showBrowse && (
            <button
              type="button"
              onClick={() => navigate("/browse")}
              className="text-sm bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl"
            >
              Browse
            </button>
          )}

          {/* Any extra controls the page wants to pass (e.g., dark-mode toggle) */}
          {right ?? null}

          {/* Auth area */}
          {user ? (
            <UserMenu />
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="text-sm border border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-xl"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
