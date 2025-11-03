import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../components/styles/chat.css"; // Estilos propios
import { FaArrowLeft, FaPaperPlane, FaUser } from "react-icons/fa";

export default function Chat() {
  const navigate = useNavigate();
  const [partnerName, setPartnerName] = useState("Alex"); // Simulado
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // Simulación de historial de chat
    setMessages([
      { id: 1, sender: "partner", text: "¡Hola! ¿Cómo estás?" },
      { id: 2, sender: "user", text: "¡Hola! Bien, ¿y tú? 😊" },
      {
        id: 3,
        sender: "partner",
        text: "Genial, acabo de ver la foto que subiste, ¡me encanta!",
      },
    ]);
  }, []);

  const handleSend = (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    const newMsg = {
      id: messages.length + 1,
      sender: "user",
      text: newMessage,
    };
    setMessages([...messages, newMsg]);
    setNewMessage("");
    // Aquí iría la lógica para enviar el mensaje al backend
  };

  return (
    <div className="chat-page">
      {/* Header del Chat */}
      <header className="chat-header">
        <button className="back-btn" onClick={() => navigate("/home")}>
          <FaArrowLeft />
        </button>
        <div className="chat-partner-info">
          <div className="avatar-container partner small">
            <FaUser />
          </div>
          <h3>{partnerName}</h3>
        </div>
      </header>

      {/* Lista de Mensajes */}
      <main className="message-list">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message-row ${
              msg.sender === "user" ? "sent" : "received"
            }`}
          >
            <div className="message-bubble">{msg.text}</div>
          </div>
        ))}
      </main>

      {/* Input de Mensaje */}
      <footer className="chat-input-area">
        <form className="chat-input-form" onSubmit={handleSend}>
          <input
            type="text"
            placeholder="Escribe un mensaje..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button type="submit" className="send-btn">
            <FaPaperPlane />
          </button>
        </form>
      </footer>
    </div>
  );
}
