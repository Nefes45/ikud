import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Login.css';
import { UserContext } from './AdminPanel/context/UserContext';
import logoImage from './img/logo.png';  // Yeni bir logo veya görsel kullanın
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { users, currentUser, setCurrentUser, setActiveStatus } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const user = users.find(u => u.name === username && u.password === password);
    if (user) {
      if (!user.isActive || !currentUser) {
        setCurrentUser(user);
        setActiveStatus(user.id, true);
        setTimeout(() => {
          navigate('/admin');
        }, 1000);
      } else {
        setError('Kullanıcı zaten başka bir oturumda açık.');
      }
    } else {
      setError('Geçersiz kullanıcı adı veya şifre');
    }
    setLoading(false);
  };

  return (
    <div className="login-body">
      <div className="login-container">
        <div className="login-box">
          <img src={logoImage} alt="Logo" className="login-logo" />
          <h2>Giriş Yap</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Kullanıcı Adı</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                placeholder="Kullanıcı adı"
              />
            </div>
            <div className="form-group">
              <label>Şifre</label>
              <div className="password-container">
                <input
                  type={showPassword ? 'text' : 'password'}
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
              {loading ? 'Yükleniyor...' : 'Giriş Yap'}
            </button>
            <button type="button" className="signup-button" onClick={() => navigate('/signup')}>
              Üyelik İste
            </button>
            <button type="button" className="forgot-password-button" onClick={() => navigate('/forgot-password')}>
              Şifremi Unuttum
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
