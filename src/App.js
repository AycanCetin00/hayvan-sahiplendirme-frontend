import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";

import Header from "./components/Header";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import IlanEklePage from "./components/IlanEklePage";
import AdDetail from "./components/AdDetail";
import Ilanlarim from "./components/Ilanlarim";
import ProfilePage from "./components/ProfilePage";
import AnimalListingsPage from "./components/AnimalListingsPage ";
import BlogPage from "./components/BlogPage";
import BlogDetail from "./components/BlogDetail";
import Bildirimler from "./components/Bildirimler";
import BildirimDetay from "./components/BildirimlerDetay";
import MyAdoptionsPage from "./components/Sahiplendiklerim";
import AdoptionRequestDetailPage from "./components/SahiplendiklerimDetay";
import AdminPanel from "./components/AdminPanel";
import AdminLogin from "./components/AdminLogin";
import ProtectedAdminRoute from "./components/AdminRoute";
import DurumTakipForm from "./components/DurumTakipForm";
import DurumTakipRaporlari from "./components/DurumTakipRaporlari";
import Yardim from "./components/Yardim";
import YardimDurumu from "./components/YardimDurumu";
import Footer from "./components/Footer";
import GizlilikPolitikasi from "./components/GizlilikPolitikasi";
import KullanimSartlari from "./components/KullanimSartlari";
import CerezPolitikasi from "./components/CerezPolitikasi";
import SikSorulanSorular from "./components/SıkSorulanSorular";
import CiftlestirmeIlanlariPage from "./components/CiftlestirmeIlanlariPage";
import CiftlestirmeDetail from "./components/CiftlestirmeDetail";
import Forum from "./components/Forum";
import ForumDetail from "./components/ForumDetail";
import ResetPasswordPage from "./components/ResetPasswordPage";

const ADMIN_LOGIN_PATH = "/yonetim-giris-8f3b";
const ADMIN_PANEL_PATH = "/yonetim-panel-8f3b";

// Layout bileşeni oluşturuyoruz
function AppLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const location = useLocation();

  // Admin sayfaları için özel kontrol
  const isAdminPage =
    location.pathname === ADMIN_PANEL_PATH ||
    location.pathname === ADMIN_LOGIN_PATH;
  const isAdminLoginPage = location.pathname === ADMIN_LOGIN_PATH;
  const shouldHideHeaderFooter = isAdminPage || isAdminLoginPage;

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setIsAuthenticated(true);
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setCurrentUser(userData);
    localStorage.setItem("currentUser", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <div
      className="App"
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      {/* Header'ı admin sayfasında gösterme */}
      {!shouldHideHeaderFooter && (
        <Header
          isAuthenticated={isAuthenticated}
          currentUser={currentUser}
          onLogout={handleLogout}
          onLogin={handleLogin}
          onRegister={handleLogin}
        />
      )}

      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/rapor/:id" element={<DurumTakipRaporlari />} />

          {/* Admin rotaları - korumalı */}
          <Route path="/admin" element={<Navigate to="/" replace />} />
          <Route path="/admin-login" element={<Navigate to="/" replace />} />
          <Route path={ADMIN_LOGIN_PATH} element={<AdminLogin />} />
          <Route
            path={ADMIN_PANEL_PATH}
            element={
              <ProtectedAdminRoute>
                <AdminPanel />
              </ProtectedAdminRoute>
            }
          />

          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/forum/:id" element={<ForumDetail />} />
          <Route path="/animal-listing" element={<AnimalListingsPage />} />
          <Route
            path="/ciftlestirme-ilanlari"
            element={<CiftlestirmeIlanlariPage />}
          />
          <Route
            path="/ciftlestirme-ilan/:id"
            element={<CiftlestirmeDetail />}
          />
          <Route path="/ilan-ekle" element={<IlanEklePage />} />
          <Route path="/ilan/:id" element={<AdDetail />} />
          <Route path="/ilanlarim" element={<Ilanlarim />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/bildirimler" element={<Bildirimler />} />
          <Route
            path="/bildirim-detay/:requestId"
            element={<BildirimDetay />}
          />
          <Route path="/yardim-durumu" element={<YardimDurumu />} />
          <Route path="/Sahiplendiklerim" element={<MyAdoptionsPage />} />
          <Route
            path="/my-request-detail/:requestId"
            element={<AdoptionRequestDetailPage />}
          />
          <Route path="/takip-formu/:ilanId" element={<DurumTakipForm />} />
          <Route path="/Yardim" element={<Yardim />} />
          <Route path="/" element={<Home />} />
          <Route
            path="/reset-password/:token"
            element={<ResetPasswordPage />}
          />
          <Route
            path="/login"
            element={<Login onLoginSuccess={handleLogin} />}
          />
          <Route
            path="/register"
            element={<Register onRegister={handleLogin} />}
          />
          <Route path="/gizlilik-politikasi" element={<GizlilikPolitikasi />} />
          <Route path="/kullanim-sartlari" element={<KullanimSartlari />} />
          <Route path="/cerez-politikasi" element={<CerezPolitikasi />} />
          <Route path="/sss" element={<SikSorulanSorular />} />
        </Routes>
      </div>

      {/* Footer'ı admin sayfasında gösterme */}
      {!shouldHideHeaderFooter && <Footer />}
    </div>
  );
}

// Ana App bileşeni
function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
