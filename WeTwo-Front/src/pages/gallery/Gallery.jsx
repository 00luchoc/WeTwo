import React, { useState } from "react";
// Mantenemos esta ruta, es la más lógica para tu estructura
import BottomNavBar from "../../components/layout/BottomNavBar";
// Asumimos que el CSS está en la misma carpeta que este archivo
import "./gallery.css";
import { FaPlus, FaTimes, FaImage, FaPaintBrush } from "react-icons/fa";

// Datos de simulación para la galería
const mockGalleryItems = [
  // ... (el resto del código se mantiene igual) ...
  // ... (el resto del código se mantiene igual) ...
  {
    id: 1,
    type: "image",
    url: "https://placehold.co/400x400/fde2f3/f472b6?text=Recuerdo+1",
    caption: "Nuestro primer viaje juntos",
  },
  {
    id: 2,
    type: "drawing",
    url: "https://placehold.co/400x400/e0f7fa/38bdf8?text=Dibujo",
    caption: "El dibujo que hiciste",
  },
  {
    id: 3,
    type: "image",
    url: "https://placehold.co/400x400/fde2f3/f472b6?text=Recuerdo+2",
    caption: "El atardecer en la playa",
  },
  {
    id: 4,
    type: "image",
    url: "https://placehold.co/400x400/e0f7fa/38bdf8?text=Recuerdo+3",
    caption: "Cumpleaños de Alex",
  },
  {
    id: 5,
    type: "image",
    url: "https://placehold.co/400x400/fde2f3/f472b6?text=Recuerdo+4",
    caption: "Picnic",
  },
];

export default function Gallery() {
  const [galleryItems, setGalleryItems] = useState(mockGalleryItems);
  const [selectedImage, setSelectedImage] = useState(null);

  // Funciones para el Modal (pantalla completa)
  const openModal = (item) => {
    setSelectedImage(item);
  };
  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="gallery-container">
      {/* Contenido principal con scroll */}
      <main className="gallery-content">
        <h1 className="gallery-title">Nuestros Recuerdos</h1>
        <p className="gallery-subtitle">
          El espacio para sus momentos favoritos y creaciones.
        </p>

        {/* Cuadrícula de la galería */}
        <div className="gallery-grid">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              className="gallery-item"
              onClick={() => openModal(item)}
            >
              <img src={item.url} alt={item.caption} />
              <div className="item-overlay">
                {item.type === "image" ? <FaImage /> : <FaPaintBrush />}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Botón flotante para añadir foto */}
      <button
        className="add-memory-btn"
        onClick={() => alert("Abrir selector de fotos")}
      >
        <FaPlus />
      </button>

      {/* Barra de navegación fija */}
      <BottomNavBar />

      {/* Modal para ver la imagen en grande */}
      {selectedImage && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage.url} alt={selectedImage.caption} />
            <p>{selectedImage.caption}</p>
            <button className="modal-close-btn" onClick={closeModal}>
              <FaTimes />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
