import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(Boolean(auth));

  const loadProfile = useCallback(async (u) => {
    try {
      const snap = await getDoc(doc(db, 'users', u.uid));
      setProfile(snap.exists() ? snap.data() : null);
    } catch {
      setProfile(null);
    }
  }, []);

  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) await loadProfile(u); else setProfile(null);
      setLoading(false);
    });
  }, [loadProfile]);

  const value = {
    user, profile, loading,
    profileComplete: profile?.profileComplete === true,
    refreshProfile: () => (user ? loadProfile(user) : Promise.resolve()),
    logout: () => signOut(auth),
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
