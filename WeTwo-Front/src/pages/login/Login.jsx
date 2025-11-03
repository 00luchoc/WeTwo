import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// 1. Asegúrate de que tu CSS esté en la carpeta /styles/
import "../../components/styles/login.css";
// 2. Asegúrate de que apiConfig.js esté en src/
import { API_URL } from "../../apiConfig.js";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    // 3. ¡LA CORRECCIÓN MÁS IMPORTANTE!
    // Esto evita que el formulario recargue la página.
    e.preventDefault();

    setError("");
    setIsLoading(true);

    try {
      // 4. Llama a tu backend
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, contraseña: password }),
      });

      const data = await response.json();

      if (response.ok) {
        // 5. Si el login es exitoso, guarda el token
        localStorage.setItem("weTwoToken", data.token);

        // 6. Y AHORA SÍ, redirige al home
        navigate("/home");
      } else {
        // 7. Si falla, muestra el error del backend
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
          </div>
        )}

        {/* 8. El 'onSubmit' llama a nuestra función handleSubmit */}
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
