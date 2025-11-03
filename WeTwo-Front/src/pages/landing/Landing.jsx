import React from "react";
import { useNavigate } from "react-router-dom";
import "./Landing.css";

// ----- 1. IMPORTA TUS IMÁGENES AQUÍ -----
import showcaseImage from "../../assets/images/showcase-couple.jpeg";
import friendsImage from "../../assets/images/community-friends.png";
import handsImage from "../../assets/images/community-hands.png";

// ----- 2. IMPORTA LOS ICONOS DE REACT-ICONS -----
import {
  FaHeart,
  FaLaptopCode,
  FaCheckCircle,
  FaLock,
  FaFire,
  FaUser,
  FaGamepad,
  FaComments,
  FaUsers,
} from "react-icons/fa";
import { TbSparkles } from "react-icons/tb";
import { IoShareSocialSharp } from "react-icons/io5";

// ----- 3. DEFINE LOS COMPONENTES DE ICONOS -----
const GameIcon = () => (
  <span className="feature-icon-wrapper" style={{ background: "#FFECF5" }}>
    <FaGamepad size={28} color="#c026d3" />
  </span>
);
const ChatIcon = () => (
  <span className="feature-icon-wrapper" style={{ background: "#EBF3FF" }}>
    <FaComments size={28} color="#3b82f6" />
  </span>
);
const CommunityIcon = () => (
  <span className="feature-icon-wrapper" style={{ background: "#E8F8F5" }}>
    <FaUsers size={28} color="#10b981" />
  </span>
);
const StreakIcon = () => (
  <span className="feature-icon-wrapper" style={{ background: "#FFF8E6" }}>
    <FaFire size={28} color="#f59e0b" />
  </span>
);
const ProfileIcon = () => (
  <span className="how-icon-wrapper" style={{ background: "#FFECF5" }}>
    <FaUser size={32} color="#c026d3" />
  </span>
);
const ShareIcon = () => (
  <span className="how-icon-wrapper" style={{ background: "#EBF3FF" }}>
    <IoShareSocialSharp size={32} color="#3b82f6" />
  </span>
);
const ConnectIcon = () => (
  <span className="how-icon-wrapper" style={{ background: "#E8F8F5" }}>
    <FaHeart size={32} color="#10b981" />
  </span>
);

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* ----- Header ----- */}
      <header className="landing-header">
        <div className="logo-container">
          {/* Emoji '💜' reemplazado */}
          <FaHeart className="logo-heart-icon" />
          <span className="logo-text">WeTwo</span>
        </div>
        <nav>
          <button className="btn-start" onClick={() => navigate("/login")}>
            Comenzar
          </button>
        </nav>
      </header>

      <main>
        {/* ----- Hero Section ----- */}
        <section className="hero-section">
          <div className="tagline">
            {/* Emoji '✨' reemplazado */}
            <TbSparkles />
            Mantén viva la conexión
          </div>
          <h1>La distancia no importa cuando hay un verdadero lazo</h1>
          <p>
            Conéctate con tu pareja, amigos o familiares a través de juegos,
            chat privado y actividades diseñadas para mantener viva la conexión,
            sin importar la distancia.
          </p>
          <div className="hero-buttons">
            <button
              className="btn-primary-gradient"
              onClick={() => navigate("/register")}
            >
              Crear mi código único →
            </button>
            <button
              className="btn-secondary-outline"
              onClick={() => navigate("/login")}
            >
              {/* Emoji '💻' reemplazado */}
              <FaLaptopCode className="btn-icon" />
              Tengo un código
            </button>
          </div>
          <div className="hero-footer">
            {/* Emojis '💚' y '🔒' reemplazados */}
            <span className="hero-footer-item">
              <FaCheckCircle /> Gratis para siempre
            </span>
            <span className="hero-footer-item">
              <FaLock /> 100% privado y seguro
            </span>
          </div>
        </section>

        {/* ----- Showcase Section ----- */}
        <section className="showcase-section">
          <div className="showcase-card">
            <img
              src={showcaseImage}
              alt="App en uso por una pareja"
              className="showcase-image"
            />
            <div className="showcase-streak">
              {/* Emoji '🔥' reemplazado */}
              <FaFire /> <strong>365 días</strong> <FaFire />
            </div>
            <div className="showcase-status">
              {/* Emoji '❤️' reemplazado */}
              <FaHeart className="heart-icon-filled" />
              <strong>Conexión Activa</strong>
              <FaHeart className="heart-icon-filled" />
            </div>
          </div>
        </section>

        {/* ----- How It Works Section ----- */}
        <section className="how-to-section">
          <div className="tagline-pink">Súper fácil</div>
          <h2>¿Cómo funciona?</h2>
          <p>
            En solo 3 pasos estarán conectados y listos para compartir momentos
            increíbles
          </p>
          <div className="how-steps">
            <div className="how-step-item">
              <ProfileIcon />
              <h4>Crea tu perfil</h4>
              <p>Regístrate y obtén tu código único</p>
            </div>
            <div className="how-step-item">
              <ShareIcon />
              <h4>Comparte tu código</h4>
              <p>Envíalo a tu pareja, amigo o familiar</p>
            </div>
            <div className="how-step-item">
              <ConnectIcon />
              <h4>Conéctense</h4>
              <p>¡Comienzan su aventura juntos!</p>
            </div>
          </div>
        </section>

        {/* ----- Features Section ----- */}
        <section className="features-section">
          <div className="tagline-pink">Funcionalidades</div>
          <h2>Todo lo que necesitan para mantenerse cerca</h2>
          <p>
            Herramientas diseñadas especialmente para hacer que cada día juntos
            sea especial
          </p>
          <div className="features-grid">
            <div className="feature-card">
              <GameIcon />
              <h3>Juegos Divertidos</h3>
              <p>
                Desafíos y juegos diseñados para fortalecer su conexión mientras
                se divierten juntos.
              </p>
            </div>
            <div className="feature-card">
              <ChatIcon />
              <h3>Chat Privado</h3>
              <p>
                Mensajes seguros y privados para compartir momentos especiales
                en cualquier momento.
              </p>
            </div>
            <div className="feature-card">
              <CommunityIcon />
              <h3>Foro Comunitario</h3>
              <p>
                Comparte experiencias y consejos con otras parejas y amigos a
                distancia.
              </p>
            </div>
            <div className="feature-card">
              <StreakIcon />
              <h3>Racha de Conexión</h3>
              <p>
                Mantén viva la llama con rachas diarias y logros que celebran su
                vínculo.
              </p>
            </div>
          </div>
        </section>

        {/* ----- Community Section ----- */}
        <section className="community-section">
          <h2>Una comunidad que te entiende</h2>
          <p>
            No están solos en esto. Miles de parejas, amigos y familiares usan
            WeTwo para mantenerse conectados a pesar de la distancia.
          </p>
          <div className="stats-grid">
            <div className="stat-box">
              <h3>10K+</h3>
              <p>Lazos creados</p>
            </div>
            <div className="stat-box">
              <h3>500K+</h3>
              <p>Mensajes enviados</p>
            </div>
          </div>
          <div className="community-images">
            <img src={friendsImage} alt="Grupo de amigos riendo" />
            <img src={handsImage} alt="Manos de pareja conectadas" />
          </div>
        </section>

        {/* ----- CTA Section ----- */}
        <section className="cta-section">
          <div className="cta-box">
            <h4>Comienza tu historia hoy</h4>
            <p>
              Crea tu código único y empieza a construir recuerdos inolvidables
              con las personas que más quieres
            </p>
            <button
              className="btn-cta-white"
              onClick={() => navigate("/register")}
            >
              Crear mi cuenta gratis <FaHeart style={{ marginLeft: "8px" }} />
            </button>
          </div>
        </section>
      </main>

      {/* ----- Footer ----- */}
      <footer className="landing-footer">
        <p>
          <FaHeart style={{ color: "#ff4d6d" }} /> Hecho con amor para mantener
          unidos a quienes más importan
        </p>
        <p>© 2025 WeTwo. Acortando distancias, un mensaje a la vez.</p>
      </footer>
    </div>
  );
}
