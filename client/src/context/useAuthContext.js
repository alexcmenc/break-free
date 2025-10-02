import { useContext } from "react";
import { AuthContext } from "./AuthContext.js";

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used inside AuthProvider");
  return ctx;
}
