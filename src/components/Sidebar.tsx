import { 
  Home, 
  CheckSquare, 
  Briefcase, 
  Calendar, 
  BookOpen, 
  Award, 
  Grid, 
  LayoutGrid, 
  Wind, 
  Moon, 
  Sun,
  Timer
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useData } from '@/context/DataProvider';

export type ViewType = 'home' | 'todo' | 'projects' | 'affairs' | 'calendar' | 'journal' | 'achievements' | 'apps' | 'pomodoro';

interface SidebarProps {
  currentView: ViewType;
  onChangeView: (view: ViewType) => void;
}

export function Sidebar({ currentView, onChangeView }: SidebarProps) {
  const menuItems = [
    { id: 'home', label: '我的主页', icon: Home, color: 'from-teal-400 to-emerald-500' },
    { id: 'pomodoro', label: '番茄时钟', icon: Timer, color: 'from-red-400 to-orange-500' },
    { id: 'todo', label: '待办事项', icon: CheckSquare, color: 'from-blue-400 to-cyan-500' },
    { id: 'projects', label: '长期事项', icon: Briefcase, color: 'from-purple-400 to-pink-500' },
    { id: 'calendar', label: '日程管理', icon: Calendar, color: 'from-emerald-400 to-teal-500' },
    { id: 'journal', label: '生活手账', icon: BookOpen, color: 'from-amber-400 to-orange-500' },
    { id: 'achievements', label: '我的成就', icon: Award, color: 'from-yellow-400 to-amber-500' },
    { id: 'apps', label: '应用中心', icon: Grid, color: 'from-indigo-400 to-blue-500' },
  ];

  return (
    <aside className="w-64 h-full bg-slate-800 border-r border-slate-700 flex flex-col p-4 rounded-r-2xl border-l-0 z-20 transition-all duration-300">
      {/* Logo Section */}
      <div className="flex items-center gap-3 px-4 py-6 mb-6">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-teal-500/30 ring-2 ring-teal-500/20">
          <div className="w-4 h-4 bg-white rounded-full" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">
            Explore OS
          </h1>
          <p className="text-xs text-slate-400">现代化工作台</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 px-2">
        {menuItems.map((item) => {
          const isActive = currentView === item.id;
          const Icon = item.icon;
          
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id as ViewType)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
                isActive 
                  ? "bg-slate-700 text-white border border-slate-600"
                  : "text-slate-300 hover:bg-slate-700 hover:text-white"
              )}
            >
              {isActive && (
                <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${item.color}`} />
              )}
              <Icon 
                size={20} 
                className={cn(
                  "transition-transform duration-300 group-hover:scale-110",
                  isActive ? "text-teal-400" : "text-slate-400 group-hover:text-teal-300"
                )} 
              />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="mt-auto px-4 pb-6 opacity-40 text-xs text-center font-mono tracking-widest text-slate-400">
        Explore OS v2.1
      </div>
    </aside>
  );
}
