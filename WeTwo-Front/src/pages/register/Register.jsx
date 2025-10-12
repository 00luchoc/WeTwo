import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/register.css";

export default function Register() {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nombre = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;

    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Registro exitoso: " + data.mensaje);
        navigate("/"); // vuelve al inicio
      } else {
        alert("⚠️ " + data.error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Error de conexión con el servidor");
    }
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
