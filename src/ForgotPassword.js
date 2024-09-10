import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/ForgotPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const newRequest = {
      email,
      name,
      surname,
      phone,
      date: new Date().toLocaleString(),
      type: "Şifre Sıfırlama Talebi",
    };

    const existingRequests =
      JSON.parse(localStorage.getItem("pendingUsers")) || [];
    const updatedRequests = [...existingRequests, newRequest];
    localStorage.setItem("pendingUsers", JSON.stringify(updatedRequests));

    alert("Şifre sıfırlama talebiniz alınmıştır.");
    navigate("/login");
  };

  return (
    <div className="forgot-password-container">
      <h2>Şifremi Unuttum</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Ad:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Soyad:</label>
          <input
            type="text"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Telefon Numarası:</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Email Adresi:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-button">
          Talep Gönder
        </button>
      </form>
      <button className="login-button" onClick={() => navigate("/login")}>
        Giriş Yap
      </button>
    </div>
  );
}

export default ForgotPassword;
