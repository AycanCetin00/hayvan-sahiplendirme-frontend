import React, { useEffect, useState } from "react";
import "../styles/AdminKullaniciListesi.css";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiTrash2,
  FiAlertCircle,
  FiCheckCircle,
  FiLoader,
  FiFileText,
} from "react-icons/fi";

const KullaniciListesi = () => {
  const [kullanicilar, setKullanicilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Kullanıcıları getir
        const userResponse = await fetch(
          "http://localhost:7001/api/kullanicilar",
        );
        const userData = await userResponse.json();

        // İlanları getir
        const adsResponse = await fetch(
          "http://localhost:7001/api/admin/ilanlar",
        );
        const adsData = await adsResponse.json();

        // Her kullanıcı için ilan sayısını hesapla
        const kullanicilarWithAdCount = userData.map((kullanici) => {
          const userAds = adsData.filter(
            (ilan) => ilan.kullanici_id === kullanici.id,
          );
          return {
            ...kullanici,
            ilanSayisi: userAds.length,
          };
        });

        setKullanicilar(kullanicilarWithAdCount);
      } catch (error) {
        setError("Veriler yüklenirken bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteUser = async (userId, userName) => {
    if (
      !window.confirm(
        `${userName} kullanıcısını silmek istediğinize emin misiniz? Bu işlem geri alınamaz ve kullanıcıya ait tüm ilanlar ve veriler silinecektir.`,
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:7001/api/admin/kullanicilar/${userId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Silme işlemi başarısız");
      }

      // Başarılı işlem
      setSuccessMessage(`${userName} kullanıcısı başarıyla silindi`);

      // Kullanıcı listesini güncelle
      setKullanicilar(kullanicilar.filter((user) => user.id !== userId));

      // 3 saniye sonra mesajı kaldır
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      setError(`Kullanıcı silinemedi: ${error.message}`);

      // 3 saniye sonra hata mesajını kaldır
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  if (loading)
    return (
      <div className="loading-container">
        <FiLoader className="loading-icon" />
        <p className="loading-text">Kullanıcılar yükleniyor...</p>
      </div>
    );

  return (
    <div className="kullanici-listesi-container">
      {successMessage && (
        <div className="success-message">
          <FiCheckCircle className="message-icon" />
          {successMessage}
        </div>
      )}

      {error && (
        <div className="error-message">
          <FiAlertCircle className="message-icon" />
          {error}
        </div>
      )}

      <h1 className="sayfa-basligi">Kullanıcı Yönetimi</h1>
      <p className="sayfa-aciklama">
        Sistemdeki tüm kullanıcıların listesi ve yönetimi
      </p>
      <div className="user-search-bar">
        <input
          type="text"
          placeholder="Kullanıcı adı veya soyadı ile ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="owner-search-input"
        />
        <button
          className="owner-search-btn"
          onClick={() => {
            const el = document.querySelector(".kullanici-listesi");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
        >
          Ara
        </button>
        <button
          className="owner-search-clear"
          onClick={() => setSearchTerm("")}
        >
          Temizle
        </button>
      </div>

      {kullanicilar.length === 0 ? (
        <div className="empty-state">
          <FiUser className="empty-icon" />
          <p>Hiç kullanıcı bulunamadı</p>
        </div>
      ) : (
        <div className="kullanici-listesi">
          {kullanicilar
            .filter((k) => {
              if (!searchTerm || searchTerm.trim() === "") return true;
              const full = `${k.adi || ""} ${k.soyadi || ""}`.toLowerCase();
              return full.includes(searchTerm.trim().toLowerCase());
            })
            .map((kullanici) => (
              <div className="kullanici-karti" key={kullanici.id}>
                <div className="kullanici-avatar">
                  {kullanici.adi[0]}
                  {kullanici.soyadi[0]}
                </div>

                <div className="kullanici-bilgileri">
                  <h3>
                    {kullanici.adi} {kullanici.soyadi}
                  </h3>

                  <div className="bilgi-satiri">
                    <FiMail className="bilgi-ikonu" />
                    <span className="bilgi-etiketi">Email:</span>
                    <span className="bilgi-degeri">{kullanici.email}</span>
                  </div>

                  <div className="bilgi-satiri">
                    <FiPhone className="bilgi-ikonu" />
                    <span className="bilgi-etiketi">Telefon:</span>
                    <span className="bilgi-degeri">{kullanici.telefon}</span>
                  </div>

                  <div className="bilgi-satiri">
                    <FiLock className="bilgi-ikonu" />
                    <span className="bilgi-etiketi">Şifre:</span>
                    <span className="bilgi-degeri">••••••••</span>
                  </div>

                  <div className="bilgi-satiri">
                    <FiFileText className="bilgi-ikonu" />
                    <span className="bilgi-etiketi">İlan:</span>
                    <span className="bilgi-degeri">{kullanici.ilanSayisi}</span>
                  </div>
                </div>

                <button
                  className="delete-button"
                  onClick={() =>
                    handleDeleteUser(
                      kullanici.id,
                      `${kullanici.adi} ${kullanici.soyadi}`,
                    )
                  }
                >
                  <FiTrash2 className="button-icon" />
                  <span>Sil</span>
                </button>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default KullaniciListesi;
