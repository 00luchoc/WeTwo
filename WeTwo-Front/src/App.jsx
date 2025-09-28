import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/landing/Landing";
import Forum from "./pages/forum/Forum"; // supongo que tu foro estará en esta ruta

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/forum" element={<Forum />} />
      </Routes>
    </Router>
  );
}
