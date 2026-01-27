import { GlassCard } from '@/components/GlassCard';
import { Clock, CheckCircle2, TrendingUp, StickyNote, CalendarPlus, Briefcase, BookOpen, Play } from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { useData } from '@/context/DataProvider';
import { ViewType } from '@/components/Sidebar';

interface HomeProps {
    onNavigate: (view: ViewType) => void;
}

export function Home({ onNavigate }: HomeProps) {
  const { stats } = useData();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000); 
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = now.getHours();
    if (hour >= 6 && hour < 12) return "上午好";
    if (hour >= 12 && hour < 18) return "下午好";
    return "晚上好";
  };

  const shortcuts = [
      { label: '添加日程', icon: CalendarPlus, view: 'calendar' as ViewType },
      { label: '生活手账', icon: BookOpen, view: 'journal' as ViewType },
      { label: '新建笔记', icon: StickyNote, view: 'journal' as ViewType }, // Maps to Journal
      { label: '我的项目', icon: Briefcase, view: 'projects' as ViewType },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
        <div>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-white mb-2">
                {getGreeting()}
            </h1>
            <p className="text-slate-300">这是您今天的概览。</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Focus / Time */}
          <GlassCard className="lg:col-span-2 p-8 relative overflow-hidden flex flex-col justify-between min-h-[240px]">
             <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/20 rounded-full blur-[80px] -mr-16 -mt-16 pointer-events-none" />
             
             <div className="relative z-10">
                 <h2 className="text-6xl font-bold text-white tracking-tighter mb-2">{format(now, 'HH:mm')}</h2>
                 <p className="text-xl text-teal-200">{format(now, 'yyyy年M月d日 EEEE', { locale: zhCN })}</p>
             </div>

             <div className="relative z-10 mt-8">
                <h3 className="text-sm uppercase tracking-widest text-slate-400 mb-3">当前专注</h3>
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                    <div className="p-3 bg-teal-500 rounded-lg shadow-lg shadow-teal-500/40 group-hover:scale-110 transition-transform">
                        <Clock className="text-white" size={24} />
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold text-white">产品设计评审</h4>
                        <p className="text-slate-400 text-sm">14:00 - 15:30 • 会议室 A</p>
                    </div>
                    <div className="ml-auto">
                        <span className="px-3 py-1 bg-teal-500/20 text-teal-300 text-xs rounded-full border border-teal-500/30 flex items-center gap-1">
                            <Play size={10} fill="currentColor" /> 进行中
                        </span>
                    </div>
                </div>
             </div>
          </GlassCard>

          {/* Quick Stats / Right Col */}
          <div className="space-y-6">
              <GlassCard className="p-5 flex items-center justify-between">
                  <div>
                      <p className="text-slate-400 text-sm mb-1">已完成任务</p>
                      <p className="text-2xl font-bold text-white">{stats.completedTodos}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                      <CheckCircle2 size={24} />
                  </div>
              </GlassCard>
               <GlassCard className="p-5 flex items-center justify-between">
                  <div>
                      <p className="text-slate-400 text-sm mb-1">项目平均进度</p>
                      <p className="text-2xl font-bold text-white">{stats.avgProjectProgress}%</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                      <TrendingUp size={24} />
                  </div>
              </GlassCard>
          </div>
      </div>

      {/* Shortcuts grid */}
      <h3 className="text-lg font-semibold text-white mt-8 mb-4">快速访问</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {shortcuts.map((item, i) => (
              <GlassCard 
                  key={i} 
                  onClick={() => onNavigate(item.view)}
                  className="p-4 flex flex-col items-center justify-center gap-3 hover:bg-white/10 hover:border-teal-500/30 cursor-pointer h-32 group transition-all" 
                  hoverEffect={false}
              >
                  <div className="w-12 h-12 rounded-full bg-slate-700/50 flex items-center justify-center group-hover:bg-teal-500/20 transition-colors">
                      <item.icon className="text-slate-300 group-hover:text-teal-300 transition-colors" size={24} />
                  </div>
                  <span className="text-slate-300 font-medium group-hover:text-white transition-colors">{item.label}</span>
              </GlassCard>
          ))}
      </div>
    </div>
  );
}
