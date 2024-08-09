import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate hook'unu import edin
import './styles/ForgotPassword.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [phone, setPhone] = useState('');
  const navigate = useNavigate(); // useNavigate hook'unu kullanarak navigate fonksiyonunu alın

  const handleSubmit = (e) => {
    e.preventDefault();
    const newRequest = { 
      email, 
      name, 
      surname, 
      phone, 
      date: new Date().toLocaleString(), 
      type: 'Şifre Sıfırlama Talebi' 
    };
    const existingRequests = JSON.parse(localStorage.getItem('pendingUsers')) || [];
    const updatedRequests = [...existingRequests, newRequest];
    localStorage.setItem('pendingUsers', JSON.stringify(updatedRequests));
    alert('Şifre sıfırlama talebiniz alınmıştır.');
  };

  return (
    <div className="forgot-password-container">
      <h2>Şifremi Unuttum</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Ad:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Soyad:</label>
          <input
            type="text"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Telefon Numarası:</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email Adresi:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit">Talep Gönder</button>
      </form>
      <button className="login-button" onClick={() => navigate('/login')}>
        Giriş Yap
      </button> {/* Giriş Yap butonu */}
    </div>
  );
}

export default ForgotPassword;
