import { motion } from "motion/react";

interface HeaderProps {
  totalSavings?: number;
}

export default function Header({ totalSavings = 0 }: HeaderProps) {
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
      
      <div className="flex items-center gap-6">
        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold italic">Logros</span>
          <span className="text-2xl font-mono text-emerald-400 tracking-tighter">
            {totalSavings < 10 ? `0${totalSavings}` : totalSavings}
          </span>
        </div>
        <div className="h-10 w-10 rounded-full border-2 border-emerald-500/30 flex items-center justify-center bg-emerald-500/10">
          <span className="text-sm font-bold text-emerald-400">{totalSavings}</span>
        </div>
      </div>
    </motion.header>
  );
}
