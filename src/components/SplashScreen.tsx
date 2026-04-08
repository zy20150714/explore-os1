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
        // Non-linear progress for more natural feel
        const increment = Math.random() * 0.8 + 0.3;
        return Math.min(prev + increment, 100);
      });
    }, 40); // Slightly faster interval for smoother progress

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0f172a] text-blue-100"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      {/* Background Atmosphere */}
      <div className="absolute inset-0 overflow-hidden">
         {/* Animated gradient background */}
         <div 
           className="absolute inset-0 bg-gradient-to-br from-blue-900/50 via-purple-900/30 to-blue-900/50"
           style={{ 
             backgroundSize: '400% 400%',
             animation: 'gradientShift 10s ease infinite'
           }}
         />
         {/* Floating particles */}
         {[...Array(10)].map((_, i) => (
           <motion.div
             key={i}
             className="absolute rounded-full bg-blue-400/20 blur-2xl"
             style={{
               width: Math.random() * 200 + 100,
               height: Math.random() * 200 + 100,
               left: `${Math.random() * 100}%`,
               top: `${Math.random() * 100}%`,
             }}
             animate={{
               x: [0, Math.random() * 40 - 20],
               y: [0, Math.random() * 40 - 20],
               opacity: [0.3, 0.6, 0.3],
             }}
             transition={{
               duration: Math.random() * 8 + 10,
               repeat: Infinity,
               repeatType: "reverse",
             }}
           />
         ))}
      </div>

      <div className="relative z-10 flex flex-col items-center space-y-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative"
        >
          {/* Enhanced glow effect */}
          <motion.div 
            className="absolute inset-0 bg-blue-500 blur-3xl rounded-full"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.4, 0.6, 0.4],
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          {/* Glass effect for the compass container */}
          <div className="relative flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-xl border border-white/20 shadow-2xl shadow-blue-500/30">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Compass size={56} className="text-white text-glow-blue" />
            </motion.div>
          </div>
          {/* Outer rotating ring */}
          <motion.div 
            className="absolute -inset-3 border-2 border-blue-400/30 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />
          {/* Inner rotating ring */}
          <motion.div 
            className="absolute -inset-1 border border-blue-300/20 rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-5xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-300 text-glow"
        >
          LIQUID OS
        </motion.h1>

        {/* Enhanced progress bar */}
        <div className="w-72 h-3 bg-slate-800/50 rounded-full overflow-hidden relative border border-white/10 backdrop-blur-sm">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-400 to-purple-500 shadow-[0_0_15px_rgba(105,177,255,0.8)]"
            style={{ width: `${progress}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>
        
        <motion.p 
          className="text-slate-300 text-sm font-light tracking-widest"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {progress < 100 ? "初始化液态玻璃界面..." : "准备就绪"}
        </motion.p>
      </div>


    </motion.div>
  );
}
