import { motion } from "framer-motion";

export default function AnimatedButton({ children }) {
  return (
    <motion.button
      whileHover={{
        scale: 1.1,
        boxShadow: "0px 0px 12px rgba(226,109,140,0.8)",
      }}
      whileTap={{ scale: 0.95 }}
      style={{
        padding: "0.75rem 2rem",
        border: "none",
        borderRadius: "8px",
        background: "#e26d8c",
        color: "#fff",
        cursor: "pointer",
        fontSize: "1rem",
      }}
    >
      {children}
    </motion.button>
  );
}
