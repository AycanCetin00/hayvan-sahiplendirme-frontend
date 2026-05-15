import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPhotoSrc } from "../utils/photoSrc";
import "../styles/Bildirimler.css";

const Bildirimler = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
          navigate("/login");
          return;
        }

        const endpoint = `http://localhost:7001/api/users/${user.id}/received-adoption-requests`;
        const response = await fetch(endpoint);

        if (!response.ok) {
          throw new Error(`HTTP hatası! Durum: ${response.status}`);
        }

        const data = await response.json();
        setRequests(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [navigate]);

  const handleRequestClick = (requestId) => {
    navigate(`/bildirim-detay/${requestId}`);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Başvurular yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-alert">
          <h3>Hata Oluştu!</h3>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="retry-button"
          >
            Yeniden Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bildirimler-container">
      <h2>Gelen Sahiplendirme Başvuruları</h2>

      {requests.length === 0 ? (
        <div className="no-requests">
          <p>Henüz hiç başvuru bulunmamaktadır</p>
        </div>
      ) : (
        <div className="requests-grid">
          {requests.map((request) => (
            <div
              key={request.request_id}
              className={`request-card ${request.status}`}
              onClick={() => handleRequestClick(request.request_id)}
            >
              {/* Üst: isim + durum badge */}
              <div className="card-header">
                <span className="pet-name">
                  {request.petName || "İsimsiz Hayvan"}
                </span>
                <span className={`status-badge ${request.status}`}>
                  {request.status === "pending" && "BEKLİYOR"}
                  {request.status === "approved" && "ONAYLANDI"}
                  {request.status === "rejected" && "REDDEDİLDİ"}
                </span>
              </div>

              {/* Alt: fotoğraf + bilgiler */}
              <div className="card-body">
                {request.ilan_photo ? (
                  <img
                    src={getPhotoSrc(request.ilan_photo)}
                    alt={request.petName}
                    className="pet-thumbnail"
                  />
                ) : (
                  <div className="pet-thumbnail placeholder">🐾</div>
                )}
                <div className="pet-meta">
                  <p>
                    <strong>Sahiplendiren:</strong> {request.requester_name}
                  </p>
                  <p>
                    <strong>Tarih:</strong>{" "}
                    {request.request_date || "Belirtilmemiş"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bildirimler;
