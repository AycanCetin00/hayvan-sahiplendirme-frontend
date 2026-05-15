import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ForgotPasswordModal from "./ForgotPasswordModal";
import "../styles/Modal.css";

const Login = ({ onClose, onRegisterClick, onLoginSuccess, onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const isModal = typeof onClose === "function";

  const handleClose = () => {
    if (isModal) {
      onClose();
      return;
    }
    navigate("/");
  };

  const handleOpenRegister = () => {
    if (typeof onRegisterClick === "function") {
      onRegisterClick();
      return;
    }
    navigate("/register");
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:7001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailOrPhone: formData.emailOrPhone,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Giriş başarısız oldu");
      }

      // Başarılı giriş işlemleri
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("currentUser", JSON.stringify(data.user));

      // Üst componente başarılı girişi bildir
      if (onLoginSuccess) {
        onLoginSuccess(data.user);
      } else if (typeof onLogin === "function") {
        onLogin(data.user);
      }

      handleClose();
    } catch (err) {
      setError(err.message || "Bir hata oluştu, lütfen tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="modal-overlay show"
      onClick={isModal ? handleClose : undefined}
    >
      <div
        className="modal-content auth-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-modal" onClick={handleClose}>
          ×
        </button>
        <h2 className="auth-title">Giriş Yap</h2>

        {error && <div className="error-message">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="emailOrPhone"
            placeholder="E-posta veya Telefon Numarası"
            value={formData.emailOrPhone}
            onChange={handleChange}
            required
            autoComplete="username"
          />
          <input
            type="password"
            name="password"
            placeholder="Şifre"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
          />
          <button type="submit" className="btn auth-btn" disabled={isLoading}>
            {isLoading ? "Giriş Yapılıyor..." : "Giriş Yap"}
          </button>
        </form>

        <p className="auth-switch">
          <span
            onClick={() => setIsForgotPasswordOpen(true)}
            className="switch-link"
            style={{ cursor: "pointer" }}
          >
            Şifremi unuttum?
          </span>
        </p>

        <p className="auth-switch">
          Hesabınız yok mu?{" "}
          <span
            onClick={handleOpenRegister}
            className="switch-link"
            style={{ cursor: "pointer" }}
          >
            Kayıt Ol
          </span>
        </p>

        {isForgotPasswordOpen && (
          <ForgotPasswordModal onClose={() => setIsForgotPasswordOpen(false)} />
        )}
      </div>
    </div>
  );
};

export default Login;
