import React, { useState } from "react";

const SECTIONS = {
  hero: "Inicio",
  features: "Características",
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
          <p>Mensajes, muro compartido, juegos y cápsulas del tiempo. Todo en un solo lugar.</p>
          <button className="primaryBtn" onClick={() => setSection("cta")}>Probar demo</button>
        </section>
      )}

      {section === "features" && (
        <section className="features">
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

      {section === "cta" && (
        <section className="cta">
          <h2>Sumate a la beta</h2>
          <p>Dejá tu email y te avisamos cuando esté lista.</p>
          <form className="ctaForm" onSubmit={(e)=>{e.preventDefault(); alert("¡Gracias! Te avisamos pronto.");}}>
            <input placeholder="tu@email.com" type="email" required />
            <button className="primaryBtn" type="submit">Avisame</button>
          </form>
        </section>
      )}

      <footer className="landingFooter">© {new Date().getFullYear()} WeTwo</footer>
    </div>
  );
}