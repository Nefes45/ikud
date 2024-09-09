import React, { createContext, useState, useEffect, useMemo } from "react";
import axios from "axios";

// Axios için base URL ayarını kaldırıyoruz. Proxy ayarı ile backend'e ulaşacağız.
axios.defaults.headers.common["Content-Type"] = "application/json";

// UserContext oluşturuluyor
export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(() => {
    return JSON.parse(localStorage.getItem("currentUser")) || null;
  });
  const [activeStatus, setActiveStatus] = useState(true);

  // Kullanıcıları çekme
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // "/api/users" ile istek gönderiyoruz, tam URL gerekmez
        const response = await axios.get("/api/users");
        setUsers(response.data || []);
      } catch (error) {
        console.error(
          "Kullanıcılar alınamadı:",
          error.response?.data || error.message
        );
      }
    };

    fetchUsers();
  }, []);

  // Kullanıcı girişi
  const loginUser = async (email, password) => {
    try {
      const response = await axios.post("/api/users/login", {
        email,
        password,
      });

      localStorage.setItem("currentUser", JSON.stringify(response.data.user));
      setCurrentUser(response.data.user);

      return response.data.user;
    } catch (error) {
      console.error(
        "Giriş işlemi başarısız:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Giriş sırasında hata oluştu."
      );
    }
  };

  // Kullanıcı ekleme (register)
  const addUser = async (newUser) => {
    try {
      const response = await axios.post("/api/users/register", newUser);
      setUsers((prevUsers) => [...prevUsers, response.data]);

      return response.data;
    } catch (error) {
      console.error(
        "Kullanıcı eklenemedi:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Kullanıcı eklenirken hata oluştu."
      );
    }
  };

  // Kullanıcı çıkışı (logout)
  const logoutUser = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    setActiveStatus(false);
  };

  // Context için memorized değerler (performans iyileştirmesi)
  const contextValue = useMemo(
    () => ({
      users,
      loginUser,
      addUser,
      currentUser,
      setCurrentUser,
      logoutUser,
      activeStatus,
      setActiveStatus,
    }),
    [users, currentUser, activeStatus]
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export { UserProvider };
