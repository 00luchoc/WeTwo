import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../components/styles/login.css"; // (Reutilizamos los estilos de login)
import { API_URL } from "../../apiConfig.js";

export default function Register() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    // ---- ¡ESTA ES LA LÍNEA MÁGICA! ----
    e.preventDefault();
    // ---------------------------------

    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: nombre,
          email: email,
          contraseña: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("¡Registro exitoso! Ahora inicia sesión.");
        navigate("/login");
      } else {
        setError(data.error || "Error en el registro");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Error de conexión con el servidor");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Crea tu cuenta</h1>
        <p>Es rápido y fácil</p>

        {error && (
          <div className="error" style={{ color: "red", marginBottom: "10px" }}>
            <strong>⚠️ {error}</strong>
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre</label>
            <input
              id="nombre"
              type="text"
              placeholder="Tu nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="Crea una contraseña segura"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="primaryBtn" type="submit" disabled={isLoading}>
            {isLoading ? "Registrando..." : "Registrarme"}
          </button>

          <div
            className="divider"
            style={{ textAlign: "center", margin: "15px 0" }}
          >
            <span>o</span>
          </div>

          <button
            className="altBtn"
            type="button"
            onClick={() => navigate("/login")}
          >
            ¿Ya tienes cuenta? Inicia sesión
          </button>
        </form>
      </div>
    </div>
  );
}
