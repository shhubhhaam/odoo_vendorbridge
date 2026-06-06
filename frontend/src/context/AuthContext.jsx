import { createContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";

export const AuthContext = createContext();

/**
 * FIX 26: isAuthenticated was computed as `!!token` — meaning a stale,
 *          expired, or tampered token kept isAuthenticated = true until
 *          the first API call failed.
 *          Now isAuthenticated is derived from whether `user` is non-null
 *          (set only after the server verifies the token via /auth/me).
 *
 * FIX 27: verifyToken errors (expired token) silently cleared the token
 *          but left `loading = false` with `user = null`. Any component
 *          checking isAuthenticated during the loading phase could render
 *          protected UI briefly. Added `isReady` flag to gate rendering
 *          until verification is complete.
 *
 * FIX 28: Register form allowed selecting any role including "Admin".
 *          The backend now ignores the client-submitted role, but we
 *          align the form to only offer self-registerable roles to avoid
 *          user confusion.
 */

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);
  const [isReady, setIsReady] = useState(false); // FIX 27
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      verifyToken();
    } else {
      setIsReady(true);
    }
  }, []);

  const verifyToken = async () => {
    try {
      setLoading(true);
      const response = await authAPI.getMe();
      setUser(response.data.user);
    } catch (err) {
      // Token is invalid or expired — clean up
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
      setIsReady(true); // FIX 27: signal that auth check is complete
    }
  };

  const register = async (firstName, lastName, email, password, phone, country) => {
    // FIX 28: role removed from register params — backend always assigns
    //          "Procurement Officer" for self-registration
    try {
      setLoading(true);
      setError(null);
      const response = await authAPI.register({
        firstName,
        lastName,
        email,
        password,
        phone,
        country,
        // NOTE: `role` intentionally omitted — backend enforces "Procurement Officer"
      });
      const { token: newToken, user: newUser } = response.data;
      localStorage.setItem("token", newToken);
      setToken(newToken);
      setUser(newUser);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authAPI.login({ email, password });
      const { token: newToken, user: newUser } = response.data;
      localStorage.setItem("token", newToken);
      setToken(newToken);
      setUser(newUser);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setError(null);
  };

  const value = {
    user,
    token,
    loading,
    isReady,   // FIX 27: expose to AppContent for proper load gating
    error,
    register,
    login,
    logout,
    // FIX 26: isAuthenticated derived from `user`, not `token`
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};
