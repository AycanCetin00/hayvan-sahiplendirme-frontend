import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/YardimDurumu.css";

const YardimDurumu = () => {
  const [basvurular, setBasvurular] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const localUser = localStorage.getItem("user");

    if (localUser) {
      try {
        const userObj = JSON.parse(localUser);
        fetchBasvurular(userObj.id);
      } catch (e) {
        setError("Oturum bilgilerinize ulaşılamadı.");
      }
    } else {
      setError("Yardım durumu görmek için lütfen giriş yapın.");
      setTimeout(() => navigate("/"), 2000);
    }
  }, [navigate]);

  const fetchBasvurular = async (userId) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:7001/api/yardim-basvurulari/${userId}`,
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Başvurular alınamadı");
      }

      setBasvurular(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError(err.message || "Başvurular yüklenirken hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const getDurumBadge = (durum) => {
    const durumMap = {
      bekliyor: { label: "Bekliyor", class: "durum-inceleniyor" },
      çözüldü: { label: "Çözüldü", class: "durum-cozuldu" },
    };

    const durumBilgi = durumMap[durum?.toLowerCase()] || {
      label: durum || "Bilinmiyor",
      class: "durum-unknown",
    };
    return durumBilgi;
  };

  const getAciliyetRengi = (aciliyet) => {
    switch (aciliyet?.toLowerCase()) {
      case "yüksek":
        return "aciliyet-yuksek";
      case "orta":
        return "aciliyet-orta";
      case "düşük":
        return "aciliyet-dusuk";
      default:
        return "aciliyet-orta";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="yardim-durumu-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Başvurularınız yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="yardim-durumu-container">
      <div className="yardim-durumu-header">
        <h1>Yardım Başvururlarım</h1>
        <p className="subtitle">
          Gönderdiğiniz yardım başvurularının durumunu takip edin
        </p>
      </div>

      {error && (
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i>
          {error}
        </div>
      )}

      {basvurular.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-inbox"></i>
          <h2>Henüz yardım başvurusu yapmadınız</h2>
          <p>
            Bir sorunla karşılaştıysanız, Yardım sayfasını ziyaret edip bize
            haber verin.
          </p>
          <button className="btn-yardim" onClick={() => navigate("/yardim")}>
            Yardım Başvurusu Yap
          </button>
        </div>
      ) : (
        <div className="basvurular-list">
          {basvurular.map((basvuru) => {
            const durumBilgi = getDurumBadge(basvuru.durum);
            const aciliyetClass = getAciliyetRengi(basvuru.aciliyet);
            const isExpanded = expandedId === basvuru.id;
            const hasCevap =
              basvuru.yonetici_notu && basvuru.yonetici_notu.trim() !== "";

            return (
              <div
                key={basvuru.id}
                className={`basvuru-card ${isExpanded ? "expanded" : ""}`}
                onClick={() => setExpandedId(isExpanded ? null : basvuru.id)}
              >
                <div className="basvuru-card-header">
                  <div className="baslik-bolumu">
                    <h3>{basvuru.konu}</h3>
                    <span className="tarih-kisa">
                      {formatDate(basvuru.created_at).split(" ")[0]}
                    </span>
                  </div>
                  <div className="durum-bolusu">
                    <span className={`durum-badge ${durumBilgi.class}`}>
                      {durumBilgi.label}
                    </span>
                    <span className={`aciliyet-badge ${aciliyetClass}`}>
                      {basvuru.aciliyet}
                    </span>
                    <i
                      className={`fas fa-chevron-down ${
                        isExpanded ? "rotated" : ""
                      }`}
                    ></i>
                  </div>
                </div>

                {isExpanded && (
                  <div className="basvuru-card-content">
                    <div className="aciklama-bolumu">
                      <h4>Açıklama</h4>
                      <p>{basvuru.aciklama}</p>
                    </div>

                    {hasCevap ? (
                      <div className="cevap-bolumu">
                        <div className="cevap-header">
                          <i className="fas fa-check-circle"></i>
                          <h4>Cevap Alındı</h4>
                        </div>
                        <p>{basvuru.yonetici_notu}</p>
                      </div>
                    ) : (
                      <div className="bekleniyor-bolumu">
                        <div className="bekleniyor-header">
                          <i className="fas fa-clock"></i>
                          <h4>Cevap Bekleniyor</h4>
                        </div>
                        <p>
                          Başvurunuz incelenmektedir. Kısa sürede sizinle
                          iletişime geçeceğiz.
                        </p>
                      </div>
                    )}

                    <div className="tarih-detay">
                      <div className="tarih-item">
                        <span className="label">Gönderme Tarihi:</span>
                        <span className="deger">
                          {formatDate(basvuru.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default YardimDurumu;
