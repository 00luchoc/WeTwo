import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
// Corregimos la ruta para que busque en la MISMA CARPETA
import "./BottomNavBar.css"; // Estilos propios

/*
  NOTA: Si ves un error sobre "react-icons/fa", 
  asegúrate de haber instalado la librería en tu terminal:
  npm install react-icons
*/
import {
  FaHome,
  FaComments,
  FaGamepad,
  FaImages,
  FaPlus,
} from "react-icons/fa";

export default function BottomNavBar() {
  const navigate = useNavigate();
  const location = useLocation(); // Hook para saber qué ruta está activa

  // Función para determinar si un botón está activo
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bottom-nav-bar">
      <button
        className={`nav-btn ${isActive("/home") ? "active" : ""}`}
        onClick={() => navigate("/home")}
      >
        <FaHome />
        <span>Home</span>
      </button>
      <button
        className={`nav-btn ${isActive("/chat") ? "active" : ""}`}
        onClick={() => navigate("/chat")}
      >
        <FaComments />
        <span>Chat</span>
      </button>

      {/* Botón de Acción Central */}
      <button
        className="nav-action-btn"
        onClick={() => alert("Crear nuevo...")}
      >
        <FaPlus />
      </button>

      <button
        className={`nav-btn ${isActive("/games") ? "active" : ""}`}
        onClick={() => navigate("/games")}
      >
        <FaGamepad />
        <span>Juegos</span>
      </button>
      <button
        className={`nav-btn ${isActive("/gallery") ? "active" : ""}`}
        onClick={() => navigate("/gallery")}
      >
        <FaImages />
        <span>Galería</span>
      </button>
    </nav>
  );
}
