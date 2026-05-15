import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminPanel.css";
import IlanListesi from "../components/AdminİlanListesi";
import KullaniciListesi from "../components/AdminKullaniciListesi";
import AdminYardimBasvurulari from "../components/AdminYardimBasvurulari";

const ADMIN_LOGIN_PATH = "/yonetim-giris-8f3b";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("ilanlar");
  const [adminUser, setAdminUser] = useState(null);
  const navigate = useNavigate();

  // Component yüklendiğinde admin oturum kontrolü
  useEffect(() => {
    const storedAdminUser = sessionStorage.getItem("adminUser");

    if (storedAdminUser) {
      try {
        const parsedAdminUser = JSON.parse(storedAdminUser);
        setAdminUser(parsedAdminUser);

        const validateSession = async () => {
          try {
            if (!parsedAdminUser?.token) {
              throw new Error("Token bulunamadı");
            }

            const response = await fetch(
              "http://localhost:7001/api/admin/validate",
              {
                headers: {
                  Authorization: `Bearer ${parsedAdminUser.token}`,
                },
              },
            );

            if (!response.ok) {
              sessionStorage.removeItem("adminUser");
              navigate(ADMIN_LOGIN_PATH);
            }
          } catch (error) {
            sessionStorage.removeItem("adminUser");
            navigate(ADMIN_LOGIN_PATH);
          }
        };

        validateSession();
      } catch (error) {
        // Geçersiz JSON verisi varsa temizle ve login sayfasına yönlendir
        sessionStorage.removeItem("adminUser");
        navigate("/admin-login");
      }
    } else {
      // Admin girişi yapılmamışsa login sayfasına yönlendir
      navigate(ADMIN_LOGIN_PATH);
    }
  }, [navigate]);

  // Component unmount olduğunda (sayfa değiştiğinde) oturum verilerini temizle
  useEffect(() => {
    const intervalId = setInterval(async () => {
      const storedAdminUser = sessionStorage.getItem("adminUser");

      if (!storedAdminUser) {
        navigate(ADMIN_LOGIN_PATH);
        return;
      }

      try {
        const parsedAdminUser = JSON.parse(storedAdminUser);
        if (!parsedAdminUser?.token) {
          throw new Error("Token bulunamadı");
        }

        const response = await fetch(
          "http://localhost:7001/api/admin/validate",
          {
            headers: {
              Authorization: `Bearer ${parsedAdminUser.token}`,
            },
          },
        );

        if (!response.ok) {
          sessionStorage.removeItem("adminUser");
          navigate(ADMIN_LOGIN_PATH);
        }
      } catch (error) {
        sessionStorage.removeItem("adminUser");
        navigate(ADMIN_LOGIN_PATH);
      }
    }, 30000);

    return () => {
      // AdminPanel bileşeni unmount olduğunda oturum verilerini temizle
      sessionStorage.removeItem("adminUser");
      clearInterval(intervalId);
    };
  }, [navigate]);

  // Henüz admin bilgisi yüklenmediyse loading göster
  if (!adminUser) {
    return (
      <div className="admin-wrapper">
        <div className="loading-message">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="admin-wrapper">
      <div className="tab-buttons">
        <button
          className={activeTab === "ilanlar" ? "tab active-tab" : "tab"}
          onClick={() => setActiveTab("ilanlar")}
        >
          İlanlar
        </button>
        <button
          className={activeTab === "kullanicilar" ? "tab active-tab" : "tab"}
          onClick={() => setActiveTab("kullanicilar")}
        >
          Kullanıcılar
        </button>
        <button
          className={
            activeTab === "yardim-basvurulari" ? "tab active-tab" : "tab"
          }
          onClick={() => setActiveTab("yardim-basvurulari")}
        >
          Yardım Başvuruları
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "ilanlar" ? (
          <div className="content-card">
            <h2>📢 Yayında Olan İlanlar</h2>
            <IlanListesi />
          </div>
        ) : activeTab === "kullanicilar" ? (
          <div className="content-card">
            <h2>👤 Kayıtlı Kullanıcılar</h2>
            <KullaniciListesi />
          </div>
        ) : (
          <div className="content-card">
            <h2>🆘 Yardım Başvuruları</h2>
            <AdminYardimBasvurulari />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
