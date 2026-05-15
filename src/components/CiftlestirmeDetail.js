import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPhotoSrc } from "../utils/photoSrc";
import "../styles/CiftlestirmeDetail.css";

const CiftlestirmeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ilan, setIlan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    ownPetBreed: "",
    ownPetAge: "",
    note: "",
  });

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await fetch(
          `http://localhost:7001/api/ciftlestirme/ilan/${id}`,
        );
        if (!response.ok) {
          throw new Error("İlan detayı getirilemedi.");
        }

        const data = await response.json();
        setIlan(data);
      } catch (err) {
        setError(err.message || "Bir hata oluştu.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  const getImageSrc = () => {
    if (!ilan) return null;

    return getPhotoSrc(ilan.photo || ilan.photo_path || ilan.photoUrl);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Bu aşamada veritabanına gönderim yok; sadece arayüz akışı.
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
    }, 700);
  };

  if (isLoading) {
    return (
      <div className="cift-detail-loading">
        <div className="spinner"></div>
        <p>İlan detayı yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return <div className="cift-detail-error">{error}</div>;
  }

  if (!ilan) {
    return <div className="cift-detail-error">İlan bulunamadı.</div>;
  }

  return (
    <div className="cift-detail-page">
      <div className="cift-detail-card">
        <div className="cift-detail-header">
          <h1>{ilan.petName}</h1>
          <p>
            {ilan.species} • {ilan.breed}
          </p>
        </div>

        <div className="cift-detail-grid">
          <div className="cift-detail-photo-wrap">
            {ilan.photo || ilan.photo_path || ilan.photoUrl ? (
              <img
                src={getImageSrc()}
                alt={ilan.petName}
                className="cift-detail-photo"
              />
            ) : (
              <div className="cift-detail-placeholder">Fotoğraf Yok</div>
            )}
          </div>

          <div className="cift-detail-info">
            <div className="cift-detail-tags">
              <span>📍 {ilan.city || "Belirtilmemiş"}</span>
              <span>⚥ {ilan.gender || "Belirtilmemiş"}</span>
              <span>💉 {ilan.vaccinated ? "Aşılı" : "Aşı Bilgisi Yok"}</span>
              <span>
                ❤ {ilan.neutered ? "Kısırlaştırılmış" : "Kısırlaştırılmamış"}
              </span>
            </div>

            <div className="cift-detail-box">
              <h3>Çiftleştirme Kriterleri</h3>
              <p>Aranan Irk: {ilan.aranan_irk || "Belirtilmemiş"}</p>
              <p>Aranan Cinsiyet: {ilan.aranan_cinsiyet || "Belirtilmemiş"}</p>
            </div>

            {ilan.description && (
              <div className="cift-detail-box">
                <h3>Açıklama</h3>
                <p>{ilan.description}</p>
              </div>
            )}

            <div className="cift-detail-actions">
              <button
                className="cift-apply-btn"
                onClick={() => setShowForm(true)}
              >
                Çiftleştirmek İçin Başvuru
              </button>
              <button className="cift-back-btn" onClick={() => navigate(-1)}>
                Geri Dön
              </button>
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <div
          className="cift-modal"
          onClick={(e) =>
            e.target.classList.contains("cift-modal") && setShowForm(false)
          }
        >
          <div className="cift-modal-card">
            <div className="cift-modal-header">
              <h2>Çiftleştirme Başvurusu</h2>
              <button onClick={() => setShowForm(false)}>X</button>
            </div>

            {submitSuccess ? (
              <div className="cift-success">
                Başvurunuz alındı. Bu ekran simülasyon amaçlıdır, henüz
                veritabanına kaydedilmiyor.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="cift-form">
                <input
                  type="text"
                  name="name"
                  placeholder="Ad Soyad"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="phone"
                  placeholder="Telefon"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="ownPetBreed"
                  placeholder="Kendi hayvanınızın ırkı"
                  value={formData.ownPetBreed}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="number"
                  min="0"
                  name="ownPetAge"
                  placeholder="Kendi hayvanınızın yaşı"
                  value={formData.ownPetAge}
                  onChange={handleInputChange}
                  required
                />
                <textarea
                  name="note"
                  rows="4"
                  placeholder="Kısa açıklama"
                  value={formData.note}
                  onChange={handleInputChange}
                  required
                />

                <button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Gönderiliyor..." : "Başvuruyu Gönder"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CiftlestirmeDetail;
