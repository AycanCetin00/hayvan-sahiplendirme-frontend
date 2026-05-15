import React, { useState, useEffect } from "react";
import "../styles/FiltersSection.css";

const FiltersSection = ({
  availableSpecies,
  availableBreeds,
  filters,
  setFilters,
  handleSearch,
  resetFilters,
  filteredCount,
  handleSpeciesChange,
}) => {
  // Genel filtre değişikliği işleyicisi
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === "animalType") {
      // handleSpeciesChange prop'u varsa onu kullan
      if (typeof handleSpeciesChange === "function") {
        handleSpeciesChange(e);
      }
    } else {
      setFilters({
        ...filters,
        [name]: value,
      });
    }
  };

  // Şehir listesi
  const cities = [
    "Adana",
    "Adıyaman",
    "Afyonkarahisar",
    "Ağrı",
    "Aksaray",
    "Amasya",
    "Ankara",
    "Antalya",
    "Artvin",
    "Aydın",
    "Balıkesir",
    "Bartın",
    "Batman",
    "Bayburt",
    "Bilecik",
    "Bingöl",
    "Bitlis",
    "Bolu",
    "Burdur",
    "Bursa",
    "Çanakkale",
    "Çankırı",
    "Çorum",
    "Denizli",
    "Diyarbakır",
    "Düzce",
    "Edirne",
    "Elazığ",
    "Erzincan",
    "Erzurum",
    "Eskişehir",
    "Gaziantep",
    "Giresun",
    "Gümüşhane",
    "Hakkâri",
    "Hatay",
    "Iğdır",
    "Isparta",
    "İstanbul",
    "İzmir",
    "Kahramanmaraş",
    "Karabük",
    "Karaman",
    "Kars",
    "Kastamonu",
    "Kayseri",
    "Kilis",
    "Kırıkkale",
    "Kırklareli",
    "Kırşehir",
    "Kocaeli",
    "Konya",
    "Kütahya",
    "Malatya",
    "Manisa",
    "Mardin",
    "Mersin",
    "Muğla",
    "Muş",
    "Nevşehir",
    "Niğde",
    "Ordu",
    "Osmaniye",
    "Rize",
    "Sakarya",
    "Samsun",
    "Şanlıurfa",
    "Siirt",
    "Sinop",
    "Şırnak",
    "Sivas",
    "Tekirdağ",
    "Tokat",
    "Trabzon",
    "Tunceli",
    "Uşak",
    "Van",
    "Yalova",
    "Yozgat",
    "Zonguldak",
  ];

  return (
    <div className="filters-container">
      <div className="filters-header">
        <h2>Filtreler</h2>
        {filteredCount !== undefined && (
          <span className="results-badge">{filteredCount} ilan</span>
        )}
      </div>

      <div className="filters-grid">
        <div className="filter-field">
          <label htmlFor="animalType">Hayvan Türü</label>
          <select
            id="animalType"
            name="animalType"
            value={filters.animalType}
            onChange={handleFilterChange}
          >
            {[
              "all",
              ...availableSpecies.filter(
                (species) => species !== "Diğer" && species !== "all",
              ),
              "Diğer",
            ].map((species) => (
              <option key={species} value={species}>
                {species === "all"
                  ? "Tümü"
                  : species === "Diğer"
                    ? "Diğer"
                    : species}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-field">
          <label htmlFor="breed">Irk</label>
          <select
            id="breed"
            name="breed"
            value={filters.breed}
            onChange={handleFilterChange}
            disabled={filters.animalType === "all"}
          >
            <option value="all">Tümü</option>
            {availableBreeds.map((breed) => (
              <option key={breed} value={breed}>
                {breed}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-field">
          <label htmlFor="age">Yaş</label>
          <select
            id="age"
            name="age"
            value={filters.age}
            onChange={handleFilterChange}
          >
            <option value="all">Tümü</option>
            <option value="puppy">Yavru (0-1 yaş)</option>
            <option value="young">Genç (1-3 yaş)</option>
            <option value="adult">Yetişkin (3-8 yaş)</option>
            <option value="senior">Yaşlı (8+ yaş)</option>
          </select>
        </div>

        <div className="filter-field">
          <label htmlFor="gender">Cinsiyet</label>
          <select
            id="gender"
            name="gender"
            value={filters.gender}
            onChange={handleFilterChange}
          >
            <option value="all">Tümü</option>
            <option value="male">Erkek</option>
            <option value="female">Dişi</option>
          </select>
        </div>

        <div className="filter-field">
          <label htmlFor="city">Şehir</label>
          <select
            id="city"
            name="city"
            value={filters.city}
            onChange={handleFilterChange}
          >
            <option value="all">Tümü</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-field">
          <label htmlFor="vaccinated">Aşılı</label>
          <select
            id="vaccinated"
            name="vaccinated"
            value={filters.vaccinated}
            onChange={handleFilterChange}
          >
            <option value="all">Tümü</option>
            <option value="yes">Evet</option>
            <option value="no">Hayır</option>
          </select>
        </div>

        <div className="filter-field">
          <label htmlFor="toiletTrained">Tuvalet Eğitimli</label>
          <select
            id="toiletTrained"
            name="toiletTrained"
            value={filters.toiletTrained}
            onChange={handleFilterChange}
          >
            <option value="all">Tümü</option>
            <option value="yes">Evet</option>
            <option value="no">Hayır</option>
          </select>
        </div>

        <div className="filter-field">
          <label htmlFor="basicTrained">Temel Eğitimli</label>
          <select
            id="basicTrained"
            name="basicTrained"
            value={filters.basicTrained}
            onChange={handleFilterChange}
          >
            <option value="all">Tümü</option>
            <option value="yes">Evet</option>
            <option value="no">Hayır</option>
          </select>
        </div>

        <div className="filter-field">
          <label htmlFor="neutered">Kısırlaştırılmış</label>
          <select
            id="neutered"
            name="neutered"
            value={filters.neutered}
            onChange={handleFilterChange}
          >
            <option value="all">Tümü</option>
            <option value="yes">Evet</option>
            <option value="no">Hayır</option>
          </select>
        </div>
      </div>

      <div className="filters-divider"></div>

      <div className="filters-actions">
        <button className="btn btn-reset" onClick={resetFilters}>
          Filtreleri Sıfırla
        </button>

        <button className="btn btn-search" onClick={handleSearch}>
          Ara
        </button>
      </div>
    </div>
  );
};

export default FiltersSection;
