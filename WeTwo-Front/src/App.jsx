import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/landing/Landing";
import Forum from "./pages/forum/Forum";
import Register from "./pages/register/Register"; // 👈 importamos la nueva página

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/registro" element={<Register />} /> {/* 👈 nueva ruta */}
      </Routes>
    </Router>
  );
}
