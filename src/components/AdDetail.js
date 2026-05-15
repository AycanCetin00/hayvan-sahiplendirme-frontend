import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPhotoSrc } from "../utils/photoSrc";
import "../styles/AdDetail.css";

const AdDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ad, setAd] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loggedInUserId, setLoggedInUserId] = useState(null);

  // Form için state'ler
  const [showAdoptionForm, setShowAdoptionForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    reason: "",
    experience: "",
    familyApproval: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    const fetchAdDetails = async () => {
      try {
        const response = await fetch(`http://localhost:7001/api/ilan/${id}`);
        if (!response.ok) {
          throw new Error("İlan bulunamadı");
        }
        const data = await response.json();
        // Veriyi normalize etme işlemi
        const normalizedData = {
          ...data,
          kullanici: {
            username:
              data.kullanici?.username || data.kullanici_adi || "Bilgi yok",
            soyadi: data.kullanici?.soyadi || data.kullanici_soyadi || "",
            email: data.kullanici?.email || "",
            telefon: data.kullanici?.telefon || "",
          },
        };
        setAd(normalizedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdDetails();

    // Oturum açmış kullanıcıyı kontrol et
    const checkLoggedInUser = () => {
      const userData = localStorage.getItem("currentUser");
      if (userData) {
        try {
          const user = JSON.parse(userData);
          setLoggedInUserId(user.id);
        } catch {
          setLoggedInUserId(null);
          localStorage.removeItem("currentUser");
        }
      } else {
        setLoggedInUserId(null);
      }
    };
    checkLoggedInUser();
  }, [id]);

  // Form girişlerini güncellemek için handler
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Form gönderme işlemi
  // Fix for the handleSubmitAdoptionForm function in AdDetail.jsx
  // AdDetail.jsx içindeki handleSubmitAdoptionForm fonksiyonunu debug işlemleriyle geliştirin

  const handleSubmitAdoptionForm = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    // Kullanıcı giriş yapmamışsa
    if (!loggedInUserId) {
      setSubmitError(
        "Sahiplendirme talebinde bulunmak için giriş yapmalısınız.",
      );
      setIsSubmitting(false);
      return;
    }

    // Gerçekte hangi URL'ye istek gönderiliyor, konsolda görelim
    const apiUrl = "http://localhost:7001/api/adoption-requests";

    // Gönderilecek verileri kontrol edelim
    const requestPayload = {
      adId: parseInt(id),
      requesterId: parseInt(loggedInUserId),
      ownerUserId: parseInt(ad.kullanici_id),
      reason: formData.reason,
      experience: formData.experience,
      familyApproval: formData.familyApproval,
      petName: ad.petName,
      ownerUsername: ad.kullanici.username,
    };

    try {
      // İstek yapılandırmasını ayrı tanımlayarak debug edelim
      const requestConfig = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestPayload),
      };

      // İsteği gönder ve tam yanıtı logla
      const response = await fetch(apiUrl, requestConfig);

      // Başarısız yanıt durumunda daha fazla bilgi al
      if (!response.ok) {
        let errorMessage = `HTTP hata kodu: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData?.error || errorMessage;
        } catch (jsonError) {}
        throw new Error(errorMessage);
      }

      // Başarılı yanıt
      const responseData = await response.json();

      setSubmitSuccess(true);
      // 3 saniye sonra formu kapat
      setTimeout(() => {
        setShowAdoptionForm(false);
        setSubmitSuccess(false);
        setFormData({
          name: "",
          email: "",
          phone: "",
          address: "",
          reason: "",
          experience: "",
          familyApproval: false,
        });
      }, 3000);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdopt = () => {
    setShowAdoptionForm(true);
  };

  // Modal dışı tıklamada kapatma
  const handleCloseModal = (e) => {
    if (e.target.classList.contains("adoption-form-modal")) {
      setShowAdoptionForm(false);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>İlan detayları yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!ad) {
    return <div className="error-message">İlan verisi bulunamadı.</div>;
  }

  return (
    <div className="ad-detail-container">
      <div className="ad-detail-card">
        <div className="ad-header">
          <h1>{ad.petName}</h1>
          <div className="ad-date">
            <i className="fas fa-calendar-alt"></i>
            {new Date(ad.created_at).toLocaleDateString("tr-TR")}
          </div>
        </div>

        <div className="ad-content-grid">
          {/* Sol Bölüm - Fotoğraf */}
          <div className="ad-photo-section">
            {ad.photo || ad.photo_path || ad.photoUrl ? (
              <img
                src={getPhotoSrc(ad.photo || ad.photo_path || ad.photoUrl)}
                alt={ad.petName}
                className="pet-photo"
              />
            ) : (
              <div className="pet-photo-placeholder">
                <i className="fas fa-paw"></i>
                <p>Fotoğraf Yok</p>
              </div>
            )}

            {/* İlan Sahibi Bilgileri - Mobilde üstte yer alacak */}
            <div className="user-info-section-mobile">
              <div className="user-info-header">
                <div className="user-avatar">
                  {ad.kullanici?.username?.charAt(0).toUpperCase() || "K"}
                </div>
                <h3>
                  {ad.kullanici?.username} {ad.kullanici?.soyadi}
                </h3>
              </div>
              <div className="contact-buttons">
                {ad.kullanici?.email && (
                  <button
                    className="contact-btn email-btn"
                    onClick={() =>
                      (window.location.href = `mailto:${ad.kullanici.email}`)
                    }
                  >
                    <i className="fas fa-envelope"></i> E-posta
                  </button>
                )}
                {ad.kullanici?.telefon && (
                  <button
                    className="contact-btn phone-btn"
                    onClick={() =>
                      (window.location.href = `tel:${ad.kullanici.telefon}`)
                    }
                  >
                    <i className="fas fa-phone"></i> Ara
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sağ Bölüm - Detaylar */}
          <div className="ad-details-section">
            {/* İlan Sahibi Bilgileri - Masaüstünde gösterilecek */}
            <div className="user-info-section-desktop">
              <div className="user-info-header">
                <div className="user-avatar">
                  {ad.kullanici?.username?.charAt(0).toUpperCase() || "K"}
                </div>
                <div>
                  <h3>İlan Sahibi</h3>
                  <p>
                    {ad.kullanici?.username} {ad.kullanici?.soyadi}
                  </p>
                </div>
              </div>
            </div>

            <div className="pet-info-section">
              <h3>Evcil Hayvan Bilgileri</h3>
              <div className="pet-badges">
                <div className="pet-badge">
                  <i className="fas fa-paw"></i>
                  <span>{ad.species || "Belirtilmemiş"}</span>
                </div>
                <div className="pet-badge">
                  <i className="fas fa-dna"></i>
                  <span>{ad.breed || "Belirtilmemiş"}</span>
                </div>
                <div className="pet-badge">
                  <i className="fas fa-venus-mars"></i>
                  <span>{ad.gender || "Belirtilmemiş"}</span>
                </div>
                <div className="pet-badge">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>{ad.city || "Belirtilmemiş"}</span>
                </div>
              </div>

              <div className="pet-details-grid">
                <div className="detail-item">
                  <i className="fas fa-birthday-cake"></i>
                  <div>
                    <span className="detail-label">Doğum Tarihi</span>
                    <span className="detail-value">
                      {ad.birthDate
                        ? new Date(ad.birthDate).toLocaleDateString("tr-TR")
                        : "Belirtilmemiş"}
                    </span>
                  </div>
                </div>
                <div className="detail-item">
                  <i
                    className={`fas fa-syringe ${ad.vaccinated ? "active" : ""}`}
                  ></i>
                  <div>
                    <span className="detail-label">Aşılar</span>
                    <span className="detail-value">
                      {ad.vaccinated ? "Evet" : "Hayır"}
                    </span>
                  </div>
                </div>
                <div className="detail-item">
                  <i
                    className={`fas fa-toilet ${ad.toiletTrained ? "active" : ""}`}
                  ></i>
                  <div>
                    <span className="detail-label">Tuvalet Eğitimi</span>
                    <span className="detail-value">
                      {ad.toiletTrained ? "Var" : "Yok"}
                    </span>
                  </div>
                </div>
                <div className="detail-item">
                  <i
                    className={`fas fa-graduation-cap ${ad.basicTrained ? "active" : ""}`}
                  ></i>
                  <div>
                    <span className="detail-label">Temel Eğitim</span>
                    <span className="detail-value">
                      {ad.basicTrained ? "Var" : "Yok"}
                    </span>
                  </div>
                </div>
                <div className="detail-item">
                  <i
                    className={`fas fa-heart ${ad.neutered ? "active" : ""}`}
                  ></i>
                  <div>
                    <span className="detail-label">Kısırlaştırma</span>
                    <span className="detail-value">
                      {ad.neutered ? "Evet" : "Hayır"}
                    </span>
                  </div>
                </div>
              </div>
              {ad.hadHealthIssue === "yes" && (
                <div className="detail-item">
                  <i className="fas fa-notes-medical"></i>
                  <div>
                    <span className="detail-label">Sağlık Sorunu</span>
                    <span className="detail-value">
                      Evet {ad.healthIssueDetail && `- ${ad.healthIssueDetail}`}
                    </span>
                  </div>
                </div>
              )}

              {ad.description && (
                <div className="pet-description">
                  <h3>Açıklama</h3>
                  <p>{ad.description}</p>
                </div>
              )}
            </div>

            <div className="adopt-section">
              <button className="adopt-btn" onClick={handleAdopt}>
                <i className="fas fa-heart"></i> Sahiplenmek İstiyorum
              </button>
              <button className="back-btn" onClick={() => navigate(-1)}>
                <i className="fas fa-arrow-left"></i> Geri Dön
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sahiplendirme Formu Modal */}
      {showAdoptionForm && (
        <div className="adoption-form-modal" onClick={handleCloseModal}>
          <div className="adoption-form-container">
            <div className="modal-header">
              <h2>Sahiplendirme Başvurusu</h2>
              <button
                className="close-modal"
                onClick={() => setShowAdoptionForm(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {submitSuccess ? (
              <div className="success-message">
                <i className="fas fa-check-circle"></i>
                <h3>Başvurunuz Gönderildi!</h3>
                <p>
                  Sahiplendirme talebiniz {ad.kullanici.username}{" "}
                  {ad.kullanici.soyadi} adlı kullanıcıya iletildi. Size en kısa
                  sürede dönüş yapılacaktır.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitAdoptionForm}>
                <div className="form-group">
                  <label htmlFor="address">Açık Adresiniz</label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>

                <div className="form-group">
                  <label htmlFor="reason">
                    Neden {ad.petName} isimli hayvanı sahiplenmek istiyorsunuz?
                  </label>
                  <textarea
                    id="reason"
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>

                <div className="form-group">
                  <label htmlFor="experience">
                    Daha önce evcil hayvan sahipliği deneyiminiz var mı? Varsa
                    açıklayınız.
                  </label>
                  <textarea
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>

                <div className="form-group checkbox-group">
                  <input
                    type="checkbox"
                    id="familyApproval"
                    name="familyApproval"
                    checked={formData.familyApproval}
                    onChange={handleInputChange}
                    required
                  />
                  <label htmlFor="familyApproval">
                    Aile fertlerimin/ev arkadaşlarımın bir evcil hayvan
                    sahiplenmek konusunda onayını aldım.
                  </label>
                </div>

                {submitError && (
                  <div className="error-message">
                    <i className="fas fa-exclamation-circle"></i>
                    <p>{submitError}</p>
                  </div>
                )}

                <div className="form-buttons">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setShowAdoptionForm(false)}
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="spinner-small"></div>
                        Gönderiliyor...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane"></i>
                        Başvuruyu Gönder
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdDetail;
