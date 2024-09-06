import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate hook'unu import edin
import "./styles/ForgotPassword.css"; // CSS dosyasını import edin

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate(); // useNavigate hook'unu kullanarak navigate fonksiyonunu alın

  const handleSubmit = (e) => {
    e.preventDefault();

    // Yeni şifre sıfırlama talebi oluştur
    const newRequest = {
      email,
      name,
      surname,
      phone,
      date: new Date().toLocaleString(),
      type: "Şifre Sıfırlama Talebi",
    };

    // Mevcut talepleri localStorage'dan al, eğer yoksa boş bir dizi oluştur
    const existingRequests =
      JSON.parse(localStorage.getItem("pendingUsers")) || [];

    // Yeni talebi mevcut taleplerin sonuna ekle
    const updatedRequests = [...existingRequests, newRequest];

    // Güncellenmiş talepleri tekrar localStorage'a kaydet
    localStorage.setItem("pendingUsers", JSON.stringify(updatedRequests));

    // Kullanıcıya bir bildirim göster
    alert("Şifre sıfırlama talebiniz alınmıştır.");

    // Form gönderildikten sonra kullanıcıyı başka bir sayfaya yönlendirme
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
