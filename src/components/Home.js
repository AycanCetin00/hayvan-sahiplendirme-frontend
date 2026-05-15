import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPhotoSrc } from "../utils/photoSrc";

import "../styles/Home.css";
import "../styles/Header.css";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [allAds, setAllAds] = useState([]); // Tüm ilanları saklayacak state
  const [filteredAds, setFilteredAds] = useState([]); // Filtrelenmiş ilanları saklayacak state
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleDetailClick = (adId) => {
    const ad = filteredAds.find((ad) => ad.id === adId);
    navigate(`/ilan/${adId}`, { state: { ad } });
  };

  // Son iki haftaya ait ilanları filtreleyen fonksiyon
  const filterLastTwoWeeksAds = (ads) => {
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14); // 14 gün (2 hafta) öncesi

    return ads.filter((ad) => {
      const createdAt = new Date(ad.created_at);
      return createdAt >= twoWeeksAgo;
    });
  };

  // API bağlantısı
  useEffect(() => {
    const kullanici_id = localStorage.getItem("kullanici_id") || "all";

    const apiUrl = `http://localhost:7001/api/ilanlar?kullanici_id=${kullanici_id}`;

    fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(
              `API yanıtı: ${response.status} - ${response.statusText}${text ? ": " + text : ""}`,
            );
          });
        }
        return response.json();
      })
      .then((data) => {
        setAllAds(data);

        // İlanları filtreleme
        const lastTwoWeeksAds = filterLastTwoWeeksAds(data);

        // İlanları created_at tarihine göre sıralama (en yeni en üstte)
        const sortedAds = lastTwoWeeksAds.sort((a, b) => {
          return new Date(b.created_at) - new Date(a.created_at);
        });

        setFilteredAds(sortedAds);
        setLoading(false);
        setError(null);
      })
      .catch((error) => {
        setLoading(false);
        setError(error.message);
      });
  }, []);

  // Checkbox değerlerini tik simgesine çeviren fonksiyon
  const renderCheckbox = (value) => {
    return value ? "✓" : "✗";
  };

  return (
    <div>
      <main className="page-wrapper">
        <section className="hero">
          <div className="hero-left">
            <div
              className="hero-box"
              style={{
                background: "#f8f5ec",
                borderRadius: "18px",
                boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
                padding: "32px 32px 28px 32px",
                maxWidth: 520,
                marginLeft: 0,
                marginTop: 10,
                marginBottom: 10,
                border: "1.5px solid #e9e5d6",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <h2
                style={{
                  color: "#4F6D7A",
                  fontSize: "2.5rem",
                  fontWeight: 700,
                  marginBottom: 10,
                  letterSpacing: "-1px",
                  lineHeight: 1.15,
                  fontFamily: "serif, Georgia, Times New Roman, Times",
                }}
              >
                Hayvan Sahiplendirme Platformu - SafePaw
              </h2>
              <p
                className="hero-slogan"
                style={{
                  color: "#222",
                  fontSize: "1.15rem",
                  marginBottom: 22,
                  fontWeight: 400,
                }}
              >
                Satın alma, Sahiplen.
              </p>
              <button
                className="start-adopt-btn"
                onClick={() => navigate("/animal-listing")}
                style={{
                  background: "#b86b4b",
                  color: "#fff",
                  border: "none",
                  borderRadius: 24,
                  fontSize: "1.1rem",
                  padding: "12px 32px",
                  fontWeight: 600,
                  boxShadow: "0 2px 8px rgba(205,133,63,0.08)",
                  cursor: "pointer",
                  transition: "background 0.2s",
                  marginTop: 5,
                }}
              >
                Sahiplenmeye Başla
              </button>
            </div>
          </div>
          <div className="hero-right">
            <img src="/main.jpg" alt="SafePaw Hero" className="hero-img-bg" />
          </div>
        </section>

        <div className="divider"></div>

        <section className="latest-ads">
          <h3 className="section-title">Son Eklenen İlanlar</h3>
          <p className="section-description">
            Son iki hafta içinde eklenen en güncel ilanları inceleyebilirsiniz.
          </p>

          {error && (
            <div className="error-message">
              <p>Veriler yüklenirken bir hata oluştu: {error}</p>
              <p>
                Lütfen sunucunun çalıştığından emin olun ve sayfayı yenileyin.
              </p>
            </div>
          )}

          <div className="ads-grid">
            {loading ? (
              <p>Yükleniyor...</p>
            ) : filteredAds.length > 0 ? (
              filteredAds.map((ad) => (
                <div
                  key={ad.id}
                  className="animal-card"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleDetailClick(ad.id)}
                >
                  <div className="animal-image">
                    {ad.photo || ad.photo_path || ad.photoUrl ? (
                      <img
                        src={getPhotoSrc(
                          ad.photo || ad.photo_path || ad.photoUrl,
                        )}
                        alt={ad.petName}
                      />
                    ) : (
                      <div className="animal-placeholder">Fotoğraf Yok</div>
                    )}
                    <div className="animal-badges">
                      <span
                        className={`animal-type ${ad.species === "Köpek" ? "dog" : "cat"}`}
                      >
                        {ad.species}
                      </span>
                    </div>
                  </div>
                  <div className="animal-info">
                    <h3>{ad.petName}</h3>
                    <p className="animal-location">
                      <span className="icon">📍</span>{" "}
                      {ad.city || "Belirtilmemiş"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p>Son iki haftaya ait ilan bulunamadı.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
