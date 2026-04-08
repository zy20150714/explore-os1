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
          setTimeout(onComplete, 800); // Reduced wait time for faster loading
          return 100;
        }
        // Non-linear progress for more natural feel
        const increment = Math.random() * 1.2 + 0.5;
        return Math.min(prev + increment, 100);
      });
    }, 30); // Faster interval for smoother progress

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a1128] text-blue-100"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Background Atmosphere */}
      <div className="absolute inset-0 overflow-hidden">
         {/* Animated gradient background */}
         <div 
           className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-indigo-900/20 to-blue-900/40"
           style={{ 
             backgroundSize: '400% 400%',
             animation: 'gradientShift 8s ease infinite'
           }}
         />
         {/* Floating particles - reduced to 5 for better performance */}
         {[...Array(5)].map((_, i) => (
           <motion.div
             key={i}
             className="absolute rounded-full bg-blue-400/15 blur-2xl"
             style={{
               width: Math.random() * 150 + 80,
               height: Math.random() * 150 + 80,
               left: `${Math.random() * 100}%`,
               top: `${Math.random() * 100}%`,
             }}
             animate={{
               x: [0, Math.random() * 30 - 15],
               y: [0, Math.random() * 30 - 15],
               opacity: [0.2, 0.4, 0.2],
             }}
             transition={{
               duration: Math.random() * 6 + 8,
               repeat: Infinity,
               repeatType: "reverse",
             }}
           />
         ))}
      </div>

      <div className="relative z-10 flex flex-col items-center space-y-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative"
        >
          {/* Enhanced glow effect */}
          <motion.div 
            className="absolute inset-0 bg-blue-500 blur-2xl rounded-full"
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ 
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          {/* Glass effect for the compass container */}
          <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-lg border border-white/15 shadow-xl shadow-black/20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            >
              <Compass size={48} className="text-white text-glow-blue" />
            </motion.div>
          </div>
          {/* Outer rotating ring */}
          <motion.div 
            className="absolute -inset-2 border-2 border-blue-400/20 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>

        <motion.h1
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-4xl font-semibold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-300 text-glow"
        >
          Liquid OS
        </motion.h1>

        {/* Enhanced progress bar */}
        <div className="w-64 h-2 bg-slate-800/60 rounded-full overflow-hidden relative border border-white/8 backdrop-blur-sm">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 shadow-[0_0_10px_rgba(105,177,255,0.6)]"
            style={{ width: `${progress}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          />
        </div>
        
        <motion.p 
          className="text-slate-300 text-sm font-light tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {progress < 100 ? "正在启动..." : "准备就绪"}
        </motion.p>
      </div>


    </motion.div>
  );
}
