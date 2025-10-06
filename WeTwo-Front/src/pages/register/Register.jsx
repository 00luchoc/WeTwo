import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/register.css";

export default function Register() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("¡Registro enviado! (acá iría la lógica real)");
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h1>Crear cuenta</h1>
        <p>Conectá con tu persona favorita 💞</p>

        <form className="register-form" onSubmit={handleSubmit}>
          <input type="text" placeholder="Nombre" required />
          <input type="email" placeholder="Correo electrónico" required />
          <input type="password" placeholder="Contraseña" required />
          <button className="primaryBtn" type="submit">
            Registrarme
          </button>
          <button
            className="altBtn"
            type="button"
            onClick={() => navigate("/")}
          >
            Volver al inicio
          </button>
        </form>

        <div className="back-link" onClick={() => navigate("/")}>
          ← Volver al Landing
        </div>
      </div>
    </div>
  );
}
