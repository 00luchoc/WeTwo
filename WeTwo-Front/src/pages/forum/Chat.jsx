import React, { useState } from "react";
import './chat.css';

const Chat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [chats, setChats] = useState([
    {
      id: 1,
      name: "Mi Amor ❤️",
      messages: [
        { sender: "Tú", text: "Hola cariño!" },
        { sender: "Pareja", text: "Hola! ¿Cómo estás?" }
      ],
      unread: 2
    },
    {
      id: 2,
      name: "Mi Vida 💕",
      messages: [
        { sender: "Tú", text: "Nos vemos luego?" },
        { sender: "Pareja", text: "Claro que sí!" }
      ],
      unread: 0
    }
  ]);
  const [input, setInput] = useState("");

  const openChat = () => {
    if (!isOpen && !isOpening) {
      setIsOpening(true);
      setIsOpen(true);
      // Remover la clase de opening después de la animación
      setTimeout(() => {
        setIsOpening(false);
      }, 400);
    }
  };

  const closeChat = () => {
    if (isOpen && !isClosing) {
      setIsClosing(true);
      // Esperar a que termine la animación antes de cerrar
      setTimeout(() => {
        setIsOpen(false);
        setIsClosing(false);
        setActiveChat(null);
      }, 500);
    }
  };

  const toggleChat = () => {
    if (isOpen) {
      closeChat();
    } else {
      openChat();
    }
  };

  const selectChat = (chat) => {
    setActiveChat(chat);
    // Marcar mensajes como leídos
    const updatedChats = chats.map(c => 
      c.id === chat.id ? { ...c, unread: 0 } : c
    );
    setChats(updatedChats);
  };

  const sendMessage = () => {
    if (input.trim() === "" || !activeChat) return;

    const newMessage = {
      sender: "Tú",
      text: input
    };

    // Actualizar el chat activo
    const updatedChats = chats.map(chat => {
      if (chat.id === activeChat.id) {
        return {
          ...chat,
          messages: [...chat.messages, newMessage]
        };
      }
      return chat;
    });

    setChats(updatedChats);
    setInput("");

    // Simular respuesta automática después de 1 segundo
    setTimeout(() => {
      const responseMessage = {
        sender: "Pareja",
        text: "¡Te amo! ❤️"
      };

      const updatedChatsWithResponse = updatedChats.map(chat => {
        if (chat.id === activeChat.id) {
          return {
            ...chat,
            messages: [...chat.messages, responseMessage],
            unread: chat.unread + 1
          };
        }
        return chat;
      });

      setChats(updatedChatsWithResponse);
      
      // Si el chat está activo, actualizarlo también
      if (activeChat) {
        const updatedActiveChat = updatedChatsWithResponse.find(
          chat => chat.id === activeChat.id
        );
        setActiveChat(updatedActiveChat);
      }
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  const totalUnread = chats.reduce((total, chat) => total + chat.unread, 0);

  // Determinar las clases CSS para las animaciones
  const getChatWindowClass = () => {
    let className = "chat-window";
    if (isOpening) className += " opening";
    if (isClosing) className += " closing";
    return className;
  };

  const getChatButtonClass = () => {
    let className = "chat-button";
    if (totalUnread > 0) className += " has-notifications";
    if (isClosing) className += " absorbing";
    return className;
  };

  return (
    <div className="chat-widget">
      {/* Botón flotante */}
      <div 
        className={getChatButtonClass()}
        onClick={toggleChat}
      >
        💬
        {totalUnread > 0 && (
          <span className="notification-badge">{totalUnread}</span>
        )}
      </div>

      {/* Ventana del chat */}
      {isOpen && (
        <div className={getChatWindowClass()}>
          {/* Header */}
          <div className="chat-header">
            <h3>Chats</h3>
            <button className="close-btn" onClick={closeChat}>×</button>
          </div>

          {/* Lista de chats o conversación activa */}
          <div className="chat-content">
            {!activeChat ? (
              // Lista de chats
              <div className="chats-list">
                <h4>Tus conversaciones</h4>
                {chats.map(chat => (
                  <div 
                    key={chat.id}
                    className={`chat-item ${chat.unread > 0 ? 'unread' : ''}`}
                    onClick={() => selectChat(chat)}
                  >
                    <div className="chat-avatar">💕</div>
                    <div className="chat-info">
                      <div className="chat-name">{chat.name}</div>
                      <div className="chat-preview">
                        {chat.messages[chat.messages.length - 1]?.text}
                      </div>
                    </div>
                    {chat.unread > 0 && (
                      <span className="unread-count">{chat.unread}</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              // Conversación activa
              <div className="active-chat">
                <div className="chat-header-mini">
                  <button 
                    className="back-btn"
                    onClick={() => setActiveChat(null)}
                  >
                    ←
                  </button>
                  <span>{activeChat.name}</span>
                </div>
                
                <div className="messages-container">
                  {activeChat.messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`message ${msg.sender === "Tú" ? "sent" : "received"}`}
                    >
                      <div className="message-bubble">
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="message-input-container">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Escribe un mensaje..."
                    className="message-input"
                  />
                  <button 
                    onClick={sendMessage}
                    className="send-btn"
                    disabled={!input.trim()}
                  >
                    ➤
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;