// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { auth } from "../lib/firebase";
import {
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateProfile,
} from "firebase/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);

  // Keep React tree mounted, but gate UI while we resolve session
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u || null);
      // TODO: replace this with real custom-claims logic later
      setIsOwner(!!u && u.email?.endsWith("@yourcompany.com"));
      setLoading(false);
    });
    return unsub;
  }, []);

  const loginWithEmail = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const registerWithEmail = async (email, password, displayName) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) await updateProfile(cred.user, { displayName });
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const loginWithApple = async () => {
    const provider = new OAuthProvider("apple.com");
    provider.addScope("email");
    provider.addScope("name");
    await signInWithPopup(auth, provider);
  };

  const logout = () => signOut(auth);

  const value = useMemo(
    () => ({
      user,
      isOwner,
      loginWithEmail,
      registerWithEmail,
      loginWithGoogle,
      loginWithApple,
      logout,
    }),
    [user, isOwner]
  );

  return (
    <AuthContext.Provider value={value}>
      {loading ? <div className="p-6 text-center">Loading…</div> : children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
