import React, { useState } from "react";
import "./styles.css";
import Gallery from "./components/Gallery";
import Opinions from "./components/Opinions";

const SECTIONS = {
  hero: "Inicio",
  features: "Características",
  how: "Cómo funciona",
  gallery: "Galería",
  testimonials: "Opiniones",
  cta: "Empezar",
};

export default function App() {
  const [section, setSection] = useState("hero");

  return (
    <div className="landing">
      <header className="landingTopbar">
        <div className="logo">WeTwo</div>
        <nav className="landingNav">
          {Object.entries(SECTIONS).map(([key, label]) => (
            <button
              key={key}
              className={`navBtn ${section === key ? "active" : ""}`}
              onClick={() => setSection(key)}
            >
              {label}
            </button>
          ))}
        </nav>
      </header>

      {section === "hero" && (
        <section className="hero">
          <h1>Conectá con tu persona favorita, a la distancia</h1>
          <p>
            Mensajes, muro compartido, juegos y cápsulas del tiempo. Todo en un
            solo lugar.
          </p>
          <div style={{ marginTop: "20px" }}>
            <button className="primaryBtn" onClick={() => setSection("cta")}>
              Probar demo
            </button>
            <button
              className="altBtn"
              style={{ marginLeft: "8px" }}
              onClick={() => setSection("features")}
            >
              Ver más
            </button>
          </div>
        </section>
      )}

      {section === "features" && (
        <section className="features">
          <h2 className="sectionTitle">Un poco de lo que podés hacer</h2>
          <div className="feature">
            <h3>Muro compartido</h3>
            <p>Guardá recuerdos, notas e imágenes en común.</p>
          </div>
          <div className="feature">
            <h3>Mensajería</h3>
            <p>Chat simple para el día a día.</p>
          </div>
          <div className="feature">
            <h3>Racha diaria</h3>
            <p>Pequeñas acciones para mantenerse cerca.</p>
          </div>
        </section>
      )}

      {section === "how" && (
        <section>
          <h2 className="sectionTitle">Cómo funciona</h2>
          <div className="steps">
            <div className="step">
              <h4>1. Creá tu vínculo</h4>
              <p>Registrate y conectá con tu pareja o mejor amig@.</p>
            </div>
            <div className="step">
              <h4>2. Compartí</h4>
              <p>Notas, fotos, recuerdos y pequeños momentos diarios.</p>
            </div>
            <div className="step">
              <h4>3. Disfrutá</h4>
              <p>Usá juegos, rachas y cápsulas para mantener la conexión.</p>
            </div>
          </div>
        </section>
      )}

      {section === "gallery" && <Gallery />}

      {section === "testimonials" && <Opinions />}

      {section === "cta" && (
        <section className="cta">
          <h2>Sumate a la beta</h2>
          <p>Dejá tu email y te avisamos cuando esté lista.</p>
          <form
            className="ctaForm"
            onSubmit={(e) => {
              e.preventDefault();
              alert("¡Gracias! Te avisamos pronto.");
            }}
          >
            <input placeholder="tu@email.com" type="email" required />
            <button className="primaryBtn" type="submit">
              Avisame
            </button>
            <button className="altBtn" type="button">
              Más info
            </button>
          </form>
        </section>
      )}

      <footer className="landingFooter">
        © {new Date().getFullYear()} WeTwo
      </footer>
    </div>
  );
}
