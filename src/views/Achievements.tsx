import { motion } from 'framer-motion';
import { GlassCard } from '@/components/GlassCard';
import { Award, TrendingUp, Calendar, CheckSquare, Trophy, Star, Target } from 'lucide-react';
import { useData } from '@/context/DataProvider';

export function Achievements() {
  const { stats } = useData();

  const statCards = [
    { label: '任务完成数', value: stats.completedTodos.toString(), icon: CheckSquare, color: 'text-blue-400', bg: 'bg-blue-500/20', gradient: 'from-blue-500/20 to-blue-600/10', border: 'border-blue-500/20' },
    { label: '平均项目进度', value: `${stats.avgProjectProgress}%`, icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-500/20', gradient: 'from-green-500/20 to-green-600/10', border: 'border-green-500/20' },
    { label: '习惯打卡次数', value: `${stats.habitStreak} 次`, icon: Award, color: 'text-purple-400', bg: 'bg-purple-500/20', gradient: 'from-purple-500/20 to-purple-600/10', border: 'border-purple-500/20' },
    { label: '日程事件数', value: stats.todayEvents.toString(), icon: Calendar, color: 'text-orange-400', bg: 'bg-orange-500/20', gradient: 'from-orange-500/20 to-orange-600/10', border: 'border-orange-500/20' },
  ];

  return (
    <div className="space-y-8 slide-up">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <h2 className="text-3xl font-bold gradient-text flex items-center gap-3">
          <span className="p-3 rounded-xl bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border border-yellow-500/20">
            <Trophy size={28} className="text-yellow-400" />
          </span>
          我的成就
        </h2>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <GlassCard variant="glow" delay={i * 0.1} className="p-5 flex items-center gap-4">
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 10 }}
                className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} border ${stat.border}`}
              >
                <stat.icon size={24} className={stat.color} />
              </motion.div>
              <div>
                <div className="text-2xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Achievement Badges */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
          <Star size={20} className="text-amber-400" />
          成就徽章
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: '初次使用', desc: '欢迎来到 Explore OS', icon: Star, color: 'from-blue-400 to-cyan-400', unlocked: true },
            { name: '任务达人', desc: '完成10个任务', icon: CheckSquare, color: 'from-green-400 to-emerald-400', unlocked: stats.completedTodos >= 10 },
            { name: '项目先锋', desc: '项目进度达到50%', icon: Target, color: 'from-purple-400 to-pink-400', unlocked: stats.avgProjectProgress >= 50 },
            { name: '习惯大师', desc: '连续打卡7天', icon: Award, color: 'from-amber-400 to-orange-400', unlocked: stats.habitStreak >= 7 },
          ].map((badge, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.1 }}
            >
              <GlassCard 
                variant={badge.unlocked ? 'glow' : 'default'} 
                delay={0.4 + i * 0.1}
                className={`p-5 flex flex-col items-center justify-center text-center gap-3 ${!badge.unlocked && 'opacity-50'}`}
              >
                <motion.div 
                  whileHover={badge.unlocked ? { scale: 1.2, rotate: 10 } : {}}
                  className={`p-3 rounded-full bg-gradient-to-br ${badge.color} ${badge.unlocked ? 'shadow-lg' : 'grayscale'}`}
                >
                  <badge.icon size={28} className="text-white" />
                </motion.div>
                <div>
                  <h4 className="font-semibold text-white">{badge.name}</h4>
                  <p className="text-xs text-slate-400 mt-1">{badge.desc}</p>
                </div>
                {badge.unlocked && (
                  <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-300 rounded-full border border-green-500/30">已解锁</span>
                )}
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Sub-modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard variant="glow" delay={0.7} className="p-6 flex flex-col items-center justify-center text-center space-y-4 border-t-4 border-t-blue-500">
             <motion.div 
               whileHover={{ scale: 1.1, rotate: -10 }}
               className="p-4 rounded-full bg-blue-500/10 text-blue-400"
             >
                <CheckSquare size={32} />
             </motion.div>
             <h3 className="text-xl font-semibold text-white">待办与项目</h3>
             <p className="text-slate-400 text-sm px-6">
                 {stats.completedTodos === 0 
                    ? "暂无已完成任务。开启您的高效一天吧！" 
                    : `您已完成 ${stats.completedTodos} 个任务，项目平均进度 ${stats.avgProjectProgress}%。`}
             </p>
          </GlassCard>

          <GlassCard variant="glow" delay={0.8} className="p-6 flex flex-col items-center justify-center text-center space-y-4 border-t-4 border-t-pink-500">
             <motion.div 
               whileHover={{ scale: 1.1, rotate: 10 }}
               className="p-4 rounded-full bg-pink-500/10 text-pink-400"
             >
                <Award size={32} />
             </motion.div>
             <h3 className="text-xl font-semibold text-white">生活手账记录</h3>
             <p className="text-slate-400 text-sm px-6">
                本周已打卡 {stats.habitStreak} 次。坚持记录生活，发现更多美好。
             </p>
          </GlassCard>

          <GlassCard variant="glow" delay={0.9} className="p-6 flex flex-col items-center justify-center text-center space-y-4 border-t-4 border-t-orange-500">
             <motion.div 
               whileHover={{ scale: 1.1, rotate: -10 }}
               className="p-4 rounded-full bg-orange-500/10 text-orange-400"
             >
                <Calendar size={32} />
             </motion.div>
             <h3 className="text-xl font-semibold text-white">日程回顾</h3>
             <p className="text-slate-400 text-sm px-6">
                {stats.todayEvents === 0 ? "暂无日程安排。" : `您有 ${stats.todayEvents} 个日程安排。请合理安排时间。`}
             </p>
          </GlassCard>
      </div>
    </div>
  );
}
