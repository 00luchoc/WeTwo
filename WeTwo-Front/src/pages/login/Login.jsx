import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, contraseña: password }),
      });

      const data = await response.json();

      if (response.ok) {
        setTimeout(() => {
          navigate("/home");
        }, 1000);
      } else {
        setError(data.error || "Error al iniciar sesión");
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
        <h1>Bienvenido de vuelta</h1>
        <p>Ingresa a tu cuenta para continuar</p>

        {error && (
          <div className="error">
            <strong>⚠️ {error}</strong>
            {error === "Usuario no encontrado" && (
              <div style={{ fontSize: "14px", marginTop: "5px" }}>
                ¿Necesitas{" "}
                <a
                  href="/register"
                  style={{ color: "#ff7eb3", textDecoration: "underline" }}
                >
                  crear una cuenta
                </a>
                ?
              </div>
            )}
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
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
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="forgot-password">
            <a href="/forgot-password">¿Olvidaste tu contraseña?</a>
          </div>

          <button className="primaryBtn" type="submit" disabled={isLoading}>
            {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>

          <div className="divider">
            <span>o</span>
          </div>

          <button
            className="altBtn"
            type="button"
            onClick={() => navigate("/register")}
          >
            ¿No tienes cuenta? Regístrate
          </button>
        </form>
      </div>
    </div>
  );
}
