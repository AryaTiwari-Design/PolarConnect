import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authApi } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(localStorage.getItem("polarconnect_token")));

  useEffect(() => {
    if (!localStorage.getItem("polarconnect_token")) return;
    authApi
      .me()
      .then(setUser)
      .catch(() => localStorage.removeItem("polarconnect_token"))
      .finally(() => setLoading(false));
  }, []);

  async function login(payload) {
    const data = await authApi.login(payload);
    localStorage.setItem("polarconnect_token", data.token);
    setUser(data.user);
  }

  async function register(payload) {
    const data = await authApi.register(payload);
    localStorage.setItem("polarconnect_token", data.token);
    setUser(data.user);
  }

  function logout() {
    localStorage.removeItem("polarconnect_token");
    setUser(null);
  }

  const value = useMemo(() => ({ user, loading, login, register, logout }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
