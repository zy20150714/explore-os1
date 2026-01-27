import { useState } from 'react';
import { GlassCard } from '@/components/GlassCard';
import { Plus, Check, AlertCircle, Calendar } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useData } from '@/context/DataProvider';

export function Todo() {
  const { todos, addTodo, toggleTodo } = useData();
  const [inputValue, setInputValue] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);

  const handleAddTodo = () => {
    if (!inputValue.trim()) return;
    addTodo(inputValue, isUrgent, dueDate || undefined);
    setInputValue("");
    setDueDate("");
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
        <span className="p-2 rounded-lg bg-teal-500/20 text-teal-300">
          <Check size={28} />
        </span>
        待办事项清单
      </h2>

      <GlassCard className="p-6">
        <div className="flex flex-col gap-4">
             <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
                    placeholder="添加新任务..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-teal-500/50 focus:bg-white/10 transition-all"
                />
                
                {/* Priority Toggle Segmented Control */}
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 shrink-0">
                    <button
                    onClick={() => setIsUrgent(false)}
                    className={cn(
                        "px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
                        !isUrgent 
                        ? "bg-teal-500 text-white shadow-lg shadow-teal-500/20" 
                        : "text-slate-400 hover:text-white"
                    )}
                    >
                    一般
                    </button>
                    <button
                    onClick={() => setIsUrgent(true)}
                    className={cn(
                        "px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
                        isUrgent 
                        ? "bg-red-500 text-white shadow-lg shadow-red-500/20" 
                        : "text-slate-400 hover:text-white"
                    )}
                    >
                    <AlertCircle size={14} />
                    紧急
                    </button>
                </div>
            </div>
            
            <div className="flex justify-between items-center">
                 <div className="flex items-center bg-white/5 rounded-lg border border-white/10 px-3 py-1.5 w-auto max-w-[200px]">
                     <Calendar size={16} className="text-slate-400 mr-2" />
                     <input 
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="bg-transparent border-none text-sm text-white focus:ring-0 outline-none w-full"
                     />
                 </div>

                <button
                    onClick={handleAddTodo}
                    className="bg-teal-500 hover:bg-teal-400 text-white px-6 py-2 rounded-xl shadow-lg shadow-teal-500/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                >
                    <Plus size={20} /> 添加
                </button>
            </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 gap-8">
        {/* Pending Tasks */}
        <div className="space-y-4">
             <h3 className="text-lg font-medium text-slate-300 border-b border-white/10 pb-2">待办事项 ({todos.filter(t => !t.completed).length})</h3>
             <div className="space-y-3">
                {todos.filter(t => !t.completed).map((todo) => (
                    <GlassCard 
                        key={todo.id} 
                        className={cn(
                        "flex items-center gap-4 p-4 cursor-pointer group transition-all duration-300 border-l-4",
                        todo.urgent ? "border-l-red-500" : "border-l-teal-500"
                        )}
                        onClick={() => toggleTodo(todo.id)}
                    >
                        <div className="w-6 h-6 rounded-full border-2 border-slate-500 group-hover:border-teal-400 flex items-center justify-center transition-all shrink-0" />
                        <div className="flex-1 flex flex-col">
                            <span className="text-lg text-slate-100">{todo.text}</span>
                            {todo.dueDate && (
                                <span className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                                    <Calendar size={12} /> {todo.dueDate}
                                </span>
                            )}
                        </div>
                        {todo.urgent && (
                            <span className="text-xs px-2 py-1 rounded bg-red-500/20 text-red-300 border border-red-500/30 shrink-0 flex items-center gap-1">
                                <AlertCircle size={12} /> 紧急
                            </span>
                        )}
                    </GlassCard>
                ))}
                {todos.filter(t => !t.completed).length === 0 && (
                    <p className="text-slate-500 text-sm py-4 italic">暂无待办任务。</p>
                )}
             </div>
        </div>

        {/* Completed Tasks */}
        <div className="space-y-4">
             <h3 className="text-lg font-medium text-slate-400 border-b border-white/10 pb-2">已完成</h3>
             <div className="space-y-3 opacity-60 hover:opacity-100 transition-opacity">
                {todos.filter(t => t.completed).map((todo) => (
                    <GlassCard 
                        key={todo.id} 
                        className="flex items-center gap-4 p-4 cursor-pointer bg-white/5 border-l-4 border-l-slate-500"
                        onClick={() => toggleTodo(todo.id)}
                    >
                        <div className="w-6 h-6 rounded-full border-2 bg-teal-500/20 border-teal-500 text-teal-500 flex items-center justify-center shrink-0">
                             <Check size={14} strokeWidth={3} />
                        </div>
                        <span className="flex-1 text-lg line-through text-slate-500">{todo.text}</span>
                    </GlassCard>
                ))}
                {todos.filter(t => t.completed).length === 0 && (
                    <p className="text-slate-600 text-sm py-4 italic">暂无完成记录。</p>
                )}
             </div>
        </div>
      </div>
    </div>
  );
}
