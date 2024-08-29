import React, { createContext, useState, useEffect } from "react";
import usersData from "./users.json"; // Kullanıcıları içeren JSON dosyasını içe aktarın

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [users, setUsers] = useState(usersData);
  const [currentUser, setCurrentUser] = useState(() => {
    return JSON.parse(localStorage.getItem("currentUser")) || null;
  });

  useEffect(() => {
    const savedUsers = JSON.parse(localStorage.getItem("users"));
    if (savedUsers) {
      setUsers(savedUsers);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  const addUser = (newUser) => {
    const newId = users.length ? users[users.length - 1].id + 1 : 1;
    const updatedUsers = [...users, { ...newUser, id: newId }];
    setUsers(updatedUsers);
  };

  const updateUser = (userId, updatedData) => {
    const updatedUsers = users.map((user) =>
      user.id === userId ? { ...user, ...updatedData } : user
    );
    setUsers(updatedUsers);
  };

  const deleteUser = (userId) => {
    const updatedUsers = users.filter((user) => user.id !== userId);
    setUsers(updatedUsers);
  };

  const setActiveStatus = (id, status) => {
    const updatedUsers = users.map((user) =>
      user.id === id ? { ...user, isActive: status } : user
    );
    setUsers(updatedUsers);
  };

  return (
    <UserContext.Provider
      value={{
        users,
        setUsers,
        currentUser,
        setCurrentUser,
        setActiveStatus,
        addUser,
        updateUser,
        deleteUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider };
