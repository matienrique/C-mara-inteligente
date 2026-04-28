/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Header from "./components/Header";
import CameraScanner from "./components/CameraScanner";
import RecommendationCard from "./components/RecommendationCard";
import { DEVICES, Device } from "./data/devices";
import { GeminiResponse } from "./services/geminiService";
import { AlertCircle, ChevronDown, ChevronUp } from "lucide-react";

export default function App() {
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeviceList, setShowDeviceList] = useState(false);

  const availableDevices = [
    "aire acondicionado", "heladera", "freezer", "lavarropas", "termotanques", 
    "televisor", "iluminación", "cocina", "pava eléctrica", "plancha", 
    "ventilador", "cargador", "computadora"
  ];

  const handleDetection = (result: GeminiResponse) => {
    if (DEVICES[result.detectedDevice]) {
      setSelectedDevice(DEVICES[result.detectedDevice]);
      setError(null);
    } else {
      setSelectedDevice(null);
      setError("No pude identificar el dispositivo. Probá acercarte o mejorar la iluminación.");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col font-sans selection:bg-emerald-500 selection:text-zinc-950 overflow-hidden" id="app-root">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[100px] rounded-full" />
      </div>

      <Header />

      <main className="flex-1 w-full flex items-center justify-center relative bg-gradient-to-br from-[#1a1c23] via-[#0f1115] to-[#1a1c23] overflow-hidden">
        <AnimatePresence mode="wait">
          {error ? (
            <motion.div 
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-6 p-6"
              id="error-view"
            >
              <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
                <AlertCircle className="w-10 h-10 text-red-400" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-white uppercase tracking-tight">Ups! Algo salió mal</h2>
                <p className="text-white/60 max-w-xs mx-auto text-sm">
                  {error}
                </p>
              </div>
              <button 
                onClick={() => setError(null)}
                className="px-8 py-3 bg-white text-zinc-950 font-bold rounded-xl hover:bg-emerald-400 transition-colors w-full sm:w-auto"
                id="retry-btn"
              >
                Volver a intentar
              </button>
            </motion.div>
          ) : !selectedDevice ? (
            <motion.div 
              key="scanner"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full flex flex-col items-center gap-6"
              id="scanner-container"
            >
              <CameraScanner 
                onDetect={handleDetection}
                isAnalyzing={isAnalyzing}
                setIsAnalyzing={setIsAnalyzing}
                onError={(msg) => setError(msg)}
              />
              
              <div className="flex flex-col gap-3 w-full max-w-sm">
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 flex items-center gap-4 text-white/80 text-sm">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 text-emerald-400" />
                  <p className="leading-tight">Apuntá a los electrodomésticos que más uses y te hacemos recomendaciones</p>
                </div>

                <div className="w-full">
                  <button 
                    onClick={() => setShowDeviceList(!showDeviceList)}
                    className="w-full flex items-center justify-between px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all group"
                  >
                    <span className="text-white/60 text-xs font-medium">Consultá el listado de equipos disponibles acá</span>
                    {showDeviceList ? <ChevronUp className="w-3.5 h-3.5 text-emerald-400" /> : <ChevronDown className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>

                  <AnimatePresence>
                    {showDeviceList && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-white/5 border-x border-b border-white/10 rounded-b-xl -mt-2 pt-4 pb-2 px-5"
                      >
                        <div className="flex flex-col gap-y-2 pb-2">
                          {availableDevices.map((device, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/30" />
                              <span className="text-[10px] uppercase tracking-[0.1em] text-white/50 font-medium">{device}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>

      <RecommendationCard 
        device={selectedDevice}
        onClose={() => setSelectedDevice(null)}
      />
      
      <footer className="px-8 py-4 bg-[#15181e] border-t border-white/5 z-10 min-h-[40px]">
        {/* Footer content removed per user request */}
      </footer>
    </div>
  );
}
