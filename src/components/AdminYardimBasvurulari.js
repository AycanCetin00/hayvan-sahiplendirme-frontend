import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/AdminYardimBasvurulari.css";

const AdminYardimBasvurulari = () => {
  const [basvurular, setBasvurular] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBasvuru, setSelectedBasvuru] = useState(null);
  const [kullaniciBilgisi, setKullaniciBilgisi] = useState(null);
  const [kullaniciLoading, setKullaniciLoading] = useState(false);
  const [cevapText, setCevapText] = useState("");
  const [cevapLoading, setCevapLoading] = useState(false);

  useEffect(() => {
    fetchYardimBasvurulari();
  }, []);

  useEffect(() => {
    // Seçili başvuru değiştiğinde kullanıcı bilgilerini getir
    if (selectedBasvuru && selectedBasvuru.user_id) {
      fetchKullaniciBilgisi(selectedBasvuru.user_id);
    } else {
      setKullaniciBilgisi(null);
    }
  }, [selectedBasvuru]);

  const fetchYardimBasvurulari = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:7001/api/yardim-basvurulari-admin",
      );
      // Sort: unresolved (not 'Çözüldü') first, then within each group sort by date descending (newest first)
      const sorted = (response.data || []).slice().sort((a, b) => {
        const aSolved =
          String(a.durum || "").toLowerCase() === "çözüldü" ||
          String(a.durum || "").toLowerCase() === "cozuldu";
        const bSolved =
          String(b.durum || "").toLowerCase() === "çözüldü" ||
          String(b.durum || "").toLowerCase() === "cozuldu";
        if (aSolved !== bSolved) return aSolved ? 1 : -1; // unresolved first

        const aTime =
          new Date(
            a.basvuru_tarihi || a.created_at || a.createdAt || 0,
          ).getTime() || 0;
        const bTime =
          new Date(
            b.basvuru_tarihi || b.created_at || b.createdAt || 0,
          ).getTime() || 0;
        return bTime - aTime; // newest first
      });

      setBasvurular(sorted);
      setError(null);
    } catch (err) {
      setError("Yardım başvuruları yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const fetchKullaniciBilgisi = async (userId) => {
    try {
      setKullaniciLoading(true);
      const response = await axios.get(
        `http://localhost:7001/api/kullanicilar/${userId}`,
      );
      setKullaniciBilgisi(response.data);
    } catch (err) {
      setKullaniciBilgisi({ error: "Kullanıcı bilgileri yüklenemedi" });
    } finally {
      setKullaniciLoading(false);
    }
  };

  const handleDurumGuncelle = async (id, yeniDurum) => {
    try {
      await axios.put(
        `http://localhost:7001/api/yardim-basvurulari/${id}/durum`,
        {
          durum: yeniDurum,
        },
      );
      fetchYardimBasvurulari(); // Listeyi güncelle
      setSelectedBasvuru(null); // Detaydan çık
    } catch (err) {}
  };

  const handleCevapGonder = async () => {
    if (!cevapText.trim()) {
      alert("Lütfen bir cevap yazınız");
      return;
    }

    setCevapLoading(true);
    try {
      await axios.put(
        `http://localhost:7001/api/yardim-basvurulari/${selectedBasvuru.id}/cevap`,
        {
          cevap: cevapText,
          durum: "Çözüldü",
        },
      );
      setCevapText("");
      fetchYardimBasvurulari();
      setSelectedBasvuru(null);
      alert("Cevap başarıyla gönderildi!");
    } catch (err) {
      alert("Cevap gönderilemedi: " + err.response?.data?.error || err.message);
    } finally {
      setCevapLoading(false);
    }
  };

  const handleBasvuruClick = (basvuru) => {
    setSelectedBasvuru(basvuru);
  };

  const handleCloseDetail = () => {
    setSelectedBasvuru(null);
    setKullaniciBilgisi(null);
  };

  const getAciliyetClass = (aciliyet) => {
    if (!aciliyet) return ""; // aciliyet boşsa sınıf döndürme

    switch (aciliyet.toLowerCase()) {
      case "acil":
      case "yüksek":
        return "aciliyet-yuksek";
      case "normal":
        return "aciliyet-normal";
      case "düşük":
        return "aciliyet-dusuk";
      default:
        return "";
    }
  };

  if (loading)
    return <div className="loading">Yardım başvuruları yükleniyor...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="yardim-basvurulari-container">
      {selectedBasvuru ? (
        <div className="basvuru-detay">
          <button className="close-button" onClick={handleCloseDetail}>
            ×
          </button>
          <h3>Başvuru Detayı</h3>
          <div className="detay-bilgi">
            <p>
              <strong>Başvuru ID:</strong> {selectedBasvuru.id}
            </p>

            {/* Kullanıcı Bilgileri Bölümü */}
            <div className="kullanici-bilgileri">
              <h4>Başvuru Sahibi Bilgileri</h4>
              {kullaniciLoading ? (
                <p>Kullanıcı bilgileri yükleniyor...</p>
              ) : kullaniciBilgisi ? (
                kullaniciBilgisi.error ? (
                  <p className="error">{kullaniciBilgisi.error}</p>
                ) : (
                  <>
                    <p>
                      <strong>Adı Soyadı:</strong> {kullaniciBilgisi.adi}{" "}
                      {kullaniciBilgisi.soyadi}
                    </p>
                    <p>
                      <strong>Email:</strong> {kullaniciBilgisi.email}
                    </p>
                    <p>
                      <strong>Telefon:</strong>{" "}
                      {kullaniciBilgisi.telefon || "Belirtilmemiş"}
                    </p>
                    {kullaniciBilgisi.adres && (
                      <p>
                        <strong>Adres:</strong> {kullaniciBilgisi.adres}
                      </p>
                    )}
                  </>
                )
              ) : (
                <p>Kullanıcı bilgisi bulunamadı</p>
              )}
            </div>

            <p>
              <strong>Konu:</strong> {selectedBasvuru.konu}
            </p>
            <p>
              <strong>Aciliyet:</strong>
              <span className={getAciliyetClass(selectedBasvuru.aciliyet)}>
                {selectedBasvuru.aciliyet}
              </span>
            </p>
            <p>
              <strong>Tarih:</strong> {selectedBasvuru.basvuru_tarihi}
            </p>

            <div className="aciklama-alani">
              <p>
                <strong>Açıklama:</strong>
              </p>
              <p>{selectedBasvuru.aciklama}</p>
            </div>

            {selectedBasvuru.yonetici_notu && (
              <div className="onceki-cevap">
                <p>
                  <strong>Daha Önce Verilen Cevap:</strong>
                </p>
                <p>{selectedBasvuru.yonetici_notu}</p>
              </div>
            )}

            <div className="cevap-verme-alani">
              <h4>Cevap Ver</h4>
              <textarea
                value={cevapText}
                onChange={(e) => setCevapText(e.target.value)}
                placeholder="Kullanıcıya verilecek cevabı yazınız..."
                rows="5"
                className="cevap-textarea"
              ></textarea>
            </div>
          </div>
          <div className="islem-butonlari">
            <button
              className="islem-btn cevap-gonder"
              onClick={handleCevapGonder}
              disabled={cevapLoading || !cevapText.trim()}
            >
              {cevapLoading ? "Gönderiliyor..." : "Cevap Gönder"}
            </button>
            <button
              className="islem-btn cozuldu"
              onClick={() => handleDurumGuncelle(selectedBasvuru.id, "çözüldü")}
            >
              Çözüldü Olarak İşaretle
            </button>
            <button
              className="islem-btn yanit-ver"
              onClick={() =>
                (window.location.href = `mailto:${kullaniciBilgisi?.email}`)
              }
              disabled={!kullaniciBilgisi?.email}
            >
              E-posta Gönder
            </button>
          </div>
        </div>
      ) : (
        <>
          <h3>Toplam {basvurular.length} başvuru bulundu</h3>
          <div className="basvuru-listesi">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Kullanıcı</th>
                  <th>Konu</th>
                  <th>Aciliyet</th>
                  <th>Tarih</th>
                  <th>Durum</th>
                </tr>
              </thead>
              <tbody>
                {basvurular.length > 0 ? (
                  basvurular.map((basvuru) => (
                    <tr
                      key={basvuru.id}
                      onClick={() => handleBasvuruClick(basvuru)}
                      className="basvuru-satir"
                    >
                      <td>{basvuru.id}</td>
                      <td>{basvuru.user_id}</td>
                      <td className="konu-hucre">{basvuru.konu}</td>
                      <td>
                        <span className={getAciliyetClass(basvuru.aciliyet)}>
                          {basvuru.aciliyet}
                        </span>
                      </td>
                      <td>{basvuru.basvuru_tarihi}</td>
                      <td>
                        <span
                          className={`durum-badge durum-${basvuru.durum?.toLowerCase()}`}
                        >
                          {basvuru.durum}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-data">
                      Henüz yardım başvurusu bulunmuyor.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminYardimBasvurulari;
