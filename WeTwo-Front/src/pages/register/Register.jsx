import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../components/styles/login.css"; // (Reutilizamos los estilos de login)
import { API_URL } from "../../apiConfig.js";

// 1. Importar Firebase desde el NUEVO archivo de config
import { auth } from "../../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";

export default function Register() {
  const [nombre, setNombre] = useState("");
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
      // 1. Crear el usuario en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // 2. Añadir el nombre al perfil de Firebase
      await updateProfile(user, { displayName: nombre });

      // 3. Enviar email de verificación
      await sendEmailVerification(user);

      // 4. Obtener el Token de Firebase
      // (Lo necesitamos para autenticarnos con nuestro propio backend)
      const token = await user.getIdToken();

      // 5. Llamar a NUESTRO backend (Flask) para crear el perfil en MySQL
      const backendResponse = await fetch(`${API_URL}/create-profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // <-- Token de Firebase
        },
        body: JSON.stringify({
          // El backend puede extraer el 'uid' y 'email' del token,
          // pero enviamos el 'nombre'
          nombre: nombre,
        }),
      });

      if (!backendResponse.ok) {
        // Si el backend de Flask falla, tenemos un problema
        throw new Error("Error al crear el perfil de usuario en el backend.");
      }

      // 6. ¡Éxito!
      alert(
        "¡Registro exitoso! Te enviamos un email. Por favor, verifica tu correo antes de iniciar sesión."
      );
      navigate("/login");
    } catch (error) {
      console.error("❌ Error de Registro:", error);
      if (error.code === "auth/email-already-in-use") {
        setError("Este email ya está registrado.");
      } else if (error.code === "auth/weak-password") {
        setError("La contraseña debe tener al menos 6 caracteres.");
      } else {
        setError("Error en el registro. Intenta de nuevo.");
      }
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
