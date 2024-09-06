import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Signup.css"; // Yeni yol
import kudiImage from "./img/kudi.png"; // Yeni yol

const Signup = () => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        navigate("/login");
      }, 15000); // 15 seconds

      return () => clearTimeout(timer); // Clear timeout if the component unmounts
    }
  }, [message, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = { name, surname, phone, email };

    try {
      const response = await fetch("http://localhost:5001/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        throw new Error("Başvuru gönderilirken bir hata oluştu.");
      }

      setMessage(
        "Başvurunuz Alınmıştır. En Kısa Zamanda Tarafınıza Dönüş Yapılacaktır."
      );
    } catch (error) {
      console.error("Başvuru gönderme hatası:", error);
      setMessage("Başvuru gönderilirken bir hata oluştu.");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-background">
        <div className="signup-box">
          <img src={kudiImage} alt="Kudi Logo" className="signup-logo" />{" "}
          {/* Add image element */}
          <h2>Üyelik İste</h2>
          {message ? (
            <div className="message">{message}</div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <label>Ad</label>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  required
                />
                <label>Soyad</label>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
                <label>Telefon Numarası</label>
              </div>
              <div className="form-group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <label>Email</label>
              </div>
              <button type="submit" className="signup-button">
                Gönder
              </button>
              <button
                type="button"
                className="login-button"
                onClick={() => navigate("/login")}
              >
                Giriş Yap
              </button>{" "}
              {/* Add login button */}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;
