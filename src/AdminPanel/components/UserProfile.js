import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import "../styles/UserProfile.css";

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchUserById, updateUser } = useContext(UserContext);

  const [user, setUser] = useState({
    name: "",
    role: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!id || isNaN(Number(id))) {
      setErrorMessage("Geçersiz kullanıcı ID'si.");
      return;
    }

    const getUser = async () => {
      try {
        const fetchedUser = await fetchUserById(id);
        setUser({
          name: fetchedUser.name,
          role: fetchedUser.role,
        });
      } catch (error) {
        setErrorMessage("Kullanıcı bilgileri alınamadı.");
      }
    };

    getUser();
  }, [id, fetchUserById]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!id || isNaN(Number(id))) {
      setErrorMessage("Güncelleme yapılamıyor, geçersiz kullanıcı ID'si.");
      return;
    }
    try {
      await updateUser(id, user);
      setSuccessMessage("Kullanıcı başarıyla güncellendi!");
      setTimeout(() => {
        navigate("/admin/users");
      }, 2000);
    } catch (error) {
      setErrorMessage("Kullanıcı güncellenirken hata oluştu.");
    }
  };

  const handleCancel = () => {
    navigate("/admin");
  };

  return (
    <div className="user-profile-container">
      <h2>Kullanıcı Düzenle</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <form onSubmit={handleUpdate}>
        <div className="profile-info">
          <div className="profile-row">
            <label htmlFor="name">İsim:</label>
            <input
              type="text"
              name="name"
              id="name"
              value={user.name}
              onChange={handleChange}
            />
          </div>
          <div className="profile-row">
            <label htmlFor="role">Rol:</label>
            <select
              name="role"
              id="role"
              value={user.role}
              onChange={handleChange}
            >
              <option value="Admin">Admin</option>
              <option value="Moderatör">Moderatör</option>
              <option value="Kullanıcı">Kullanıcı</option>
            </select>
          </div>
        </div>
        <div className="profile-actions">
          <button type="submit" className="save-button">
            Güncelle
          </button>
          <button
            type="button"
            className="cancel-button"
            onClick={handleCancel}
          >
            İptal
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserProfile;
