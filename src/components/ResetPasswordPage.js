import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/Auth.css";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!newPassword || newPassword.length < 6) {
      setError("Şifre en az 6 karakter olmalı.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Şifreler eşleşmiyor.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:7001/reset-password/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newPassword }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Şifre sıfırlama başarısız oldu.");
      }

      setMessage("Şifreniz başarıyla güncellendi. Giriş sayfasına yönlendiriliyorsunuz.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.message || "Bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Yeni Şifre Belirle</h2>
      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Yeni şifre"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          minLength={6}
        />
        <input
          type="password"
          placeholder="Yeni şifre (tekrar)"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={6}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Kaydediliyor..." : "Şifreyi Güncelle"}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
