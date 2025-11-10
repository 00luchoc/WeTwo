import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../components/styles/login.css"; // (Asegúrate que la ruta sea correcta)

// 1. Importar Firebase y los métodos de autenticación
import { auth } from "../../firebaseConfig"; // <-- Importa de tu archivo de config
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification,
} from "firebase/auth";

// 2. Importar el icono de Google
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  /**
   * --- LÓGICA ELIMINADA ---
   * La función 'syncBackend' (que llamaba a /sync-user) ha sido eliminada.
   * La ruta /me de Flask se encargará de crear/sincronizar
   * el perfil la PRIMERA VEZ que el usuario cargue el Home.
   */

  // Función genérica de éxito de login
  const handleLoginSuccess = async (firebaseUser) => {
    try {
      // 1. Obtener el Token de Firebase (el "sello" para nuestro backend)
      const token = await firebaseUser.getIdToken();
      localStorage.setItem("weTwoToken", token); // Guardamos el token de Firebase

      // 2. Todo listo, redirigir al Home
      navigate("/home");
    } catch (error) {
      console.error("❌ Error al obtener el token:", error);
      setError("No se pudo obtener el token de sesión.");
    }
  };

  // --- MANEJADOR PARA LOGIN CON EMAIL ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // 1. Autenticar con Firebase
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // 2. Verificar si el email está verificado
      if (!user.emailVerified) {
        setError("Por favor, verifica tu email antes de iniciar sesión.");
        // (Opcional: Re-enviar email de verificación)
        // await sendEmailVerification(user);
        setIsLoading(false);
        return;
      }

      // 3. ¡Éxito! Guardar token y redirigir
      await handleLoginSuccess(user);
    } catch (error) {
      console.error("❌ Error de Login:", error);
      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/wrong-password"
      ) {
        setError("Email o contraseña incorrectos.");
      } else {
        setError("Error al iniciar sesión.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // --- MANEJADOR PARA LOGIN CON GOOGLE ---
  const handleGoogleLogin = async () => {
    setError("");
    setIsLoading(true);
    const provider = new GoogleAuthProvider();

    try {
      // 1. Mostrar el Pop-up de Google
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // 2. ¡Éxito! Guardar token y redirigir
      await handleLoginSuccess(user);
    } catch (error) {
      console.error("❌ Error de Google Login:", error);
      // Este es el error que estabas viendo
      setError("Error al iniciar sesión con Google.");
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

        <form className="login-form" onSubmit={handleSubmit}>
          {/* ... (inputs de email y contraseña se quedan igual) ... */}
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
        </form>

        <div className="divider">
          <span>o</span>
        </div>

        {/* --- NUEVO BOTÓN DE GOOGLE --- */}
        <button
          className="google-btn"
          onClick={handleGoogleLogin}
          disabled={isLoading}
        >
          <FcGoogle />
          <span>Continuar con Google</span>
        </button>

        <button
          className="altBtn"
          type="button"
          onClick={() => navigate("/register")}
        >
          ¿No tienes cuenta? Regístrate
        </button>
      </div>
    </div>
  );
}
