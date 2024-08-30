import React, { createContext, useState, useContext, useEffect } from "react";
import { UserContext } from "./UserContext"; // Kullanıcının kimliğini almak için UserContext'i ekleyin

export const OperationsContext = createContext();

export const OperationsProvider = ({ children }) => {
  const { currentUser } = useContext(UserContext); // Kullanıcı bilgilerini alın
  const userId = currentUser?.id; // Kullanıcının kimliğini alın
  const localStorageKey = `operations_${userId}`; // Her kullanıcı için unique bir anahtar

  const [operations, setOperations] = useState(() => {
    const savedOperations = localStorage.getItem(localStorageKey);
    return savedOperations ? JSON.parse(savedOperations) : {};
  });

  useEffect(() => {
    const savedOperations = localStorage.getItem(localStorageKey);
    if (savedOperations) {
      setOperations(JSON.parse(savedOperations));
    }
  }, [userId, localStorageKey]); // `localStorageKey`'i bağımlılık dizisine ekledik

  const updateOperations = (newOperations) => {
    setOperations((prevOperations) => {
      const updatedOperations = { ...prevOperations, ...newOperations };
      localStorage.setItem(localStorageKey, JSON.stringify(updatedOperations));
      return updatedOperations;
    });
  };

  const resetOperations = () => {
    setOperations({});
    localStorage.removeItem(localStorageKey);
  };

  return (
    <OperationsContext.Provider
      value={{
        operations,
        updateOperations,
        resetOperations,
      }}
    >
      {children}
    </OperationsContext.Provider>
  );
};

export default OperationsProvider;
