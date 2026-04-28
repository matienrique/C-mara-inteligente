import { Camera, RefreshCcw, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { analyzeDeviceImage, GeminiResponse } from "../services/geminiService";

interface CameraScannerProps {
  onDetect: (result: GeminiResponse) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (val: boolean) => void;
  onError: (msg: string) => void;
}

export default function CameraScanner({ onDetect, isAnalyzing, setIsAnalyzing, onError }: CameraScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [internalError, setInternalError] = useState<string | null>(null);
  const [permissionsGranted, setPermissionsGranted] = useState(false);

  const startCamera = async () => {
    setInternalError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Tu navegador no soporta el acceso a la cámara.");
      }

      // Intentar primero con cámara trasera
      let mediaStream: MediaStream;
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });
      } catch (e) {
        console.warn("No environment camera, trying default...");
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      }
      
      setStream(mediaStream);
      setPermissionsGranted(true);
      setInternalError(null);
    } catch (err) {
      console.error("Camera error:", err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      if (errorMessage.includes("Permission denied") || errorMessage.includes("NotAllowedError")) {
        setInternalError("Permiso denegado. Por favor, permití el acceso a la cámara en los ajustes de tu navegador.");
      } else {
        setInternalError("No se pudo acceder a la cámara. Verificá que no esté siendo usada por otra app.");
      }
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
    
    // Optimize for speed: resize to a max dimension of 768px while maintaining aspect ratio
    const maxSize = 768;
    let width = video.videoWidth;
    let height = video.videoHeight;

    if (width > height) {
      if (width > maxSize) {
        height *= maxSize / width;
        width = maxSize;
      }
    } else {
      if (height > maxSize) {
        width *= maxSize / height;
        height = maxSize;
      }
    }

    canvas.width = width;
    canvas.height = height;
    
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0, width, height);
      // Use 0.7 quality for faster upload/processing
      const base64 = canvas.toDataURL("image/jpeg", 0.7).split(",")[1];
      
      const result = await analyzeDeviceImage(base64);
      if (result) {
        onDetect(result);
      } else {
        onError("Ocurrió un error al analizar la imagen. Intentá de nuevo o revisá tu conexión.");
      }
    }
    setIsAnalyzing(false);
  };

  useEffect(() => {
    if (stream && videoRef.current && permissionsGranted) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(e => console.error("Video play error:", e));
    }
    return () => stopCamera();
  }, [stream, permissionsGranted]);

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
        {internalError && <p className="text-red-400 text-xs italic">{internalError}</p>}
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-3xl mx-auto aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden bg-black shadow-2xl border border-white/5" id="camera-viewport">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover opacity-80"
      />
      
      {/* Scanning Overlay */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[85%] h-[70%] md:w-[75%] md:h-[65%] border border-white/10 relative">
          {/* Corners */}
          <div className="absolute -top-1 -left-1 w-12 h-12 border-t-4 border-l-4 border-emerald-500 rounded-tl-lg shadow-[0_0_20px_rgba(16,185,129,0.7)]" />
          <div className="absolute -top-1 -right-1 w-12 h-12 border-t-4 border-r-4 border-emerald-500 rounded-tr-lg shadow-[0_0_20px_rgba(16,185,129,0.7)]" />
          <div className="absolute -bottom-1 -left-1 w-12 h-12 border-b-4 border-l-4 border-emerald-500 rounded-bl-lg shadow-[0_0_20px_rgba(16,185,129,0.7)]" />
          <div className="absolute -bottom-1 -right-1 w-12 h-12 border-b-4 border-r-4 border-emerald-500 rounded-br-lg shadow-[0_0_20px_rgba(16,185,129,0.7)]" />
          
          <motion.div 
            animate={{ top: ["0%", "100%", "0%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent shadow-[0_0_20px_rgba(16,185,129,0.4)]"
          />
          
          <div className="absolute inset-0 flex items-center justify-center uppercase">
            <p className="text-[10px] tracking-[0.4em] text-emerald-400/40 font-bold bg-black/40 px-6 py-2 rounded-lg backdrop-blur-sm border border-emerald-500/10 whitespace-nowrap">
              Enfoque el dispositivo
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
          className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all border ${
            isAnalyzing 
              ? "bg-zinc-800 text-white/50 border-white/5" 
              : "bg-white border-emerald-500/30 hover:bg-zinc-50 group"
          }`}
          id="analyze-btn"
        >
          {isAnalyzing ? (
            <RefreshCcw className="w-8 h-8 animate-spin" />
          ) : (
            <Check className="w-8 h-8 text-emerald-500 stroke-[3]" />
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
