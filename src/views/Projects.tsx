import { GlassCard } from '@/components/GlassCard';
import { Briefcase, Plus, Calendar, X, CheckCircle } from 'lucide-react';
import { useData } from '@/context/DataProvider';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';

export function Projects() {
  const { projects, addProject, checkInProject } = useData();
  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !startDate || !endDate) return;
    
    addProject({ name, startDate, endDate });
    setShowForm(false);
    setName("");
    setStartDate("");
    setEndDate("");
  };

  const isTodayChecked = (checkIns: string[]) => {
    const today = new Date().toISOString().split('T')[0];
    return checkIns.includes(today);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <span className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300">
                <Briefcase size={28} />
            </span>
            长期事项
        </h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-500/30 transition-all hover:scale-105 active:scale-95 font-medium"
        >
          {showForm ? <X size={20} /> : <Plus size={20} />}
          {showForm ? "取消" : "新建项目"}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
            >
                <GlassCard className="p-6 mb-6 border-indigo-500/30">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">项目名称</label>
                            <input 
                                value={name} onChange={e => setName(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-400"
                                placeholder="例如：考研复习"
                                required 
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">开始日期</label>
                                <input 
                                    type="date"
                                    value={startDate} onChange={e => setStartDate(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-400"
                                    required 
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">结束日期</label>
                                <input 
                                    type="date"
                                    value={endDate} onChange={e => setEndDate(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-400"
                                    required 
                                />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg shadow-lg shadow-indigo-500/20">
                                创建项目
                            </button>
                        </div>
                    </form>
                </GlassCard>
            </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => {
            const checkedToday = isTodayChecked(project.checkIns);
            return (
              <GlassCard key={project.id} className="p-6 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold text-white">{project.name}</h3>
                  <div className="bg-white/5 px-3 py-1 rounded-lg text-xs text-indigo-200 border border-indigo-500/30 flex items-center gap-1">
                    <Calendar size={12} />
                    {project.endDate} 截止
                  </div>
                </div>

                <div className="space-y-2 mt-2">
                  <div className="flex justify-between text-sm text-slate-300">
                    <span>进度</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="h-3 w-full bg-slate-700/50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 text-right">
                      {project.startDate} 至 {project.endDate} • 已打卡 {project.checkIns.length} 天
                  </p>
                </div>
                
                <button
                    onClick={() => checkInProject(project.id)}
                    disabled={checkedToday}
                    className={cn(
                        "mt-2 w-full py-3 rounded-xl flex items-center justify-center gap-2 transition-all font-medium border",
                        checkedToday
                            ? "bg-green-500/20 border-green-500/30 text-green-400 cursor-default"
                            : "bg-indigo-600/80 hover:bg-indigo-500 border-indigo-500/30 text-white shadow-lg shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98]"
                    )}
                >
                    {checkedToday ? (
                        <>
                            <CheckCircle size={18} /> 今日已打卡
                        </>
                    ) : (
                        <>
                            <CheckCircle size={18} /> 今日打卡
                        </>
                    )}
                </button>
              </GlassCard>
            );
        })}
        {projects.length === 0 && (
            <div className="md:col-span-2 text-center py-12 text-slate-500 italic">
                暂无长期项目，点击右上角新建。
            </div>
        )}
      </div>
    </div>
  );
}
