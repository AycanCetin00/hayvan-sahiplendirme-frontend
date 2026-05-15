import React from "react";
import { Link } from "react-router-dom";
import { FaPaw, FaHeart, FaShieldAlt, FaEnvelope } from "react-icons/fa";
import footerLogo from "../assests/images/logo/logo2.png";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Hakkımızda Bölümü */}
        <div className="footer-section about">
          <div className="logo-container">
            <img
              src={footerLogo}
              alt="SafePaw Logo"
              className="footer-brand-logo"
            />
            <div className="footer-brand-text">
              <h3>SafePaw</h3>
              <p>Hayvan Sahiplendirme Platformu</p>
            </div>
          </div>
          <p className="about-text">
            Hayvan dostlarımız için güvenli ve sevgi dolu yuvalar bulmayı
            amaçlayan bir platformuz. Amacımız sahipsiz hayvanlar ile onlara
            yuva açmak isteyenleri buluşturmak.
          </p>
          <div className="mission-statement">
            <FaHeart className="mission-icon" />
            <span>Her hayvan bir aileyi hak eder</span>
          </div>
        </div>

        {/* Hızlı Bağlantılar */}
        <div className="footer-section links">
          <h3>Hızlı Erişim</h3>
          <ul>
            <li>
              <Link to="/">
                <FaPaw className="link-icon" /> Ana Sayfa
              </Link>
            </li>
            <li>
              <Link to="/animal-listing">
                <FaPaw className="link-icon" /> Hayvan İlanları
              </Link>
            </li>
            <li>
              <Link to="/blog">
                <FaPaw className="link-icon" /> Hayvan Bakım Blogu
              </Link>
            </li>
          </ul>
        </div>

        {/* İletişim Bilgileri */}
        <div className="footer-section contact">
          <h3>Bize Ulaşın</h3>
          <ul className="contact-info">
            <li>
              <FaEnvelope className="contact-icon" />
<a
  href="mailto:desteksafepaw@gmail.com?subject=SafePaw%20ile%20ileti%C5%9Fim&body=Merhaba%20SafePaw%2C"
>
  desteksafepaw@gmail.com
</a>            </li>
            <li>
              <FaPaw className="contact-icon" />
              <Link to="/yardim">Yardım Merkezi</Link>
            </li>
          </ul>
        </div>

        {/* Değerler ve Rozetler */}
        <div className="footer-section social">
          <h3>Platform Değerleri</h3>
          <div className="social-links"></div>

          <div className="trust-badges">
            <div className="badge">
              <FaShieldAlt className="badge-icon" />
              <span>Güvenli Sahiplendirme</span>
            </div>
            <div className="badge">
              <FaHeart className="badge-icon" />
              <span>Hayvan Dostu</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Alt Kısım */}
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>
            © {new Date().getFullYear()} SafePaw Hayvan Sahiplendirme Platformu.
            Tüm hakları saklıdır.
          </p>
          <div className="legal-links">
            <Link to="/gizlilik-politikasi">Gizlilik Politikası</Link>
            <Link to="/kullanim-sartlari">Kullanım Şartları</Link>
            <Link to="/cerez-politikasi">Çerez Politikası</Link>
            <Link to="/sss">Sık Sorulan Sorular</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
