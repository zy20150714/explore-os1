import { motion } from 'framer-motion';
import { Compass } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 1500); // Wait longer after 100%
          return 100;
        }
        // Non-linear progress or just very slow
        // Random increment between 0.2 and 0.8
        const increment = Math.random() * 0.6 + 0.2;
        return Math.min(prev + increment, 100);
      });
    }, 50); // Slower interval

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0f172a] text-teal-100"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background Atmosphere */}
      <div className="absolute inset-0 overflow-hidden">
         <div className="absolute -top-1/2 left-0 w-full h-full bg-teal-500/20 blur-[150px] rounded-full mix-blend-screen animate-pulse" />
         <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-teal-900 to-transparent opacity-50" />
      </div>

      <div className="relative z-10 flex flex-col items-center space-y-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative"
        >
          <div className="absolute inset-0 bg-teal-400 blur-xl opacity-30 rounded-full" />
          <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-teal-400 to-emerald-600 shadow-2xl shadow-teal-500/50">
            <Compass size={48} className="text-white animate-spin-slow" style={{ animationDuration: '10s' }} />
          </div>
          <motion.div 
            className="absolute -inset-2 border border-teal-500/30 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-4xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-emerald-400"
        >
          EXPLORE OS
        </motion.h1>

        <div className="w-64 h-2 bg-slate-800 rounded-full overflow-hidden relative border border-slate-700">
          <motion.div
            className="h-full bg-gradient-to-r from-teal-400 to-emerald-500 shadow-[0_0_10px_rgba(45,212,191,0.5)]"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <p className="text-slate-400 text-sm font-light tracking-widest">
          {progress < 100 ? "系统初始化中..." : "准备就绪"}
        </p>
      </div>
    </motion.div>
  );
}
