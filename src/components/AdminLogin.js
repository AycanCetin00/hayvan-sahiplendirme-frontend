import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminLogin.css";

const ADMIN_PANEL_PATH = "/yonetim-panel-8f3b";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await fetch("http://localhost:7001/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Kullanıcı adı veya şifre hatalı!");
      }

      const adminData = {
        username: data.admin?.username,
        role: data.admin?.role || "admin",
        token: data.token,
        loginTime: Date.now(),
      };

      sessionStorage.setItem("adminUser", JSON.stringify(adminData));
      navigate(ADMIN_PANEL_PATH);
    } catch (err) {
      setError(err.message || "Giriş yapılamadı");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <h2>🐾 Admin Girişi</h2>
          <p>Hayvan Dostları Admin Paneline Hoşgeldiniz</p>
        </div>

        {error && <div className="admin-login-error">{error}</div>}

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="form-group">
            <label htmlFor="username">Kullanıcı Adı</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Şifre</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="admin-login-button">
            {loading ? "Kontrol ediliyor..." : "Giriş Yap"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
