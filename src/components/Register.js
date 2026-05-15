import React, { useState } from "react";
import "../styles/Modal.css";

const Register = ({ onClose, onLoginClick }) => {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Şifre eşleşme kontrolü ekleyin
    if (formData.password !== formData.confirmPassword) {
      setError("Şifreler eşleşmiyor");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:7001/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          surname: formData.surname,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }),
        credentials: "include", // Oturum yönetimi için gerekli olabilir
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Kayıt başarısız");
      }

      setSuccess(true);
      setTimeout(() => onLoginClick(), 2000);
    } catch (err) {
      setError(err.message || "Kayıt işlemi sırasında bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  // Modal dışına tıklayınca kapat
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay show" onClick={handleOverlayClick}>
      <div className="modal-content auth-modal">
        <button className="close-modal" onClick={onClose}>
          ×
        </button>
        <h2 className="auth-title">Kayıt Ol</h2>

        {error && <div className="error-message">{error}</div>}
        {success && (
          <div className="success-message">
            Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>Adınız</label>
          <input
            type="text"
            name="name"
            placeholder="Adınızı girin"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label>Soyadınız</label>
          <input
            type="text"
            name="surname"
            placeholder="Soyadınızı girin"
            value={formData.surname}
            onChange={handleChange}
            required
          />

          <label>E-posta</label>
          <input
            type="email"
            name="email"
            placeholder="E-posta adresinizi girin"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>Telefon Numarası</label>
          <input
            type="tel"
            name="phone"
            placeholder="Telefon numaranızı girin"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <label>Şifre</label>
          <input
            type="password"
            name="password"
            placeholder="Şifrenizi girin"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="6"
          />

          <label>Şifre Tekrar</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Şifrenizi tekrar girin"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <button type="submit" className="btn auth-btn" disabled={isLoading}>
            {isLoading ? "İşleniyor..." : "Kayıt Ol"}
          </button>
        </form>

        <p className="auth-switch">
          Zaten bir hesabınız var mı?{" "}
          <span onClick={onLoginClick} className="switch-link">
            Giriş Yap
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
