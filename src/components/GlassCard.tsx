import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { useData } from '@/context/DataProvider';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
  variant?: 'default' | 'elevated' | 'outlined';
}

export function GlassCard({ children, className, hoverEffect = true, variant = 'default', ...props }: GlassCardProps) {
  const { themeMode } = useData();
  
  return (
    <motion.div
      className={cn(
        "rounded-2xl p-4 overflow-hidden relative",
        themeMode === 'glass' 
          ? variant === 'elevated'
            ? "glass-card shadow-xl shadow-teal-500/10"
            : variant === 'outlined'
              ? "bg-white/5 border border-white/10 shadow-lg"
              : "glass-card"
          : variant === 'elevated'
            ? "bg-slate-800 border border-slate-700 shadow-xl shadow-slate-900/50"
            : variant === 'outlined'
              ? "bg-slate-900 border border-slate-700"
              : "bg-slate-800 border border-slate-700/50",
        hoverEffect && (
          themeMode === 'glass' 
            ? "hover:bg-white/10 hover:shadow-lg hover:shadow-teal-500/20 hover:scale-[1.01] transition-all duration-300"
            : "hover:bg-slate-700/80 transition-colors duration-300"
        ),
        className
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
