import React, { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

export const UserContext = createContext();

const API_BASE_URL = "http://localhost:5001"; // Backend URL'si

const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  const clearError = () => setError(null);

  const fetchUsers = useCallback(async () => {
    clearError();
    try {
      const response = await axios.get(`${API_BASE_URL}/api/users`);
      setUsers(response.data);
    } catch (error) {
      console.error("Kullanıcılar çekilemedi:", error);
      setError("Kullanıcılar çekilemedi.");
    }
  }, []);

  const fetchUserById = useCallback(async (id) => {
    clearError();
    if (!id || id === "undefined") {
      setError("Geçersiz kullanıcı ID.");
      return null;
    }
    try {
      const response = await axios.get(`${API_BASE_URL}/api/users/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Kullanıcı bilgisi alınamadı (ID: ${id}):`, error);
      setError("Kullanıcı bilgisi alınamadı.");
      throw error;
    }
  }, []);

  const addUser = useCallback(
    async (newUser) => {
      clearError();
      try {
        await axios.post(`${API_BASE_URL}/api/users/register`, newUser);
        fetchUsers();
      } catch (error) {
        console.error("Kullanıcı eklenirken hata oluştu:", error);
        setError("Kullanıcı eklenirken hata oluştu.");
      }
    },
    [fetchUsers]
  );

  const updateUser = useCallback(
    async (id, updatedUser) => {
      clearError();
      if (!id || id === "undefined") {
        setError("Geçersiz kullanıcı ID.");
        return null;
      }
      try {
        await axios.put(`${API_BASE_URL}/api/users/update/${id}`, updatedUser);
        fetchUsers();
      } catch (error) {
        console.error(
          `Kullanıcı güncellenirken hata oluştu (ID: ${id}):`,
          error
        );
        setError("Kullanıcı güncellenirken hata oluştu.");
        throw error;
      }
    },
    [fetchUsers]
  );

  const deleteUser = useCallback(
    async (userId) => {
      clearError();
      if (!userId || userId === "undefined") {
        setError("Geçersiz kullanıcı ID.");
        return null;
      }
      try {
        await axios.delete(`${API_BASE_URL}/api/users/${userId}`);
        fetchUsers();
      } catch (error) {
        console.error("Kullanıcı silinirken hata oluştu:", error);
        setError("Kullanıcı silinirken hata oluştu.");
      }
    },
    [fetchUsers]
  );

  const loginUser = useCallback(async (email, password) => {
    clearError();
    try {
      const response = await axios.post(`${API_BASE_URL}/api/users/login`, {
        email,
        password,
      });
      const { user, token } = response.data;
      localStorage.setItem("token", token);
      setCurrentUser(user);
    } catch (error) {
      console.error(
        "Giriş başarısız:",
        error.response?.data?.error || error.message
      );
      setError("Giriş başarısız.");
      throw new Error(error.response?.data?.error || "Giriş başarısız.");
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <UserContext.Provider
      value={{
        users,
        currentUser,
        addUser,
        deleteUser,
        loginUser,
        fetchUsers,
        fetchUserById,
        updateUser,
        setCurrentUser,
        error,
        clearError,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider };
