import React, { useState, useRef, useEffect } from "react"; // useRef ve useEffect eklenmeli
import logo from "../assests/images/logo/logo2.png";
import "../styles/Header.css";
//import BreedModal from './BreedModal';
import Login from "./Login";
import Register from "./Register";
import { useNavigate } from "react-router-dom"; // eğer yönlendirme için react-router kullanıyorsan

const Header = ({
  isAuthenticated,
  currentUser,
  onLogout,
  onLogin,
  onRegister,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // eksikti
  const menuRef = useRef(null); // eksikti
  const navigate = useNavigate();

  // Dışarı tıklanınca menüyü kapat
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogoutClick = () => {
    onLogout();
    localStorage.removeItem("user");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    window.location.href = "/"; // Çıkış yapınca ana sayfaya yönlendir
  };

  // Modal açma fonksiyonu
  const handleModalOpen = (modalType) => {
    if (modalType === "login") {
      setIsLoginOpen(true);
    } else if (modalType === "register") {
      setIsRegisterOpen(true);
    }
  };

  const handleModalClose = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(false);
  };

  return (
    <>
      <header className="header">
        <div className="top-header">
          <div className="logo-container">
            <img
              src={logo}
              alt="SafePaw Logo"
              className="logo"
              onClick={() => (window.location.href = "/")}
            />
            <div
              className="logo-text-block"
              onClick={() => (window.location.href = "/")}
            >
              <h1 className="logo-text">SafePaw</h1>
              <span className="logo-subtext">
                Hayvan Sahiplendirme Platformu
              </span>
            </div>
          </div>

          <div className="auth-buttons">
            {isAuthenticated ? (
              <div className="user-menu" ref={menuRef}>
                <button
                  className="btn avatar-btn"
                  onClick={() => setMenuOpen(!menuOpen)}
                  aria-label="Kullanıcı Menüsü"
                >
                  {currentUser.name}
                </button>

                {menuOpen && (
                  <ul className="dropdown-menu">
                    <li onClick={() => navigate("/Sahiplendiklerim")}>
                      Sahiplendiklerim
                    </li>
                    <li onClick={() => navigate("/ilanlarim")}>İlanlarım</li>
                    <li onClick={() => navigate("/profile")}>
                      Profil Ayarları
                    </li>
                    <li onClick={() => navigate("/Bildirimler")}>
                      Bildirimler
                    </li>
                    <li onClick={() => navigate("/yardim-durumu")}>
                      Yardım Durumu
                    </li>
                    <li onClick={handleLogoutClick}>Çıkış yap</li>
                  </ul>
                )}
              </div>
            ) : (
              <>
                <button
                  className="btn auth-btn"
                  onClick={() => handleModalOpen("register")}
                  aria-label="Üye Kayıt"
                >
                  Üye Kayıt
                </button>
                <button
                  className="btn auth-btn"
                  onClick={() => handleModalOpen("login")}
                  aria-label="Giriş Yap"
                >
                  Giriş
                </button>
              </>
            )}
          </div>
        </div>

        <nav className="nav-container" aria-label="Main navigation">
          <ul className="nav">
            <li>
              <a href="/">Ana Sayfa</a>
            </li>
            <li>
              <a
                href="/animal-listing"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/animal-listing"); // Sahiplendirme sayfasına yönlendir
                }}
                aria-label="Sahiplendirme"
              >
                Sahiplendirme
              </a>
            </li>

            <li>
              <a
                href="/ciftlestirme-ilanlari"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/ciftlestirme-ilanlari");
                }}
                aria-label="Çiftleştirme İlanları"
              >
                Çiftleştirme
              </a>
            </li>
            <li>
              <a href="/ilan-ekle">İlan Ekle</a>
            </li>
            <li>
              <a href="/blog">Blog</a>
            </li>
            <li>
              <a href="/forum">Forum</a>
            </li>
          </ul>
        </nav>
      </header>

      {/* Modal bileşenleri */}
      {isLoginOpen && (
        <Login
          onClose={() => setIsLoginOpen(false)}
          onRegisterClick={() => {
            setIsLoginOpen(false);
            setIsRegisterOpen(true);
          }}
          onLoginSuccess={(userData) => {
            if (typeof onLogin === "function") {
              onLogin(userData);
            }
          }}
        />
      )}

      {isRegisterOpen && (
        <Register
          onClose={() => setIsRegisterOpen(false)}
          onLoginClick={() => {
            setIsRegisterOpen(false);
            setIsLoginOpen(true);
          }}
          onRegisterSuccess={(userData) => {
            setIsRegisterOpen(false);
            if (typeof onRegister === "function") {
              onRegister(userData);
            }
          }}
        />
      )}
    </>
  );
};

export default Header;
