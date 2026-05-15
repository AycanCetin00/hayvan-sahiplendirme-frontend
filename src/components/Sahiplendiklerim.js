import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getPhotoSrc } from "../utils/photoSrc";
import "../styles/Sahiplendiklerim.css";

const Sahiplendiklerim = () => {
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Kullanıcı bilgilerini ve token'ı güvenli şekilde alalım
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState("");
  const [manualToken, setManualToken] = useState("");

  // Component yüklenir yüklenmez localStorage'dan bilgileri al
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("currentUser");

      const possibleTokenKeys = [
        "token",
        "authToken",
        "jwt",
        "accessToken",
        "userToken",
      ];
      let storedToken = null;

      // Olası tüm token anahtarlarını dene
      for (const key of possibleTokenKeys) {
        const tempToken = localStorage.getItem(key);
        if (tempToken) {
          storedToken = tempToken;
          break;
        }
      }

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);

        // Kullanıcı ID'si farklı bir alanda olabilir, tüm olasılıkları kontrol et
        const extractedId =
          parsedUser.id || parsedUser.userId || parsedUser.user_id;

        if (extractedId) {
          setUserId(extractedId);
        } else {
        }
      }

      if (storedToken) {
        setToken(storedToken);
      }
    } catch (error) {}
  }, []);

  // Verileri çekmek için userId ve token değerleri hazır olduğunda istek yap
  useEffect(() => {
    // userId hazır değilse, henüz istek yapmayalım
    if (!userId) {
      return;
    }

    // Token yoksa veya boşsa ve manualToken de boşsa, warning göster ama devam et
    if ((!token || token === "") && (!manualToken || manualToken === "")) {
    }

    const effectiveToken = token || manualToken;

    const fetchSentRequests = async () => {
      setLoading(true);

      try {
        // Token varsa Authorization header'ını ekle, yoksa sadece Content-Type header'ını kullan
        const headers = {
          "Content-Type": "application/json",
        };

        if (effectiveToken) {
          headers["Authorization"] = `Bearer ${effectiveToken}`;
        }

        const response = await axios.get(
          `http://localhost:7001/api/users/${userId}/my-adoption-requests`,
          { headers },
        );

        // API'den gelen verileri detaylı logla

        if (Array.isArray(response.data)) {
          if (response.data.length > 0) {
          } else {
          }

          setSentRequests(response.data);
        } else {
          setError("API yanıtı beklenmeyen formatta");
        }
      } catch (err) {
        if (err.response?.status === 401) {
          setError(
            "Oturum süresi dolmuş veya token geçersiz. Lütfen tekrar giriş yapın.",
          );
        } else {
          setError(err.response?.data?.error || "Başvurular alınamadı");
        }
      } finally {
        setLoading(false);
      }
    };

    // Verileri getir
    fetchSentRequests();
  }, [userId, token, manualToken]); // userId, token veya manualToken değiştiğinde yeniden çalıştır

  const getStatusLabel = (status) => {
    switch (String(status).toLowerCase()) {
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

  const handleManualTokenChange = (e) => {
    setManualToken(e.target.value);
  };

  const reloadData = () => {
    setLoading(true);
    window.location.reload();
  };

  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Hata Oluştu</h2>
        <p>{error}</p>

        <div
          className="debug-info"
          style={{
            margin: "10px 0",
            padding: "10px",
            backgroundColor: "#f8f9fa",
            border: "1px solid #ddd",
            borderRadius: "4px",
          }}
        >
          <p>
            <strong>Debug Bilgisi:</strong>
          </p>
          <ul>
            <li>UserId: {userId || "Yok"}</li>
            <li>Token mevcut: {token ? "Evet" : "Hayır"}</li>
            <li>Manuel Token: {manualToken ? "Girilmiş" : "Girilmemiş"}</li>
          </ul>

          {/* Token giriş alanı */}
          <div style={{ marginTop: "10px" }}>
            <p>
              <strong>Test için manuel token girebilirsiniz:</strong>
            </p>
            <input
              type="text"
              placeholder="JWT Token"
              style={{ padding: "5px", marginRight: "10px", width: "300px" }}
              value={manualToken}
              onChange={handleManualTokenChange}
            />
          </div>

          {/* Kullanıcı kimliği yoksa manuel giriş seçeneği */}
          {!userId && (
            <div style={{ marginTop: "10px" }}>
              <p>
                <strong>Test için kullanıcı ID'si girin:</strong>
              </p>
              <input
                type="number"
                placeholder="Kullanıcı ID"
                style={{ padding: "5px", marginRight: "10px" }}
                onChange={(e) => setUserId(e.target.value)}
              />
            </div>
          )}
        </div>

        <button onClick={reloadData} className="retry-button">
          Tekrar Dene
        </button>
      </div>
    );
  }

  return (
    <div className="my-adoptions-container">
      <h1>Gönderdiğim Sahiplendirme Başvuruları</h1>

      {sentRequests.length === 0 ? (
        <p className="no-requests">Henüz başvuru bulunmamaktadır</p>
      ) : (
        <div className="adoption-requests-grid">
          {sentRequests.map((request, index) => {
            return (
              <div
                key={request.request_id || index}
                className="adoption-request-card"
                onClick={() =>
                  navigate(`/my-request-detail/${request.request_id}`)
                }
              >
                <div className="card-header">
                  <h3>{request.petName || "İsimsiz"}</h3>
                  <span
                    className={`status-badge ${getStatusLabel(request.status).className}`}
                  >
                    {getStatusLabel(request.status).text}
                  </span>
                </div>

                <div className="card-body">
                  {request.ilan_photo ? (
                    <img
                      src={getPhotoSrc(request.ilan_photo)}
                      alt={request.petName || "Evcil Hayvan"}
                      className="pet-thumbnail"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "";
                        e.target.alt = "Resim Yüklenemedi";
                        e.target.className = "no-image-placeholder";
                      }}
                    />
                  ) : (
                    <div className="no-image-placeholder">Resim Yok</div>
                  )}

                  <div className="request-details">
                    <p>
                      <strong>Sahiplendiren:</strong>{" "}
                      {request.owner_name || "Bilinmiyor"}
                    </p>
                    <p>
                      <strong>Tarih:</strong>{" "}
                      {request.request_date
                        ? new Date(request.request_date).toLocaleDateString(
                            "tr-TR",
                          )
                        : "Bilinmiyor"}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Sahiplendiklerim;
