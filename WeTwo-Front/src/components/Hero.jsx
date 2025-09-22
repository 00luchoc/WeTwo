import FloatingHearts from "./FloatingHearts";
import PhoneMockup from "./PhoneMockup";
import "../styles/hero.css";

const Hero = ({setSection}) => {
  return (
    <section className="hero-section">
      <FloatingHearts />
      <div className="hero-content">
        <div className="hero-text">
          <h1>Conectá con tu persona favorita, a la distancia</h1>
          <p>Mensajes, juegos y cápsulas del tiempo. Todo en un solo lugar.</p>
             <div className="hero-buttons">
            <button className="btn-primary" onClick={() => setSection("cta")}>Probar demo</button>
            <button className="btn-secondary">Ver más</button>
          </div>
        </div>
        <PhoneMockup />
      </div>
    </section>
  );
};

export default Hero;
