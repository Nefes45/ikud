import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('currentUser')));

  const usersFilePath = '/users.json'; // JSON dosyasının yolu

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(usersFilePath);
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Kullanıcıları çekerken hata oluştu:', error.message);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  const setActiveStatus = (id, status) => {
    const updatedUsers = users.map(user =>
      user.id === id ? { ...user, isActive: status } : user
    );
    setUsers(updatedUsers);
    // Burada localStorage veya bir dosya güncellemesi yapılabilir.
  };

  const addUser = (newUser) => {
    const updatedUsers = [...users, { ...newUser, id: users.length ? users[users.length - 1].id + 1 : 1 }];
    setUsers(updatedUsers);
    // Burada localStorage veya bir dosya güncellemesi yapılabilir.
  };

  const deleteUser = (userId) => {
    const updatedUsers = users.filter(user => user.id !== userId);
    setUsers(updatedUsers);
    // Burada localStorage veya bir dosya güncellemesi yapılabilir.
  };

  return (
    <UserContext.Provider value={{ users, setUsers, currentUser, setCurrentUser, setActiveStatus, addUser, deleteUser }}>
      {children}
    </UserContext.Provider>
  );
};
