import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/DurumtakipForm.css";

const DurumTakipForm = () => {
  const [ilanBilgisi, setIlanBilgisi] = useState(null);
  const [aciklama, setAciklama] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { ilanId } = useParams();
  const navigate = useNavigate();

  // Kullanıcı bilgisini localStorage'dan al
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userId = currentUser ? currentUser.id : null;

  // İlan bilgilerini çekerken kullanici_id'yi doğru şekilde alın
  useEffect(() => {
    const fetchIlanDetay = async () => {
      try {
        const response = await axios.get(
          `http://localhost:7001/api/ilan/${ilanId}`,
        );
        const ilanData = response.data;

        // Eğer kullanici_id doğrudan ilan objesinde değilse:
        if (!ilanData.kullanici_id && ilanData.kullanici?.id) {
          ilanData.kullanici_id = ilanData.kullanici.id;
        }

        setIlanBilgisi(ilanData);
        setLoading(false);
      } catch (err) {
        setError("İlan bilgileri alınamadı");
        setLoading(false);
      }
    };

    fetchIlanDetay();
  }, [ilanId]);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);

      // Dosya önizlemesi oluştur
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewURL(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile || !aciklama || !ilanId || !userId) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append("ilan_id", ilanId);
      formData.append("sahiplenen_id", userId);
      formData.append("aciklama", aciklama);
      formData.append("fotograf", selectedFile);

      // Eğer backend hala hayvan_sahibi_id istiyorsa:
      if (ilanBilgisi?.kullanici?.id) {
        formData.append("hayvan_sahibi_id", ilanBilgisi.kullanici.id);
      }

      const response = await axios.post(
        "http://localhost:7001/api/durum-takibi",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      alert("Durum raporu başarıyla gönderildi!");
      navigate("/sahiplendiklerim");
    } catch (err) {
      alert(`Hata: ${err.response?.data?.details || err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!ilanBilgisi) {
    return <div className="error">İlan bilgileri bulunamadı.</div>;
  }

  return (
    <div className="durum-takip-container">
      <div className="navigation">
        <button onClick={() => navigate(-1)} className="back-button">
          ← Geri Dön
        </button>
      </div>

      <div className="durum-takip-form-card">
        <h1>Durum Raporu Gönder</h1>

        <div className="pet-info-section">
          <h2>{ilanBilgisi.petName || "İsimsiz Hayvan"} için Durum Raporu</h2>
          <p className="info-text">
            Sahiplendiğiniz hayvanın durumu hakkında eski sahibine bilgi vermek
            için bir fotoğraf ve açıklama ekleyin.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="takip-form">
          <div className="form-group photo-upload-section">
            <label htmlFor="photo-upload">Güncel Fotoğraf</label>
            <div className="photo-preview-container">
              {previewURL ? (
                <img
                  src={previewURL}
                  alt="Fotoğraf Önizleme"
                  className="photo-preview"
                />
              ) : (
                <div className="upload-placeholder">Fotoğraf seçilmedi</div>
              )}
            </div>
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="file-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Açıklama</label>
            <textarea
              id="description"
              value={aciklama}
              onChange={(e) => setAciklama(e.target.value)}
              rows="6"
              placeholder="Hayvanın sağlık durumu, beslenme alışkanlıkları, yaşam koşulları vb. hakkında bilgi verin."
              required
            />
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="submit-button"
              disabled={submitting}
            >
              {submitting ? "Gönderiliyor..." : "Raporu Gönder"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DurumTakipForm;
