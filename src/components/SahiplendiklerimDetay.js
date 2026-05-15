import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { getPhotoSrc } from "../utils/photoSrc";
import "../styles/SahiplendiklerimDetay.css";

const AdoptionRequestDetailPage = () => {
  const [requestDetail, setRequestDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { requestId } = useParams();
  const navigate = useNavigate();

  // Kullanıcı bilgisini localStorage'dan al
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userId = currentUser ? currentUser.id : null;

  useEffect(() => {
    const fetchRequestDetail = async () => {
      try {
        if (!requestId) {
          setError("Geçersiz istek ID'si");
          setLoading(false);
          return;
        }

        // API'ye istek yapalım
        const response = await axios.get(
          `http://localhost:7001/api/adoption-requests/${requestId}`,
          {
            // Authorization header'ı ekleyelim (eğer kullanılıyorsa)
            headers: localStorage.getItem("token")
              ? {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
              : {},
          },
        );

        // Veriyi state'e set edelim
        setRequestDetail(response.data);
        setLoading(false);
      } catch (err) {
        // Daha detaylı hata mesajı gösterelim
        const errorMessage =
          err.response?.data?.error || err.message || "Bilinmeyen hata";
        setError(
          `Başvuru detayları yüklenirken bir hata oluştu: ${errorMessage}`,
        );
        setLoading(false);
      }
    };

    fetchRequestDetail();
  }, [requestId]);

  // Durum etiketini belirleyen fonksiyon
  const getStatusLabel = (status) => {
    switch (status) {
      case "pending":
        return { text: "Beklemede", className: "status-pending" };
      case "approved":
        return { text: "Onaylandı", className: "status-approved" };
      case "rejected":
        return { text: "Reddedildi", className: "status-rejected" };
      default:
        return { text: "Bilinmeyen", className: "status-unknown" };
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const response = await axios.put(
        `http://localhost:7001/api/adoption-requests/${requestId}/status`,
        { status: newStatus },
        // Authorization header'ı ekleyelim (eğer kullanılıyorsa)
        {
          headers: localStorage.getItem("token")
            ? {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              }
            : {},
        },
      );

      // Başarılı güncelleme sonrası detayları tekrar yükle
      const updatedDetailResponse = await axios.get(
        `http://localhost:7001/api/adoption-requests/${requestId}`,
        {
          headers: localStorage.getItem("token")
            ? {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              }
            : {},
        },
      );

      setRequestDetail(updatedDetailResponse.data);

      // Başarı mesajı göster
      alert(
        `Başvuru durumu başarıyla "${getStatusLabel(newStatus).text}" olarak güncellendi.`,
      );
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || err.message || "Bilinmeyen hata";
      alert(`Durum güncellenemedi: ${errorMessage}`);
    }
  };

  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!requestDetail) {
    return <div className="error">Başvuru bulunamadı</div>;
  }

  const statusInfo = getStatusLabel(requestDetail.status);

  return (
    <div className="adoption-request-detail-container">
      <div className="navigation">
        <button onClick={() => navigate(-1)} className="back-button">
          ← Geri Dön
        </button>
      </div>

      <div className="request-detail-card">
        <div className="card-header">
          <h1>{requestDetail.petName || "İsimsiz Hayvan"}</h1>
          <span className={`status-badge ${statusInfo.className}`}>
            {statusInfo.text}
          </span>
        </div>

        <div className="request-detail-content">
          <div className="pet-info">
            <h2>Hayvan Bilgileri</h2>
            <p>
              <strong>Tür:</strong> {requestDetail.species || "Belirtilmemiş"}
            </p>
            <p>
              <strong>Irk:</strong> {requestDetail.breed || "Belirtilmemiş"}
            </p>
            <p>
              <strong>Açıklama:</strong>{" "}
              {requestDetail.pet_description || "Açıklama yok"}
            </p>
          </div>

          {requestDetail.pet_photo && (
            <div className="pet-photo">
              <img
                src={getPhotoSrc(requestDetail.pet_photo)}
                alt={requestDetail.petName || "Hayvan Fotoğrafı"}
              />
            </div>
          )}

          <div className="requester-info">
            <h2>Başvuran Kullanıcı Bilgileri</h2>
            <p>
              <strong>Ad Soyad:</strong> {requestDetail.requester_name || ""}{" "}
              {requestDetail.requester_surname || "Belirtilmemiş"}
            </p>
            <p>
              <strong>E-posta:</strong>{" "}
              {requestDetail.requester_email || "Belirtilmemiş"}
            </p>
            <p>
              <strong>Telefon:</strong>{" "}
              {requestDetail.requester_phone || "Belirtilmemiş"}
            </p>
          </div>

          <div className="request-motivation">
            <h2>Başvuru Detayları</h2>
            <p>
              <strong>Sahiplenmek İsteme Nedeni:</strong>{" "}
              {requestDetail.reason || "Belirtilmemiş"}
            </p>
            <p>
              <strong>Hayvan Bakma Tecrübesi:</strong>{" "}
              {requestDetail.experience || "Belirtilmemiş"}
            </p>
            <p>
              <strong>Aile Onayı:</strong>
              {requestDetail.family_approval ? "Evet" : "Hayır"}
            </p>
            <p>
              <strong>Başvuru Tarihi:</strong>
              {requestDetail.request_date
                ? new Date(requestDetail.request_date).toLocaleDateString(
                    "tr-TR",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    },
                  )
                : "Belirtilmemiş"}
            </p>
          </div>

          {/* Sadece hayvan sahibi ve bekleyen başvurularda göster */}
          {requestDetail.status === "pending" &&
            requestDetail.animal_owner_id === parseInt(userId) && (
              <div className="action-buttons">
                <button
                  className="approve-button"
                  onClick={() => handleStatusChange("approved")}
                >
                  Onayla
                </button>
                <button
                  className="reject-button"
                  onClick={() => handleStatusChange("rejected")}
                >
                  Reddet
                </button>
              </div>
            )}

          {/* Başvuru onaylandıysa "Rapor Gönder" butonunu göster */}
          {requestDetail.status === "approved" && (
            <div className="tracking-button-container">
              <button
                className="tracking-button"
                onClick={() => navigate(`/takip-formu/${requestDetail.ad_id}`)}
              >
                Rapor Gönder
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdoptionRequestDetailPage;
