import { GlassCard } from '@/components/GlassCard';
import { Briefcase, Plus, Calendar, X, CheckCircle, Target, Trash2, AlertCircle, Clock } from 'lucide-react';
import { useData } from '@/context/DataProvider';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';

export function Projects() {
  const { projects, addProject, deleteProject, checkInProject, canCheckInToday } = useData();
  const [showForm, setShowForm] = useState(false);
  
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [errors, setErrors] = useState<{ name?: string; startDate?: string; endDate?: string }>({});

  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [customCheckinId, setCustomCheckinId] = useState<number | null>(null);
  const [customDate, setCustomDate] = useState("");

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = '请输入项目名称';
    if (!startDate) newErrors.startDate = '请选择开始日期';
    if (!endDate) newErrors.endDate = '请选择结束日期';
    if (startDate && endDate && new Date(endDate) <= new Date(startDate)) {
      newErrors.endDate = '结束日期必须晚于开始日期';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    addProject({ name: name.trim(), startDate, endDate });
    setShowForm(false);
    setName("");
    setStartDate("");
    setEndDate("");
    setErrors({});
  };

  const isTodayChecked = (checkIns: string[]) => {
    const today = new Date().toISOString().split('T')[0];
    return checkIns.includes(today);
  };

  const handleCustomCheckin = (projectId: number) => {
    if (!customDate) return;
    const today = new Date().toISOString().split('T')[0];
    if (customDate > today) return;
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    if (customDate < project.startDate || customDate > project.endDate) return;
    if (project.checkIns.includes(customDate)) return;
    checkInProject(projectId, customDate);
    setCustomCheckinId(null);
    setCustomDate("");
  };

  return (
    <div className="space-y-6 slide-up">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
          <span className="p-3 rounded-xl bg-slate-700/50 border border-slate-600/50">
            <Briefcase size={28} className="text-slate-300" />
          </span>
          长期事项
        </h2>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-5 py-2.5 rounded-xl transition-colors font-medium text-sm"
          aria-label={showForm ? "取消创建" : "新建项目"}
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? "取消" : "新建项目"}
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <GlassCard variant="paper" className="p-4 flex items-center gap-4">
          <div className="p-2 rounded-lg bg-purple-600/20">
            <Target size={20} className="text-purple-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{projects.length}</p>
            <p className="text-sm text-slate-400">进行中项目</p>
          </div>
        </GlassCard>
        <GlassCard variant="paper" className="p-4 flex items-center gap-4">
          <div className="p-2 rounded-lg bg-green-600/20">
            <CheckCircle size={20} className="text-green-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">
              {projects.reduce((acc, p) => acc + p.checkIns.length, 0)}
            </p>
            <p className="text-sm text-slate-400">总打卡天数</p>
          </div>
        </GlassCard>
        <GlassCard variant="paper" className="p-4 flex items-center gap-4">
          <div className="p-2 rounded-lg bg-amber-600/20">
            <Calendar size={20} className="text-amber-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">
              {projects.length > 0
                ? (projects.reduce((acc, p) => acc + p.progress, 0) / projects.length).toFixed(2)
                : '0.00'}%
            </p>
            <p className="text-sm text-slate-400">平均进度</p>
          </div>
        </GlassCard>
      </div>

      <AnimatePresence>
        {showForm && (
            <motion.div
                initial={{ scale: 0.3, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.3, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="origin-top"
            >
                <GlassCard variant="paper" className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <h3 className="text-lg font-medium text-white">创建新项目</h3>
                        <div>
                            <label htmlFor="proj-name" className="block text-sm text-slate-400 mb-1">项目名称</label>
                            <input 
                                id="proj-name"
                                value={name} onChange={e => { setName(e.target.value); if (e.target.value.trim()) setErrors(prev => ({ ...prev, name: undefined })); }}
                                className={cn(
                                  "w-full bg-slate-700/50 border rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none transition-colors",
                                  errors.name ? "border-red-500/50 focus:border-red-500" : "border-slate-600/50 focus:border-purple-500"
                                )}
                                placeholder="例如：考研复习"
                                aria-invalid={!!errors.name}
                                aria-describedby={errors.name ? "proj-name-error" : undefined}
                            />
                            <AnimatePresence>
                              {errors.name && (
                                <motion.p id="proj-name-error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-red-400 mt-1 flex items-center gap-1" role="alert">
                                  <AlertCircle size={12} /> {errors.name}
                                </motion.p>
                              )}
                            </AnimatePresence>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="proj-start" className="block text-sm text-slate-400 mb-1">开始日期</label>
                                <input 
                                    id="proj-start"
                                    type="date"
                                    value={startDate} onChange={e => { setStartDate(e.target.value); if (e.target.value) setErrors(prev => ({ ...prev, startDate: undefined })); }}
                                    className={cn(
                                      "w-full bg-slate-700/50 border rounded-lg px-3 py-2 text-white focus:outline-none transition-colors",
                                      errors.startDate ? "border-red-500/50 focus:border-red-500" : "border-slate-600/50 focus:border-purple-500"
                                    )}
                                    aria-invalid={!!errors.startDate}
                                />
                                <AnimatePresence>
                                  {errors.startDate && (
                                    <motion.p id="proj-start-error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-red-400 mt-1" role="alert">{errors.startDate}</motion.p>
                                  )}
                                </AnimatePresence>
                            </div>
                            <div>
                                <label htmlFor="proj-end" className="block text-sm text-slate-400 mb-1">结束日期</label>
                                <input 
                                    id="proj-end"
                                    type="date"
                                    value={endDate} onChange={e => { setEndDate(e.target.value); if (e.target.value) setErrors(prev => ({ ...prev, endDate: undefined })); }}
                                    className={cn(
                                      "w-full bg-slate-700/50 border rounded-lg px-3 py-2 text-white focus:outline-none transition-colors",
                                      errors.endDate ? "border-red-500/50 focus:border-red-500" : "border-slate-600/50 focus:border-purple-500"
                                    )}
                                    aria-invalid={!!errors.endDate}
                                    aria-describedby={errors.endDate ? "proj-end-error" : undefined}
                                />
                                <AnimatePresence>
                                  {errors.endDate && (
                                    <motion.p id="proj-end-error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-red-400 mt-1" role="alert">{errors.endDate}</motion.p>
                                  )}
                                </AnimatePresence>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <motion.button 
                              type="submit" 
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2.5 rounded-xl transition-colors font-medium text-sm"
                            >
                                创建项目
                            </motion.button>
                        </div>
                    </form>
                </GlassCard>
            </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {projects.map((project, index) => {
              const checkedToday = isTodayChecked(project.checkIns);
              const available = canCheckInToday(project.id);
              return (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, height: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <GlassCard variant="paper" className="p-5 flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-medium text-white">{project.name}</h3>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => setDeleteConfirmId(project.id)}
                          aria-label={`删除 ${project.name}`}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="bg-slate-700/50 px-2.5 py-1 rounded-lg text-xs text-slate-400 border border-slate-600/30 flex items-center gap-1">
                        <Calendar size={10} />
                        {project.startDate} → {project.endDate}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">进度</span>
                        <span className="font-medium text-purple-400 tabular-nums">{project.progress.toFixed(2)}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-700/50 rounded-full overflow-hidden">
                        <motion.div 
                          animate={{ width: `${project.progress}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className="h-full bg-purple-600 rounded-full"
                        />
                      </div>
                      <p className="text-xs text-slate-500">
                          已打卡 {project.checkIns.length} 天 · {project.checkIns.length > 0 ? `最近: ${project.checkIns[project.checkIns.length - 1]}` : '暂无打卡'}
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                          onClick={() => checkInProject(project.id)}
                          disabled={checkedToday || !available}
                          aria-label={checkedToday ? "今日已打卡" : available ? "打卡" : "不在日期范围内"}
                          className={cn(
                              "flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors font-medium text-sm",
                              checkedToday
                                  ? "bg-green-600/20 text-green-400 border border-green-500/30 cursor-default"
                                  : !available
                                    ? "bg-slate-700/30 text-slate-600 cursor-not-allowed"
                                    : "bg-purple-600 hover:bg-purple-500 text-white"
                          )}
                      >
                          {checkedToday ? (
                              <><CheckCircle size={16} /> 今日已打卡</>
                          ) : !available ? (
                              <><Calendar size={16} /> 未到项目日期</>
                          ) : (
                              <><CheckCircle size={16} /> 今日打卡</>
                          )}
                      </button>
                      <button
                        onClick={() => setCustomCheckinId(project.id)}
                        className="px-3 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors text-sm"
                        aria-label="选择其他日期打卡"
                        title="选择其他日期打卡"
                      >
                        <Clock size={16} />
                      </button>
                    </div>
                  </GlassCard>
                </motion.div>
              );
          })}
        </AnimatePresence>
        {projects.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="md:col-span-2 text-center py-12 text-slate-500"
            >
              <Briefcase size={48} className="mx-auto mb-3 text-slate-600" />
              <p className="text-sm">暂无长期项目，点击右上角新建。</p>
            </motion.div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmId !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overscroll-contain"
            onClick={() => setDeleteConfirmId(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-medium text-white mb-2">确认删除</h3>
              <p className="text-sm text-slate-400 mb-6">
                删除后所有打卡记录将丢失，此操作不可撤销。
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={() => { deleteProject(deleteConfirmId); setDeleteConfirmId(null); }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  确认删除
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Check-in Date Modal */}
      <AnimatePresence>
        {customCheckinId !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overscroll-contain"
            onClick={() => { setCustomCheckinId(null); setCustomDate(""); }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-medium text-white mb-2 flex items-center gap-2">
                <Calendar size={18} className="text-purple-400" />
                选择打卡日期
              </h3>
              <p className="text-sm text-slate-400 mb-4">
                选择项目的起止日期内的任意一天进行打卡。
              </p>
              <input
                type="date"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white mb-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus:border-purple-500"
                min={projects.find(p => p.id === customCheckinId)?.startDate}
                max={new Date().toISOString().split('T')[0]}
              />
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => { setCustomCheckinId(null); setCustomDate(""); }}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={() => handleCustomCheckin(customCheckinId)}
                  disabled={!customDate}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
                >
                  确认打卡
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}