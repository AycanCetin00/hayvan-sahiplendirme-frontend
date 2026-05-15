import React, { useEffect, useState } from "react";
import axios from "axios";
import { getPhotoSrc } from "../utils/photoSrc";
import "../styles/RaporGörüntüle.css";

const DurumTakipRaporlari = () => {
  const [raporlar, setRaporlar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userId = currentUser?.id;

  useEffect(() => {
    const fetchRaporlar = async () => {
      if (!userId) {
        setError("Kullanıcı bilgisi bulunamadı");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          `http://localhost:7001/api/durum-takibi/hayvan-sahibi/${userId}`,
        );
        setRaporlar(response.data);
      } catch (error) {
        setError("Raporlar alınırken bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    fetchRaporlar();
  }, [userId]);

  if (loading) return <div className="loading">Yükleniyor...</div>;
  if (error) return <div className="error">{error}</div>;
  if (raporlar.length === 0)
    return <div className="empty">Henüz durum raporu yok.</div>;

  return (
    <div className="raporlar-container">
      <h1 className="rapor-title">📊 Durum Takip Raporları</h1>
      <div className="rapor-grid">
        {raporlar.map((rapor) => (
          <div className="rapor-card" key={rapor.id}>
            <div className="rapor-content">
              <div className="rapor-foto-container">
                {rapor.fotograf ? (
                  <img
                    src={getPhotoSrc(rapor.fotograf)}
                    alt="Durum Fotoğrafı"
                    className="rapor-foto"
                  />
                ) : (
                  <div className="no-photo">Fotoğraf Yok</div>
                )}
              </div>
              <div className="rapor-detay">
                <h3 className="rapor-baslik">
                  {rapor.petName
                    ? `${rapor.petName} Durum Güncellemesi`
                    : `İlan #${rapor.ilan_id} Durum Güncellemesi`}
                </h3>

                <div className="rapor-bilgiler">
                  <div className="bilgi-grubu">
                    <h4>Hayvan Bilgileri</h4>
                    <p>
                      <strong>Hayvan Adı:</strong>{" "}
                      {rapor.petName || "Bilgi yok"}
                    </p>
                  </div>

                  <div className="bilgi-grubu">
                    <h4>Güncelleme Detayları</h4>
                    <p>
                      <strong>Açıklama:</strong>{" "}
                      {rapor.diger_aciklamalar || "Açıklama yok"}
                    </p>
                    <p>
                      <strong>Güncelleme Tarihi:</strong>{" "}
                      {rapor.rapor_tarihi || "Tarih bilgisi yok"}
                    </p>
                  </div>

                  <div className="bilgi-grubu">
                    <h4>Sahiplenen Kişi</h4>
                    <p>
                      <strong>Ad:</strong> {rapor.sahiplenen_adi || "Bilgi yok"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DurumTakipRaporlari;
