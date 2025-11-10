import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BottomNavBar from "../../components/layout/BottomNavBar";
import "../../components/styles/home.css"; // (Asegúrate que esta ruta es correcta)
import { API_URL, getAuthHeaders } from "../../apiConfig.js"; // Importa los helpers

import {
  FaUser,
  FaFire,
  FaPaperPlane,
  FaCamera,
  FaGamepad,
  FaSmileBeam,
  FaLightbulb,
  FaCheckSquare,
  FaPlus,
  FaLink,
} from "react-icons/fa";

// ----- Sub-componentes para el Home (Widgets) -----

const ConnectionCard = ({ user, partner, streak }) => (
  <div className="connection-card">
    <div className="profile-avatar user-avatar">
      <FaUser />
      {/* El nombre ahora viene de MySQL */}
      <span>{user.nombre}</span>
    </div>
    <div className="streak-display">
      <FaFire className="streak-icon" />
      <strong>{streak}</strong>
      <span>días de racha</span>
    </div>
    <div className="profile-avatar partner-avatar">
      <FaUser />
      {/* El nombre de la pareja viene de MySQL */}
      <span>{partner.nombre}</span>
    </div>
  </div>
);

const QuickActions = ({ navigate }) => (
  // (Este componente no cambia)
  <div className="quick-actions">
    <button className="action-btn" onClick={() => navigate("/chat")}>
      <FaPaperPlane />
      <span>Mensaje</span>
    </button>
    <button className="action-btn" onClick={() => navigate("/gallery")}>
      <FaCamera />
      <span>Enviar Foto</span>
    </button>
    <button className="action-btn" onClick={() => navigate("/games")}>
      <FaGamepad />
      <span>Jugar</span>
    </button>
    <button className="action-btn" onClick={() => alert("Actualizar estado")}>
      <FaSmileBeam />
      <span>Tu Estado</span>
    </button>
  </div>
);

const DailyPrompt = ({ prompt, onRespond }) => (
  // (Este componente no cambia)
  <div className="widget-card prompt-card">
    <div className="widget-header">
      <FaLightbulb className="widget-icon" />
      <h4>Pregunta del Día</h4>
    </div>
    <p className="prompt-text">"{prompt}"</p>
    <button className="btn-respond" onClick={onRespond}>
      Responder
    </button>
  </div>
);

const SharedPlans = ({ plans }) => (
  // (Este componente no cambia)
  <div className="widget-card plans-card">
    <div className="widget-header">
      <FaCheckSquare className="widget-icon" />
      <h4>Nuestros Planes</h4>
    </div>
    <ul className="plans-list">
      {plans.map((plan, index) => (
        <li key={index}>
          <div className="plan-checkbox" />
          <span>{plan}</span>
        </li>
      ))}
    </ul>
    <button className="btn-add-plan">
      <FaPlus />
    </button>
  </div>
);

// ----- ¡NUEVO WIDGET! -----
// Este widget se muestra si NO tienes pareja
const ConnectPartnerWidget = ({ userCode, onConnect }) => {
  const [partnerCode, setPartnerCode] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onConnect(partnerCode);
  };

  return (
    <div className="widget-card connect-card">
      <div className="widget-header">
        <FaLink className="widget-icon" />
        <h4>Conéctate con tu pareja</h4>
      </div>
      <p className="your-code-label">Tu código de conexión es:</p>
      {/* Mostramos el código que vino del backend */}
      <p className="your-code">{userCode}</p>
      <hr className="divider" />
      <p className="prompt-text">Ingresa el código de tu pareja:</p>
      <form onSubmit={handleSubmit} className="connect-form">
        <input
          type="text"
          placeholder="WT-XXXXXX"
          value={partnerCode}
          onChange={(e) => setPartnerCode(e.target.value)}
          className="connect-input"
        />
        <button type="submit" className="btn-respond">
          Conectar
        </button>
      </form>
    </div>
  );
};

// ----- Componente Principal del Home -----
export default function Home() {
  const [user, setUser] = useState(null); // Tu perfil de MySQL
  const [partner, setPartner] = useState(null); // El perfil de tu pareja
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Datos de simulación (los moveremos a la BD luego)
  const [streak, setStreak] = useState(0); // (Esto aún es simulado)
  const [dailyPrompt, setDailyPrompt] = useState(
    "¿Cuál es tu recuerdo favorito de un viaje juntos?"
  );
  const [sharedPlans, setSharedPlans] = useState([
    "Hacer un picnic en el parque",
    "Ver la nueva peli de Ghibli",
  ]);

  // Cargar datos reales del usuario al iniciar
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("weTwoToken");
      if (!token) {
        navigate("/login"); // Si no hay token, fuera
        return;
      }

      try {
        const response = await fetch(`${API_URL}/me`, {
          method: "GET",
          headers: getAuthHeaders(), // <-- Usa la función de apiConfig.js
        });

        if (!response.ok) {
          // Si el token es inválido, etc.
          localStorage.removeItem("weTwoToken");
          navigate("/login");
          return;
        }

        const data = await response.json();

        // El backend (app.py) devuelve { "usuario": ..., "partner": ... }
        if (data.usuario) {
          setUser(data.usuario); // Guardamos tu perfil de MySQL
          setPartner(data.partner); // Guardamos el perfil de tu pareja (o null si no hay)
        } else {
          throw new Error("Formato de datos de usuario incorrecto");
        }
      } catch (error) {
        console.error("Error al cargar datos:", error);
        localStorage.removeItem("weTwoToken");
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  // Función para conectar (se llama desde el nuevo widget)
  const handleConnect = async (partnerCode) => {
    if (!partnerCode) {
      alert("Por favor, ingresa un código.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/connect`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ partner_code: partnerCode }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("¡Conectados con éxito!");
        // Recargamos la página para que el useEffect() vuelva a
        // buscar al usuario y esta vez traiga a la pareja.
        window.location.reload();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error al conectar:", error);
      alert("Error de conexión con el servidor.");
    }
  };

  if (isLoading) {
    return <div className="loading-screen">Cargando...</div>;
  }

  // Esto previene un error si el fetch falla y user es null
  if (!user) {
    return <div className="loading-screen">Error: Usuario no encontrado.</div>;
  }

  return (
    <div className="home-container">
      <main className="home-content">
        <h1 className="home-greeting">Hola, {user.nombre}</h1>

        {/* --- ¡ESTA ES LA LÓGICA PRINCIPAL! --- */}
        {!partner ? (
          // SI NO HAY PAREJA, MUESTRA EL WIDGET DE CONEXIÓN
          <>
            <p className="home-subtitle">Conéctate para empezar...</p>
            <ConnectPartnerWidget
              userCode={user.connection_code} // Le pasamos el código que vino de /me
              onConnect={handleConnect}
            />
          </>
        ) : (
          // SI SÍ HAY PAREJA, MUESTRA EL DASHBOARD COMPLETO
          <>
            <p className="home-subtitle">Tu espacio con {partner.nombre}</p>
            <ConnectionCard user={user} partner={partner} streak={streak} />
            <QuickActions navigate={navigate} />
            <DailyPrompt
              prompt={dailyPrompt}
              onRespond={() => navigate("/chat")}
            />
            <SharedPlans plans={sharedPlans} />
          </>
        )}
      </main>

      {/* La barra de navegación se queda igual */}
      <BottomNavBar />
    </div>
  );
}
