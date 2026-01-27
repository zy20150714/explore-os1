import { 
  Home, 
  CheckSquare, 
  Briefcase, 
  Calendar, 
  BookOpen, 
  Award, 
  Grid 
} from 'lucide-react';
import { cn } from '@/utils/cn';

export type ViewType = 'home' | 'todo' | 'projects' | 'affairs' | 'calendar' | 'journal' | 'achievements' | 'apps';

interface SidebarProps {
  currentView: ViewType;
  onChangeView: (view: ViewType) => void;
}

export function Sidebar({ currentView, onChangeView }: SidebarProps) {
  const menuItems = [
    { id: 'home', label: '我的主页', icon: Home },
    { id: 'todo', label: '待办事项', icon: CheckSquare },
    { id: 'projects', label: '长期事项', icon: Briefcase },
    { id: 'calendar', label: '日程管理', icon: Calendar },
    { id: 'journal', label: '生活手账', icon: BookOpen },
    { id: 'achievements', label: '我的成就', icon: Award },
    { id: 'apps', label: '应用中心', icon: Grid },
  ];

  return (
    <aside className="w-64 h-full glass-panel flex flex-col p-4 rounded-r-2xl border-l-0 z-20">
      <div className="flex items-center gap-3 px-4 py-6 mb-4">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-teal-500/30">
          <div className="w-3 h-3 bg-white rounded-full" />
        </div>
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-200 to-white">
          Explore OS
        </span>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = currentView === item.id;
          const Icon = item.icon;
          
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id as ViewType)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group",
                isActive 
                  ? "bg-teal-500/20 text-white shadow-[0_0_20px_rgba(20,184,166,0.2)] border border-teal-500/30" 
                  : "text-slate-400 hover:bg-white/5 hover:text-teal-200"
              )}
            >
              <Icon 
                size={20} 
                className={cn(
                  "transition-transform duration-300 group-hover:scale-110",
                  isActive ? "text-teal-300" : "text-slate-500 group-hover:text-teal-300"
                )} 
              />
              <span className="font-medium">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-400 shadow-[0_0_8px_#2dd4bf]" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto px-4 pb-6 opacity-40 text-xs text-center font-mono tracking-widest text-teal-200/50">
        EXPLORE OS v2.1
      </div>
    </aside>
  );
}
