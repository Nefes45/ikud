import React, { useState, useContext, useEffect } from "react";
import Notification from "./Notification";
import "../styles/UserManagement.css";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const UserManagement = () => {
  const {
    users = [],
    addUser,
    deleteUser,
    currentUser,
    setCurrentUser,
    setActiveStatus,
  } = useContext(UserContext);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "Kullanıcı",
    password: "",
  });

  const [notification, setNotification] = useState({ message: "", type: "" });
  const [searchTerm, setSearchTerm] = useState(""); // Kullanıcı arama terimi
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Current User:", currentUser);
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      setNotification({
        message: "İsim, e-posta ve şifre gereklidir.",
        type: "error",
      });
      return;
    }

    try {
      await addUser(newUser);
      setNewUser({ name: "", email: "", role: "Kullanıcı", password: "" });
      setNotification({
        message: "Kullanıcı başarıyla eklendi!",
        type: "success",
      });
    } catch (error) {
      setNotification({
        message: "Kullanıcı eklenirken hata oluştu.",
        type: "error",
      });
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId);
      setNotification({
        message: "Kullanıcı başarıyla silindi!",
        type: "success",
      });
    } catch (error) {
      setNotification({
        message: "Kullanıcı silinirken hata oluştu.",
        type: "error",
      });
    }
  };

  const handleEditUser = (user) => {
    navigate(`/admin/profile/${user.id}`);
  };

  const handleLogout = () => {
    if (currentUser) {
      localStorage.removeItem("currentUser");
      setCurrentUser(null);
      navigate("/login");
    }
  };

  // Kullanıcı durumunu güncelle
  const handleSetActiveStatus = async (userId, isActive) => {
    try {
      await setActiveStatus(userId, isActive);
      setNotification({
        message: `Kullanıcı durumu ${
          isActive ? "aktif" : "pasif"
        } olarak güncellendi!`,
        type: "success",
      });
    } catch (error) {
      setNotification({
        message: "Kullanıcı durumu güncellenirken hata oluştu.",
        type: "error",
      });
    }
  };

  // Kullanıcı arama işlemi
  const filteredUsers = users.filter((user) => {
    const name = user.name ? user.name.toLowerCase() : "";
    const email = user.email ? user.email.toLowerCase() : "";
    const search = searchTerm.toLowerCase();
    return name.includes(search) || email.includes(search);
  });

  return (
    <div className="user-management-container">
      <h2>Kullanıcı Yönetimi</h2>
      <Notification message={notification.message} type={notification.type} />

      <div className="user-add-form">
        <div className="form-group">
          <label htmlFor="name">İsim</label>
          <input
            type="text"
            name="name"
            id="name"
            value={newUser.name}
            onChange={handleInputChange}
            placeholder="İsim"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">E-posta</label>
          <input
            type="email"
            name="email"
            id="email"
            value={newUser.email}
            onChange={handleInputChange}
            placeholder="E-posta"
          />
        </div>
        <div className="form-group">
          <label htmlFor="role">Rol</label>
          <select
            name="role"
            id="role"
            value={newUser.role}
            onChange={handleInputChange}
          >
            <option value="Admin">Admin</option>
            <option value="Moderatör">Moderatör</option>
            <option value="Kullanıcı">Kullanıcı</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="password">Şifre</label>
          <input
            type="password"
            name="password"
            id="password"
            value={newUser.password}
            onChange={handleInputChange}
            placeholder="Şifre"
          />
        </div>
        <button className="save-button" onClick={handleAddUser}>
          Kullanıcı Ekle
        </button>
        <button className="logout-button" onClick={handleLogout}>
          Çıkış Yap
        </button>
      </div>

      {/* Kullanıcı Arama */}
      <input
        type="text"
        placeholder="Kullanıcı Ara"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      {/* Kullanıcı Listesi */}
      <table className="user-table">
        <thead>
          <tr>
            <th>İsim</th>
            <th>E-posta</th>
            <th>Rol</th>
            <th>Durum</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button
                  onClick={() => handleSetActiveStatus(user.id, !user.isActive)}
                >
                  {user.isActive ? "Pasif Yap" : "Aktif Yap"}
                </button>
              </td>
              <td>
                <button onClick={() => handleEditUser(user)}>Düzenle</button>
                <button onClick={() => handleDeleteUser(user.id)}>Sil</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
