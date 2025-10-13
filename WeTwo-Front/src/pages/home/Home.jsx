import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/home.css";

export default function Home() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [connectionCode, setConnectionCode] = useState("");
  const [partner, setPartner] = useState(null);
  const [streak, setStreak] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Simular datos del usuario (en una app real vendrían del login)
    const userData = {
      name: "Julieta",
      email: "mendozajulietabelen87@gmail.com",
      code: "WT-7B3K9M",
      avatar: "👩‍💻",
    };
    setUser(userData);

    // Simular datos de la pareja/conexión
    const partnerData = {
      name: "Alex",
      code: "WT-8D4L2N",
      avatar: "👨‍💻",
      lastActive: "Hace 2 horas",
    };
    setPartner(partnerData);

    setStreak(15);
  }, []);

  const handleConnect = () => {
    if (connectionCode.trim()) {
      alert(`Solicitud enviada al código: ${connectionCode}`);
      setConnectionCode("");
    }
  };

  const handleSendMessage = () => {
    navigate("/chat");
  };

  const handlePlayGame = (game) => {
    alert(`Iniciando ${game} con ${partner?.name}`);
  };

  const activities = [
    { type: "message", text: "Alex te envió un mensaje", time: "2 min ago" },
    { type: "drawing", text: "Julieta envió un dibujo", time: "1 hora ago" },
    { type: "game", text: "Completaron un juego juntos", time: "3 horas ago" },
    { type: "streak", text: "¡Racha de 15 días!", time: "Ayer" },
  ];

  if (!user) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="home-container">
      {/* Header */}
      <header className="home-header">
        <div className="header-left">
          <div className="user-avatar">{user.avatar}</div>
          <div className="user-info">
            <h2>Hola, {user.name}!</h2>
            <p>
              Tu código: <span className="user-code">{user.code}</span>
            </p>
          </div>
        </div>
        <div className="header-right">
          <div className="streak-counter">
            <div className="streak-icon">🔥</div>
            <div className="streak-info">
              <span className="streak-days">{streak} días</span>
              <span className="streak-label">Racha activa</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="home-nav">
        <button
          className={`nav-tab ${activeTab === "dashboard" ? "active" : ""}`}
          onClick={() => setActiveTab("dashboard")}
        >
          🏠 Dashboard
        </button>
        <button
          className={`nav-tab ${activeTab === "chat" ? "active" : ""}`}
          onClick={() => setActiveTab("chat")}
        >
          💬 Chat
        </button>
        <button
          className={`nav-tab ${activeTab === "games" ? "active" : ""}`}
          onClick={() => setActiveTab("games")}
        >
          🎮 Juegos
        </button>
        <button
          className={`nav-tab ${activeTab === "gallery" ? "active" : ""}`}
          onClick={() => setActiveTab("gallery")}
        >
          🖼️ Galería
        </button>
      </nav>

      {/* Main Content */}
      <main className="home-main">
        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="tab-content">
            <div className="welcome-section">
              <h3>Tu espacio de conexión</h3>
              <p>
                Mantente cerca de tus seres queridos sin importar la distancia
              </p>
            </div>

            {/* Connection Status */}
            <div className="connection-card">
              <div className="connection-header">
                <h4>Tu conexión</h4>
                {partner ? (
                  <span className="status-connected">🟢 Conectado</span>
                ) : (
                  <span className="status-disconnected">🔴 Sin conectar</span>
                )}
              </div>

              {partner ? (
                <div className="partner-info">
                  <div className="partner-avatar">{partner.avatar}</div>
                  <div className="partner-details">
                    <h5>{partner.name}</h5>
                    <p>Código: {partner.code}</p>
                    <p className="last-active">{partner.lastActive}</p>
                  </div>
                  <button className="chat-btn" onClick={handleSendMessage}>
                    💬 Chatear
                  </button>
                </div>
              ) : (
                <div className="connect-section">
                  <p>Conecta con alguien usando su código</p>
                  <div className="connect-input">
                    <input
                      type="text"
                      placeholder="Ingresa código (ej: WT-8D4L2N)"
                      value={connectionCode}
                      onChange={(e) => setConnectionCode(e.target.value)}
                    />
                    <button onClick={handleConnect}>Conectar</button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
              <h4>Acciones rápidas</h4>
              <div className="actions-grid">
                <button
                  className="action-card"
                  onClick={() => navigate("/chat")}
                >
                  <div className="action-icon">💬</div>
                  <span>Enviar mensaje</span>
                </button>
                <button
                  className="action-card"
                  onClick={() => handlePlayGame("Preguntas")}
                >
                  <div className="action-icon">❓</div>
                  <span>Preguntas</span>
                </button>
                <button
                  className="action-card"
                  onClick={() => handlePlayGame("Dibujo")}
                >
                  <div className="action-icon">🎨</div>
                  <span>Dibujar juntos</span>
                </button>
                <button
                  className="action-card"
                  onClick={() => navigate("/gallery")}
                >
                  <div className="action-icon">🖼️</div>
                  <span>Galería</span>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="activity-section">
              <h4>Actividad reciente</h4>
              <div className="activity-list">
                {activities.map((activity, index) => (
                  <div key={index} className="activity-item">
                    <div className="activity-icon">
                      {activity.type === "message" && "💬"}
                      {activity.type === "drawing" && "🎨"}
                      {activity.type === "game" && "🎮"}
                      {activity.type === "streak" && "🔥"}
                    </div>
                    <div className="activity-content">
                      <p>{activity.text}</p>
                      <span>{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === "chat" && (
          <div className="tab-content">
            <div className="chat-preview">
              <h4>Chat con {partner?.name}</h4>
              <div className="chat-messages">
                <div className="message received">
                  <p>Hola! ¿Cómo estás hoy?</p>
                  <span>10:30 AM</span>
                </div>
                <div className="message sent">
                  <p>Muy bien! Acabo de completar el desafío de dibujo 🎨</p>
                  <span>10:32 AM</span>
                </div>
              </div>
              <button className="primary-btn" onClick={handleSendMessage}>
                Abrir chat completo
              </button>
            </div>
          </div>
        )}

        {/* Games Tab */}
        {activeTab === "games" && (
          <div className="tab-content">
            <h4>Juegos para 2</h4>
            <div className="games-grid">
              <div
                className="game-card"
                onClick={() => handlePlayGame("Preguntas y Respuestas")}
              >
                <div className="game-icon">❓</div>
                <h5>Preguntas</h5>
                <p>Descubre más el uno del otro</p>
              </div>
              <div
                className="game-card"
                onClick={() => handlePlayGame("Dibujo a ciegas")}
              >
                <div className="game-icon">🎨</div>
                <h5>Dibujo</h5>
                <p>Dibuja y adivina</p>
              </div>
              <div
                className="game-card"
                onClick={() => handlePlayGame("Verdad o Reto")}
              >
                <div className="game-icon">🎯</div>
                <h5>Verdad o Reto</h5>
                <p>Clásico para parejas</p>
              </div>
              <div
                className="game-card"
                onClick={() => handlePlayGame("Memoria")}
              >
                <div className="game-icon">🧠</div>
                <h5>Memoria</h5>
                <p>Encuentra las parejas</p>
              </div>
            </div>
          </div>
        )}

        {/* Gallery Tab */}
        {activeTab === "gallery" && (
          <div className="tab-content">
            <h4>Galería compartida</h4>
            <div className="gallery-grid">
              <div className="gallery-item">
                <div className="gallery-placeholder">🎨</div>
                <p>Dibujo de ayer</p>
              </div>
              <div className="gallery-item">
                <div className="gallery-placeholder">📸</div>
                <p>Foto compartida</p>
              </div>
              <div className="gallery-item">
                <div className="gallery-placeholder">💕</div>
                <p>Momento especial</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
