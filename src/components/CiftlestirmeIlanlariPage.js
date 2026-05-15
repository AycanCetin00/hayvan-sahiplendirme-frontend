import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPhotoSrc } from "../utils/photoSrc";
import "../styles/AnimalListingsPage.css";
import "../styles/CiftlestirmeIlanlariPage.css";

const CiftlestirmeIlanlariPage = () => {
  const navigate = useNavigate();
  const [ilanlar, setIlanlar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mesaj, setMesaj] = useState({ type: "", text: "" });

  const [filters, setFilters] = useState({
    species: "all",
    city: "all",
    gender: "all",
  });

  useEffect(() => {
    const fetchIlanlar = async () => {
      setLoading(true);
      setError("");
      setMesaj({ type: "", text: "" });

      try {
        const response = await fetch(
          "http://localhost:7001/api/ciftlestirme/ilanlar",
        );
        if (!response.ok) {
          throw new Error(`API hatası: ${response.status}`);
        }

        const data = await response.json();
        setIlanlar(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("İlanlar yüklenirken bir hata oluştu. Lütfen tekrar deneyin.");
      } finally {
        setLoading(false);
      }
    };

    fetchIlanlar();
  }, []);

  const availableSpecies = useMemo(
    () => [...new Set(ilanlar.map((ilan) => ilan.species).filter(Boolean))],
    [ilanlar],
  );

  const availableCities = useMemo(
    () => [...new Set(ilanlar.map((ilan) => ilan.city).filter(Boolean))],
    [ilanlar],
  );

  const filteredIlanlar = useMemo(() => {
    return ilanlar.filter((ilan) => {
      if (filters.species !== "all" && ilan.species !== filters.species) {
        return false;
      }

      if (filters.city !== "all" && ilan.city !== filters.city) {
        return false;
      }

      if (filters.gender !== "all") {
        const targetGender = filters.gender === "male" ? "Erkek" : "Dişi";
        if (ilan.gender !== targetGender) {
          return false;
        }
      }

      return true;
    });
  }, [ilanlar, filters]);

  const handleApplyClick = (ilanId) => {
    setMesaj({ type: "", text: "" });
    navigate(`/ciftlestirme-ilan/${ilanId}`);
  };

  const getImageSrc = (ilan) => {
    return getPhotoSrc(ilan.photo || ilan.photo_path || ilan.photoUrl);
  };

  return (
    <div className="listings-container ciftlestirme-page">
      <section className="listings-header ciftlestirme-hero">
        <div>
          <h1>Çiftleştirme İlanları</h1>
        </div>
      </section>

      <section className="ciftlestirme-filters">
        <div className="filter-item">
          <label>Tür</label>
          <select
            value={filters.species}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, species: e.target.value }))
            }
          >
            <option value="all">Tümü</option>
            {availableSpecies.map((species) => (
              <option key={species} value={species}>
                {species}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-item">
          <label>Şehir</label>
          <select
            value={filters.city}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, city: e.target.value }))
            }
          >
            <option value="all">Tümü</option>
            {availableCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-item">
          <label>Cinsiyet</label>
          <select
            value={filters.gender}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, gender: e.target.value }))
            }
          >
            <option value="all">Tümü</option>
            <option value="male">Erkek</option>
            <option value="female">Dişi</option>
          </select>
        </div>
      </section>

      {mesaj.text && (
        <div className={`status-message ${mesaj.type}`}>{mesaj.text}</div>
      )}

      <section className="ciftlestirme-list">
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>İlanlar yükleniyor...</p>
          </div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : filteredIlanlar.length === 0 ? (
          <div className="state-box">Filtrelere uygun ilan bulunamadı.</div>
        ) : (
          <div className="listings-grid">
            {filteredIlanlar.map((ilan) => (
              <article key={ilan.id} className="animal-card">
                <div className="animal-image">
                  {ilan.photo || ilan.photo_path || ilan.photoUrl ? (
                    <img src={getImageSrc(ilan)} alt={ilan.petName} />
                  ) : (
                    <div className="animal-placeholder">Fotoğraf Yok</div>
                  )}
                  <div className="animal-badges">
                    <span
                      className={`animal-type ${ilan.species === "Köpek" ? "dog" : "cat"}`}
                    >
                      {ilan.species}
                    </span>
                  </div>
                </div>

                <div className="animal-info ciftlestirme-card-content">
                  <h3>{ilan.petName}</h3>
                  <p className="animal-location">
                    <span className="icon">📍</span>{" "}
                    {ilan.city || "Belirtilmemiş"}
                  </p>

                  <div className="animal-footer">
                    <button
                      type="button"
                      className="view-details-btn"
                      onClick={() => handleApplyClick(ilan.id)}
                    >
                      Detaya Git
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default CiftlestirmeIlanlariPage;
