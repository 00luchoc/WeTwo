import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../components/styles/login.css";
import { API_URL } from "../../apiConfig.js";

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
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, contraseña: password }),
      });

      const data = await response.json();
      console.log("🔹 Login response:", data);

      if (response.ok) {
        localStorage.setItem("weTwoToken", data.token);
        navigate("/home");
      } else {
        setError(data.error || "Error al iniciar sesión");
      }
    } catch (err) {
      console.error("❌ Error:", err);
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

        {error && <div className="error"><strong>⚠️ {error}</strong></div>}

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

          <button className="primaryBtn" type="submit" disabled={isLoading}>
            {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>

          <div className="divider"><span>o</span></div>

          <button className="altBtn" type="button" onClick={() => navigate("/register")}>
            ¿No tienes cuenta? Regístrate
          </button>
        </form>
      </div>
    </div>
  );
}
