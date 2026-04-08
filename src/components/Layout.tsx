import { ReactNode, useRef, useEffect } from 'react';
import { Sidebar, ViewType } from './Sidebar';

interface LayoutProps {
  children: ReactNode;
  currentView: ViewType;
  onChangeView: (view: ViewType) => void;
}

export function Layout({ children, currentView, onChangeView }: LayoutProps) {
  const fluidBgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (fluidBgRef.current) {
        fluidBgRef.current.style.backgroundPosition = `${e.clientX * 0.01}px ${e.clientY * 0.01}px`;
      }
    };

    // Use passive event listener for better performance
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Pre-generate particle styles to avoid recalculating on every render
  const particleStyles = Array.from({ length: 5 }, (_, i) => ({
    width: Math.random() * 100 + 50,
    height: Math.random() * 100 + 50,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 5}s`,
    animationDuration: `${Math.random() * 10 + 15}s`,
  }));

  return (
    <div className="flex h-screen w-full overflow-hidden text-slate-100 relative">
      {/* Dynamic Background Elements */}
      <div 
        ref={fluidBgRef}
        className="fluid-bg"
      >
        <div className="mountain"></div>
        <div className="mountain"></div>
        <div className="mountain"></div>
        {/* Floating particles */}
        {particleStyles.map((style, i) => (
          <div
            key={i}
            className="particle"
            style={style}
          />
        ))}
      </div>
      
      {/* Noise/Overlay for texture (optional) */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />

      <Sidebar currentView={currentView} onChangeView={onChangeView} />
      
      <main className="flex-1 h-full overflow-y-auto overflow-x-hidden relative z-10 p-8 scroll-smooth">
        <div className="max-w-7xl mx-auto h-full">
           {children}
        </div>
      </main>
    </div>
  );
}
