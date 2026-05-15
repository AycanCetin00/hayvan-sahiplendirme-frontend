import React from "react";
import { useParams } from "react-router-dom";

const CiftlestirmeBasvuruPlaceholder = () => {
  const { ilanId } = useParams();

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: "24px" }}>
      <h1>Çiftleştirme Başvuru Sayfası</h1>
      <p>Bu sayfa şimdilik boş bırakıldı.</p>
      <p>Seçilen ilan ID: {ilanId}</p>
    </div>
  );
};

export default CiftlestirmeBasvuruPlaceholder;
