import React, { createContext, useState, useContext } from 'react';
import { UserContext } from './UserContext'; // Kullanıcının kimliğini almak için UserContext'i ekleyin

export const OperationsContext = createContext();

export const OperationsProvider = ({ children }) => {
  const { currentUser } = useContext(UserContext); // Kullanıcı bilgilerini alın
  const userId = currentUser?.id; // Kullanıcının kimliğini alın
  const localStorageKey = `operations_${userId}`; // Her kullanıcı için unique bir anahtar

  const [operations, setOperations] = useState(() => {
    const savedOperations = localStorage.getItem(localStorageKey);
    return savedOperations ? JSON.parse(savedOperations) : {};
  });

  const updateOperations = (newOperations) => {
    setOperations(prevOperations => {
      const updatedOperations = { ...prevOperations, ...newOperations };
      localStorage.setItem(localStorageKey, JSON.stringify(updatedOperations));
      localStorage.setItem(`priceUpdateNotification_${userId}`, 'true'); // Kullanıcıya özel fiyat güncelleme bildirimi
      return updatedOperations;
    });
  };

  const resetOperations = () => {
    setOperations({});
    localStorage.removeItem(localStorageKey);
  };

  return (
    <OperationsContext.Provider value={{ operations, updateOperations, resetOperations }}>
      {children}
    </OperationsContext.Provider>
  );
};

export default OperationsProvider;
