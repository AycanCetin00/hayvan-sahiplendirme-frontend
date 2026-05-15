import React, { useEffect, useState } from "react";
import axios from "axios";
import { getPhotoSrc } from "../utils/photoSrc";
import "../styles/Ilanlarim.css";

const IlanlarSayfasi = () => {
  const [ilanlar, setIlanlar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state'leri
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingIlan, setEditingIlan] = useState(null);
  const [formData, setFormData] = useState({
    petName: "",
    species: "",
    breed: "",
    birthDate: "",
    gender: "",
    city: "",
    description: "",
    vaccinated: false,
    toiletTrained: false,
    basicTrained: false,
    neutered: false,
    hadHealthIssue: false,
    healthIssueDetail: "",
    additionalInfo: "",
    status: "available",
  });

  // Form input değişikliklerini işle
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Checkbox için checked değerini, diğer input tipleri için value değerini kullan
    const inputValue = type === "checkbox" ? checked : value;

    setFormData({
      ...formData,
      [name]: inputValue,
    });
  };

  // Modal açma fonksiyonu
  const handleEditClick = (ilan) => {
    prepareEditForm(ilan);
  };

  // İlan silme fonksiyonu - GÜNCELLENDİ
  const handleDelete = async (ilanId) => {
    if (window.confirm("Bu ilanı silmek istediğinize emin misiniz?")) {
      try {
        // localStorage'dan kullanıcı ID'sini al
        let kullaniciId = null;
        const userString = localStorage.getItem("user");
        if (userString) {
          try {
            const userData = JSON.parse(userString);
            kullaniciId = userData.id;
          } catch (e) {}
        }

        if (!kullaniciId) {
          const currentUserString = localStorage.getItem("currentUser");
          if (currentUserString) {
            try {
              const currentUserData = JSON.parse(currentUserString);
              kullaniciId = currentUserData.id;
            } catch (e) {}
          }
        }

        if (!kullaniciId) {
          alert("Kullanıcı oturumu bulunamadı. Lütfen tekrar giriş yapın.");
          return;
        }

        // DELETE isteği gönder
        const response = await axios.delete(
          `http://localhost:7001/api/ilanlar/${ilanId}?kullanici_id=${kullaniciId}`,
        );

        // İşlem başarılıysa, yerel state'i güncelle
        if (response.data.success) {
          setIlanlar(ilanlar.filter((ilan) => ilan.id !== ilanId));
          alert("İlan başarıyla silindi.");
        } else {
          alert("İlan silinirken bir hata oluştu: " + response.data.error);
        }
      } catch (error) {
        alert(
          "İlan silinirken bir hata oluştu: " +
            (error.response?.data?.error || error.message),
        );
      }
    }
  };

  // Form verisini hazırla - DÜZELTILMIŞ FONKSIYON
  const prepareEditForm = (ilan) => {
    setEditingIlan(ilan);

    // Boolean değerleri doğru şekilde kontrol et
    const parseBooleanValue = (value) => {
      if (
        value === true ||
        value === 1 ||
        value === "1" ||
        value === "true" ||
        value === "yes" ||
        value === "evet"
      ) {
        return true;
      }
      return false;
    };

    // hadHealthIssue için özel kontrol (veritabanında 'no' olarak kaydedilmiş olabilir)
    const hasHealthIssue =
      ilan.hadHealthIssue === "yes" ||
      parseBooleanValue(ilan.hadHealthIssue) ||
      (ilan.hadHealthIssue !== "no" &&
        ilan.hadHealthIssue !== false &&
        ilan.hadHealthIssue !== 0);

    // Doğum tarihi formatını düzelt
    let formattedBirthDate = "";
    if (ilan.birthDate) {
      try {
        const date = new Date(ilan.birthDate);
        if (!isNaN(date.getTime())) {
          formattedBirthDate = date.toISOString().split("T")[0];
        }
      } catch (e) {}
    }

    // Cinsiyet değerini UI formatına dönüştür
    let genderValue = "";
    if (ilan.gender === "Erkek") {
      genderValue = "male";
    } else if (ilan.gender === "Dişi") {
      genderValue = "female";
    } else {
      genderValue = ilan.gender || "";
    }

    // Form verilerini ayarla
    const updatedFormData = {
      petName: ilan.petName || "",
      species: ilan.species || "",
      breed: ilan.breed || "",
      birthDate: formattedBirthDate,
      gender: genderValue,
      city: ilan.city || "",
      description: ilan.description || "",
      vaccinated: parseBooleanValue(ilan.vaccinated),
      toiletTrained: parseBooleanValue(ilan.toiletTrained),
      basicTrained: parseBooleanValue(ilan.basicTrained),
      neutered: parseBooleanValue(ilan.neutered),
      hadHealthIssue: hasHealthIssue,
      healthIssueDetail: hasHealthIssue ? ilan.healthIssueDetail || "" : "",
      additionalInfo: ilan.additionalInfo || "",
      status: ilan.status || "available",
    };

    setFormData(updatedFormData);
    setShowEditModal(true);
  };

  // Form gönderimini işle
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Map the gender values to match database ENUM('Erkek', 'Dişi')
      const genderMapping = {
        male: "Erkek",
        female: "Dişi",
      };

      // Create an object with only the fields that exist in your database table
      const updatedData = {
        petName: formData.petName,
        species: formData.species,
        breed: formData.breed,
        birthDate: formData.birthDate ? formData.birthDate : null,
        gender: genderMapping[formData.gender] || formData.gender,
        city: formData.city,
        description: formData.description,
        vaccinated: formData.vaccinated ? 1 : 0,
        toiletTrained: formData.toiletTrained ? 1 : 0,
        basicTrained: formData.basicTrained ? 1 : 0,
        neutered: formData.neutered ? 1 : 0,
        hadHealthIssue: formData.hadHealthIssue ? "yes" : "no", // Düzeltildi: her zaman 'yes' veya 'no' olarak gönder
        healthIssueDetail: formData.hadHealthIssue
          ? formData.healthIssueDetail
          : "", // Sağlık sorunu yoksa detay boş olmalı
      };

      // Get the user ID from localStorage for verification
      let kullaniciId = null;
      const userString = localStorage.getItem("user");
      if (userString) {
        try {
          const userData = JSON.parse(userString);
          kullaniciId = userData.id;
        } catch (e) {}
      }

      if (!kullaniciId) {
        const currentUserString = localStorage.getItem("currentUser");
        if (currentUserString) {
          try {
            const currentUserData = JSON.parse(currentUserString);
            kullaniciId = currentUserData.id;
          } catch (e) {}
        }
      }

      // Include the user ID in the request URL
      const url = `http://localhost:7001/api/ilanlar/${editingIlan.id}?kullanici_id=${kullaniciId}`;

      // Make the API request
      const response = await axios.put(url, updatedData);

      // Update the ilanlar state with the new data
      setIlanlar(
        ilanlar.map((ilan) =>
          ilan.id === editingIlan.id
            ? {
                ...ilan,
                ...response.data.ilan,
                // Boolean değerleri doğru şekilde dönüştür
                vaccinated: response.data.ilan.vaccinated === 1,
                toiletTrained: response.data.ilan.toiletTrained === 1,
                basicTrained: response.data.ilan.basicTrained === 1,
                neutered: response.data.ilan.neutered === 1,
                hadHealthIssue: response.data.ilan.hadHealthIssue === "yes", // Düzeltildi: string karşılaştırması
              }
            : ilan,
        ),
      );

      // Close the modal
      setShowEditModal(false);

      // Show success message
      alert("İlan başarıyla güncellendi!");
    } catch (error) {
      setError(
        "İlan güncelleme başarısız: " +
          (error.response?.data?.error || error.message),
      );

      // Show error message to user
      alert(
        "Güncelleme başarısız: " +
          (error.response?.data?.error || error.message),
      );
    }
  };

  useEffect(() => {
    // localStorage'dan kullanıcı bilgilerini alalım
    let kullaniciId = null;

    // Önce user objesini kontrol et
    const userString = localStorage.getItem("user");
    if (userString) {
      try {
        const userData = JSON.parse(userString);
        kullaniciId = userData.id;
      } catch (e) {}
    }

    // Eğer user objesinde yoksa, currentUser objesini kontrol et
    if (!kullaniciId) {
      const currentUserString = localStorage.getItem("currentUser");
      if (currentUserString) {
        try {
          const currentUserData = JSON.parse(currentUserString);
          kullaniciId = currentUserData.id;
        } catch (e) {}
      }
    }

    if (!kullaniciId) {
      setError("Kullanıcı oturumu bulunamadı. Lütfen tekrar giriş yapın.");
      setLoading(false);
      return;
    }

    // API çağrısını doğru kullanıcı ID'si ile yapalım
    axios
      .get(`http://localhost:7001/api/ilanlar?kullanici_id=${kullaniciId}`)
      .then((response) => {
        const formattedData = response.data.map((ilan) => {
          // Boolean değerleri tutarlı bir şekilde dönüştür
          const parseBooleanValue = (value) => {
            if (
              value === true ||
              value === 1 ||
              value === "1" ||
              value === "true" ||
              value === "yes" ||
              value === "evet"
            ) {
              return true;
            }
            return false;
          };

          // hadHealthIssue özel işleme tabi tutulmalı
          const hasHealthIssue =
            ilan.hadHealthIssue === "yes" ||
            parseBooleanValue(ilan.hadHealthIssue);

          // Eksik alanlar için fallback değerler
          return {
            ...ilan,
            city: ilan.city || "Belirtilmemiş",
            description: ilan.description || "Açıklama yok",
            healthIssueDetail: hasHealthIssue
              ? ilan.healthIssueDetail || ""
              : "",
            additionalInfo: ilan.additionalInfo || "",
            status: ilan.status || "available",
            // Boolean değerlerini güvenli şekilde işleme
            hadHealthIssue: hasHealthIssue,
            // Diğer boolean alanlar
            vaccinated: parseBooleanValue(ilan.vaccinated),
            toiletTrained: parseBooleanValue(ilan.toiletTrained),
            basicTrained: parseBooleanValue(ilan.basicTrained),
            neutered: parseBooleanValue(ilan.neutered),
          };
        });

        setIlanlar(formattedData);
        setLoading(false);
      })
      .catch((error) => {
        setError("İlanlar yüklenirken hata oluştu");
        setLoading(false);
      });
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "Belirtilmemiş";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Geçersiz Tarih";
      return date.toLocaleDateString("tr-TR");
    } catch (e) {
      return "Geçersiz Tarih";
    }
  };

  // Durum bilgisini çevir
  const formatStatus = (status) => {
    const statusMap = {
      available: "Sahiplendirmeye Uygun",
      adopted: "Sahiplendirildi",
      pending: "İşlemde",
      lost: "Kayıp",
      found: "Bulundu",
    };
    return statusMap[status] || status;
  };

  // Evet/Hayır formatı
  const formatYesNo = (value) => {
    if (value === null || value === undefined) return "Belirtilmemiş";

    if (typeof value === "string") {
      if (value.toLowerCase() === "yes" || value.toLowerCase() === "evet")
        return "Evet";
      if (value.toLowerCase() === "no" || value.toLowerCase() === "hayır")
        return "Hayır";
    }

    return value === true || value === 1 || value === "1" ? "Evet" : "Hayır";
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>İlanlarınız Yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <p>{error}</p>
        <button
          className="retry-button"
          onClick={() => window.location.reload()}
        >
          Tekrar Dene
        </button>
      </div>
    );
  }

  return (
    <div className="ilanlar-page">
      <div className="ilanlar-header">
        <h1>İlanlarım</h1>
        <p>Oluşturduğunuz tüm ilanları buradan görüntüleyebilirsiniz</p>
      </div>

      {ilanlar.length > 0 ? (
        <div className="ilanlar-grid">
          {ilanlar.map((ilan) => (
            <div className="ilan-card" key={ilan.id}>
              <div className="ilan-card-image">
                {ilan.photo || ilan.photo_path || ilan.photoUrl ? (
                  <div className="image-container">
                    <img
                      src={getPhotoSrc(
                        ilan.photo || ilan.photo_path || ilan.photoUrl,
                      )}
                      alt={ilan.petName}
                      className="pet-image"
                    />
                  </div>
                ) : (
                  <div className="no-image">Fotoğraf Yok</div>
                )}
                {ilan.status && (
                  <div className={`status-badge status-${ilan.status}`}>
                    {formatStatus(ilan.status)}
                  </div>
                )}
              </div>

              <div className="ilan-card-content">
                <h2 className="pet-name">{ilan.petName}</h2>

                <div className="ilan-details">
                  <div className="detail-item">
                    <span className="label">Tür:</span>
                    <span className="value">{ilan.species}</span>
                  </div>

                  <div className="detail-item">
                    <span className="label">Irk:</span>
                    <span className="value">
                      {ilan.breed || "Belirtilmemiş"}
                    </span>
                  </div>

                  <div className="detail-item">
                    <span className="label">Şehir:</span>
                    <span className="value">
                      {ilan.city || "Belirtilmemiş"}
                    </span>
                  </div>

                  {ilan.gender && (
                    <div className="detail-item">
                      <span className="label">Cinsiyet:</span>
                      <span className="value">
                        {ilan.gender === "male"
                          ? "Erkek"
                          : ilan.gender === "female"
                            ? "Dişi"
                            : ilan.gender === "Erkek"
                              ? "Erkek"
                              : ilan.gender === "Dişi"
                                ? "Dişi"
                                : ilan.gender}
                      </span>
                    </div>
                  )}
                </div>

                <div className="accordion-sections">
                  <details className="accordion-item">
                    <summary className="accordion-header">
                      Sağlık ve Eğitim Bilgileri
                    </summary>
                    <div className="accordion-content">
                      <div className="health-details-vertical">
                        <div className="detail-row">
                          <span className="health-label">Aşı Durumu:</span>
                          <span
                            className={`health-value ${ilan.vaccinated ? "yes" : "no"}`}
                          >
                            {formatYesNo(ilan.vaccinated)}
                          </span>
                        </div>

                        <div className="detail-row">
                          <span className="health-label">Tuvalet Eğitimi:</span>
                          <span
                            className={`health-value ${ilan.toiletTrained ? "yes" : "no"}`}
                          >
                            {formatYesNo(ilan.toiletTrained)}
                          </span>
                        </div>

                        <div className="detail-row">
                          <span className="health-label">Temel Eğitimler:</span>
                          <span
                            className={`health-value ${ilan.basicTrained ? "yes" : "no"}`}
                          >
                            {formatYesNo(ilan.basicTrained)}
                          </span>
                        </div>

                        <div className="detail-row">
                          <span className="health-label">
                            Kısırlaştırılmış:
                          </span>
                          <span
                            className={`health-value ${ilan.neutered ? "yes" : "no"}`}
                          >
                            {formatYesNo(ilan.neutered)}
                          </span>
                        </div>

                        <div className="detail-row">
                          <span className="health-label">Sağlık Sorunu:</span>
                          <span
                            className={`health-value ${ilan.hadHealthIssue ? "yes" : "no"}`}
                          >
                            {formatYesNo(ilan.hadHealthIssue)}
                          </span>
                        </div>

                        {ilan.hadHealthIssue && (
                          <div className="detail-row health-issue-detail">
                            <span className="health-label">
                              Sağlık Sorunu Detayı:
                            </span>
                            <span className="health-value health-detail">
                              {ilan.healthIssueDetail || "Detay girilmemiş"}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </details>

                  {ilan.description && (
                    <details className="accordion-item">
                      <summary className="accordion-header">Açıklama</summary>
                      <div className="accordion-content">
                        <p>{ilan.description}</p>

                        {ilan.additionalInfo && (
                          <div className="additional-info">
                            <h4>Ek Bilgiler</h4>
                            <p>{ilan.additionalInfo}</p>
                          </div>
                        )}
                      </div>
                    </details>
                  )}

                  <details className="accordion-item">
                    <summary className="accordion-header">
                      İletişim Bilgileri
                    </summary>
                    <div className="accordion-content">
                      <p>
                        <strong>
                          {ilan.kullanici_adi} {ilan.kullanici_soyadi}
                        </strong>
                        <br />
                        {ilan.kullanici_email && (
                          <span className="contact-item">
                            <i className="icon email-icon"></i>
                            {ilan.kullanici_email}
                          </span>
                        )}
                        {ilan.kullanici_telefon && (
                          <span className="contact-item">
                            <i className="icon phone-icon"></i>
                            {ilan.kullanici_telefon}
                          </span>
                        )}
                      </p>
                    </div>
                  </details>
                </div>

                <div className="ilan-info">
                  <div className="detail-item">
                    <span className="label">Doğum Tarihi:</span>
                    <span className="value">{formatDate(ilan.birthDate)}</span>
                  </div>

                  {ilan.updated_at && (
                    <div className="detail-item">
                      <span className="label">Son Güncelleme:</span>
                      <span className="value">
                        {formatDate(ilan.updated_at)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="ilan-actions">
                  <button
                    className="edit-button"
                    onClick={() => handleEditClick(ilan)}
                  >
                    Düzenle
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(ilan.id)}
                  >
                    Sil
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-ilanlar">
          <div className="no-data-icon">📋</div>
          <h2>Henüz İlan Bulunamadı</h2>
          <p>
            Henüz ilan oluşturmadınız. Yeni bir ilan eklemek için ilan oluştur
            sayfasını kullanabilirsiniz.
          </p>
          <button
            className="create-ilan-button"
            onClick={() => (window.location.href = "/ilan-olustur")}
          >
            Yeni İlan Oluştur
          </button>
        </div>
      )}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="edit-modal">
            <button
              className="close-button"
              onClick={() => setShowEditModal(false)}
            >
              ×
            </button>
            <h2>İlanı Düzenle</h2>

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Evcil Hayvan Adı</label>
                  <input
                    type="text"
                    name="petName"
                    value={formData.petName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Tür</label>
                  <select
                    name="species"
                    value={formData.species}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seçiniz</option>
                    <option value="dog">Köpek</option>
                    <option value="cat">Kedi</option>
                    <option value="bird">Kuş</option>
                    <option value="other">Diğer</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Irk</label>
                  <input
                    type="text"
                    name="breed"
                    value={formData.breed}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>Doğum Tarihi</label>
                  <input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Cinsiyet</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                  >
                    <option value="">Seçiniz</option>
                    <option value="male">Erkek</option>
                    <option value="female">Dişi</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Şehir</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Açıklama</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                />
              </div>

              <div className="health-section">
                <h3>Sağlık Bilgileri</h3>

                <div className="checkboxes-row">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="vaccinated"
                      checked={formData.vaccinated}
                      onChange={handleInputChange}
                    />
                    Aşıları Tam
                  </label>

                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="toiletTrained"
                      checked={formData.toiletTrained}
                      onChange={handleInputChange}
                    />
                    Tuvalet Eğitimli
                  </label>
                </div>

                <div className="checkboxes-row">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="basicTrained"
                      checked={formData.basicTrained}
                      onChange={handleInputChange}
                    />
                    Temel Eğitimli
                  </label>

                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="neutered"
                      checked={formData.neutered}
                      onChange={handleInputChange}
                    />
                    Kısırlaştırılmış
                  </label>
                </div>

                <div className="checkboxes-row">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="hadHealthIssue"
                      checked={formData.hadHealthIssue}
                      onChange={handleInputChange}
                    />
                    Sağlık Sorunu Var
                  </label>
                </div>

                {formData.hadHealthIssue && (
                  <div className="form-group health-issue-details">
                    <label>Sağlık Sorunu Detayı</label>
                    <textarea
                      name="healthIssueDetail"
                      value={formData.healthIssueDetail || ""}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="Evcil hayvanın sağlık sorunu hakkında detay bilgi giriniz..."
                    />
                  </div>
                )}
              </div>

              <div className="modal-actions">
                <button
                  className="cancel-button"
                  type="button"
                  onClick={() => setShowEditModal(false)}
                >
                  İptal
                </button>
                <button className="kaydet-button" type="submit">
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default IlanlarSayfasi;
