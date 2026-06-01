import { GlassCard } from '@/components/GlassCard';
import { Clock, CheckCircle2, TrendingUp, CalendarPlus, Briefcase, BookOpen, Calendar, CheckSquare, Trophy, Grid, BarChart3, Sun, Moon, Timer } from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { useData } from '@/context/DataProvider';
import { ViewType } from '@/components/Sidebar';
import { useDeviceDetector } from '@/utils/useDeviceDetector';
import { motion } from 'framer-motion';

interface HomeProps {
    onNavigate: (view: ViewType) => void;
}

export function Home({ onNavigate }: HomeProps) {
  const { stats, themeMode, installedApps } = useData();
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

  const getGreetingIcon = () => {
    const hour = now.getHours();
    if (hour >= 6 && hour < 12) return <Sun size={28} className="text-amber-400" />;
    if (hour >= 12 && hour < 18) return <Sun size={28} className="text-orange-400" />;
    return <Moon size={28} className="text-indigo-400" />;
  };

  const shortcuts = [
    { label: '待办事项', icon: CheckSquare, view: 'todo' as ViewType },
    { label: '项目管理', icon: Briefcase, view: 'projects' as ViewType },
    { label: '日程安排', icon: Calendar, view: 'calendar' as ViewType },
    { label: '生活手账', icon: BookOpen, view: 'journal' as ViewType },
    { label: '成就系统', icon: Trophy, view: 'achievements' as ViewType },
    { label: '番茄时钟', icon: Timer, view: 'pomodoro' as ViewType, requiresInstall: true },
    { label: '应用中心', icon: Grid, view: 'apps' as ViewType },
  ].filter(item => !item.requiresInstall || installedApps?.includes(item.id));

  return (
    <div className="space-y-6 slide-up">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`relative overflow-hidden rounded-2xl ${isMobile ? 'p-5' : 'p-8'} bg-slate-800 border border-slate-700/50 shadow-lg`}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {getGreetingIcon()}
              <h1 className={`font-semibold text-white ${isMobile ? 'text-2xl' : 'text-4xl'}`}>
                {getGreeting()}
              </h1>
            </div>
            <p className="text-slate-400">这是您今天的概览，祝您工作顺利。</p>
            <div className="flex items-center gap-1.5 text-sm text-slate-500">
              <Clock size={14} />
              <span>今日有 {stats.todayEvents} 个日程安排</span>
            </div>
          </div>
          
          <div className="text-right space-y-1">
            <h2 className={`font-mono font-bold text-white ${isMobile ? 'text-3xl' : 'text-5xl'} tabular-nums`}>{format(now, 'HH:mm')}</h2>
            <p className="text-sm text-slate-400">{format(now, 'yyyy年M月d日 EEEE', { locale: zhCN })}</p>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-4">
        <div className={`grid gap-4 ${isMobile ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-4'}`}>
          <GlassCard variant="paper" delay={0.1} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">已完成任务</p>
                <p className="text-2xl font-bold text-white mt-1 tabular-nums">{stats.completedTodos}</p>
              </div>
              <div className="p-2 rounded-lg bg-green-600/20">
                <CheckCircle2 size={22} className="text-green-400" />
              </div>
            </div>
          </GlassCard>
          
          <GlassCard variant="paper" delay={0.2} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">项目平均进度</p>
                <p className="text-2xl font-bold text-white mt-1 tabular-nums">{stats.avgProjectProgress}%</p>
              </div>
              <div className="p-2 rounded-lg bg-blue-600/20">
                <TrendingUp size={22} className="text-blue-400" />
              </div>
            </div>
          </GlassCard>

          <GlassCard variant="paper" delay={0.3} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">日程总数</p>
                <p className="text-2xl font-bold text-white mt-1 tabular-nums">{stats.totalEvents}</p>
              </div>
              <div className="p-2 rounded-lg bg-purple-600/20">
                <CalendarPlus size={22} className="text-purple-400" />
              </div>
            </div>
          </GlassCard>

          <GlassCard variant="paper" delay={0.4} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">习惯打卡</p>
                <p className="text-2xl font-bold text-white mt-1 tabular-nums">{stats.habitStreak}/7</p>
              </div>
              <div className="p-2 rounded-lg bg-amber-600/20">
                <BarChart3 size={22} className="text-amber-400" />
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-medium text-white flex items-center gap-2">
          <Grid size={18} className="text-slate-400" />
          快速访问
        </h3>
        
        <div className={`grid gap-3 ${isMobile ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7'}`}>
          {shortcuts.map((item, i) => {
            const Icon = item.icon;
            return (
              <GlassCard
                key={i}
                onClick={() => onNavigate(item.view)}
                variant="paper"
                className={`flex flex-col items-center justify-center gap-2 cursor-pointer ${isMobile ? 'p-3 h-24' : 'p-4 h-28'}`}
                hoverEffect={true}
                delay={0.1 + i * 0.05}
              >
                <div className="rounded-lg bg-slate-700/50 p-2.5">
                  <Icon className="text-slate-300" size={22} />
                </div>
                <span className="text-slate-400 hover:text-white transition-colors text-center text-xs">{item.label}</span>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </div>
  );
}
