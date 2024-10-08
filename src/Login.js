import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Login.css";
import { UserContext } from "./AdminPanel/context/UserContext";
import logoImage from "./img/logo.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { loginUser, currentUser } = useContext(UserContext);

  useEffect(() => {
    if (currentUser) {
      navigate("/admin", { replace: true });
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await loginUser(username, password);
      navigate("/admin", { replace: true });
    } catch (error) {
      setError("Giriş başarısız, lütfen bilgilerinizi kontrol edin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-body">
      <div className="login-container">
        <div className="login-box">
          <img src={logoImage} alt="Logo" className="login-logo" />
          <h2>Giriş Yap</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>E-Posta</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                placeholder="E-Mail "
              />
            </div>
            <div className="form-group">
              <label>Şifre</label>
              <div className="password-container">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="Şifre"
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? "Yükleniyor..." : "Giriş Yap"}
            </button>
            <button
              type="button"
              className="signup-button"
              onClick={() => navigate("/signup")}
            >
              Üyelik İste
            </button>
            <button
              type="button"
              className="forgot-password-button"
              onClick={() => navigate("/forgot-password")}
            >
              Şifremi Unuttum
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
