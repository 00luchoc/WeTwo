import { motion } from "framer-motion";
import "../styles/floating.css";

const FloatingHearts = () => {
  const hearts = ["💖", "💌", "🎶", "📸", "🎁"];

  return (
    <div className="floating-container">
      {hearts.map((icon, i) => (
        <motion.div
          key={i}
          className="floating-item"
          style={{ left: `${10 + i * 15}%` }}
          initial={{ y: "100vh", opacity: 0 }}
          animate={{ y: ["100vh", "-10vh"], opacity: [0.3, 1, 0] }}
          transition={{
            duration: 10 + i * 2,
            repeat: Infinity,
            delay: i * 1.5,
            ease: "easeInOut",
          }}
        >
          {icon}
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingHearts;
