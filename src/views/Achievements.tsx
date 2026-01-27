import { GlassCard } from '@/components/GlassCard';
import { Award, TrendingUp, Calendar, CheckSquare } from 'lucide-react';
import { useData } from '@/context/DataProvider';

export function Achievements() {
  const { stats } = useData();

  const statCards = [
    { label: '任务完成数', value: stats.completedTodos.toString(), icon: CheckSquare, color: 'text-blue-400', bg: 'bg-blue-500/20' },
    { label: '平均项目进度', value: `${stats.avgProjectProgress}%`, icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-500/20' },
    { label: '习惯打卡次数', value: `${stats.habitStreak} 次`, icon: Award, color: 'text-purple-400', bg: 'bg-purple-500/20' },
    { label: '日程事件数', value: stats.totalEvents.toString(), icon: Calendar, color: 'text-orange-400', bg: 'bg-orange-500/20' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-3xl font-bold text-white flex items-center gap-3 mb-6">
        <span className="p-2 rounded-lg bg-yellow-500/20 text-yellow-300">
            <Award size={28} />
        </span>
        我的成就
      </h2>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
            <GlassCard key={i} className="p-4 flex items-center gap-4 hover:scale-105">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                    <stat.icon size={24} />
                </div>
                <div>
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-slate-400">{stat.label}</div>
                </div>
            </GlassCard>
        ))}
      </div>

      {/* Sub-modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard className="p-6 h-64 flex flex-col items-center justify-center text-center space-y-4 border-t-4 border-t-blue-500">
             <div className="p-4 rounded-full bg-blue-500/10 text-blue-400">
                <CheckSquare size={32} />
             </div>
             <h3 className="text-xl font-semibold text-white">待办与项目</h3>
             <p className="text-slate-400 text-sm px-6">
                 {stats.completedTodos === 0 
                    ? "暂无已完成任务。开启您的高效一天吧！" 
                    : `您已完成 ${stats.completedTodos} 个任务，项目平均进度 ${stats.avgProjectProgress}%。`}
             </p>
          </GlassCard>

          <GlassCard className="p-6 h-64 flex flex-col items-center justify-center text-center space-y-4 border-t-4 border-t-pink-500">
             <div className="p-4 rounded-full bg-pink-500/10 text-pink-400">
                <Award size={32} />
             </div>
             <h3 className="text-xl font-semibold text-white">生活手账记录</h3>
             <p className="text-slate-400 text-sm px-6">
                本周已打卡 {stats.habitStreak} 次。坚持记录生活，发现更多美好。
             </p>
          </GlassCard>

          <GlassCard className="p-6 h-64 flex flex-col items-center justify-center text-center space-y-4 border-t-4 border-t-orange-500">
             <div className="p-4 rounded-full bg-orange-500/10 text-orange-400">
                <Calendar size={32} />
             </div>
             <h3 className="text-xl font-semibold text-white">日程回顾</h3>
             <p className="text-slate-400 text-sm px-6">
                {stats.totalEvents === 0 ? "暂无日程安排。" : `您有 ${stats.totalEvents} 个日程安排。请合理安排时间。`}
             </p>
          </GlassCard>
      </div>
    </div>
  );
}
