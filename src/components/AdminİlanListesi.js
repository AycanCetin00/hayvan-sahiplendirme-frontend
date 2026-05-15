import React, { useEffect, useState, useCallback } from "react";
import {
  FaTrashAlt,
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
  FaPaw,
  FaUserAlt,
  FaHandHoldingHeart,
} from "react-icons/fa";
import { getPhotoSrc } from "../utils/photoSrc";
import "../styles/AdminİlanListesi.css";

const IlanListesi = () => {
  const [ilanlar, setIlanlar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // 'all', 'sahiplendirme', 'ciftlestirme'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIlan, setSelectedIlan] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchIlanlar = useCallback(async () => {
    try {
      setLoading(true); // Yükleme başladı
      const adminUrl = `http://localhost:7001/api/admin/ilanlar`;
      const ciftUrl = `http://localhost:7001/api/ciftlestirme/ilanlar`;

      // Paralel olarak her iki endpoint'i de çağır
      const [adminRes, ciftRes] = await Promise.all([
        fetch(adminUrl),
        fetch(ciftResUrlOrDefault(ciftUrl)),
      ]);

      if (!adminRes.ok) throw new Error(`Admin API hata: ${adminRes.status}`);
      if (!ciftRes.ok) throw new Error(`Çiftleşme API hata: ${ciftRes.status}`);

      const adminData = await adminRes.json();
      const ciftData = await ciftRes.json();

      // Normalize: işaretle hangi kaynağın geldiğini
      const normalized = [
        ...adminData.map((d) => ({ ...d, source: "ilan" })),
        ...ciftData.map((d) => ({ ...d, source: "ciftlestirme" })),
      ];

      // Sıralama: yeni ilanlar üstte (created_at veya id'ye göre)
      normalized.sort((a, b) => {
        const ta = a.created_at || a.createdAt || a.createdAt || 0;
        const tb = b.created_at || b.createdAt || b.createdAt || 0;
        if (ta && tb) return new Date(tb) - new Date(ta);
        return (b.id || 0) - (a.id || 0);
      });

      // Client-side filter by source
      let merged = normalized;
      if (filter === "sahiplendirme") {
        merged = normalized.filter((d) => d.source === "ilan");
      } else if (filter === "ciftlestirme") {
        merged = normalized.filter((d) => d.source === "ciftlestirme");
      }

      setIlanlar(merged);
      setError(null);
    } catch (error) {
      setError("İlan verileri yüklenemedi. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false); // Yükleme bitti
    }
  }, [filter]);

  // helper: return URL (placeholder for future modifications)
  function ciftResUrlOrDefault(url) {
    return url;
  }

  useEffect(() => {
    fetchIlanlar();
  }, [fetchIlanlar]); // fetchIlanlar bağımlılığıyla güncelle

  // İlan silme fonksiyonu
  // İlan silme fonksiyonu
  const handleDelete = async (id) => {
    try {
      setDeleteLoading(true);
      const response = await fetch(
        `http://localhost:7001/api/admin/ilanlar/${id}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Başarılı silme sonrası güncel ilanları getir
      await fetchIlanlar();
      setIsModalOpen(false);
      setSelectedIlan(null);
      setSuccessMessage("İlan başarıyla silindi");

      // 3 saniye sonra başarı mesajını kaldır
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      setError("İlan silinemedi. Lütfen tekrar deneyin.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const openDeleteModal = (ilan) => {
    setSelectedIlan(ilan);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedIlan(null);
  };

  const getStatusClass = (durum) => {
    if (durum === "Sahiplenildi" || durum === "Onaylandı")
      return "status-adopted";
    if (durum === "Beklemede") return "status-pending";
    if (durum === "Reddedildi") return "status-rejected";
    return "status-available";
  };

  const getStatusIcon = (durum) => {
    if (durum === "Sahiplenildi" || durum === "Onaylandı")
      return <FaCheckCircle className="status-icon" />;
    if (durum === "Beklemede")
      return <FaHourglassHalf className="status-icon" />;
    if (durum === "Reddedildi")
      return <FaTimesCircle className="status-icon" />;
    return <FaPaw className="status-icon" />;
  };

  const getStatusText = (ilan) => {
    // Öncelikle sahip_durumu alanına bakılır
    if (
      ilan.sahip_durumu === "Sahiplenildi" ||
      ilan.sahip_durumu === "Onaylandı"
    ) {
      return "Sahiplenildi";
    }
    // Backend'den gelen adoption_status bilgisine bakılır
    if (
      ilan.adoption_status === "approved" ||
      ilan.adoption_status === "Onaylandı"
    ) {
      return "Sahiplenildi";
    }
    // İlanın durum bilgisine bakılır
    if (ilan.durum === "Sahiplenildi" || ilan.durum === "Onaylandı") {
      return "Sahiplenildi";
    }
    if (ilan.durum === "Beklemede" || ilan.sahip_durumu === "Beklemede")
      return "Beklemede";
    if (ilan.durum === "Reddedildi" || ilan.sahip_durumu === "Reddedildi")
      return "Reddedildi";
    return "Sahiplenilmedi";
  };
  const formatDate = (isoDate) => {
    if (!isoDate) return "-";
    const date = new Date(isoDate);
    return date.toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // İlan kaynak sayılarını hesapla (sahiplendirme vs çiftleştirme)
  const sahiplendirmeCount = ilanlar.filter(
    (ilan) => ilan.source === "ilan",
  ).length;
  const ciftlestirmeCount = ilanlar.filter(
    (ilan) => ilan.source === "ciftlestirme",
  ).length;

  if (loading)
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div className="loading-text">İlanlar yükleniyor...</div>
      </div>
    );

  // Eğer loading false ama ilanlar boşsa
  if (!loading && ilanlar.length === 0)
    return (
      <div className="no-results">
        <FaPaw className="no-results-icon" />
        <p>Hiç ilan bulunamadı.</p>
      </div>
    );
  return (
    <div className="ilan-listesi-container">
      <h1 className="page-title">
        <FaPaw className="title-icon" /> İlan Yönetimi
      </h1>

      {error && <div className="error-message">{error}</div>}
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

      <div className="ilan-filtre">
        <button
          className={`filter-btn ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          Tüm İlanlar{" "}
          <span className="count">
            {sahiplendirmeCount + ciftlestirmeCount}
          </span>
        </button>
        <button
          className={`filter-btn ${filter === "sahiplendirme" ? "active" : ""}`}
          onClick={() => setFilter("sahiplendirme")}
        >
          Sahiplendirme <span className="count">{sahiplendirmeCount}</span>
        </button>
        <button
          className={`filter-btn ${filter === "ciftlestirme" ? "active" : ""}`}
          onClick={() => setFilter("ciftlestirme")}
        >
          Çiftleştirme <span className="count">{ciftlestirmeCount}</span>
        </button>
      </div>

      {/* Bottom search bar: search by ilan sahibi (owner) name */}
      <div className="search-bar-bottom">
        <input
          type="text"
          placeholder="İlan veren kişinin adıyla ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              // simply rely on controlled searchTerm — nothing else needed
            }
          }}
          className="owner-search-input"
        />
        <button
          className="owner-search-btn"
          onClick={() => {
            // no-op: search is applied reactively via searchTerm
            // focus back to list or optionally scroll
            const el = document.querySelector(".ilan-listesi");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
        >
          Ara
        </button>
        <button
          className="owner-search-clear"
          onClick={() => setSearchTerm("")}
          title="Aramayı temizle"
        >
          Temizle
        </button>
      </div>

      <div className="ilan-listesi">
        {ilanlar.length === 0 ? (
          <div className="no-results">
            <FaPaw className="no-results-icon" />
            <p>Bu kriterlere uygun ilan bulunamadı.</p>
          </div>
        ) : (
          // Apply owner-name search if a term is provided
          ilanlar
            .filter((ilan) => {
              if (!searchTerm || searchTerm.trim() === "") return true;
              const fullName =
                `${ilan.kullanici_adi || ""} ${ilan.kullanici_soyadi || ""}`.toLowerCase();
              return fullName.includes(searchTerm.trim().toLowerCase());
            })
            .map((ilan) => (
              <div className="ilan-karti" key={ilan.id}>
                <div className="ilan-header">
                  <div className="ilan-header-left">
                    <span className="ilan-id">ID: {ilan.id}</span>
                    <span className="ilan-date">
                      {ilan.formatted_date || "-"}
                    </span>
                  </div>
                  <div className="ilan-actions">
                    <span
                      className={`ilan-durum ${getStatusClass(getStatusText(ilan))}`}
                    >
                      {getStatusIcon(getStatusText(ilan))}
                      {getStatusText(ilan)}
                    </span>
                    <button
                      className="delete-btn"
                      onClick={() => openDeleteModal(ilan)}
                      aria-label="İlanı Sil"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </div>

                <div className="ilan-content">
                  <div className="ilan-left-content">
                    {ilan.photo || ilan.photo_path || ilan.photoUrl ? (
                      <div className="ilan-resim-container">
                        <img
                          src={getPhotoSrc(
                            ilan.photo || ilan.photo_path || ilan.photoUrl,
                          )}
                          alt={ilan.petName}
                          className="ilan-resmi"
                        />
                      </div>
                    ) : (
                      <div className="ilan-resim-placeholder">
                        <FaPaw className="placeholder-icon" />
                      </div>
                    )}

                    <div className="ilan-bilgi-ozet">
                      <h3 className="pet-name">{ilan.petName}</h3>
                      <div className="ilan-flags">
                        {ilan.vaccinated === 1 && (
                          <span className="flag">Aşılı</span>
                        )}
                        {ilan.toiletTrained === 1 && (
                          <span className="flag">Tuvalet Eğitimli</span>
                        )}
                        {ilan.basicTrained === 1 && (
                          <span className="flag">Temel Eğitimli</span>
                        )}
                        {ilan.neutered === 1 && (
                          <span className="flag">Kısırlaştırılmış</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="ilan-right-content">
                    <div className="ilan-detay-compact">
                      <div className="info-grid">
                        <div className="info-item">
                          <span className="info-label">Tür:</span>
                          <span className="info-value">{ilan.species}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Cins:</span>
                          <span className="info-value">{ilan.breed}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Cinsiyet:</span>
                          <span className="info-value">{ilan.gender}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Yaş/Doğum:</span>
                          <span className="info-value">
                            {formatDate(ilan.birthDate)}
                          </span>
                        </div>

                        <div className="info-item">
                          <span className="info-label">Şehir:</span>
                          <span className="info-value">{ilan.city}</span>
                        </div>
                      </div>

                      {ilan.description && (
                        <div className="description-section">
                          <span className="info-label">Açıklama:</span>
                          <p className="description-text">{ilan.description}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="kullanici-bilgileri-container">
                  <div className="kullanici-bilgisi-kart sahip">
                    <div className="kullanici-bilgisi-baslik">
                      <FaUserAlt className="kullanici-icon" />
                      <h4>İlan Sahibi</h4>
                    </div>
                    <div className="kullanici-bilgileri-icerik">
                      <div className="kullanici-bilgi-item">
                        <span className="kullanici-label">Ad Soyad:</span>
                        <span className="kullanici-deger">
                          {ilan.kullanici_adi} {ilan.kullanici_soyadi}
                        </span>
                      </div>
                      <div className="kullanici-bilgi-item">
                        <span className="kullanici-label">E-posta:</span>
                        <span className="kullanici-deger">
                          {ilan.kullanici_email}
                        </span>
                      </div>
                      <div className="kullanici-bilgi-item">
                        <span className="kullanici-label">Telefon:</span>
                        <span className="kullanici-deger">
                          {ilan.kullanici_telefon}
                        </span>
                      </div>
                    </div>
                  </div>

                  {getStatusText(ilan) === "Sahiplenildi" &&
                    (ilan.sahiplenen_adi || ilan.sahiplenen_email) && (
                      <div className="kullanici-bilgisi-kart sahiplenen">
                        <div className="kullanici-bilgisi-baslik">
                          <FaHandHoldingHeart className="kullanici-icon" />
                          <h4>Sahiplenen Kullanıcı</h4>
                        </div>
                        <div className="kullanici-bilgileri-icerik">
                          <div className="kullanici-bilgi-item">
                            <span className="kullanici-label">Ad Soyad:</span>
                            <span className="kullanici-deger">
                              {ilan.sahiplenen_adi || "-"}{" "}
                              {ilan.sahiplenen_soyadi || ""}
                            </span>
                          </div>
                          <div className="kullanici-bilgi-item">
                            <span className="kullanici-label">E-posta:</span>
                            <span className="kullanici-deger">
                              {ilan.sahiplenen_email || "-"}
                            </span>
                          </div>
                          <div className="kullanici-bilgi-item">
                            <span className="kullanici-label">Telefon:</span>
                            <span className="kullanici-deger">
                              {ilan.sahiplenen_telefon || "-"}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                </div>
              </div>
            ))
        )}
      </div>

      {isModalOpen && selectedIlan && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>İlanı Sil</h2>
            <p>
              <strong>{selectedIlan.petName}</strong> isimli hayvan ilanını
              silmek istediğinize emin misiniz?
            </p>
            <p className="modal-warning">Bu işlem geri alınamaz!</p>
            <div className="modal-buttons">
              <button
                className="cancel-btn"
                onClick={closeModal}
                disabled={deleteLoading}
              >
                İptal
              </button>
              <button
                className="delete-btn"
                onClick={() => handleDelete(selectedIlan.id)}
                disabled={deleteLoading}
              >
                {deleteLoading ? "Siliniyor..." : "Sil"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IlanListesi;
