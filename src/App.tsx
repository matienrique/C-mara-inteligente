/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Header from "./components/Header";
import CameraScanner from "./components/CameraScanner";
import RecommendationCard from "./components/RecommendationCard";
import { DEVICES, Device } from "./data/devices";
import { GeminiResponse } from "./services/geminiService";
import { Trophy, AlertCircle, Sparkles } from "lucide-react";

export default function App() {
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showIncompatible, setShowIncompatible] = useState(false);

  const handleDetection = (result: GeminiResponse) => {
    if (DEVICES[result.detectedDevice]) {
      setSelectedDevice(DEVICES[result.detectedDevice]);
      setShowIncompatible(false);
      setError(null);
    } else {
      setSelectedDevice(null);
      setShowIncompatible(true);
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
          {!selectedDevice && !showIncompatible ? (
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
              />
              
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center gap-4 text-white/60 text-sm max-w-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-emerald-400" />
                <p>Apuntá a heladeras, aires, lavarropas, TV, termotanques o cargadores.</p>
              </div>
            </motion.div>
          ) : showIncompatible ? (
            <motion.div 
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-6"
              id="error-view"
            >
              <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
                <AlertCircle className="w-10 h-10 text-red-400" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-white">No pudimos identificarlo</h2>
                <p className="text-white/60 max-w-xs mx-auto">
                  Probá acercarte más al dispositivo o mejorar la iluminación del ambiente.
                </p>
              </div>
              <button 
                onClick={() => setShowIncompatible(false)}
                className="px-8 py-3 bg-white text-zinc-950 font-bold rounded-xl hover:bg-emerald-400 transition-colors"
                id="retry-btn"
              >
                Volver a intentar
              </button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>

      <RecommendationCard 
        device={selectedDevice}
        onClose={() => setSelectedDevice(null)}
      />
      
      <footer className="px-8 py-4 bg-[#15181e] flex justify-between items-center text-[10px] text-gray-500 border-t border-white/5 z-10">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            Cámara Activa
          </span>
          <span className="hidden sm:inline">Privacidad: La imagen no se almacena</span>
        </div>
        <div className="flex gap-4 font-mono uppercase tracking-wider">
          <span>ISO 400</span>
          <span>f/1.8</span>
          <span>1/120s</span>
        </div>
      </footer>
    </div>
  );
}
