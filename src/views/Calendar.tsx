import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/GlassCard';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Clock, Edit2, Trash2, X } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, getDay } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { cn } from '@/utils/cn';

import { useData } from '@/context/DataProvider';

export function CalendarView() {
  const { allEvents, addEvent, updateEvent, deleteEvent } = useData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [selectedColor, setSelectedColor] = useState("#3b82f6");

  const [editingEvent, setEditingEvent] = useState<null | typeof allEvents[0]>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editNote, setEditNote] = useState("");
  const [editColor, setEditColor] = useState("#3b82f6");

  const colorTemplates = [
      '#ef4444',
      '#f97316',
      '#eab308',
      '#22c55e',
      '#3b82f6',
      '#a855f7',
      '#ec4899',
  ];

  const handleAddEvent = () => {
      if (!title.trim()) return;
      const newDate = new Date(selectedDate);
      newDate.setHours(9, 0, 0, 0);
      const endDate = new Date(selectedDate);
      endDate.setHours(10, 0, 0, 0);
      
      addEvent({
          title: title.trim(),
          start: newDate,
          end: endDate,
          color: selectedColor,
          note
      });
      setTitle("");
      setNote("");
  };

  const handleEditEvent = (event: typeof allEvents[0]) => {
    setEditingEvent(event);
    setEditTitle(event.title);
    setEditNote(event.note);
    setEditColor(event.color);
  };

  const handleSaveEdit = () => {
    if (!editingEvent || !editTitle.trim() || typeof editingEvent.id === 'string') return;
    const newDate = new Date(editingEvent.start);
    newDate.setHours(9, 0, 0, 0);
    const endDate = new Date(editingEvent.start);
    endDate.setHours(10, 0, 0, 0);
    updateEvent(editingEvent.id as number, {
      title: editTitle.trim(),
      start: newDate,
      end: endDate,
      color: editColor,
      note: editNote,
    });
    setEditingEvent(null);
  };

  const handleDeleteEvent = (id: number | string) => {
    deleteEvent(id);
    setEditingEvent(null);
  };
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const startDay = getDay(monthStart);
  const paddingDays = Array(startDay).fill(null);

  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const todaysEvents = allEvents.filter(e => isSameDay(e.start, selectedDate));

  const getEventLabel = (event: typeof allEvents[0]) => {
    if (event.type === 'project-day') return '项目';
    if (event.type === 'todo') return '待办';
    return '手动';
  };

  return (
    <div className="h-full flex flex-col md:flex-row gap-4 md:gap-6 slide-up">
      <div className="w-full md:w-80 lg:w-96 space-y-4 shrink-0">
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3"
        >
            <span className="p-2.5 md:p-3 rounded-xl bg-slate-700/50 border border-slate-600/50">
                <CalendarIcon size={24} className="text-slate-300" />
            </span>
            日程管理
        </motion.h2>

        <GlassCard variant="paper" className="p-4 md:p-5">
            <h3 className="text-base md:text-lg font-medium text-white mb-4">新建日程</h3>
            
            <div className="space-y-3 md:space-y-4">
                <div>
                    <label htmlFor="event-title" className="block text-xs md:text-sm text-slate-400 mb-1">标题</label>
                    <input 
                        id="event-title"
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddEvent()}
                        type="text" 
                        placeholder="输入日程标题..."
                        className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors text-xs md:text-sm" 
                    />
                </div>
                
                <div>
                    <label className="block text-xs md:text-sm text-slate-400 mb-1">颜色标记</label>
                    <div className="flex gap-2 items-center flex-wrap" role="radiogroup" aria-label="选择颜色">
                        {colorTemplates.map(color => (
                            <button
                                key={color}
                                onClick={() => setSelectedColor(color)}
                                aria-label={`选择颜色 ${color}`}
                                aria-checked={selectedColor === color}
                                role="radio"
                                className={cn(
                                    "w-5 h-5 md:w-6 md:h-6 rounded-full border transition-transform hover:scale-110",
                                    selectedColor === color ? "border-white scale-110" : "border-transparent opacity-70"
                                )}
                                style={{ backgroundColor: color }}
                            />
                        ))}
                        <div className="w-px h-5 md:h-6 bg-slate-600 mx-1" />
                        <label htmlFor="event-color-custom" className="sr-only">自定义颜色</label>
                        <input 
                            id="event-color-custom"
                            type="color" 
                            value={selectedColor}
                            onChange={(e) => setSelectedColor(e.target.value)}
                            className="w-6 h-6 md:w-7 md:h-7 rounded cursor-pointer bg-transparent border-0"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="event-note" className="block text-xs md:text-sm text-slate-400 mb-1">备注</label>
                    <textarea 
                        id="event-note"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="添加备注..."
                        className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white placeholder-slate-500 h-16 md:h-20 resize-none focus:outline-none focus:border-blue-500 transition-colors text-xs md:text-sm" 
                    />
                </div>

                <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddEvent}
                    disabled={!title.trim()}
                    aria-label="添加日程"
                    className="w-full py-2 md:py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-colors flex items-center justify-center gap-2 font-medium text-xs md:text-sm"
                >
                    <Plus size={14} /> 添加日程
                </motion.button>
            </div>
        </GlassCard>
        
        <div className="space-y-2">
             <h4 className="text-xs md:text-sm text-slate-400 px-1 flex items-center gap-1.5">
                 <Clock size={12} className="text-slate-500" />
                 {format(selectedDate, 'M月d日', {locale: zhCN})} ({todaysEvents.length})
             </h4>
             <div className="max-h-[200px] md:max-h-[280px] overflow-y-auto space-y-1.5 pr-1">
                <AnimatePresence mode="popLayout">
                {todaysEvents.map((event, idx) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ delay: idx * 0.02 }}
                      onClick={() => typeof event.id === 'number' && handleEditEvent(event)}
                      onKeyDown={(e) => e.key === 'Enter' && typeof event.id === 'number' && handleEditEvent(event)}
                      role={typeof event.id === 'number' ? 'button' : undefined}
                      tabIndex={typeof event.id === 'number' ? 0 : undefined}
                      className={typeof event.id === 'number' ? 'cursor-pointer' : ''}
                    >
                      <GlassCard variant="minimal" className="p-2.5 md:p-3 flex items-start gap-2.5" hoverEffect={false}>
                            <div 
                                className="w-1 h-full min-h-[20px] rounded-full shrink-0 mt-0.5" 
                                style={{ backgroundColor: event.color }} 
                            />
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start gap-2">
                                    <p className="text-xs md:text-sm text-slate-200 truncate">{event.title}</p>
                                    <span className="text-[9px] md:text-[10px] px-1 md:px-1.5 py-0.5 rounded bg-slate-700 text-slate-400 shrink-0">
                                        {getEventLabel(event)}
                                    </span>
                                </div>
                                {event.note && (
                                    <p className="text-[10px] md:text-xs text-slate-500 mt-0.5 truncate">{event.note}</p>
                                )}
                            </div>
                      </GlassCard>
                    </motion.div>
                ))}
                </AnimatePresence>
                {todaysEvents.length === 0 && (
                    <p className="text-xs text-slate-600 py-4 text-center">无日程</p>
                )}
             </div>
        </div>
      </div>

      <GlassCard variant="paper" className="flex-1 p-4 md:p-5 flex flex-col min-h-[400px] md:min-h-[500px]">
        <div className="flex items-center justify-between mb-4 md:mb-5">
            <div className="flex items-center gap-2 md:gap-3">
                <h3 className="text-lg md:text-xl font-semibold text-white">{format(currentDate, 'yyyy年 MMMM', { locale: zhCN })}</h3>
                <button
                    onClick={goToToday}
                    aria-label="回到今天"
                    className="px-2 md:px-2.5 py-1 text-[10px] md:text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors"
                >
                    今天
                </button>
            </div>
            <div className="flex gap-1">
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={prevMonth} 
                  aria-label="上个月"
                  className="p-1.5 md:p-2 hover:bg-slate-700/50 rounded-lg text-slate-400 transition-colors"
                >
                  <ChevronLeft size={16} />
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={nextMonth} 
                  aria-label="下个月"
                  className="p-1.5 md:p-2 hover:bg-slate-700/50 rounded-lg text-slate-400 transition-colors"
                >
                  <ChevronRight size={16} />
                </motion.button>
            </div>
        </div>

        <div className="grid grid-cols-7 gap-px flex-1">
            {['日', '一', '二', '三', '四', '五', '六'].map(day => (
                <div key={day} className="text-center text-slate-500 text-[10px] md:text-xs py-2">{day}</div>
            ))}
            
            {paddingDays.map((_, i) => (
                <div key={`pad-${i}`} className="h-full" />
            ))}

            {daysInMonth.map((day) => {
                const isSelected = isSameDay(day, selectedDate);
                const isToday = isSameDay(day, new Date());
                const dayEvents = allEvents.filter(e => isSameDay(e.start, day));
                
                return (
                    <motion.div 
                        key={day.toString()} 
                        whileHover={{ backgroundColor: 'rgba(51, 65, 85, 0.3)' }}
                        onClick={() => setSelectedDate(day)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && setSelectedDate(day)}
                        aria-label={`${format(day, 'M月d日')}, ${dayEvents.length} 个日程`}
                        className={cn(
                            "relative h-16 md:h-20 rounded-lg p-1 md:p-1.5 cursor-pointer transition-colors flex flex-col items-start justify-start gap-0.5 md:gap-1 group overflow-hidden",
                            isSelected ? "bg-blue-600/15 ring-1 ring-blue-500/30" : "",
                            !isSameMonth(day, currentDate) ? "opacity-30" : ""
                        )}
                    >
                        <span className={cn(
                            "w-5 h-5 md:w-6 md:h-6 flex items-center justify-center rounded-full text-[10px] md:text-xs font-medium shrink-0",
                            isToday ? "bg-blue-600 text-white" : "text-slate-400 group-hover:text-white"
                        )}>
                            {format(day, 'd')}
                        </span>
                        
                        <div className="w-full flex flex-col gap-0.5 mt-0.5">
                            {dayEvents.slice(0, 3).map((e, idx) => (
                                <div key={idx} className="h-1 w-full rounded-full" style={{ backgroundColor: e.color }} />
                            ))}
                            {dayEvents.length > 3 && (
                                <span className="text-[7px] md:text-[8px] text-slate-500">+{dayEvents.length - 3}</span>
                            )}
                        </div>
                    </motion.div>
                );
            })}
        </div>
      </GlassCard>

      <AnimatePresence>
        {editingEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setEditingEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-slate-800 border border-slate-700 rounded-2xl p-4 md:p-6 w-full max-w-sm shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base md:text-lg font-medium text-white flex items-center gap-2">
                  <Edit2 size={16} className="text-blue-400" />
                  编辑日程
                </h3>
                <button
                  onClick={() => setEditingEvent(null)}
                  aria-label="关闭编辑"
                  className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-400 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">标题</label>
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">颜色标记</label>
                  <div className="flex gap-2 flex-wrap">
                    {colorTemplates.map(color => (
                      <button
                        key={color}
                        onClick={() => setEditColor(color)}
                        className={cn(
                          "w-6 h-6 rounded-full border transition-transform hover:scale-110",
                          editColor === color ? "border-white scale-110" : "border-transparent opacity-70"
                        )}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                    <input
                      type="color"
                      value={editColor}
                      onChange={(e) => setEditColor(e.target.value)}
                      className="w-7 h-7 rounded cursor-pointer bg-transparent border-0"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">备注</label>
                  <textarea
                    value={editNote}
                    onChange={(e) => setEditNote(e.target.value)}
                    className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white text-sm h-20 resize-none focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  {typeof editingEvent.id === 'number' && (
                    <button
                      onClick={() => handleDeleteEvent(editingEvent.id)}
                      className="flex items-center gap-1 px-3 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg text-xs font-medium transition-colors"
                    >
                      <Trash2 size={12} /> 删除
                    </button>
                  )}
                  <div className="flex-1" />
                  <button
                    onClick={() => setEditingEvent(null)}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-medium transition-colors"
                  >
                    取消
                  </button>
                  {typeof editingEvent.id === 'number' && (
                    <button
                      onClick={handleSaveEdit}
                      disabled={!editTitle.trim()}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-xs font-medium transition-colors"
                    >
                      保存
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
