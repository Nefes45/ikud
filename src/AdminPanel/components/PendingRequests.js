import React, { useEffect, useState } from 'react';
import '../styles/PendingRequests.css';

const PendingRequests = () => {
  const [pendingUsers, setPendingUsers] = useState([]);

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('pendingUsers')) || [];
    setPendingUsers(users);
  }, []);

  return (
    <div className="pending-requests-container">
      <h2>Üyelik İsteyen Kullanıcılar</h2>
      <table>
        <thead>
          <tr>
            <th>Ad</th>
            <th>Soyad</th>
            <th>Telefon Numarası</th>
            <th>Email</th>
            <th>Talep Türü</th> {/* Yeni sütun ekliyoruz */}
          </tr>
        </thead>
        <tbody>
          {pendingUsers.map((user, index) => (
            <tr key={index}>
              <td>{user.name}</td>
              <td>{user.surname}</td>
              <td>{user.phone}</td>
              <td>{user.email}</td>
              <td>{user.type}</td> {/* Talep türünü gösteriyoruz */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PendingRequests;
