// La URL donde se está ejecutando tu backend de Flask
export const API_URL = "http://127.0.0.1:5000"; // (O la IP de tu servidor)

/**
 * Obtiene el token de autenticación desde localStorage.
 * @returns {HeadersInit} Un objeto de Headers listo para usar en fetch.
 */
export const getAuthHeaders = () => {
  const token = localStorage.getItem("weTwoToken");
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};
