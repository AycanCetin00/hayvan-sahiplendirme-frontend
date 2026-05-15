import React, { useState, useEffect } from "react";
import "../styles/Yardim.css";

const Yardim = () => {
  const [formData, setFormData] = useState({
    konu: "",
    aciliyet: "Orta", // Varsayılan değer
    aciklama: "",
  });

  const [gonderildi, setGonderildi] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Kullanıcı oturum kontrolü - localStorage'dan veya oturum yönetimi sisteminizden alınabilir
  useEffect(() => {
    const localUser = localStorage.getItem("user");

    if (localUser) {
      try {
        const userObj = JSON.parse(localUser);
        setUserId(userObj.id);
      } catch (e) {
        setError(
          "Oturum bilgilerinize ulaşılamadı. Lütfen yeniden giriş yapın.",
        );
      }
    } else {
      setError("Yardım başvurusu yapmak için lütfen giriş yapın.");
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!userId) {
      setError("Kullanıcı bilgisi bulunamadı. Lütfen giriş yapın.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:7001/api/yardim-basvurusu",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            konu: formData.konu,
            aciliyet: formData.aciliyet,
            aciklama: formData.aciklama,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Başvuru gönderilirken bir hata oluştu");
      }

      setGonderildi(true);
      setFormData({ konu: "", aciliyet: "Orta", aciklama: "" });
    } catch (err) {
      setError(err.message || "Başvuru gönderilirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  // Kullanıcının daha önce yaptığı başvuruları gösterme (opsiyonel)
  const [oncekiBasvurular, setOncekiBasvurular] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const getBasvuruGecmisi = async () => {
    if (!userId) return;

    try {
      const response = await fetch(
        `http://localhost:7001/api/yardim-basvurulari/${userId}`,
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error("Başvuru geçmişi alınamadı");
      }

      setOncekiBasvurular(data);
    } catch (err) {}
  };

  useEffect(() => {
    if (showHistory && userId) {
      getBasvuruGecmisi();
    }
  }, [showHistory, userId]);

  return (
    <div className="yardim-container">
      <h2 className="yardim-title">Bize Ulaşın</h2>

      {error && (
        <div className="yardim-error">
          <p>{error}</p>
        </div>
      )}

      {gonderildi ? (
        <div className="yardim-success">
          <p>Mesajınız için teşekkürler! En kısa sürede dönüş yapacağız.</p>
          <button
            className="yardim-button secondary"
            onClick={() => setGonderildi(false)}
          >
            Yeni Başvuru Yap
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="yardim-form">
          <label className="yardim-label">
            Konu:
            <input
              type="text"
              name="konu"
              value={formData.konu}
              onChange={handleChange}
              required
              className="yardim-input"
              placeholder="Yardım konusunu kısaca belirtin"
              disabled={loading}
            />
          </label>

          <label className="yardim-label">
            Aciliyet:
            <select
              name="aciliyet"
              value={formData.aciliyet}
              onChange={handleChange}
              required
              className="yardim-select"
              disabled={loading}
            >
              <option value="Düşük">Düşük</option>
              <option value="Orta">Orta</option>
              <option value="Yüksek">Yüksek</option>
            </select>
          </label>

          <label className="yardim-label">
            Açıklama:
            <textarea
              name="aciklama"
              value={formData.aciklama}
              onChange={handleChange}
              required
              rows="5"
              className="yardim-textarea"
              placeholder="Lütfen sorununuzu detaylıca açıklayın"
              disabled={loading}
            ></textarea>
          </label>

          <button
            type="submit"
            className="yardim-button"
            disabled={loading || !userId}
          >
            {loading ? "Gönderiliyor..." : "Gönder"}
          </button>
        </form>
      )}

      {userId && !gonderildi && (
        <div className="yardim-history-toggle">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="yardim-link-button"
          >
            {showHistory ? "Başvuru Geçmişini Gizle" : "Önceki Başvurularım"}
          </button>

          {showHistory && (
            <div className="yardim-history">
              <h3>Önceki Başvurularım</h3>

              {oncekiBasvurular.length === 0 ? (
                <p>Henüz bir başvurunuz bulunmuyor.</p>
              ) : (
                <ul className="yardim-history-list">
                  {oncekiBasvurular.map((basvuru) => (
                    <li key={basvuru.id} className="yardim-history-item">
                      <div className="yardim-history-header">
                        <strong>{basvuru.konu}</strong>
                        <span
                          className={`yardim-aciliyet yardim-aciliyet-${basvuru.aciliyet.toLowerCase()}`}
                        >
                          {basvuru.aciliyet}
                        </span>
                      </div>
                      <div className="yardim-history-date">
                        {basvuru.basvuru_tarihi}
                      </div>
                      <p className="yardim-history-description">
                        {basvuru.aciklama}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Yardim;
