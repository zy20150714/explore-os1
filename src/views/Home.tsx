import { GlassCard } from '@/components/GlassCard';
import { Clock, CheckCircle2, TrendingUp, StickyNote, CalendarPlus, Briefcase, BookOpen, Play, Calendar, CheckSquare, Trophy, Grid } from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { useData } from '@/context/DataProvider';
import { ViewType } from '@/components/Sidebar';
import { useDeviceDetector } from '@/utils/useDeviceDetector';

interface HomeProps {
    onNavigate: (view: ViewType) => void;
}

export function Home({ onNavigate }: HomeProps) {
  const { stats, themeMode } = useData();
  const { isMobile } = useDeviceDetector();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const updateTime = () => setNow(new Date());
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = now.getHours();
    if (hour >= 6 && hour < 12) return "上午好";
    if (hour >= 12 && hour < 18) return "下午好";
    return "晚上好";
  };

  const shortcuts = [
    { label: '待办事项', icon: CheckSquare, view: 'todo' as ViewType, color: 'from-blue-400 to-cyan-500' },
    { label: '项目管理', icon: Briefcase, view: 'projects' as ViewType, color: 'from-purple-400 to-pink-500' },
    { label: '日程安排', icon: Calendar, view: 'calendar' as ViewType, color: 'from-emerald-400 to-teal-500' },
    { label: '生活手账', icon: BookOpen, view: 'journal' as ViewType, color: 'from-amber-400 to-orange-500' },
    { label: '成就系统', icon: Trophy, view: 'achievements' as ViewType, color: 'from-yellow-400 to-amber-500' },
    { label: '应用中心', icon: Grid, view: 'apps' as ViewType, color: 'from-indigo-400 to-blue-500' },
  ];

  // Get current focus session from user data
  const getCurrentFocus = () => {
    // For now, return null to indicate no focus session
    // Later, this can be updated to get actual focus sessions from user data
    return null;
  };

  const currentFocus = getCurrentFocus();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Welcome Section */}
      <div className={`relative overflow-hidden rounded-3xl p-6 ${isMobile ? 'p-4' : 'p-8'} bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50`}>
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] -mr-32 -mt-32 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -ml-24 -mb-24 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div className="space-y-2">
            <h1 className={`font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-200 via-emerald-300 to-white ${isMobile ? 'text-3xl' : 'text-5xl'}`}>
              {getGreeting()}
            </h1>
            <p className="text-slate-300 text-lg">这是您今天的概览，祝您工作顺利！</p>
          </div>
          
          <div className="text-right">
            <h2 className={`font-bold text-white tracking-tighter mb-1 ${isMobile ? 'text-4xl' : 'text-6xl'}`}>{format(now, 'HH:mm')}</h2>
            <p className="text-xl text-teal-300">{format(now, 'yyyy年M月d日 EEEE', { locale: zhCN })}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'}`}>
        {/* Main Focus - Only show if there's a focus session */}
        {currentFocus && (
          <GlassCard className={`p-6 relative overflow-hidden ${isMobile ? '' : 'lg:col-span-2'}`}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/20 rounded-full blur-[80px] -mr-16 -mt-16 pointer-events-none" />
            
            <div className="relative z-10">
              <h3 className="text-sm uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                <Clock size={16} className="text-teal-400" />
                当前专注
              </h3>
              
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 hover:bg-slate-800/80 transition-all duration-300 cursor-pointer group">
                <div className={`flex items-center gap-4 ${isMobile ? 'flex-col items-start' : ''}`}>
                  <div className="p-3 bg-gradient-to-br from-teal-400 to-emerald-600 rounded-lg shadow-lg shadow-teal-500/30 group-hover:scale-110 transition-transform duration-300">
                    <Clock className="text-white" size={24} />
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-white mb-1">{currentFocus.title}</h4>
                    <p className="text-slate-400 text-sm">{currentFocus.time} • {currentFocus.location}</p>
                  </div>
                  
                  <span className={`px-3 py-1 bg-teal-500/20 text-teal-300 text-xs rounded-full border border-teal-500/30 flex items-center gap-1 ${isMobile ? 'mt-3' : ''}`}>
                    <Play size={10} fill="currentColor" />
                    {currentFocus.status}
                  </span>
                </div>
              </div>
            </div>
          </GlassCard>
        )}

        {/* Quick Stats */}
        <div className={`space-y-4 ${!currentFocus && !isMobile ? 'lg:col-span-3' : ''}`}>
          <GlassCard className="p-5 bg-slate-800/50 border border-slate-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">已完成任务</p>
                <p className="text-3xl font-bold text-white">{stats.completedTodos}</p>
              </div>
              <div className="h-14 w-14 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 shadow-lg shadow-green-500/10">
                <CheckCircle2 size={28} />
              </div>
            </div>
          </GlassCard>
          
          <GlassCard className="p-5 bg-slate-800/50 border border-slate-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">项目平均进度</p>
                <p className="text-3xl font-bold text-white">{stats.avgProjectProgress}%</p>
              </div>
              <div className="h-14 w-14 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 shadow-lg shadow-blue-500/10">
                <TrendingUp size={28} />
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Shortcuts grid */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
          <Grid size={20} className="text-teal-400" />
          快速访问
        </h3>
        
        <div className={`grid gap-4 ${isMobile ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-6'}`}>
          {shortcuts.map((item, i) => {
            const Icon = item.icon;
            return (
              <GlassCard
                key={i}
                onClick={() => onNavigate(item.view)}
                className={`flex flex-col items-center justify-center gap-3 hover:bg-slate-800/80 cursor-pointer transition-all duration-300 ${isMobile ? 'p-4 h-32' : 'p-5 h-40'}`}
                hoverEffect={false}
              >
                <div className={`rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:scale-110 transition-transform duration-300 ${isMobile ? 'w-12 h-12' : 'w-14 h-14'}`}>
                  <Icon className="text-white" size={isMobile ? 24 : 28} />
                </div>
                <span className="text-slate-300 font-medium group-hover:text-white transition-colors text-center">{item.label}</span>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </div>
  );
}
