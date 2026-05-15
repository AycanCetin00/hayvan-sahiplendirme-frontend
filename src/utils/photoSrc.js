const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:7001";

export const getPhotoSrc = (photo) => {
  if (!photo) return null;

  const value = typeof photo === "string" ? photo.trim() : String(photo).trim();
  if (!value) return null;

  if (
    value.startsWith("data:image/") ||
    value.startsWith("http://") ||
    value.startsWith("https://")
  ) {
    return value;
  }

  if (value.startsWith("/uploads/") || value.startsWith("uploads/")) {
    const normalizedPath = value.startsWith("/") ? value : `/${value}`;
    return `${API_BASE_URL}${normalizedPath}`;
  }

  return `data:image/jpeg;base64,${value}`;
};
