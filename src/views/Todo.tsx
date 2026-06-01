import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/GlassCard';
import { Plus, Check, AlertCircle, Calendar, Trash2, Flag, Clock, ListChecks, X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useData } from '@/context/DataProvider';

export function Todo() {
  const { todos, addTodo, toggleTodo, deleteTodo } = useData();
  const [showForm, setShowForm] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);
  const [errors, setErrors] = useState<{ text?: string; date?: string }>({});

  const validate = () => {
    const newErrors: { text?: string; date?: string } = {};
    if (!inputValue.trim()) {
      newErrors.text = '请输入任务名称';
    }
    if (!dueDate) {
      newErrors.date = '请选择截止日期';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddTodo = () => {
    if (!validate()) return;
    addTodo(inputValue.trim(), isUrgent, dueDate);
    setInputValue("");
    setDueDate("");
    setIsUrgent(false);
    setErrors({});
    setShowForm(false);
  };

  const pendingTodos = todos.filter(t => !t.completed);
  const completedTodos = todos.filter(t => t.completed);

  return (
    <div className="space-y-6 slide-up">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
          <span className="p-3 rounded-xl bg-slate-700/50 border border-slate-600/50">
            <ListChecks size={28} className="text-slate-300" />
          </span>
          待办事项
        </h2>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => { setShowForm(!showForm); setErrors({}); }}
          className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-5 py-2.5 rounded-xl transition-colors font-medium text-sm"
          aria-label={showForm ? "取消添加" : "添加新任务"}
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? "取消" : "新建任务"}
        </motion.button>
      </motion.div>

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
              <h3 className="text-lg font-medium text-white mb-4">新建任务</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="todo-text" className="block text-sm text-slate-400 mb-1">任务名称</label>
                  <input
                    id="todo-text"
                    type="text"
                    value={inputValue}
                    onChange={(e) => { setInputValue(e.target.value); if (e.target.value.trim()) setErrors(prev => ({ ...prev, text: undefined })); }}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
                    placeholder="输入任务内容..."
                    aria-invalid={!!errors.text}
                    aria-describedby={errors.text ? "todo-text-error" : undefined}
                    className={cn(
                      "w-full bg-slate-700/50 border rounded-lg px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none transition-colors",
                      errors.text ? "border-red-500/50 focus:border-red-500" : "border-slate-600/50 focus:border-teal-500"
                    )}
                  />
                  <AnimatePresence>
                    {errors.text && (
                      <motion.p 
                        id="todo-text-error"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-red-400 mt-1 flex items-center gap-1"
                        role="alert"
                      >
                        <AlertCircle size={12} /> {errors.text}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
                
                <div>
                  <label htmlFor="todo-date" className="block text-sm text-slate-400 mb-1">截止日期</label>
                  <div className="flex items-center bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 max-w-[220px]">
                    <Calendar size={16} className="text-slate-400 mr-2 shrink-0" aria-hidden="true" />
                    <input 
                      id="todo-date"
                      type="date"
                      value={dueDate}
                      onChange={(e) => { setDueDate(e.target.value); if (e.target.value) setErrors(prev => ({ ...prev, date: undefined })); }}
                      aria-invalid={!!errors.date}
                      aria-describedby={errors.date ? "todo-date-error" : undefined}
                      className="bg-transparent border-none text-sm text-white focus:ring-0 outline-none w-full"
                    />
                  </div>
                  <AnimatePresence>
                    {errors.date && (
                      <motion.p 
                        id="todo-date-error"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-red-400 mt-1 flex items-center gap-1"
                        role="alert"
                      >
                        <AlertCircle size={12} /> {errors.date}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div>
                  <span className="block text-sm text-slate-400 mb-2">优先级</span>
                  <div className="flex bg-slate-700/50 p-1 rounded-lg border border-slate-600/50 w-fit">
                    <button
                      onClick={() => setIsUrgent(false)}
                      aria-label="一般优先级"
                      aria-pressed={!isUrgent}
                      className={cn(
                        "px-4 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5",
                        !isUrgent 
                          ? "bg-teal-600 text-white" 
                          : "text-slate-400 hover:text-white"
                      )}
                    >
                      <Flag size={14} /> 一般
                    </button>
                    <button
                      onClick={() => setIsUrgent(true)}
                      aria-label="紧急优先级"
                      aria-pressed={isUrgent}
                      className={cn(
                        "px-4 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5",
                        isUrgent 
                          ? "bg-red-600 text-white" 
                          : "text-slate-400 hover:text-white"
                      )}
                    >
                      <AlertCircle size={14} /> 紧急
                    </button>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddTodo}
                    className="bg-teal-600 hover:bg-teal-500 text-white px-6 py-2.5 rounded-xl transition-colors flex items-center gap-2 font-medium text-sm"
                  >
                    <Plus size={18} /> 添加任务
                  </motion.button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Clock size={14} className="text-slate-500" />
          <span>待办 {pendingTodos.length}</span>
          <span className="text-slate-600">|</span>
          <Check size={14} className="text-slate-500" />
          <span>完成 {completedTodos.length}</span>
        </div>
        
        <AnimatePresence mode="popLayout">
          <div className="space-y-2">
            {pendingTodos.map((todo, index) => (
              <motion.div
                key={todo.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ delay: index * 0.03 }}
              >
                <GlassCard 
                  variant="paper"
                  className={cn(
                    "flex items-center gap-3 p-4 border-l-2",
                    todo.urgent ? "border-l-red-500" : "border-l-teal-500"
                  )}
                  hoverEffect={false}
                >
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    aria-label={`标记 "${todo.text}" 为完成`}
                    className="w-5 h-5 rounded-full border-2 border-slate-500 hover:border-teal-400 flex items-center justify-center transition-colors shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-slate-200 truncate block">{todo.text}</span>
                    {todo.dueDate && (
                      <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <Calendar size={10} /> {todo.dueDate}
                      </span>
                    )}
                  </div>
                  {todo.urgent && (
                    <span className="text-xs px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 shrink-0 flex items-center gap-1">
                      <AlertCircle size={10} /> 紧急
                    </span>
                  )}
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    aria-label={`删除 "${todo.text}"`}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0"
                  >
                    <Trash2 size={16} />
                  </button>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
        {pendingTodos.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-slate-500"
          >
            <Check size={40} className="mx-auto mb-3 text-slate-600" />
            <p>暂无待办任务</p>
          </motion.div>
        )}
      </div>

      {completedTodos.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-700/50">
          <h3 className="text-sm font-medium text-slate-500 flex items-center gap-1.5">
            <Check size={14} className="text-green-500" />
            已完成 ({completedTodos.length})
          </h3>
          <div className="space-y-2">
            {completedTodos.map((todo) => (
              <GlassCard 
                key={todo.id}
                variant="paper"
                className="flex items-center gap-3 p-4 opacity-60 border-l-2 border-l-slate-600"
                hoverEffect={false}
              >
                <button
                  onClick={() => toggleTodo(todo.id)}
                  aria-label={`撤销 "${todo.text}" 的完成状态`}
                  className="w-5 h-5 rounded-full bg-teal-600/30 border-2 border-teal-500 text-teal-500 flex items-center justify-center shrink-0"
                >
                  <Check size={12} strokeWidth={3} />
                </button>
                <span className="flex-1 text-slate-500 line-through truncate">{todo.text}</span>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  aria-label={`删除 "${todo.text}"`}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0"
                >
                  <Trash2 size={16} />
                </button>
              </GlassCard>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
