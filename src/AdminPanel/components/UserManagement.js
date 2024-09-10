import React, { useState, useContext } from "react";
import Notification from "./Notification";
import "../styles/UserManagement.css";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const UserManagement = () => {
  const { users, addUser, deleteUser, currentUser, setCurrentUser, error } =
    useContext(UserContext);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "Kullanıcı",
    password: "",
  });

  const [notification, setNotification] = useState({ message: "", type: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
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
    if (!userId) {
      setNotification({
        message: "Kullanıcı ID'si geçersiz.",
        type: "error",
      });
      return;
    }

    if (window.confirm("Kullanıcıyı silmek istediğinizden emin misiniz?")) {
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
    }
  };

  const handleLogout = () => {
    if (currentUser) {
      localStorage.removeItem("token");
      setCurrentUser(null); // Kullanıcıyı çıkış yaptır
      navigate("/login"); // Çıkış sonrası login ekranına yönlendir
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="user-management-container">
      <h2>Kullanıcı Yönetimi</h2>
      {error && <div className="error-message">{error}</div>}
      <Notification message={notification.message} type={notification.type} />
      <form onSubmit={handleAddUser}>
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
          <button type="submit" className="save-button">
            Kullanıcı Ekle
          </button>
        </div>
      </form>
      <input
        type="text"
        placeholder="Kullanıcı Ara..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
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
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <span
                  className={
                    user.isActive ? "status-active" : "status-inactive"
                  }
                >
                  {user.isActive ? "Aktif" : "Pasif"}
                </span>
              </td>
              <td>
                {currentUser?.role === "Admin" && (
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    Sil
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleLogout} className="logout-button">
        Çıkış Yap
      </button>
    </div>
  );
};

export default UserManagement;
