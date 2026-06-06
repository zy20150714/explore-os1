import { useState } from 'react';
import { 
  Home, 
  CheckSquare, 
  Briefcase, 
  Calendar, 
  BookOpen, 
  Award, 
  Grid,
  Settings,
  ChevronLeft,
  ChevronRight,
  Timer
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';
import { useData } from '@/context/DataProvider';

export type ViewType = 'home' | 'todo' | 'projects' | 'affairs' | 'calendar' | 'journal' | 'achievements' | 'apps' | 'pomodoro' | 'settings';

interface SidebarProps {
  currentView: ViewType;
  onChangeView: (view: ViewType) => void;
}

export function Sidebar({ currentView, onChangeView }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { installedApps, settings, updateSettings } = useData();
  
  const menuItems = [
    { id: 'home', label: '我的主页', icon: Home },
    { id: 'todo', label: '待办事项', icon: CheckSquare },
    { id: 'projects', label: '长期事项', icon: Briefcase },
    { id: 'calendar', label: '日程管理', icon: Calendar },
    { id: 'journal', label: '生活手账', icon: BookOpen },
    { id: 'achievements', label: '我的成就', icon: Award },
    { id: 'pomodoro', label: '番茄时钟', icon: Timer, requiresInstall: true },
    { id: 'apps', label: '应用中心', icon: Grid },
  ];

  const visibleItems = menuItems.filter(item => {
    if (!item.requiresInstall) return true;
    return installedApps?.includes(item.id);
  });

  const themeLabels: Record<string, string> = {
    glass: '玻璃模式',
    normal: '简约模式',
    dark: '深邃模式',
    warm: '暖色模式',
    ocean: '海洋模式',
  };

  return (
    <aside 
      className={cn(
        "h-full glass-panel flex flex-col relative z-20 transition-[width] duration-300 ease-in-out",
        collapsed ? "w-[72px]" : "w-64"
      )}
      aria-label="主导航"
    >
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-8 w-6 h-6 bg-slate-800 border border-slate-700/50 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors z-30 shadow-md"
        aria-label={collapsed ? "展开侧边栏" : "收起侧边栏"}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      <div className={cn(
        "flex items-center gap-3 px-4 py-6 mb-4",
        collapsed && "px-0 justify-center"
      )}>
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center shadow-md shrink-0"
        >
          <div className="w-4 h-4 bg-white rounded-full" />
        </motion.div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="overflow-hidden"
            >
              <h1 className="text-xl font-semibold text-white">
                Explore OS
              </h1>
              <p className="text-xs text-slate-500">现代化工作台</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <nav className={cn(
        "flex-1 space-y-1 px-3 overflow-y-auto",
        collapsed && "px-2"
      )} aria-label="导航菜单">
        {visibleItems.map((item) => {
          const isActive = currentView === item.id;
          const Icon = item.icon;
          
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id as ViewType)}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors duration-200 relative",
                collapsed && "justify-center px-0",
                isActive 
                  ? "bg-slate-700/80 text-white"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-teal-500 rounded-r-full" />
              )}
              <Icon size={20} className="shrink-0" aria-hidden="true" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="font-medium whitespace-nowrap text-sm"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </nav>

      <div className={cn(
        "mt-auto px-3 pb-4 space-y-2",
        collapsed && "px-2"
      )}>
        <button
          onClick={() => onChangeView('settings')}
          aria-label="设置"
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors",
            collapsed && "justify-center px-0",
            currentView === 'settings' && "bg-slate-700/80 text-white"
          )}
        >
          <Settings size={20} aria-hidden="true" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm"
              >
                设置
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        <button
          onClick={() => {
            const modes = ['glass', 'normal', 'dark', 'warm', 'ocean'] as const;
            const currentIdx = modes.indexOf(settings.themeMode);
            const nextMode = modes[(currentIdx + 1) % modes.length];
            updateSettings({ themeMode: nextMode });
          }}
          aria-label="切换主题"
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors",
            collapsed && "justify-center px-0"
          )}
        >
          <div className="w-5 h-5 rounded-full border-2 border-slate-500 shrink-0" aria-hidden="true" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm"
              >
                {themeLabels[settings.themeMode] || '玻璃模式'}
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        <div className={cn(
          "text-center text-xs text-slate-600 pt-2",
          collapsed ? "text-[10px]" : "tracking-widest"
        )}>
          {collapsed ? 'v3.2' : 'Explore OS v3.2'}
        </div>
      </div>
    </aside>
  );
}
