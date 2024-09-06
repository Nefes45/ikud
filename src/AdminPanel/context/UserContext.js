import React, { createContext, useState, useEffect, useMemo } from "react";
import axios from "axios";

// API URL'si environment değişkeninden alınıyor
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";

// Axios için global ayar yapılıyor
axios.defaults.baseURL = API_BASE_URL;
axios.defaults.headers.common["Content-Type"] = "application/json";

// UserContext oluşturuluyor
export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(() => {
    return JSON.parse(localStorage.getItem("currentUser")) || null;
  });
  const [activeStatus, setActiveStatus] = useState(true); // activeStatus tanımlandı

  // Kullanıcıları çekme
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/users");
        setUsers(response.data || []); // Veriyi direkt alabiliriz, eğer boşsa [] olarak ayarlanır
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

      // Kullanıcı verisini localStorage'a kaydet
      localStorage.setItem("currentUser", JSON.stringify(response.data.user));
      setCurrentUser(response.data.user);

      return response.data.user; // Giriş yapılan kullanıcıyı geri döndür
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

      return response.data; // Kayıt edilen kullanıcıyı geri döndür
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
    // localStorage'dan currentUser'ı kaldır
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    setActiveStatus(false); // Kullanıcı çıkışı sonrası activeStatus güncelleniyor
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
      activeStatus, // activeStatus'u provider'a ekleyin
      setActiveStatus, // setActiveStatus'u provider'a ekleyin
    }),
    [users, currentUser, activeStatus]
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export { UserProvider };
