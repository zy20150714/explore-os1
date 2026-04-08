import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/utils/cn';
import { ReactNode } from 'react';

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export function GlassCard({ children, className, hoverEffect = true, ...props }: GlassCardProps) {
  return (
    <motion.div
      className={cn(
        "glass-card rounded-2xl p-4 overflow-hidden relative",
        hoverEffect && "hover:bg-white/10 hover:shadow-lg hover:shadow-teal-500/20 hover:scale-[1.01] transition-all duration-300",
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
