import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { useData } from '@/context/DataProvider';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export function GlassCard({ children, className, hoverEffect = true, ...props }: GlassCardProps) {
  const { themeMode } = useData();
  
  return (
    <motion.div
      className={cn(
        themeMode === 'glass' ? "glass-card rounded-2xl p-4 overflow-hidden relative" : "bg-slate-800 rounded-2xl p-4 overflow-hidden relative border border-slate-700",
        hoverEffect && (themeMode === 'glass' 
          ? "hover:bg-white/10 hover:shadow-lg hover:shadow-teal-500/20 hover:scale-[1.01] transition-all duration-300"
          : "hover:bg-slate-700 transition-colors duration-300"
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
