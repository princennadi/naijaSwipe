import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";

export default function Settings() {
  const { user, logout } = useAuth();
  const [darkPref, setDarkPref] = useState(() => localStorage.getItem("pref_dark") === "1");
  const [emailNotif, setEmailNotif] = useState(() => localStorage.getItem("pref_email") !== "0");
  const [smsNotif, setSmsNotif] = useState(() => localStorage.getItem("pref_sms") === "1");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (darkPref) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("pref_dark", "1");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("pref_dark", "0");
    }
  }, [darkPref]);

  const savePrefs = () => {
    localStorage.setItem("pref_email", emailNotif ? "1" : "0");
    localStorage.setItem("pref_sms", smsNotif ? "1" : "0");
    setMsg("Settings saved ✅");
    setTimeout(() => setMsg(""), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-200/60 dark:border-gray-700 mt-8">
        <div className="p-6 sm:p-8 border-b border-gray-100 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Preferences for {user?.email || "your account"}.
          </p>
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          {/* Appearance */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Appearance</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Choose light or dark mode.</p>
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={darkPref}
                onChange={() => setDarkPref((v) => !v)}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Enable dark mode</span>
            </label>
          </section>

          <div className="border-t border-gray-100 dark:border-gray-700" />

          {/* Notifications */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Notifications</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Manage how we keep in touch.</p>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailNotif}
                  onChange={() => setEmailNotif((v) => !v)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Email notifications</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={smsNotif}
                  onChange={() => setSmsNotif((v) => !v)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">SMS notifications</span>
              </label>
            </div>
          </section>

          <div className="border-t border-gray-100 dark:border-gray-700" />

          {/* Danger Zone */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Danger Zone</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Sign out of your account.</p>
            <button onClick={logout} className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-500 text-white">
              Log out
            </button>
          </section>

          {/* Save */}
          <div className="flex items-center gap-3">
            <button onClick={savePrefs} className="px-5 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white">
              Save Settings
            </button>
            {msg && <span className="text-sm text-gray-600 dark:text-gray-300">{msg}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
