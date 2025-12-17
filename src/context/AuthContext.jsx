// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { auth, db, serverTimestamp } from "../firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

/**
 * Create or update the user's Firestore profile document:
 * /users/{uid}
 */
async function ensureUserProfile(fbUser, extra = {}) {
  if (!fbUser) return null;
  const ref = doc(db, "users", fbUser.uid);
  const snap = await getDoc(ref);

  // Default profile fields
  const base = {
    uid: fbUser.uid,
    email: fbUser.email || "",
    displayName: fbUser.displayName || "",
    photoURL: fbUser.photoURL || "",
    role: "user",         // "user" | "host" | "admin"
    isHost: false,        // convenience boolean
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  if (!snap.exists()) {
    await setDoc(ref, { ...base, ...extra });
    return { ...base, ...extra };
  } else {
    // Keep existing values, update minimal fields if provided
    const current = snap.data();
    const merged = {
      ...current,
      ...extra,
      // keep email/displayName/photo fresh from auth when present
      email: fbUser.email || current.email || "",
      displayName: fbUser.displayName ?? current.displayName ?? "",
      photoURL: fbUser.photoURL ?? current.photoURL ?? "",
      updatedAt: serverTimestamp(),
    };
    // Only write if we actually added extras or changed something material
    await setDoc(ref, merged, { merge: true });
    return merged;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);       // Firebase Auth user
  const [profile, setProfile] = useState(null); // Firestore /users doc
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      try {
        if (fbUser) {
          // Make sure user has a profile doc
          const prof = await ensureUserProfile(fbUser);
          setUser(fbUser);
          setProfile(prof);
          // Treat host/admin as "owner" for ProtectedRoute
          const ownerFlag = !!prof?.isHost || prof?.role === "host" || prof?.role === "admin";

          setIsOwner(ownerFlag);
        } else {
          setUser(null);
          setProfile(null);
          setIsOwner(false);
        }
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  // --- Auth actions you can call from UI ---

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const res = await signInWithPopup(auth, provider);
    // ensure profile after social login
    const prof = await ensureUserProfile(res.user);
    setProfile(prof);
    setIsOwner(!!prof?.isHost || prof?.role === "host" || prof?.role === "admin");
    return res.user;
  };

  const signupWithEmail = async ({ email, password, displayName }) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(cred.user, { displayName });
    }
    const prof = await ensureUserProfile(
      { ...cred.user, displayName: displayName ?? cred.user.displayName },
      {} // you can add defaults here, e.g., { isHost: false }
    );
    setProfile(prof);
    setIsOwner(!!prof?.isHost || prof?.role === "host" || prof?.role === "admin");
    return cred.user;
  };

  const loginWithEmail = async ({ email, password }) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const prof = await ensureUserProfile(cred.user);
    setProfile(prof);
    setIsOwner(!!prof?.isHost || prof?.role === "host" || prof?.role === "admin");
    return cred.user;
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setProfile(null);
    setIsOwner(false);
  };

  const value = useMemo(
    () => ({
      user,
      profile,
      isOwner,
      loading,
      loginWithGoogle,
      signupWithEmail,
      loginWithEmail,
      logout,
    }),
    [user, profile, isOwner, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : null}
    </AuthContext.Provider>
  );
}
