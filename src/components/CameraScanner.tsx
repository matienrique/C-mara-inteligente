import { Camera, RefreshCcw, Scan, Search } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { analyzeDeviceImage, GeminiResponse } from "../services/geminiService";

interface CameraScannerProps {
  onDetect: (result: GeminiResponse) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (val: boolean) => void;
}

export default function CameraScanner({ onDetect, isAnalyzing, setIsAnalyzing }: CameraScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [permissionsGranted, setPermissionsGranted] = useState(false);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setPermissionsGranted(true);
      setError(null);
    } catch (err) {
      console.error("Camera error:", err);
      setError("No se pudo acceder a la cámara. Asegúrate de dar los permisos necesarios.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current || isAnalyzing) return;

    setIsAnalyzing(true);
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const base64 = canvas.toDataURL("image/jpeg", 0.8).split(",")[1];
      
      const result = await analyzeDeviceImage(base64);
      if (result) {
        onDetect(result);
      } else {
        setError("Error al analizar la imagen. Intentá de nuevo.");
      }
    }
    setIsAnalyzing(false);
  };

  useEffect(() => {
    return () => stopCamera();
  }, [stream]);

  if (!permissionsGranted) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-zinc-900 rounded-3xl border border-white/5 shadow-2xl space-y-6" id="permissions-view">
        <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center">
          <Camera className="w-10 h-10 text-emerald-400" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold text-white">Activá tu Cámara Inteligente</h2>
          <p className="text-white/60 text-sm max-w-xs">
            La imagen se usa solo para identificar el dispositivo y mostrar recomendaciones. No guardamos tus datos.
          </p>
        </div>
        <button
          onClick={startCamera}
          className="w-full py-4 bg-emerald-500 text-zinc-950 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
          id="activate-camera-btn"
        >
          <Camera className="w-5 h-5" /> Activar Cámara
        </button>
        {error && <p className="text-red-400 text-xs italic">{error}</p>}
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-3xl mx-auto aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden bg-black shadow-2xl border border-white/5" id="camera-viewport">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover opacity-60"
      />
      
      {/* Scanning Overlay */}
      <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
        <div className="w-[300px] h-[200px] md:w-[400px] md:h-[300px] border border-white/10 relative">
          {/* Corners */}
          <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-emerald-500 rounded-tl-lg shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
          <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-emerald-500 rounded-tr-lg shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
          <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-emerald-500 rounded-bl-lg shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
          <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-emerald-500 rounded-br-lg shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
          
          <motion.div 
            animate={{ top: ["0%", "100%", "0%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 h-[2px] bg-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
          />
          
          <div className="absolute inset-0 flex items-center justify-center uppercase">
            <p className="text-[10px] tracking-[0.3em] text-emerald-500 font-bold bg-black/60 px-4 py-2 rounded-lg backdrop-blur-sm border border-emerald-500/20">
              Apuntá a un dispositivo
            </p>
          </div>
        </div>
      </div>

      {/* Side Controls (Right) */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-30">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleCapture}
          disabled={isAnalyzing}
          className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all ${
            isAnalyzing 
              ? "bg-zinc-800 text-white/50" 
              : "bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/20"
          }`}
          id="analyze-btn"
        >
          {isAnalyzing ? (
            <RefreshCcw className="w-8 h-8 animate-spin" />
          ) : (
            <Scan className="w-8 h-8 stroke-[2.5]" />
          )}
        </motion.button>
        
        <button 
          onClick={() => window.location.reload()}
          className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md active:scale-95 transition-all border border-white/10"
          id="reset-btn"
        >
          <RefreshCcw className="w-6 h-6" />
        </button>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
