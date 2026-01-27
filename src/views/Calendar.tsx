import { useState } from 'react';
import { GlassCard } from '@/components/GlassCard';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, getDay } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { cn } from '@/utils/cn';

import { useData } from '@/context/DataProvider';

export function CalendarView() {
  const { allEvents, addEvent } = useData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Form State
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [selectedColor, setSelectedColor] = useState("#3b82f6");

  const colorTemplates = [
      '#ef4444', // Red (Urgent)
      '#f97316', // Orange (Warning)
      '#eab308', // Yellow (Note)
      '#22c55e', // Green (Success)
      '#3b82f6', // Blue (Default)
      '#a855f7', // Purple (Personal)
      '#ec4899', // Pink (Love)
  ];

  const handleAddEvent = () => {
      if (!title) return;
      addEvent({
          title,
          start: new Date(selectedDate.setHours(9, 0)),
          end: new Date(selectedDate.setHours(10, 0)),
          color: selectedColor,
          note
      });
      setTitle("");
      setNote("");
  };
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const startDay = getDay(monthStart);
  const paddingDays = Array(startDay).fill(null);

  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const todaysEvents = allEvents.filter(e => isSameDay(e.start, selectedDate));

  return (
    <div className="h-full flex flex-col md:flex-row gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Left: Event Form */}
      <div className="w-full md:w-1/3 space-y-6">
        <h2 className="text-3xl font-bold text-white flex items-center gap-3 mb-6">
            <span className="p-2 rounded-lg bg-blue-500/20 text-blue-300">
                <CalendarIcon size={28} />
            </span>
            日程管理
        </h2>

        <GlassCard className="p-6 space-y-5 h-auto">
            <h3 className="text-xl font-semibold text-white">新建日程</h3>
            
            <div className="space-y-4">
                <div>
                    <label className="block text-sm text-slate-400 mb-1">标题</label>
                    <input 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)}
                        type="text" 
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-400 transition-colors" 
                    />
                </div>
                
                <div>
                    <label className="block text-sm text-slate-400 mb-1">颜色标记</label>
                    <div className="flex gap-3 items-center flex-wrap">
                        {colorTemplates.map(color => (
                            <button
                                key={color}
                                onClick={() => setSelectedColor(color)}
                                className={cn(
                                    "w-6 h-6 rounded-full border transition-transform hover:scale-110",
                                    selectedColor === color ? "border-white scale-110 shadow-lg" : "border-transparent opacity-80"
                                )}
                                style={{ backgroundColor: color }}
                            />
                        ))}
                        <div className="w-px h-6 bg-white/20 mx-1" />
                        <input 
                            type="color" 
                            value={selectedColor}
                            onChange={(e) => setSelectedColor(e.target.value)}
                            className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
                            title="自定义颜色"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm text-slate-400 mb-1">备注</label>
                    <textarea 
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white h-24 resize-none focus:outline-none focus:border-blue-400 transition-colors" 
                    />
                </div>

                <button 
                    onClick={handleAddEvent}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all"
                >
                    <Plus size={18} /> 添加日程
                </button>
            </div>
        </GlassCard>
        
        <div className="space-y-2">
             <h4 className="text-sm text-slate-400 px-1">
                 {format(selectedDate, 'M月d日', {locale: zhCN})} 日程 ({todaysEvents.length})
             </h4>
             {todaysEvents.length === 0 && (
                 <p className="text-xs text-slate-500 px-1">无日程</p>
             )}
             <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
                {todaysEvents.map(event => (
                    <GlassCard key={event.id} className="p-4 bg-white/5 border-white/10" hoverEffect={false}>
                        <div className="flex items-start gap-3">
                            <div 
                                className="w-1.5 h-full min-h-[40px] rounded-full" 
                                style={{ backgroundColor: event.color }} 
                            />
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <p className="text-white font-medium">{event.title}</p>
                                    {event.isDerived && <span className="text-[10px] bg-white/10 px-1 rounded text-slate-400 shrink-0 ml-2">自动</span>}
                                </div>
                                <p className="text-sm text-slate-400 break-all">{event.note || "无备注"}</p>
                            </div>
                        </div>
                    </GlassCard>
                ))}
             </div>
        </div>
      </div>

      {/* Right: Calendar View */}
      <GlassCard className="flex-1 p-6 flex flex-col min-h-[500px]">
        <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-white capitalize">{format(currentDate, 'yyyy年 MMMM', { locale: zhCN })}</h3>
            <div className="flex gap-2">
                <button onClick={prevMonth} className="p-2 hover:bg-white/10 rounded-lg text-slate-300 transition-colors"><ChevronLeft /></button>
                <button onClick={nextMonth} className="p-2 hover:bg-white/10 rounded-lg text-slate-300 transition-colors"><ChevronRight /></button>
            </div>
        </div>

        <div className="grid grid-cols-7 gap-1 flex-1">
            {['周日', '周一', '周二', '周三', '周四', '周五', '周六'].map(day => (
                <div key={day} className="text-center text-slate-500 font-medium py-2 uppercase text-xs tracking-wider">{day}</div>
            ))}
            
            {paddingDays.map((_, i) => (
                <div key={`pad-${i}`} className="h-full border border-transparent" />
            ))}

            {daysInMonth.map((day) => {
                const isSelected = isSameDay(day, selectedDate);
                const isToday = isSameDay(day, new Date());
                const dayEvents = allEvents.filter(e => isSameDay(e.start, day));
                
                return (
                    <div 
                        key={day.toString()} 
                        onClick={() => setSelectedDate(day)}
                        className={cn(
                            "relative h-24 border border-white/5 rounded-lg p-2 cursor-pointer transition-all hover:bg-white/5 flex flex-col items-start justify-start gap-1 group overflow-hidden",
                            isSelected ? "bg-blue-500/10 border-blue-400 ring-1 ring-blue-400/50" : "",
                            !isSameMonth(day, currentDate) ? "opacity-30" : "opacity-100"
                        )}
                    >
                        <span className={cn(
                            "w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium shrink-0",
                            isToday ? "bg-blue-500 text-white shadow-lg shadow-blue-500/50" : "text-slate-300 group-hover:text-white"
                        )}>
                            {format(day, 'd')}
                        </span>
                        
                        <div className="w-full flex flex-col gap-1 mt-1">
                            {dayEvents.slice(0, 3).map((e, idx) => (
                                <div key={idx} className="h-1.5 w-full rounded-full opacity-80" style={{ backgroundColor: e.color }} />
                            ))}
                            {dayEvents.length > 3 && (
                                <div className="h-1.5 w-1.5 bg-slate-500 rounded-full self-center" />
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
      </GlassCard>
    </div>
  );
}
