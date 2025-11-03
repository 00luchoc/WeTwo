import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BottomNavBar from "../../components/layout/BottomNavBar";
import "../../components/styles/home.css";
import { API_URL, getAuthHeaders } from "../../apiConfig"; // 1. Importar API config

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

// (Los sub-componentes ConnectionCard, QuickActions, etc. se quedan igual)
// ...
// Tarjeta principal que conecta a la pareja
const ConnectionCard = ({ user, partner, streak }) => (
  <div className="connection-card">
    <div className="profile-avatar user-avatar">
      <FaUser />
      <span>{user.nombre}</span>
    </div>
    <div className="streak-display">
      <FaFire className="streak-icon" />
      <strong>{streak}</strong>
      <span>días de racha</span>
    </div>
    <div className="profile-avatar partner-avatar">
      <FaUser />
      <span>{partner.nombre}</span>
    </div>
  </div>
);

// Fila de botones de acción rápida
const QuickActions = ({ navigate }) => (
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

// Widget para la Pregunta del Día
const DailyPrompt = ({ prompt, onRespond }) => (
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

// Widget para la lista de planes compartidos
const SharedPlans = ({ plans }) => (
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
// Widget para conectar con tu pareja
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
  const [user, setUser] = useState(null);
  const [partner, setPartner] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Datos de simulación (los moveremos a la BD luego)
  const [streak, setStreak] = useState(0);
  const [dailyPrompt, setDailyPrompt] = useState(
    "¿Cuál es tu recuerdo favorito de un viaje juntos?"
  );
  const [sharedPlans, setSharedPlans] = useState([
    "Hacer un picnic en el parque",
    "Ver la nueva peli de Ghibli",
  ]);

  // 2. Cargar datos reales del usuario al iniciar
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("weTwoToken");
      if (!token) {
        navigate("/login"); // Si no hay token, fuera
        return;
      }
      console.log(token);

      try {
        const response = await fetch(`${API_URL}/me`, {
          method: "GET", // Aquí indicas el tipo de solicitud (GET en este caso)
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          // Si el token es inválido, etc.
          // localStorage.removeItem("weTwoToken");
          navigate("/login");
          return;
        }

        const data = await response.json();
        setUser(data.user);
        setPartner(data.partner);

        // (Aquí también cargarías la racha, planes, etc. desde la BD)
      } catch (error) {
        console.error("Error al cargar datos:", error);
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  // 3. Función para conectar
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
        window.location.reload(); // Recargar la página para ver a la pareja
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

  if (!user) {
    return <div>Error: Usuario no encontrado.</div>;
  }

  return (
    <div className="home-container">
      <main className="home-content">
        <h1 className="home-greeting">Hola, {user.nombre}</h1>

        {/* 4. Renderizado Condicional */}
        {!partner ? (
          // SI NO HAY PAREJA, MUESTRA EL WIDGET DE CONEXIÓN
          <>
            <p className="home-subtitle">Conéctate para empezar...</p>
            <ConnectPartnerWidget
              userCode={user.connection_code}
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

      <BottomNavBar />
    </div>
  );
}
