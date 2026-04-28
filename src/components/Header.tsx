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
        <h1 className="text-xl font-bold tracking-tight text-emerald-400">
          Escaneá tu hogar eficiente
        </h1>
        <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">
          IA de detección v1.0
        </p>
      </div>
    </motion.header>
  );
}
