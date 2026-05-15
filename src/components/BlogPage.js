import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Blog.css";
import dogAdoption from "../assests/images/blog/1.jpg";
import catFood from "../assests/images/blog/2.jpg";
import petVaccination from "../assests/images/blog/4.jpg";
import petAsı from "../assests/images/blog/6.jpg";
import pet5 from "../assests/images/blog/5.jpg";

const BlogPage = () => {
  // Blog yazıları — kullanıcı tarafından eklenen yazılar
  const [blogPosts] = useState([
    {
      id: 1,
      title:
        "Kediler Neden Mırlar? Küçük Bir Motor Sesi Gibi Gelen Büyük Bir İletişim Dili",
      excerpt:
        "Mırlama yalnızca mutluluğun işareti değildir; iletişim, rahatlama, sosyal bağ ve bazen stresle baş etme amaçlı karmaşık bir sinyaldir.",
      image: pet5,
      date: "14 Mayıs 2026",
      category: "Kediler",
      author: "Zeynep Çoban (Veteriner Hekim Öğrencisi)",
    },
    {
      id: 2,
      title:
        "Köpekler İnsanların Duygularını Gerçekten Anlar mı? Bakışlardan Kuyruk Sallamaya Uzanan Bilimsel Bir Hikaye",
      excerpt:
        "Köpekler insan yüz ifadelerini, ses tonunu ve beden dilini birleştirerek duygular hakkında ipuçları çıkarabilir; bu yetenek empati ile karıştırılmamalıdır.",
      image: dogAdoption,
      date: "14 Mayıs 2026",
      category: "Köpekler",
      author: "Zeynep Çoban (Veteriner Hekim Öğrencisi)",
    },
    {
      id: 3,
      title: "Kedi ve Köpeklerde Obezite",
      excerpt:
        "Evcil hayvanlarda fazla kilo yalnızca estetik değil; hareket, eklem sağlığı ve metabolik riskleri etkileyen ciddi bir sağlık sorunudur.",
      image: petVaccination,
      date: "14 Mayıs 2026",
      category: "Sağlık",
      author: "Zeynep Çoban (Veteriner Hekim Öğrencisi)",
    },
    {
      id: 4,
      title: "Görünmez Kalkan: Kedi ve Köpeklerde Aşı Takviminin Hayati Rolü",
      excerpt:
        "Aşı takvimi, anne antikorlarının azaldığı kritik dönemde bağışıklık penceresini doğru yakalayarak kediler ve köpekler için uzun vadeli koruma sağlar.",
      image: petAsı,
      date: "14 Mayıs 2026",
      category: "Sağlık",
      author: "Hayvan Sahibi Bir Dostumuz",
    },
    {
      id: 5,
      title:
        "Bir Kap Sevgi, Bir Ömür Sağlık: Evcil Hayvanlarda Doğru Beslenmenin Bilimi",
      excerpt:
        "Doğru beslenme; fiziksel sağlık, yaşam kalitesi ve psikoloji üzerinde doğrudan etkili, sevgiyle yönetilmesi gereken bilimsel bir denge işidir.",
      image: catFood,
      date: "14 Mayıs 2026",
      category: "Beslenme",
      author: "Hayvan Sahibi Bir Dostumuz",
    },
  ]);

  // Kategori filtresi için state
  const [activeCategory, setActiveCategory] = useState("Tümü");

  // Tüm kategorileri çıkar
  const categories = [
    "Tümü",
    ...new Set(blogPosts.map((post) => post.category)),
  ];

  // Filtrelenmiş blog yazıları
  const filteredPosts =
    activeCategory === "Tümü"
      ? blogPosts
      : blogPosts.filter((post) => post.category === activeCategory);

  return (
    <div className="blog-container">
      <div className="blog-header">
        <h1>Hayvan Dostlarımız Blog</h1>
        <p>Sevimli dostlarımızla ilgili bilgilendirici yazılar ve ipuçları</p>
      </div>

      <div className="blog-categories">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-button ${activeCategory === category ? "active" : ""}`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="blog-posts">
        {filteredPosts.length === 0 ? (
          <div className="no-posts">Henüz blog yazısı bulunmuyor.</div>
        ) : (
          filteredPosts.map((post) => (
            <div className="blog-card" key={post.id}>
              <div className="blog-image">
                <img src={post.image} alt={post.title} />
                <span className="blog-category">{post.category}</span>
              </div>
              <div className="blog-content">
                <div className="blog-info"></div>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <Link to={`/blog/${post.id}`} className="read-more">
                  Devamını Oku <i className="fas fa-arrow-right"></i>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BlogPage;
