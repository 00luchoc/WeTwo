import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Importa todas las páginas
import Landing from "./pages/landing/Landing";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Home from "./pages/home/Home";
import Chat from "./pages/chat/Chat"; // Nueva página
import Games from "./pages/games/Games"; // Nueva página
import Gallery from "./pages/gallery/Gallery";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas privadas (después de iniciar sesión) */}
        <Route path="/home" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/games" element={<Games />} />
        <Route path="/gallery" element={<Gallery />} />
        {/* <Route path="/gallery" element={<Gallery />} /> */}
      </Routes>
    </Router>
  );
}
