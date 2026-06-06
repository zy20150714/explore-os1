import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
  variant?: 'default' | 'elevated' | 'outlined' | 'glow' | 'paper' | 'minimal';
  delay?: number;
  onClick?: () => void;
}

export function GlassCard({ children, className, hoverEffect = true, variant = 'default', delay = 0, onClick, ...props }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      whileHover={hoverEffect ? { y: -2 } : {}}
      onClick={onClick}
      className={cn(
        "rounded-2xl p-5 overflow-hidden relative",
        variant === 'elevated'
          ? "bg-slate-800 border border-slate-700/50 shadow-lg shadow-black/20"
          : variant === 'outlined'
            ? "bg-transparent border border-slate-600/50"
            : variant === 'glow'
              ? "bg-slate-800/80 border border-slate-700/50 shadow-lg"
              : variant === 'paper'
                ? "bg-slate-800 border border-slate-700/30 shadow-sm"
                : variant === 'minimal'
                  ? "bg-transparent"
                  : "bg-slate-800 border border-slate-700/30 shadow-sm",
        hoverEffect && "hover:border-slate-600/50 transition-colors duration-200 cursor-pointer",
        className
      )}
      {...props}
    >
      {variant === 'glow' && (
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-emerald-500/5 pointer-events-none" />
      )}
      <div className={cn("relative z-10", variant === 'minimal' && "p-0")}>
        {children}
      </div>
    </motion.div>
  );
}
