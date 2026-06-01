import { GlassCard } from '@/components/GlassCard';
import { BookOpen, CheckCircle2, Plus, Heart, Star, Coffee } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useData } from '@/context/DataProvider';
import { useState } from 'react';
import { startOfWeek, addDays, isSameDay, format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';

export function Journal() {
  const { habits, toggleHabit, addHabit, timeline, addTimelineEntry, weeklyCheckins, toggleWeeklyCheckin } = useData();
  
  const [time, setTime] = useState("");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const [newHabit, setNewHabit] = useState("");

  const handleAddTimeline = () => {
      if(!title) return;
      addTimelineEntry({ time: time || "00:00", title, desc });
      setTime(""); setTitle(""); setDesc("");
  };

  const handleAddHabit = () => {
      if(!newHabit) return;
      addHabit(newHabit);
      setNewHabit("");
  };

  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });

  return (
    <div className="space-y-6 slide-up">
      <motion.h2 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-3xl font-bold gradient-text flex items-center gap-3"
      >
        <span className="p-3 rounded-xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/20">
            <BookOpen size={28} className="text-pink-400" />
        </span>
        生活手账
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Mood & Timeline */}
        <div className="space-y-6">
            {/* Today's Mood */}
            <GlassCard variant="glow" delay={0.1} className="p-6 flex flex-col items-center justify-center text-center space-y-4 bg-gradient-to-br from-pink-500/10 to-purple-500/10 border-pink-500/20">
                <h3 className="text-lg font-semibold text-pink-200">今日心情</h3>
                <div className="flex gap-4">
                  {['😊', '😄', '🥰', '😌', '😔', '😤'].map((emoji, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.3 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-4xl cursor-pointer"
                    >
                      {emoji}
                    </motion.button>
                  ))}
                </div>
                <input 
                    type="text" 
                    placeholder="写下你的心情..." 
                    className="bg-transparent text-center text-slate-300 italic w-full focus:outline-none border-b border-transparent focus:border-pink-300/30 transition-all" 
                />
            </GlassCard>

             <GlassCard variant="glow" delay={0.2} className="p-6 h-[400px] flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                      <Coffee size={20} className="text-pink-400" />
                      时间轴
                    </h3>
                    <div className="flex gap-2">
                         <input value={time} onChange={e=>setTime(e.target.value)} type="time" className="bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-white text-sm focus:outline-none focus:border-pink-400 transition-all" />
                         <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="事件" className="bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-white text-sm w-24 focus:outline-none focus:border-pink-400 transition-all" />
                         <motion.button 
                           whileHover={{ scale: 1.1 }}
                           whileTap={{ scale: 0.9 }}
                           onClick={handleAddTimeline} 
                           className="bg-pink-500/20 hover:bg-pink-500/40 text-pink-300 rounded-lg p-1.5 transition-all"
                         >
                           <Plus size={16} />
                         </motion.button>
                    </div>
                </div>
                
                <div className="relative border-l-2 border-white/10 ml-3 space-y-8 overflow-y-auto pr-2 flex-1">
                    {timeline.length === 0 && <p className="text-slate-500 text-sm italic pl-8">暂无记录，添加你的第一个时刻吧。</p>}
                    <AnimatePresence mode="popLayout">
                    {timeline.map((item, idx) => (
                        <motion.div 
                          key={idx} 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: idx * 0.05 }}
                          className="relative pl-8 group"
                        >
                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 border-4 border-slate-800 shadow-[0_0_10px_rgba(236,72,153,0.5)] group-hover:scale-125 transition-transform" />
                            <span className="text-sm text-pink-300 font-mono mb-1 block">{item.time}</span>
                            <h4 className="text-lg font-medium text-white">{item.title}</h4>
                            <p className="text-slate-400 text-sm">{item.desc}</p>
                        </motion.div>
                    ))}
                    </AnimatePresence>
                </div>
            </GlassCard>
        </div>

        {/* Right Column - Weekly & Habits */}
        <div className="space-y-6">
             <GlassCard variant="glow" delay={0.3} className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Star size={18} className="text-amber-400" />
                  本周打卡
                </h3>
                <div className="grid grid-cols-7 gap-3">
                    {Array.from({ length: 7 }).map((_, i) => {
                        const date = addDays(weekStart, i);
                        const isToday = isSameDay(date, today);
                        const dayName = format(date, 'EE', { locale: zhCN });

                        return (
                            <div key={i} className="text-center space-y-2">
                                <div className={cn("text-xs", isToday ? "text-pink-300 font-bold" : "text-slate-400")}>
                                    {dayName}
                                </div>
                                <motion.button 
                                    whileHover={isToday ? { scale: 1.1 } : {}}
                                    whileTap={isToday ? { scale: 0.9 } : {}}
                                    onClick={() => toggleWeeklyCheckin(i)}
                                    disabled={!isToday}
                                    className={cn(
                                        "w-10 h-10 rounded-lg mx-auto transition-all flex items-center justify-center",
                                        weeklyCheckins[i] 
                                            ? "bg-gradient-to-r from-green-500 to-emerald-500 shadow-[0_0_8px_rgba(34,197,94,0.4)] text-white" 
                                            : "bg-white/5 border border-white/10",
                                        isToday && !weeklyCheckins[i] && "hover:bg-white/20 cursor-pointer animate-pulse border-pink-500/50",
                                        !isToday && "opacity-50 cursor-not-allowed"
                                    )} 
                                >
                                   {weeklyCheckins[i] && <CheckCircle2 size={16} />}
                                </motion.button>
                            </div>
                        );
                    })}
                </div>
                <p className="text-xs text-slate-500 mt-4 text-center">只能进行当日打卡，保持连续性！</p>
            </GlassCard>

            <GlassCard variant="glow" delay={0.4} className="p-6">
                <div className="flex justify-between items-center mb-4">
                     <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                       <Heart size={18} className="text-red-400" />
                       每日习惯清单
                     </h3>
                     <div className="flex gap-2">
                        <input value={newHabit} onChange={e=>setNewHabit(e.target.value)} placeholder="新习惯..." className="bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-green-400 transition-all" />
                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={handleAddHabit} 
                          className="text-green-400 hover:text-green-300 transition-colors"
                        >
                          <Plus size={16} />
                        </motion.button>
                     </div>
                </div>
                
                <div className="space-y-3">
                    {habits.length === 0 && <p className="text-slate-500 text-sm">暂无习惯。</p>}
                    <AnimatePresence mode="popLayout">
                    {habits.map((habit, idx) => (
                         <motion.div 
                             key={habit.id} 
                             initial={{ opacity: 0, x: -10 }}
                             animate={{ opacity: 1, x: 0 }}
                             exit={{ opacity: 0, x: 10 }}
                             transition={{ delay: idx * 0.05 }}
                             onClick={() => toggleHabit(habit.id)}
                             className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                         >
                            <span className={habit.completed ? "text-slate-500 line-through" : "text-slate-200"}>{habit.name}</span>
                            <CheckCircle2 className={habit.completed ? "text-green-400" : "text-slate-600"} />
                        </motion.div>
                    ))}
                    </AnimatePresence>
                </div>
            </GlassCard>
        </div>
      </div>
    </div>
  );
}
