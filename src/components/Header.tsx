import { motion } from "motion/react";

export default function Header() {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full px-8 py-6 flex justify-between items-center bg-[#15181e] border-b border-white/10 z-20"
      id="app-header"
    >
      <div>
      </div>
    </motion.header>
  );
}
