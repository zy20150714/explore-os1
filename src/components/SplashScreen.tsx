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
          setTimeout(onComplete, 500);
          return 100;
        }
        const increment = Math.random() * 1.5 + 0.5;
        return Math.min(prev + increment, 100);
      });
    }, 20);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 text-teal-100"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background Atmosphere */}
      <div className="absolute inset-0 overflow-hidden">
         <div className="absolute -top-1/2 left-0 w-full h-full bg-teal-500/20 blur-[150px] rounded-full mix-blend-screen animate-pulse" />
         <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-teal-900/30 to-transparent" />
         {/* Decorative elements */}
         <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-[40px]" />
         <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-emerald-500/10 rounded-full blur-[50px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center space-y-8">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-emerald-600 blur-xl opacity-30 rounded-full animate-pulse" />
          <div className="relative flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-br from-teal-400 to-emerald-600 shadow-2xl shadow-teal-500/50 ring-2 ring-teal-500/30">
            <Compass size={56} className="text-white animate-spin" style={{ animationDuration: '10s', animationTimingFunction: 'linear' }} />
          </div>
          <motion.div
            className="absolute -inset-3 border-2 border-teal-500/30 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute -inset-5 border border-teal-500/10 rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>

        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
          className="text-5xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-teal-200 via-emerald-300 to-teal-200"
        >
          Explore OS
        </motion.h1>

        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: '16rem', opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="w-64 h-2 bg-slate-800/50 rounded-full overflow-hidden relative border border-slate-700/50"
        >
          <motion.div
            className="h-full bg-gradient-to-r from-teal-400 to-emerald-500 shadow-[0_0_15px_rgba(45,212,191,0.6)]"
            style={{ width: `${progress}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.2 }}
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-slate-400 text-sm font-light tracking-widest"
        >
          {progress < 100 ? "系统初始化中..." : "准备就绪"}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 0.9 }}
          className="text-xs text-slate-500 tracking-widest"
        >
          v2.1
        </motion.div>
      </div>
    </motion.div>
  );
}
