import React, { useState } from "react";

const ForgotPasswordModal = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [errorDetails, setErrorDetails] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendLink = async () => {
    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      setError("Lütfen e-posta adresinizi girin.");
      return;
    }

    setIsLoading(true);
    setError("");
    setErrorDetails("");
    setMessage("");

    try {
      const payload = {
        email: normalizedEmail,
        emailOrPhone: normalizedEmail,
      };

      const res = await fetch("http://localhost:7001/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const rawBody = await res.text();
      let data = null;

      try {
        data = rawBody ? JSON.parse(rawBody) : null;
      } catch (parseErr) {
        data = null;
      }

      if (!res.ok) {
        const backendMessage =
          (data && (data.message || data.error)) || rawBody || "Bilinmeyen hata";

        const detailedMessage = `İstek başarısız: ${res.status} ${res.statusText}`;
        setError(detailedMessage);
        setErrorDetails(
          `Gonderilen payload: ${JSON.stringify(payload)}\n` +
            `Status: ${res.status} ${res.statusText}\n` +
            `Backend mesaji: ${backendMessage}`,
        );
        return;
      }

      setMessage(
        "Eğer bu e-posta kayıtlıysa, şifre sıfırlama bağlantısı gönderildi.",
      );
    } catch (err) {
      setError("İstek sırasında ağ veya sunucu bağlantı hatası oluştu.");
      setErrorDetails(
        `Hata tipi: ${err.name || "Error"}\n` +
          `Hata mesaji: ${err.message || "Bilinmeyen hata"}\n` +
          `API: POST http://localhost:7001/forgot-password`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay show" onClick={onClose}>
      <div
        className="modal-content auth-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-modal" onClick={onClose}>
          ×
        </button>
        <h2>Şifremi Unuttum</h2>

        <input
          type="email"
          placeholder="E-posta adresiniz"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          className="btn auth-btn"
          onClick={handleSendLink}
          disabled={isLoading}
        >
          {isLoading ? "Gönderiliyor..." : "Sıfırlama Bağlantısı Gönder"}
        </button>

        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}
        {errorDetails && (
          <pre
            style={{
              width: "100%",
              marginTop: "10px",
              background: "#fff3f3",
              color: "#8b0000",
              border: "1px solid #ffc9c9",
              borderRadius: "6px",
              padding: "10px",
              fontSize: "12px",
              whiteSpace: "pre-wrap",
            }}
          >
            {errorDetails}
          </pre>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
