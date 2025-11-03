import React from "react";
import { useNavigate } from "react-router-dom";
import "../../components/styles/games.css"; // Estilos propios
import BottomNavBar from "../../components/layout/BottomNavBar"; // Importa la barra de navegación
import {
  FaQuestionCircle,
  FaPaintBrush,
  FaBrain,
  FaCamera,
} from "react-icons/fa";

// Componente de Tarjeta de Juego
const GameCard = ({ icon, title, description, onClick, color, bgColor }) => {
  return (
    <div className="game-card" onClick={onClick}>
      <div
        className="game-card-icon"
        style={{ backgroundColor: bgColor, color: color }}
      >
        {icon}
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default function Games() {
  const navigate = useNavigate();

  const handleGameClick = (gameTitle) => {
    alert(`Iniciando ${gameTitle}...`);
    // Aquí puedes navegar a una ruta de juego específica, ej: navigate('/games/preguntas')
  };

  return (
    <div className="games-page">
      <header className="games-header">
        <h2>Juegos y Desafíos</h2>
      </header>

      <main className="games-grid">
        <GameCard
          icon={<FaQuestionCircle />}
          title="Preguntas Cruzadas"
          description="Descubre cuánto se conocen con preguntas divertidas."
          onClick={() => handleGameClick("Preguntas Cruzadas")}
          color="#f472b6"
          bgColor="#fde2f3"
        />
        <GameCard
          icon={<FaPaintBrush />}
          title="Dibujo Dúo"
          description="Uno dibuja, el otro adivina. ¡Caos garantizado!"
          onClick={() => handleGameClick("Dibujo Dúo")}
          color="#38bdf8"
          bgColor="#e0f7fa"
        />
        <GameCard
          icon={<FaBrain />}
          title="Memoria de Momentos"
          description="¿Recuerdan dónde fue su primera foto juntos? ¡Pruébenlo!"
          onClick={() => handleGameClick("Memoria de Momentos")}
          color="#f59e0b"
          bgColor="#fff8e6"
        />
        <GameCard
          icon={<FaCamera />}
          title="Desafío de Fotos"
          description="Completen una lista de desafíos de fotos creativas."
          onClick={() => handleGameClick("Desafío de Fotos")}
          color="#10b981"
          bgColor="#e8f8f5"
        />
      </main>

      <BottomNavBar />
    </div>
  );
}
