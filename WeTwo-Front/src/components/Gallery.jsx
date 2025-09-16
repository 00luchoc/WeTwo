import styles from "./Gallery.module.css";

const Gallery = () => {
  const imagenes = [
    { id: 1, src: "https://picsum.photos/300/200?random=1", alt: "Imagen 1" },
    { id: 2, src: "https://picsum.photos/300/200?random=2", alt: "Imagen 2" },
    { id: 3, src: "https://picsum.photos/300/200?random=3", alt: "Imagen 3" },
    { id: 4, src: "https://picsum.photos/300/200?random=4", alt: "Imagen 4" },
    { id: 5, src: "https://picsum.photos/300/200?random=5", alt: "Imagen 5" },
  ];

  return (
    <section>
      <h2>Galería</h2>
      <div className={styles.galleryGrid}>
        {imagenes.map((img) => (
          <div key={img.id} className={styles.galleryItem}>
            <img src={img.src} alt={img.alt} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Gallery;
