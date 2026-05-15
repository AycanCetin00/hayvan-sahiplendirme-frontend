import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/Bildirimler.css";

const BildirimDetay = () => {
  const { requestId } = useParams();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequestDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:7001/api/adoption-requests/${requestId}`,
        );
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setRequest(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRequestDetails();
  }, [requestId]);

  const handleStatusUpdate = async (newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:7001/api/adoption-requests/${requestId}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        },
      );

      if (!response.ok) throw new Error("Durum güncellenemedi");
      const data = await response.json();

      setRequest((prev) => ({ ...prev, status: newStatus }));
    } catch (err) {}
  };

  if (loading) return <div className="loading">Yükleniyor...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="detay-wrapper">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Geri
      </button>

      <div className="detay-card">
        <h1 className="detay-title">{request.petName} için Başvuru</h1>

        {request.status !== "pending" && (
          <div className={`status-label ${request.status}`}>
            {request.status === "approved" ? "Onaylandı" : "Reddedildi"}
          </div>
        )}

        <div className="info-grid">
          <div className="info-block">
            <h2>🐾 Hayvan Bilgileri</h2>
            <p>
              <strong>Tür:</strong> {request.species}
            </p>
            <p>
              <strong>Cins:</strong> {request.breed}
            </p>
            <p>
              <strong>Açıklama:</strong> {request.pet_description}
            </p>
          </div>

          <div className="info-block">
            <h2>👤 Başvuru Sahibi</h2>
            <p>
              <strong>Ad Soyad:</strong> {request.requester_name}{" "}
              {request.requester_surname}
            </p>
            <p>
              <strong>Telefon:</strong> {request.requester_phone}
            </p>
            <p>
              <strong>E-posta:</strong> {request.requester_email}
            </p>
          </div>

          <div className="info-block">
            <h2>📄 Başvuru Detayları</h2>
            <p>
              <strong>Tarih:</strong>{" "}
              {new Date(request.request_date).toLocaleString("tr-TR")}
            </p>
            <p>
              <strong>Sebep:</strong> {request.reason}
            </p>
            <p>
              <strong>Deneyim:</strong> {request.experience}
            </p>
            <p>
              <strong>Aile Onayı:</strong>{" "}
              {request.family_approval ? "Evet" : "Hayır"}
            </p>
          </div>
        </div>

        {request.status === "pending" && (
          <div className="button-group">
            <button
              className="btn-approve"
              onClick={() => handleStatusUpdate("approved")}
            >
              Onayla
            </button>
            <button
              className="btn-reject"
              onClick={() => handleStatusUpdate("rejected")}
            >
              Reddet
            </button>
          </div>
        )}

        {request.status === "approved" && (
          <div className="report-button-group">
            <button
              className="btn-report"
              onClick={() => navigate(`/rapor/${requestId}`)}
            >
              Sahiplendirme Raporunu Gör
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BildirimDetay;
