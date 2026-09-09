import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import * as authService from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    authService.getSession().then((s) => {
      if (active) {
        setSession(s);
        setLoading(false);
      }
    });

    const { data: subscription } = supabase.auth.onAuthStateChange(async () => {
      const s = await authService.getSession();
      if (active) setSession(s);
    });

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  const loginCustomer = async (payload) => {
    const s = await authService.loginCustomer(payload);
    setSession(s);
    return s;
  };

  const registerCustomer = async (payload) => {
    const s = await authService.registerCustomer(payload);
    setSession(s);
    return s;
  };

  const loginAdmin = async (payload) => {
    const s = await authService.loginAdmin(payload);
    setSession(s);
    return s;
  };

  const logout = async () => {
    await authService.logout();
    setSession(null);
  };

  const value = {
    session,
    loading,
    isAuthenticated: Boolean(session),
    isAdmin: session?.role === "admin",
    isCustomer: session?.role === "customer",
    loginCustomer,
    registerCustomer,
    loginAdmin,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
