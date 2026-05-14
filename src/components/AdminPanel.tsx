import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Plus, Trash2, Lock, Eye, EyeOff, Settings, ChevronDown, BarChart3, Users, Smartphone } from "lucide-react";
import { DEVICES } from "../data/devices";

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  customRecommendations: Record<string, string[]>;
  onUpdateRecommendations: (deviceId: string, recommendations: string[]) => void;
  stats: {
    visits: number;
    scans: Record<string, number>;
  };
}

export default function AdminPanel({ 
  isOpen, 
  onClose, 
  customRecommendations, 
  onUpdateRecommendations,
  stats
}: AdminPanelProps) {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"modifications" | "data">("modifications");
  const [editingDevice, setEditingDevice] = useState<string | null>(null);
  const [newRecommendation, setNewRecommendation] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setPassword("");
      setIsAuthenticated(false);
      setError("");
      setEditingDevice(null);
      setActiveTab("modifications");
    }
  }, [isOpen]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "Energia25#") {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Contraseña incorrecta");
    }
  };

  const addRecommendation = (deviceId: string) => {
    if (!newRecommendation.trim()) return;
    const current = customRecommendations[deviceId] || [];
    onUpdateRecommendations(deviceId, [...current, newRecommendation.trim()]);
    setNewRecommendation("");
  };

  const removeRecommendation = (deviceId: string, index: number) => {
    const current = customRecommendations[deviceId] || [];
    const updated = current.filter((_, i) => i !== index);
    onUpdateRecommendations(deviceId, updated);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-zinc-900 border border-white/10 rounded-3xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl"
      >
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-zinc-900/50">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-bold text-white">Panel de Administración</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-white/50 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {isAuthenticated && (
          <div className="flex border-b border-white/5 bg-zinc-900/30">
            <button 
              onClick={() => setActiveTab("modifications")}
              className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 ${
                activeTab === "modifications" ? "text-emerald-400 bg-emerald-500/5" : "text-white/30 hover:text-white/60"
              }`}
            >
              <Settings className="w-4 h-4" /> Modificaciones
            </button>
            <button 
              onClick={() => setActiveTab("data")}
              className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 ${
                activeTab === "data" ? "text-emerald-400 bg-emerald-500/5" : "text-white/30 hover:text-white/60"
              }`}
            >
              <BarChart3 className="w-4 h-4" /> Datos
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {!isAuthenticated ? (
            <div className="max-w-sm mx-auto py-12 text-center space-y-6">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
                <Lock className="w-8 h-8 text-emerald-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white">Acceso Restringido</h3>
                <p className="text-white/40 text-sm">Introduzca la contraseña para continuar</p>
              </div>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500/50 transition-colors"
                    autoFocus
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {error && <p className="text-red-400 text-xs font-medium">{error}</p>}
                <button 
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold py-3 rounded-xl transition-colors"
                >
                  Confirmar
                </button>
              </form>
            </div>
          ) : activeTab === "modifications" ? (
            <div className="space-y-4">
              {Object.values(DEVICES).map((device) => (
                <div 
                  key={device.id}
                  className={`border rounded-2xl transition-all ${
                    editingDevice === device.id ? "bg-white/5 border-emerald-500/30" : "bg-white/2 border-white/5 hover:border-white/10"
                  }`}
                >
                  <button 
                    onClick={() => setEditingDevice(editingDevice === device.id ? null : device.id)}
                    className="w-full flex items-center justify-between p-4 text-left"
                  >
                    <div>
                      <h4 className="font-bold text-white">{device.nombre}</h4>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest">{device.id}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] bg-white/5 text-white/50 px-2 py-1 rounded-md">
                        {(customRecommendations[device.id]?.length || 0) + device.recomendaciones.length} consejos
                      </span>
                      <ChevronDown className={`w-5 h-5 text-white/30 transition-transform ${editingDevice === device.id ? "rotate-180" : ""}`} />
                    </div>
                  </button>

                  <AnimatePresence>
                    {editingDevice === device.id && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 pt-0 space-y-4">
                          <div className="space-y-2 border-t border-white/5 pt-4">
                            <p className="text-[10px] font-bold text-emerald-400/60 uppercase tracking-widest">Sugerencias actuales</p>
                            
                            {device.recomendaciones.map((rec, i) => (
                              <div key={`orig-${i}`} className="flex items-start gap-3 p-3 bg-white/2 rounded-xl text-sm text-white/60">
                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500/40 flex-shrink-0" />
                                <span>{rec}</span>
                              </div>
                            ))}

                            {(customRecommendations[device.id] || []).map((rec, i) => (
                              <div key={`custom-${i}`} className="flex items-start gap-3 p-3 bg-emerald-500/5 rounded-xl text-sm text-emerald-200/80 border border-emerald-500/10 group">
                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                                <span className="flex-1">{rec}</span>
                                <button 
                                  onClick={() => removeRecommendation(device.id, i)}
                                  className="text-white/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>

                          <div className="space-y-2">
                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Añadir nueva sugerencia</p>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={newRecommendation}
                                onChange={(e) => setNewRecommendation(e.target.value)}
                                placeholder="Escriba un nuevo consejo..."
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500/30"
                              />
                              <button 
                                onClick={() => addRecommendation(device.id)}
                                className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 p-2 rounded-xl transition-colors disabled:opacity-50 disabled:hover:bg-emerald-500"
                                disabled={!newRecommendation.trim()}
                              >
                                <Plus className="w-6 h-6" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-white/40">
                    <Users className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Visitantes Totales</span>
                  </div>
                  <p className="text-4xl font-mono font-bold text-white tracking-tighter">{stats.visits}</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-white/40">
                    <Smartphone className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Escaneos Totales</span>
                  </div>
                  <p className="text-4xl font-mono font-bold text-emerald-400 tracking-tighter">
                    {Object.values(stats.scans).reduce((a, b) => a + b, 0)}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest px-1">Escaneos por Dispositivo</h4>
                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                  {Object.values(DEVICES).map((device, idx) => (
                    <div 
                      key={device.id} 
                      className={`flex items-center justify-between p-4 ${idx !== 0 ? "border-t border-white/5" : ""}`}
                    >
                      <span className="text-sm text-white/80 font-medium">{device.nombre}</span>
                      <div className="flex items-center gap-4">
                        <div className="h-1.5 w-24 bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, (stats.scans[device.id] || 0) * 10)}%` }}
                            className="h-full bg-emerald-500/40"
                          />
                        </div>
                        <span className="text-sm font-mono font-bold text-white">{stats.scans[device.id] || 0}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
