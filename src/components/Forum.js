import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Forum.css";

const API_URL = "http://localhost:7001/api/forum"; // 5000 -> 7001

const Forum = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Tüm Yazılar");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "Genel",
  });

  const categories = [
    "Tüm Yazılar",
    "Eğitim",
    "Beslenme",
    "Sağlık",
    "Davranış",
    "Bakım",
    "Genel",
  ];

  // Yazıları API'den çek
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/posts`);
      const data = await response.json();
      setPosts(data || []);
    } catch (error) {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (post) => {
    navigate(`/forum/${post.id}`, { state: { post } });
  };

  const handleAddPost = async () => {
    const storedUser =
      localStorage.getItem("currentUser") || localStorage.getItem("user");
    const currentUser = storedUser ? JSON.parse(storedUser) : null;

    if (!currentUser?.id) {
      alert("Yazı paylaşmak için giriş yapmalısınız.");
      navigate("/login");
      return;
    }

    if (!formData.title.trim() || !formData.content.trim()) {
      alert("Lütfen başlık ve içeriği doldurun!");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: currentUser.id,
          title: formData.title,
          content: formData.content,
          category: formData.category,
        }),
      });

      if (response.ok) {
        alert("Yazı başarıyla yayınlandı!");
        setFormData({ title: "", content: "", category: "Genel" });
        setIsModalOpen(false);
        fetchPosts(); // Yazıları yeniden yükle
      } else {
        alert("Yazı eklenirken hata oluştu");
      }
    } catch (error) {
      alert("Yazı eklenirken hata oluştu");
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const filteredPosts =
    selectedCategory === "Tüm Yazılar"
      ? posts
      : posts.filter((post) => post.category === selectedCategory);

  if (loading) {
    return (
      <div className="forum-container">
        <p>Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="forum-container">
      {/* Yazı Ekleme Butonu */}
      <div className="forum-action-bar">
        <button className="btn-new-post" onClick={() => setIsModalOpen(true)}>
          + Yeni Yazı Başlat
        </button>
      </div>

      <div className="forum-main-layout">
        {/* Kategoriler */}
        <aside className="forum-categories">
          <h2>Kategoriler</h2>
          <div className="categories-list">
            {categories.map((category) => (
              <button
                key={category}
                className={`category-btn ${
                  selectedCategory === category ? "active" : ""
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </aside>

        {/* Grid Kartlar */}
        <div className="forum-content-area">
          <div className="forum-cards-grid">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="forum-card"
                onClick={() => handleCardClick(post)}
              >
                <div className="forum-card-header">
                  <div className="forum-card-author">
                    <span className="forum-card-avatar">👨</span>
                    <div className="forum-card-author-info">
                      <p className="forum-card-author-name">{post.author}</p>
                      <p className="forum-card-time">
                        {new Date(post.created_at).toLocaleDateString("tr-TR")}
                      </p>
                    </div>
                  </div>
                  <span className="forum-card-category">{post.category}</span>
                </div>

                <h3 className="forum-card-title">{post.title}</h3>
                <p className="forum-card-content">
                  {post.content.length > 80
                    ? post.content.substring(0, 80) + "..."
                    : post.content}
                </p>

                <div className="forum-card-footer">
                  <button className="btn-view-detail">Cevapları Gör</button>
                </div>
              </div>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="forum-empty-state">
              <p>Bu kategori için henüz yazı yok.</p>
            </div>
          )}
        </div>
      </div>

      {/* Kart Ekle Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {/* Sadece formu bırakıyoruz, sol yeşil alanı kaldırıyoruz */}
            <form className="modal-form">
              <div className="form-group">
                <label htmlFor="title">Başlık *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  placeholder="Yazı başlığını girin..."
                  maxLength="100"
                />
                <small>{formData.title.length}/100</small>
              </div>

              <div className="form-group">
                <label htmlFor="category">Kategori</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleFormChange}
                >
                  <option value="Eğitim">Eğitim</option>
                  <option value="Beslenme">Beslenme</option>
                  <option value="Sağlık">Sağlık</option>
                  <option value="Davranış">Davranış</option>
                  <option value="Bakım">Bakım</option>
                  <option value="Genel">Genel</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="content">İçerik *</label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleFormChange}
                  placeholder="Yazı içeriğini girin..."
                  rows="6"
                  maxLength="1000"
                />
                <small>{formData.content.length}/1000</small>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setIsModalOpen(false)}
                >
                  İptal
                </button>
                <button
                  type="button"
                  className="btn-submit"
                  onClick={handleAddPost}
                >
                  Yazıyı Yayınla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Forum;
