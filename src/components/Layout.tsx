import { ReactNode } from 'react';
import { Sidebar, ViewType } from './Sidebar';
import { useData } from '@/context/DataProvider';

interface LayoutProps {
  children: ReactNode;
  currentView: ViewType;
  onChangeView: (view: ViewType) => void;
}

const DENSITY_PADDING: Record<string, string> = {
  compact: 'p-3 md:p-5',
  standard: 'p-4 md:p-6 lg:p-8',
  spacious: 'p-5 md:p-8 lg:p-10',
};

const FONT_SIZES: Record<string, string> = {
  small: 'text-xs md:text-sm',
  medium: 'text-sm md:text-base',
  large: 'text-base md:text-lg',
};

export function Layout({ children, currentView, onChangeView }: LayoutProps) {
  const { settings } = useData();
  
  const densityPadding = DENSITY_PADDING[settings.densityMode] || DENSITY_PADDING.standard;
  const fontClass = FONT_SIZES[settings.fontSizeMode] || FONT_SIZES.medium;

  return (
    <div className={`flex h-screen w-full overflow-hidden ${fontClass} relative`}>
      <Sidebar currentView={currentView} onChangeView={onChangeView} />
      
      <main className={`flex-1 h-full overflow-y-auto overflow-x-hidden relative z-10 ${densityPadding} scroll-smooth`}>
        <div className="max-w-7xl mx-auto h-full">
           {children}
        </div>
      </main>
    </div>
  );
}
