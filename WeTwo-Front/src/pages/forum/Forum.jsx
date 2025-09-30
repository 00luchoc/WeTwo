import React from "react";
import Chat from "./Chat"; // Asegúrate de la ruta correcta
import './forum.css'; // Opcional: estilos de la página

const Forum = () => {
  return (
    <div className="forum-container">
      <header className="forum-header">
        <h1>Foro para Parejas</h1>
        <p>Chatea con tu pareja o amigo especial</p>
      </header>

      <main className="forum-main">
        <Chat />
      </main>
    </div>
  );
};

export default Forum;