import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api.js";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const verify = async (token) => {
    if (!token) {
      setUser(null);
      localStorage.removeItem("authToken");
      setLoading(false);
      return;
    }
    try {
      const response = await api.get("/auth/verify", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        setUser(response.data.payload);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.log("verify error:", err);
      setUser(null);
      localStorage.removeItem("authToken");
    } finally {
      setLoading(false);
    }
  };

  const signup = async (body, setToggle, e) => {
    if (e?.preventDefault) e.preventDefault();
    try {
      const response = await api.post("/auth/signup", body);
      if (response.status === 201 || response.status === 200) {
        if (typeof setToggle === "function") setToggle((prev) => !prev);
      }
    } catch (err) {
      console.log("signup error:", err);
    }
  };

  const login = async (body, e) => {
    if (e?.preventDefault) e.preventDefault();
    try {
      const response = await api.post("/auth/login", body);
      if (response.status === 200 || response.status === 201) {
        localStorage.setItem("authToken", response.data.authToken);
        await verify(response.data.authToken);
        navigate("/profile");
      }
    } catch (err) {
      console.log("login error:", err);
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    navigate("/");
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    verify(token);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used inside AuthProvider");
  return ctx;
}
