import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
  variant?: 'default' | 'elevated' | 'outlined';
}

export function GlassCard({ children, className, hoverEffect = true, variant = 'default', ...props }: GlassCardProps) {
  return (
    <motion.div
      className={cn(
        "rounded-2xl p-4 overflow-hidden relative",
        variant === 'elevated'
          ? "bg-slate-800 border border-slate-700 shadow-xl shadow-slate-900/50"
          : variant === 'outlined'
            ? "bg-slate-900 border border-slate-700"
            : "bg-slate-800 border border-slate-700/50",
        hoverEffect && "hover:bg-slate-700/80 transition-colors duration-300",
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
