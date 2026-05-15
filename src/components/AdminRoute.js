import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ADMIN_LOGIN_PATH = "/yonetim-giris-8f3b";

const ProtectedAdminRoute = ({ children }) => {
  const [isValidating, setIsValidating] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const adminUser = sessionStorage.getItem("adminUser");

  useEffect(() => {
    const validateAdminSession = async () => {
      try {
        if (!adminUser) {
          setIsAuthorized(false);
          setIsValidating(false);
          return;
        }

        const parsedAdminUser = JSON.parse(adminUser);

        if (
          !parsedAdminUser ||
          parsedAdminUser.role !== "admin" ||
          !parsedAdminUser.token
        ) {
          sessionStorage.removeItem("adminUser");
          setIsAuthorized(false);
          setIsValidating(false);
          return;
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
          setIsAuthorized(false);
          setIsValidating(false);
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        sessionStorage.removeItem("adminUser");
        setIsAuthorized(false);
      } finally {
        setIsValidating(false);
      }
    };

    validateAdminSession();
  }, [adminUser]);

  if (isValidating) {
    return <div className="loading-message">Admin oturumu doğrulanıyor...</div>;
  }

  if (!isAuthorized) {
    return <Navigate to={ADMIN_LOGIN_PATH} replace />;
  }

  // Her şey yolundaysa admin paneline erişime izin ver
  return children;
};

export default ProtectedAdminRoute;
