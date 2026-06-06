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
  accentColor?: string;
}

const variantStyles: Record<string, string> = {
    default: 'bg-[var(--card-bg)] border border-[var(--border-color)] shadow-sm',
    elevated: 'bg-[var(--card-bg)] border border-[var(--border-color)] shadow-lg',
    outlined: 'bg-transparent border-2 border-[var(--border-color)]',
    glow: 'bg-[var(--card-bg)] border border-[var(--border-color)] shadow-md',
    paper: 'bg-[var(--card-bg)] border border-[var(--border-color)] shadow-sm',
    minimal: 'bg-transparent border-none shadow-none',
  };

export function GlassCard({ children, className, hoverEffect = true, variant = 'default', delay = 0, onClick, accentColor, ...props }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      whileHover={hoverEffect ? { y: -2 } : {}}
      onClick={onClick}
      className={cn(
        "rounded-2xl p-5 overflow-hidden relative",
        variantStyles[variant],
        hoverEffect && "hover:border-slate-600/50 transition-colors duration-200 cursor-pointer",
        className
      )}
      {...props}
    >
      {variant === 'glow' && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{ background: `linear-gradient(to bottom right, ${accentColor || '#14b8a6'}10, transparent, ${accentColor || '#14b8a6'}08)` }}
        />
      )}
      <div className={cn("relative z-10", variant === 'minimal' && "p-0")}>
        {children}
      </div>
    </motion.div>
  );
}
