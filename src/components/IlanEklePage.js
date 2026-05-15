import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/IlanEkle.css";

const MAX_PHOTO_SIZE_MB = 10;
const MAX_PHOTO_SIZE_BYTES = MAX_PHOTO_SIZE_MB * 1024 * 1024;

const IlanEklePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ilanAmaci: "sahiplendirme",
    petName: "",
    species: "",
    breed: "",
    birthDate: "",
    gender: "",
    vaccinated: false,
    toiletTrained: false,
    basicTrained: false,
    neutered: false,
    description: "",
    city: "",
    photo: null,
    hadHealthIssue: "no",
    healthIssueDetail: "",
    aranan_irk: "",
    aranan_cinsiyet: "",
  });

  const [photoPreview, setPhotoPreview] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const storedCurrentUser = localStorage.getItem("currentUser");
    const user = storedCurrentUser || localStorage.getItem("user");
    if (user) {
      try {
        setCurrentUser(JSON.parse(user));
      } catch {
        setCurrentUser(null);
        localStorage.removeItem("currentUser");
        localStorage.removeItem("user");
      }
    } else {
      setCurrentUser(null);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "hadHealthIssue" && value === "no"
        ? { healthIssueDetail: "" }
        : {}),
    }));
  };

  // Fotoğraf işleme kısmında yapılması gereken değişiklikler
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Dosya boyutu kontrolü
      if (file.size > MAX_PHOTO_SIZE_BYTES) {
        alert(`Dosya boyutu ${MAX_PHOTO_SIZE_MB}MB'dan küçük olmalıdır.`);
        // Input'u temizle
        e.target.value = "";
        return;
      }

      // Geçerli resim dosyası kontrolü
      if (!file.type.match("image.*")) {
        alert("Lütfen geçerli bir resim dosyası yükleyin (JPEG, PNG, GIF vb.)");
        e.target.value = "";
        return;
      }

      setFormData((prev) => ({ ...prev, photo: file }));
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };
  // handleSubmit fonksiyonunda yapılması gereken değişiklikler
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Çift gönderimi önle
    if (isSubmitting) return;
    setIsSubmitting(true);

    // Kullanıcı giriş yapmamışsa işlemi durdur
    if (!currentUser) {
      alert("İlan eklemek için giriş yapmalısınız!");
      setIsSubmitting(false);
      return;
    }

    try {
      const data = new FormData();
      const isCiftlestirme = formData.ilanAmaci === "ciftlestirme";

      // Form verilerini ekle (Tüm verileri temizleyerek ekleyin)
      data.append("petName", formData.petName.trim());
      data.append("species", formData.species);
      data.append("breed", formData.breed.trim());
      data.append("birthDate", formData.birthDate);
      data.append("gender", formData.gender);

      // Boolean değerleri stringe çevirerek gönder
      data.append("vaccinated", formData.vaccinated ? "1" : "0");
      data.append("neutered", formData.neutered ? "1" : "0");

      if (!isCiftlestirme) {
        data.append("toiletTrained", formData.toiletTrained ? "1" : "0");
        data.append("basicTrained", formData.basicTrained ? "1" : "0");
      }

      data.append("description", formData.description.trim());
      data.append("city", formData.city);
      data.append("hadHealthIssue", formData.hadHealthIssue);
      data.append(
        "healthIssueDetail",
        formData.hadHealthIssue === "yes"
          ? formData.healthIssueDetail.trim()
          : "",
      );
      data.append("kullanici_id", currentUser.id.toString());
      data.append("Sahip_durumu", "0"); // Her zaman string olarak gönder

      if (isCiftlestirme) {
        data.append("aranan_irk", formData.aranan_irk.trim());
        data.append("aranan_cinsiyet", formData.aranan_cinsiyet);
      }

      // Fotoğraf kontrolü
      if (formData.photo) {
        data.append("photo", formData.photo);
      } else {
        alert("Lütfen bir fotoğraf seçin.");
        setIsSubmitting(false);
        return;
      }

      for (let [key, value] of data.entries()) {
      }

      const endpoint = isCiftlestirme
        ? "http://localhost:7001/api/ciftlestirme/ilanEkle"
        : "http://localhost:7001/api/ilanEkle";

      const response = await fetch(endpoint, {
        method: "POST",
        body: data,
      });

      const rawResponseText = await response.text();
      let responseData = {};

      try {
        responseData = rawResponseText ? JSON.parse(rawResponseText) : {};
      } catch {
        responseData = {
          error: rawResponseText || "Sunucu yanıtı işlenemedi.",
        };
      }

      if (response.ok) {
        // Form verilerini sıfırla
        setFormData({
          ilanAmaci: "sahiplendirme",
          petName: "",
          species: "",
          breed: "",
          birthDate: "",
          gender: "",
          vaccinated: false,
          toiletTrained: false,
          basicTrained: false,
          neutered: false,
          description: "",
          city: "",
          photo: null,
          hadHealthIssue: "no",
          healthIssueDetail: "",
          aranan_irk: "",
          aranan_cinsiyet: "",
        });
        setPhotoPreview(null);
        alert("İlan başarıyla eklendi!");

        if (isCiftlestirme) {
          navigate("/ciftlestirme-ilanlari");
        } else {
          navigate("/animal-listing");
        }

        // Başarılı işlem sonrası yönlendirme
        // window.location.href = "/ilanlarim"; // İsteğe bağlı yönlendirme
      } else {
        let errorMessage =
          responseData.error || responseData.details || "Bilinmeyen hata";

        if (isCiftlestirme && response.status === 404) {
          errorMessage =
            "Çiftleştirme endpoint'i bulunamadı (404). Backend sunucusunu yeniden başlatın.";
        }

        alert(`İlan eklenirken hata: ${errorMessage}`);
      }
    } catch (error) {
      alert("Bağlantı hatası. Lütfen tekrar deneyin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isCiftlestirme = formData.ilanAmaci === "ciftlestirme";

  return (
    <div className="ilan-form-container">
      <h2>Yeni İlan Ekle</h2>
      <form onSubmit={handleSubmit} className="ilan-form">
        <div className="ilan-amaci-group">
          <label>İlanınızın amacı nedir?</label>
          <div className="ilan-amaci-options">
            <label
              className={`ilan-amaci-box ${formData.ilanAmaci === "sahiplendirme" ? "selected" : ""}`}
            >
              <input
                type="radio"
                name="ilanAmaci"
                value="sahiplendirme"
                checked={formData.ilanAmaci === "sahiplendirme"}
                onChange={handleChange}
              />
              Sahiplendirmek için
            </label>
            <label
              className={`ilan-amaci-box ${formData.ilanAmaci === "ciftlestirme" ? "selected" : ""}`}
            >
              <input
                type="radio"
                name="ilanAmaci"
                value="ciftlestirme"
                checked={formData.ilanAmaci === "ciftlestirme"}
                onChange={handleChange}
              />
              Çiftleştirmek için
            </label>
          </div>
        </div>

        <label>
          Hayvan Adı
          <input
            type="text"
            name="petName"
            value={formData.petName}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Tür
          <select
            name="species"
            value={formData.species}
            onChange={handleChange}
            required
          >
            <option value="">Seçiniz</option>
            <option value="Köpek">Köpek</option>
            <option value="Kedi">Kedi</option>
            <option value="Kuş">Kuş</option>
            <option value="Tavşan">Tavşan</option>
            <option value="Diğer">Diğer</option>
          </select>
        </label>

        <label>
          Irk
          <input
            type="text"
            name="breed"
            value={formData.breed}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Doğum Tarihi
          <input
            type="date"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            required
          />
        </label>

        <div className="gender-group">
          <label>Cinsiyet</label>
          <div className="gender-options">
            <label
              className={`gender-box ${formData.gender === "Erkek" ? "selected" : ""}`}
            >
              <input
                type="radio"
                name="gender"
                value="Erkek"
                checked={formData.gender === "Erkek"}
                onChange={handleChange}
                required
              />
              Erkek
            </label>
            <label
              className={`gender-box ${formData.gender === "Dişi" ? "selected" : ""}`}
            >
              <input
                type="radio"
                name="gender"
                value="Dişi"
                checked={formData.gender === "Dişi"}
                onChange={handleChange}
              />
              Dişi
            </label>
          </div>
        </div>

        <label>
          Şehir
          <select
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          >
            <option value="">Şehir Seçin</option>
            <option value="Adana">Adana</option>
            <option value="Adıyaman">Adıyaman</option>
            <option value="Afyonkarahisar">Afyonkarahisar</option>
            <option value="Ağrı">Ağrı</option>
            <option value="Aksaray">Aksaray</option>
            <option value="Amasya">Amasya</option>
            <option value="Ankara">Ankara</option>
            <option value="Antalya">Antalya</option>
            <option value="Ardahan">Ardahan</option>
            <option value="Artvin">Artvin</option>
            <option value="Aydın">Aydın</option>
            <option value="Balıkesir">Balıkesir</option>
            <option value="Bartın">Bartın</option>
            <option value="Batman">Batman</option>
            <option value="Bayburt">Bayburt</option>
            <option value="Bilecik">Bilecik</option>
            <option value="Bingöl">Bingöl</option>
            <option value="Bitlis">Bitlis</option>
            <option value="Bolu">Bolu</option>
            <option value="Burdur">Burdur</option>
            <option value="Bursa">Bursa</option>
            <option value="Çanakkale">Çanakkale</option>
            <option value="Çankırı">Çankırı</option>
            <option value="Çorum">Çorum</option>
            <option value="Denizli">Denizli</option>
            <option value="Diyarbakır">Diyarbakır</option>
            <option value="Düzce">Düzce</option>
            <option value="Edirne">Edirne</option>
            <option value="Elazığ">Elazığ</option>
            <option value="Erzincan">Erzincan</option>
            <option value="Erzurum">Erzurum</option>
            <option value="Eskişehir">Eskişehir</option>
            <option value="Gaziantep">Gaziantep</option>
            <option value="Giresun">Giresun</option>
            <option value="Gümüşhane">Gümüşhane</option>
            <option value="Hakkari">Hakkari</option>
            <option value="Hatay">Hatay</option>
            <option value="Iğdır">Iğdır</option>
            <option value="Isparta">Isparta</option>
            <option value="İstanbul">İstanbul</option>
            <option value="İzmir">İzmir</option>
            <option value="Kahramanmaraş">Kahramanmaraş</option>
            <option value="Karabük">Karabük</option>
            <option value="Karaman">Karaman</option>
            <option value="Kars">Kars</option>
            <option value="Kastamonu">Kastamonu</option>
            <option value="Kayseri">Kayseri</option>
            <option value="Kırıkkale">Kırıkkale</option>
            <option value="Kırklareli">Kırklareli</option>
            <option value="Kırşehir">Kırşehir</option>
            <option value="Kilis">Kilis</option>
            <option value="Kocaeli">Kocaeli</option>
            <option value="Konya">Konya</option>
            <option value="Kütahya">Kütahya</option>
            <option value="Malatya">Malatya</option>
            <option value="Manisa">Manisa</option>
            <option value="Mardin">Mardin</option>
            <option value="Mersin">Mersin</option>
            <option value="Muğla">Muğla</option>
            <option value="Muş">Muş</option>
            <option value="Nevşehir">Nevşehir</option>
            <option value="Niğde">Niğde</option>
            <option value="Ordu">Ordu</option>
            <option value="Osmaniye">Osmaniye</option>
            <option value="Rize">Rize</option>
            <option value="Sakarya">Sakarya</option>
            <option value="Samsun">Samsun</option>
            <option value="Siirt">Siirt</option>
            <option value="Sinop">Sinop</option>
            <option value="Sivas">Sivas</option>
            <option value="Şanlıurfa">Şanlıurfa</option>
            <option value="Şırnak">Şırnak</option>
            <option value="Tekirdağ">Tekirdağ</option>
            <option value="Tokat">Tokat</option>
            <option value="Trabzon">Trabzon</option>
            <option value="Tunceli">Tunceli</option>
            <option value="Uşak">Uşak</option>
            <option value="Van">Van</option>
            <option value="Yalova">Yalova</option>
            <option value="Yozgat">Yozgat</option>
            <option value="Zonguldak">Zonguldak</option>
          </select>
        </label>

        {isCiftlestirme && (
          <div className="ciftlestirme-fields">
            <h4>Çiftleştirme Bilgileri</h4>

            <label>
              Aranan Irk
              <input
                type="text"
                name="aranan_irk"
                value={formData.aranan_irk}
                onChange={handleChange}
                placeholder="Örn: Golden Retriever"
              />
            </label>

            <div className="gender-group">
              <label>Aranan Cinsiyet</label>
              <div className="gender-options">
                <label
                  className={`gender-box ${formData.aranan_cinsiyet === "Erkek" ? "selected" : ""}`}
                >
                  <input
                    type="radio"
                    name="aranan_cinsiyet"
                    value="Erkek"
                    checked={formData.aranan_cinsiyet === "Erkek"}
                    onChange={handleChange}
                  />
                  Erkek
                </label>
                <label
                  className={`gender-box ${formData.aranan_cinsiyet === "Dişi" ? "selected" : ""}`}
                >
                  <input
                    type="radio"
                    name="aranan_cinsiyet"
                    value="Dişi"
                    checked={formData.aranan_cinsiyet === "Dişi"}
                    onChange={handleChange}
                  />
                  Dişi
                </label>
              </div>
            </div>
          </div>
        )}

        <div className="checkbox-group">
          <h4>Ek Bilgiler</h4>
          <div className="checkbox-item">
            <input
              type="checkbox"
              id="vaccinated"
              name="vaccinated"
              checked={formData.vaccinated}
              onChange={handleChange}
            />
            <label htmlFor="vaccinated">Aşılı</label>
          </div>
          {!isCiftlestirme && (
            <>
              <div className="checkbox-item">
                <input
                  type="checkbox"
                  id="toiletTrained"
                  name="toiletTrained"
                  checked={formData.toiletTrained}
                  onChange={handleChange}
                />
                <label htmlFor="toiletTrained">Tuvalet Eğitimi</label>
              </div>
              <div className="checkbox-item">
                <input
                  type="checkbox"
                  id="basicTrained"
                  name="basicTrained"
                  checked={formData.basicTrained}
                  onChange={handleChange}
                />
                <label htmlFor="basicTrained">Temel Eğitimli</label>
              </div>

              <div className="checkbox-item">
                <input
                  type="checkbox"
                  id="neutered"
                  name="neutered"
                  checked={formData.neutered}
                  onChange={handleChange}
                />
                <label htmlFor="neutered">Kısırlaştırılmış</label>
              </div>
            </>
          )}
        </div>

        <div className="health-issue-section">
          <label>
            Sağlık Sorunu Var mı?
            <div className="radio-group">
              <label
                className={`radio-option ${formData.hadHealthIssue === "yes" ? "selected" : ""}`}
              >
                <input
                  type="radio"
                  name="hadHealthIssue"
                  value="yes"
                  checked={formData.hadHealthIssue === "yes"}
                  onChange={handleChange}
                  required
                />
                Evet
              </label>
              <label
                className={`radio-option ${formData.hadHealthIssue === "no" ? "selected" : ""}`}
              >
                <input
                  type="radio"
                  name="hadHealthIssue"
                  value="no"
                  checked={formData.hadHealthIssue === "no"}
                  onChange={handleChange}
                />
                Hayır
              </label>
            </div>
          </label>

          {formData.hadHealthIssue === "yes" && (
            <div className="health-issue-detail">
              <label>
                Sağlık Sorunu Detayı
                <textarea
                  name="healthIssueDetail"
                  value={formData.healthIssueDetail}
                  onChange={handleChange}
                  placeholder="Lütfen sağlık sorununu detaylı şekilde açıklayın"
                  rows={4}
                  required={formData.hadHealthIssue === "yes"}
                />
              </label>
            </div>
          )}
        </div>

        <label>
          Açıklama
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </label>

        <div className="photo-upload">
          <label>
            Hayvan Fotoğrafı
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              required={!formData.photo}
            />
            <small>{`Maksimum dosya boyutu: ${MAX_PHOTO_SIZE_MB}MB`}</small>
          </label>
          {photoPreview && (
            <div className="photo-preview">
              <img src={photoPreview} alt="Önizleme" />
            </div>
          )}
        </div>

        <button type="submit" className="submit-btn" disabled={isSubmitting}>
          {isSubmitting
            ? "Gönderiliyor..."
            : formData.ilanAmaci === "ciftlestirme"
              ? "Çiftleştirme İlanını Gönder"
              : "Sahiplendirme İlanını Gönder"}
        </button>
      </form>
    </div>
  );
};

export default IlanEklePage;
