import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../components/styles/register.css";

export default function Register() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const data = { nombre, email, contraseña };

    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Registro exitoso. Redirigiendo al login.");
        navigate("/login");
      } else {
        setError(result.error || "Error desconocido");
      }
    } catch (err) {
      console.error("Error completo:", err);
      setError(
        "Error de conexión con el servidor. Verifica que el servidor esté ejecutándose."
      );
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h1>Crear cuenta</h1>
        <p>Conectá con tu persona favorita 💞</p>

        {error && <div className="error">{error}</div>}

        <form className="register-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
            required
          />
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
      </div>
    </div>
  );
}
