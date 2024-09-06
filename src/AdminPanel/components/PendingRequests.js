import React, { useEffect, useState } from "react";
import "../styles/PendingRequests.css";

const PendingRequests = () => {
  const [pendingUsers, setPendingUsers] = useState([]);

  useEffect(() => {
    // localStorage'dan kullanıcı taleplerini alıyoruz
    const users = JSON.parse(localStorage.getItem("pendingUsers")) || [];
    setPendingUsers(users);
  }, []);

  const handleDelete = (index) => {
    // Seçilen talebi listeden siliyoruz
    const updatedUsers = pendingUsers.filter((_, i) => i !== index);
    setPendingUsers(updatedUsers);

    // Güncellenmiş listeyi tekrar localStorage'a kaydediyoruz
    localStorage.setItem("pendingUsers", JSON.stringify(updatedUsers));
  };

  return (
    <div className="pending-requests-container">
      <h2>Üyelik ve Şifre Sıfırlama Talepleri</h2>
      {pendingUsers.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Ad</th>
              <th>Soyad</th>
              <th>Telefon Numarası</th>
              <th>Email</th>
              <th>Talep Türü</th>
              <th>Tarih</th>
              <th>İşlemler</th> {/* İşlemler sütunu */}
            </tr>
          </thead>
          <tbody>
            {pendingUsers.map((user, index) => (
              <tr key={index}>
                <td>{user.name}</td>
                <td>{user.surname}</td>
                <td>{user.phone}</td>
                <td>{user.email}</td>
                <td>{user.type}</td>
                <td>{user.date}</td>
                <td>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(index)}
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Bekleyen hiçbir talep bulunmamaktadır.</p>
      )}
    </div>
  );
};

export default PendingRequests;
