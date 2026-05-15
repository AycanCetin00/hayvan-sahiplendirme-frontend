import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPhotoSrc } from "../utils/photoSrc";
import "../styles/AnimalListingsPage.css";
import "../styles/FiltersSection.css"; // Yeni CSS dosyası
import FiltersSection from "../components/FiltersSections"; // Yeni oluşturulan bileşen

const AnimalListingsPage = () => {
  const [animalListings, setAnimalListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleListings, setVisibleListings] = useState(8);
  const [hasMore, setHasMore] = useState(true);
  const [availableSpecies, setAvailableSpecies] = useState([]);
  const [availableBreeds, setAvailableBreeds] = useState([]);
  const navigate = useNavigate();

  // Filtreleme durumları
  const [filters, setFilters] = useState({
    animalType: "all",
    breed: "all",
    age: "all",
    gender: "all",
    city: "all",
    vaccinated: "all",
    toiletTrained: "all",
    basicTrained: "all",
    neutered: "all",
  });

  // Aktif filtreleri saklamak için yeni state
  const [activeFilters, setActiveFilters] = useState({
    animalType: "all",
    breed: "all",
    age: "all",
    gender: "all",
    city: "all",
    vaccinated: "all",
    toiletTrained: "all",
    basicTrained: "all",
    neutered: "all",
  });

  // API'den hayvan ilanlarını çekme
  useEffect(() => {
    const fetchAnimalListings = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:7001/api/ilanlar");

        if (!response.ok) {
          throw new Error(
            `API yanıtı: ${response.status} - ${response.statusText}`,
          );
        }

        const data = await response.json();
        setAnimalListings(data);

        // Mevcut ilanlardan benzersiz türleri çıkar
        const uniqueSpecies = [
          ...new Set(data.map((animal) => animal.species)),
        ];
        setAvailableSpecies(uniqueSpecies.filter(Boolean));

        // Tüm ırkları başlangıçta yükle
        const allBreeds = [...new Set(data.map((animal) => animal.breed))];
        setAvailableBreeds(allBreeds.filter(Boolean));

        setLoading(false);
      } catch (err) {
        setError("İlanlar yüklenirken bir hata oluştu.");
        setLoading(false);
      }
    };

    fetchAnimalListings();
  }, []);

  const handleAnimalClick = (id) => {
    const animal = animalListings.find((item) => item.id === id);
    navigate(`/ilan/${id}`, { state: { animal } });
  };

  // Tür seçildiğinde o türe ait ırkları güncelle
  const handleSpeciesChange = (e) => {
    const selectedSpecies = e.target.value;
    const newFilters = {
      ...filters,
      animalType: selectedSpecies,
      breed: "all", // Tür değiştiğinde ırk seçimini sıfırla
    };

    setFilters(newFilters);

    // Seçilen türe ait ırkları filtrele
    if (selectedSpecies === "all") {
      const allBreeds = [
        ...new Set(animalListings.map((animal) => animal.breed)),
      ];
      setAvailableBreeds(allBreeds.filter(Boolean));
    } else {
      const filteredBreeds = [
        ...new Set(
          animalListings
            .filter((animal) => animal.species === selectedSpecies)
            .map((animal) => animal.breed),
        ),
      ];
      setAvailableBreeds(filteredBreeds.filter(Boolean));
    }
  };

  // Ara butonuna tıklandığında aktif filtreleri güncelle
  const handleSearch = () => {
    setActiveFilters({ ...filters });
    setVisibleListings(8); // Filtreleme yapıldığında görünen ilanları sıfırla
    setHasMore(true);
  };

  const loadMore = () => {
    const nextVisible = visibleListings + 4;
    setVisibleListings(nextVisible);

    // Tüm filtrelenmiş ilanlar gösterildi mi kontrol et
    if (nextVisible >= filteredListings.length) {
      setHasMore(false);
    }
  };

  // Tüm filtreleri sıfırlama fonksiyonu
  const resetFilters = () => {
    const resetValues = {
      animalType: "all",
      breed: "all",
      age: "all",
      gender: "all",
      city: "all",
      vaccinated: "all",
      toiletTrained: "all",
      basicTrained: "all",
      neutered: "all",
    };

    setFilters(resetValues);
    setActiveFilters(resetValues);
    setVisibleListings(8);
    setHasMore(true);

    // Tüm ırkları yeniden yükle
    const allBreeds = [
      ...new Set(animalListings.map((animal) => animal.breed)),
    ];
    setAvailableBreeds(allBreeds.filter(Boolean));
  };

  // Filtreleme fonksiyonu
  const filterAnimalListings = () => {
    return animalListings.filter((animal) => {
      // Hayvan tipine göre filtreleme
      if (
        activeFilters.animalType !== "all" &&
        animal.species !== activeFilters.animalType
      ) {
        return false;
      }

      // Irka göre filtreleme
      if (
        activeFilters.breed !== "all" &&
        animal.breed !== activeFilters.breed
      ) {
        return false;
      }

      // Yaşa göre filtreleme
      if (activeFilters.age !== "all") {
        const birthDate = new Date(animal.birthDate);
        const today = new Date();
        const ageInYears = Math.floor(
          (today - birthDate) / (365.25 * 24 * 60 * 60 * 1000),
        );

        let matches = false;
        if (activeFilters.age === "puppy" && ageInYears < 1) matches = true;
        if (activeFilters.age === "young" && ageInYears >= 1 && ageInYears < 3)
          matches = true;
        if (activeFilters.age === "adult" && ageInYears >= 3 && ageInYears < 8)
          matches = true;
        if (activeFilters.age === "senior" && ageInYears >= 8) matches = true;

        if (!matches) return false;
      }

      // Cinsiyete göre filtreleme
      if (activeFilters.gender !== "all") {
        const genderFilter = activeFilters.gender === "male" ? "Erkek" : "Dişi";
        if (animal.gender !== genderFilter) {
          return false;
        }
      }

      // Şehire göre filtreleme
      if (activeFilters.city !== "all" && animal.city !== activeFilters.city) {
        return false;
      }

      // Aşılar durumuna göre filtreleme
      if (activeFilters.vaccinated !== "all") {
        const isVaccinated = activeFilters.vaccinated === "yes";
        if (animal.vaccinated !== isVaccinated) {
          return false;
        }
      }

      // Tuvalet eğitimine göre filtreleme
      if (activeFilters.toiletTrained !== "all") {
        const isToiletTrained = activeFilters.toiletTrained === "yes";
        if (animal.toiletTrained !== isToiletTrained) {
          return false;
        }
      }

      // Temel eğitim durumuna göre filtreleme
      if (activeFilters.basicTrained !== "all") {
        const isBasicTrained = activeFilters.basicTrained === "yes";
        if (animal.basicTrained !== isBasicTrained) {
          return false;
        }
      }

      // Kısırlaştırma durumuna göre filtreleme
      if (activeFilters.neutered !== "all") {
        const isNeutered = activeFilters.neutered === "yes";
        if (animal.neutered !== isNeutered) {
          return false;
        }
      }

      return true;
    });
  };

  // Checkbox değerlerini tik simgesine çeviren fonksiyon
  const renderCheckbox = (value) => {
    return value ? "✓" : "✗";
  };

  const filteredListings = filterAnimalListings();
  const sortedListings = [...filteredListings].sort(
    (a, b) =>
      new Date(b.createdAt || b.birthDate) -
      new Date(a.createdAt || a.birthDate),
  );
  const displayedListings = sortedListings.slice(0, visibleListings);

  return (
    <div className="listings-container side-layout">
      <div className="listings-header">
        <h1>Hayvan Sahiplendirme İlanları</h1>
        <p>Yeni bir can dostuna yuva olmak için ilanları inceleyin</p>
      </div>
      <div
        className="side-content"
        style={{ display: "flex", gap: "32px", alignItems: "flex-start" }}
      >
        <aside
          className="filters-sidebar"
          style={{
            maxWidth: 320,
            width: "100%",
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            padding: 24,
            marginTop: 0,
          }}
        >
          <FiltersSection
            availableSpecies={availableSpecies}
            availableBreeds={availableBreeds}
            filters={filters}
            setFilters={setFilters}
            handleSearch={handleSearch}
            resetFilters={resetFilters}
            filteredCount={filteredListings.length}
            handleSpeciesChange={handleSpeciesChange}
            verticalLayout={true}
          />
        </aside>
        <main className="listings-main" style={{ flex: 1 }}>
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>İlanlar yükleniyor...</p>
            </div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : (
            <>
              <div className="listings-grid">
                {displayedListings.length > 0 ? (
                  displayedListings.map((animal) => (
                    <div
                      key={animal.id}
                      className="animal-card"
                      onClick={() => handleAnimalClick(animal.id)}
                    >
                      <div className="animal-image">
                        {animal.photo ||
                        animal.photo_path ||
                        animal.photoUrl ? (
                          <img
                            src={getPhotoSrc(
                              animal.photo ||
                                animal.photo_path ||
                                animal.photoUrl,
                            )}
                            alt={animal.petName}
                          />
                        ) : (
                          <div className="animal-placeholder">Fotoğraf Yok</div>
                        )}
                        <div className="animal-badges">
                          <span
                            className={`animal-type ${animal.species === "Köpek" ? "dog" : "cat"}`}
                          >
                            {animal.species}
                          </span>
                        </div>
                      </div>
                      <div className="animal-info">
                        <h3>{animal.petName}</h3>
                        <p className="animal-location">
                          <span className="icon">📍</span>{" "}
                          {animal.city || "Belirtilmemiş"}
                        </p>
                        <p className="animal-breed">{animal.breed}</p>

                        <div className="animal-footer">
                          <button className="view-details-btn">
                            Detayları Gör
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-results">
                    <div className="no-results-icon">😿</div>
                    <h3>Aramanızla eşleşen ilan bulunamadı</h3>
                    <p>
                      Farklı filtre seçeneklerini deneyerek arama
                      yapabilirsiniz.
                    </p>
                    <button className="btn btn-reset" onClick={resetFilters}>
                      <span className="btn-icon">↺</span>
                      Filtreleri Sıfırla
                    </button>
                  </div>
                )}
              </div>

              {hasMore &&
                displayedListings.length > 0 &&
                displayedListings.length < filteredListings.length && (
                  <div className="load-more-container">
                    <button className="load-more-btn" onClick={loadMore}>
                      Daha Fazla Göster (
                      {filteredListings.length - displayedListings.length} ilan
                      daha)
                    </button>
                  </div>
                )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AnimalListingsPage;
