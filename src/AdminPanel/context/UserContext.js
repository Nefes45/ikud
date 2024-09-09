import React, { createContext, useState, useCallback } from "react";
import axios from "axios";

// API Base URL tanımlama
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
axios.defaults.baseURL = API_BASE_URL;
axios.defaults.headers.common["Content-Type"] = "application/json";

// UserContext oluşturma
export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    return JSON.parse(localStorage.getItem("currentUser")) || null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Kullanıcı girişi
  const loginUser = useCallback(async (email, password) => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post("/api/users/login", {
        email,
        password,
      });
      localStorage.setItem("currentUser", JSON.stringify(response.data.user));
      setCurrentUser(response.data.user);
    } catch (err) {
      setError("Giriş başarısız, lütfen bilgilerinizi kontrol edin.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Kullanıcı çıkışı
  const logoutUser = useCallback(() => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
  }, []);

  // Context Değerlerini Sağlama
  return (
    <UserContext.Provider
      value={{ currentUser, loginUser, logoutUser, loading, error }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider };
