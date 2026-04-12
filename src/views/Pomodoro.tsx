import { useState, useEffect, useRef } from 'react';
import { GlassCard } from '@/components/GlassCard';
import { Play, Pause, RotateCcw, Coffee, Timer, Trophy } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useData } from '@/context/DataProvider';

const WORK_DURATION = 25 * 60;
const SHORT_BREAK_DURATION = 5 * 60;
const LONG_BREAK_DURATION = 15 * 60;

export function Pomodoro() {
  const { pomodoroSessions, addPomodoroSession } = useData();
  const [timeLeft, setTimeLeft] = useState(WORK_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'work' | 'shortBreak' | 'longBreak'>('work');
  const [sessionCount, setSessionCount] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      handleSessionComplete();
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const handleSessionComplete = () => {
    setIsRunning(false);
    addPomodoroSession({
      type: mode,
      duration: mode === 'work' ? WORK_DURATION : 
                mode === 'shortBreak' ? SHORT_BREAK_DURATION : LONG_BREAK_DURATION,
      completed: true
    });

    if (mode === 'work') {
      const newCount = sessionCount + 1;
      setSessionCount(newCount);
      if (newCount % 4 === 0) {
        setMode('longBreak');
        setTimeLeft(LONG_BREAK_DURATION);
      } else {
        setMode('shortBreak');
        setTimeLeft(SHORT_BREAK_DURATION);
      }
    } else {
      setMode('work');
      setTimeLeft(WORK_DURATION);
    }

    try {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleV0fWYnm9KxqpGEAykWzeXJqYWEfTIGyO/a2qicfVIjs+PSmpeEcBjiR0/LHp5iHAw==');
      audio.play();
    } catch (e) {
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'work' ? WORK_DURATION : 
                mode === 'shortBreak' ? SHORT_BREAK_DURATION : LONG_BREAK_DURATION);
  };

  const switchMode = (newMode: 'work' | 'shortBreak' | 'longBreak') => {
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft(newMode === 'work' ? WORK_DURATION : 
                newMode === 'shortBreak' ? SHORT_BREAK_DURATION : LONG_BREAK_DURATION);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const getModeColor = () => {
    switch (mode) {
      case 'work': return 'from-red-500 to-orange-500';
      case 'shortBreak': return 'from-green-500 to-emerald-500';
      case 'longBreak': return 'from-blue-500 to-indigo-500';
      default: return 'from-red-500 to-orange-500';
    }
  };

  const getModeBg = () => {
    switch (mode) {
      case 'work': return 'bg-red-500/10 border-red-500/30';
      case 'shortBreak': return 'bg-green-500/10 border-green-500/30';
      case 'longBreak': return 'bg-blue-500/10 border-blue-500/30';
      default: return 'bg-red-500/10 border-red-500/30';
    }
  };

  const todaySessions = pomodoroSessions.filter(s => {
    const today = new Date().toDateString();
    return new Date(s.completedAt).toDateString() === today;
  });

  const todayWorkMinutes = todaySessions
    .filter(s => s.type === 'work')
    .reduce((acc, s) => acc + Math.floor(s.duration / 60), 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
        <span className={cn("p-2 rounded-lg bg-gradient-to-br", getModeColor(), "text-white")}>
          <Timer size={28} />
        </span>
        番茄时钟
      </h2>

      <GlassCard className={cn("p-8 border-2 transition-all duration-300", getModeBg())}>
        <div className="flex flex-col items-center gap-8">
          <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10">
            <button
              onClick={() => switchMode('work')}
              className={cn(
                "px-6 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2",
                mode === 'work'
                  ? "bg-red-500 text-white shadow-lg shadow-red-500/20"
                  : "text-slate-400 hover:text-white"
              )}
            >
              专注
            </button>
            <button
              onClick={() => switchMode('shortBreak')}
              className={cn(
                "px-6 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2",
                mode === 'shortBreak'
                  ? "bg-green-500 text-white shadow-lg shadow-green-500/20"
                  : "text-slate-400 hover:text-white"
              )}
            >
              <Coffee size={16} />
              短休息
            </button>
            <button
              onClick={() => switchMode('longBreak')}
              className={cn(
                "px-6 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2",
                mode === 'longBreak'
                  ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                  : "text-slate-400 hover:text-white"
              )}
            >
              长休息
            </button>
          </div>

          <div className="relative">
            <div className="w-64 h-64 rounded-full bg-gradient-to-br from-white/10 to-white/5 border-4 border-white/10 flex items-center justify-center shadow-2xl">
              <div className="text-center">
                <div className="text-6xl font-bold text-white font-mono tracking-wider">
                  {formatTime(timeLeft)}
                </div>
                <div className="text-slate-400 mt-2 text-sm uppercase tracking-widest">
                  {mode === 'work' ? '专注时间' : mode === 'shortBreak' ? '短休息' : '长休息'}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTimer}
              className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-lg",
                isRunning
                  ? "bg-amber-500 hover:bg-amber-400 shadow-amber-500/30"
                  : "bg-gradient-to-br from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 shadow-teal-500/30"
              )}
            >
              {isRunning ? <Pause size={28} className="text-white" fill="currentColor" /> : <Play size={28} className="text-white ml-1" fill="currentColor" />}
            </button>
            <button
              onClick={resetTimer}
              className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all hover:scale-110 active:scale-95 text-slate-300 hover:text-white"
            >
              <RotateCcw size={24} />
            </button>
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-teal-500/20 text-teal-300">
              <Trophy size={24} />
            </div>
            <div>
              <div className="text-3xl font-bold text-white">{todayWorkMinutes}</div>
              <div className="text-slate-400 text-sm">今日专注分钟</div>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-500/20 text-purple-300">
              <Timer size={24} />
            </div>
            <div>
              <div className="text-3xl font-bold text-white">{todaySessions.filter(s => s.type === 'work').length}</div>
              <div className="text-slate-400 text-sm">今日番茄数</div>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-500/20 text-amber-300">
              <Coffee size={24} />
            </div>
            <div>
              <div className="text-3xl font-bold text-white">{Math.floor(todayWorkMinutes / 25)}</div>
              <div className="text-slate-400 text-sm">已完成周期</div>
            </div>
          </div>
        </GlassCard>
      </div>

      {todaySessions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-slate-300 border-b border-white/10 pb-2">今日记录</h3>
          <div className="space-y-3">
            {todaySessions.slice().reverse().map((session) => (
              <GlassCard key={session.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-3 h-3 rounded-full",
                    session.type === 'work' ? 'bg-red-500' :
                    session.type === 'shortBreak' ? 'bg-green-500' : 'bg-blue-500'
                  )} />
                  <span className="text-slate-200">
                    {session.type === 'work' ? '专注' : session.type === 'shortBreak' ? '短休息' : '长休息'}
                  </span>
                  <span className="text-slate-500 text-sm">
                    {Math.floor(session.duration / 60)} 分钟
                  </span>
                </div>
                <span className="text-slate-400 text-sm">
                  {new Date(session.completedAt).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </GlassCard>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
