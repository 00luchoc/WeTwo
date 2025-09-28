import { motion } from "framer-motion";
import "../../styles/hero.css";

const PhoneMockup = () => {
  const messages = [
    { text: "Te extraño 💖", side: "left" },
    { text: "Yo también 😘", side: "right" },
    { text: "¿Jugamos algo hoy?", side: "left" },
  ];

  return (
    <div className="phone">
      <div className="phone-screen">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            className={`bubble ${msg.side}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 1.5 }}
          >
            {msg.text}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PhoneMockup;
