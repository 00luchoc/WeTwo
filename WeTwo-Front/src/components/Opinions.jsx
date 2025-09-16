import styles from "./Opinions.module.css";

const Opinions = () => {
  const opiniones = [
    { id: 1, autor: "Ana", texto: "La app es increíble, me encantó usarla 💕" },
    { id: 2, autor: "Carlos", texto: "Muy intuitiva y fácil de usar 👌" },
    {
      id: 3,
      autor: "Sofía",
      texto: "Me ayudó a conectar con mis seres queridos 😍",
    },
  ];

  return (
    <section>
      <h2>Opiniones</h2>
      <div className={styles.opinionGrid}>
        {opiniones.map((op) => (
          <div key={op.id} className={styles.opinionCard}>
            <p>"{op.texto}"</p>
            <span>- {op.autor}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Opinions;
