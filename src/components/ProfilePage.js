import React, { useState, useEffect } from "react";
import "../styles/ProfilePage.css";

function ProfilePage() {
  const [user, setUser] = useState({
    id: "",
    adi: "",
    soyadi: "",
    email: "",
    telefon: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user?.id;

        if (!userId) {
          throw new Error("Kullanıcı ID'si bulunamadı");
        }

        const response = await fetch(
          `http://localhost:7001/profile?userId=${userId}`,
        );

        if (!response.ok) {
          throw new Error("Profil bilgileri alınamadı");
        }

        const data = await response.json();
        setUser(data.user);
        setIsLoading(false);
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleEditClick = () => {
    setEditedUser({ ...user });
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setSuccessMessage("");
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("http://localhost:7001/api/profile/update", {
        method: "PUT", // POST yerine PUT kullanıyoruz
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          adi: editedUser.adi,
          soyadi: editedUser.soyadi,
          email: editedUser.email,
          telefon: editedUser.telefon,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Güncelleme başarısız");
      }

      const result = await response.json();
      setUser(result.user); // Backend'in döndüğü güncel kullanıcı verisi
      setIsEditing(false);
      setSuccessMessage(result.message || "Profiliniz başarıyla güncellendi!");
    } catch (err) {
      setError(err.message || `Güncelleme hatası: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="profile-page-container">
      <div className="profile-card">
        <div className="profile-header">
          <h1>Kullanıcı Profili</h1>
          {!isEditing && (
            <div className="profile-avatar">
              {user.adi &&
                user.soyadi &&
                `${user.adi.charAt(0)}${user.soyadi.charAt(0)}`}
            </div>
          )}
        </div>

        {error && (
          <div className="alert alert-error">
            <div className="alert-icon">⚠️</div>
            <div className="alert-message">{error}</div>
          </div>
        )}

        {successMessage && (
          <div className="alert alert-success">
            <div className="alert-icon">✅</div>
            <div className="alert-message">{successMessage}</div>
          </div>
        )}

        {isEditing ? (
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="adi">Adı</label>
              <input
                type="text"
                id="adi"
                name="adi"
                value={editedUser.adi || ""}
                onChange={handleInputChange}
                required
                className="form-input"
                placeholder="Adınızı girin"
              />
            </div>

            <div className="form-group">
              <label htmlFor="soyadi">Soyadı</label>
              <input
                type="text"
                id="soyadi"
                name="soyadi"
                value={editedUser.soyadi || ""}
                onChange={handleInputChange}
                required
                className="form-input"
                placeholder="Soyadınızı girin"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">E-posta</label>
              <input
                type="email"
                id="email"
                name="email"
                value={editedUser.email || ""}
                onChange={handleInputChange}
                required
                className="form-input"
                placeholder="E-posta adresinizi girin"
              />
            </div>

            <div className="form-group">
              <label htmlFor="telefon">Telefon</label>
              <input
                type="tel"
                id="telefon"
                name="telefon"
                value={editedUser.telefon || ""}
                onChange={handleInputChange}
                required
                className="form-input"
                placeholder="Telefon numaranızı girin"
              />
            </div>

            <div className="button-group">
              <button type="submit" className="primary-button">
                {isLoading ? "Kaydediliyor..." : "Kaydet"}
              </button>
              <button
                type="button"
                className="secondary-button"
                onClick={handleCancelClick}
              >
                İptal
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-details">
            <div className="info-row">
              <div className="info-item">
                <span className="info-label">Adı</span>
                <span className="info-value">{user.adi || "—"}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Soyadı</span>
                <span className="info-value">{user.soyadi || "—"}</span>
              </div>
            </div>

            <div className="info-row">
              <div className="info-item">
                <span className="info-label">E-posta</span>
                <span className="info-value">{user.email || "—"}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Telefon</span>
                <span className="info-value">{user.telefon || "—"}</span>
              </div>
            </div>

            <button onClick={handleEditClick} className="edit-button">
              <span className="edit-icon">✏️</span> Profili Düzenle
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
