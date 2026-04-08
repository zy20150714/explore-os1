import { ReactNode } from 'react';
import { Sidebar, ViewType } from './Sidebar';

interface LayoutProps {
  children: ReactNode;
  currentView: ViewType;
  onChangeView: (view: ViewType) => void;
}

export function Layout({ children, currentView, onChangeView }: LayoutProps) {
  return (
    <div className="flex h-screen w-full overflow-hidden text-slate-100 relative">
      {/* Dynamic Background Elements */}
      <div className="fluid-bg">
        <div className="mountain"></div>
        <div className="mountain"></div>
        <div className="mountain"></div>
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
