import { CheckCircle2, Lightbulb } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Device } from "../data/devices";

interface RecommendationCardProps {
  device: Device | null;
  onClose: () => void;
}

export default function RecommendationCard({ device, onClose }: RecommendationCardProps) {
  if (!device) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: "100%", x: "-50%" }}
        animate={{ y: 0, x: "-50%" }}
        exit={{ y: "100%", x: "-50%" }}
        className="fixed bottom-12 left-1/2 w-[90%] md:w-[680px] z-50"
        id="recommendation-card-wrapper"
      >
        <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden text-[#1a1c23] p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-6 text-gray-300 hover:text-gray-500 transition-colors"
            id="close-card-btn"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full uppercase tracking-wider">
                Detectado: {device.nombre}
              </div>
              <div className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                device.impacto === "Alto" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
              }`}>
                Impacto: {device.impacto}
              </div>
            </div>
            
            <h2 className="text-3xl font-bold mb-1">{device.nombre}</h2>
            <p className="text-sm text-gray-500 mb-6">Consumo: <span className="font-mono font-bold text-gray-800">{device.consumoEstimado}</span></p>
            
            <div className="space-y-4 mb-6 max-h-[250px] overflow-y-auto custom-scrollbar pr-2">
              {device.recomendaciones.map((tip, idx) => (
                <div key={idx} className="flex items-start gap-3 group">
                  <div className="mt-1.5 h-2 w-2 rounded-full flex-shrink-0 bg-emerald-500" />
                  <p className="text-sm leading-relaxed text-gray-600">
                    {tip}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full md:w-56 bg-gray-50 rounded-2xl p-6 flex flex-col justify-center border border-gray-100">
            <div>
              <p className="text-[10px] font-bold uppercase text-gray-400 mb-1 tracking-widest">Puntaje Eco</p>
              <p className="text-2xl font-bold text-emerald-600">Ahorro {device.ahorroPotencial}</p>
              <p className="text-[10px] text-gray-400 mt-2 italic leading-tight">{device.impactoAmbiental}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
