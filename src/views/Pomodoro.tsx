import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/GlassCard';
import { Timer, Play, Pause, RotateCcw, SkipForward, Settings2, BarChart3, Clock, CheckCircle2 } from 'lucide-react';
import { useData } from '@/context/DataProvider';

export function Pomodoro() {
  const { pomodoroSessions, addPomodoroSession } = useData();
  
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [showSettings, setShowSettings] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const todaySessions = pomodoroSessions.filter(s => s.date === todayStr && s.type === 'work');

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            
            if (mode === 'work') {
              addPomodoroSession({ date: todayStr, duration: workDuration, type: 'work' });
              setMode('break');
              return breakDuration * 60;
            } else {
              setMode('work');
              return workDuration * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning, mode, workDuration, breakDuration, addPomodoroSession, todayStr]);

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setMode('work');
    setTimeLeft(workDuration * 60);
  }, [workDuration]);

  const skipPhase = () => {
    setIsRunning(false);
    if (mode === 'work') {
      setMode('break');
      setTimeLeft(breakDuration * 60);
    } else {
      setMode('work');
      setTimeLeft(workDuration * 60);
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const totalSeconds = mode === 'work' ? workDuration * 60 : breakDuration * 60;
  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="space-y-6 slide-up max-w-3xl mx-auto">
      <motion.h2 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-3xl font-bold text-white flex items-center gap-3"
      >
        <span className="p-3 rounded-xl bg-slate-700/50 border border-slate-600/50">
          <Timer size={28} className="text-slate-300" />
        </span>
        番茄时钟
      </motion.h2>

      <div className="flex justify-center gap-2">
        <button
          onClick={() => { setMode('work'); setTimeLeft(workDuration * 60); setIsRunning(false); }}
          aria-label="切换到工作模式"
          className={`px-5 py-2 rounded-xl text-sm font-medium transition-colors ${
            mode === 'work' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:bg-slate-800/50'
          }`}
        >
          工作
        </button>
        <button
          onClick={() => { setMode('break'); setTimeLeft(breakDuration * 60); setIsRunning(false); }}
          aria-label="切换到休息模式"
          className={`px-5 py-2 rounded-xl text-sm font-medium transition-colors ${
            mode === 'break' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800/50'
          }`}
        >
          休息
        </button>
      </div>

      <GlassCard variant="paper" className="p-8 flex flex-col items-center">
        <div className="relative w-72 h-72">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 256 256">
            <circle
              cx="128"
              cy="128"
              r="120"
              fill="none"
              stroke="rgba(100, 116, 139, 0.2)"
              strokeWidth="8"
            />
            <circle
              cx="128"
              cy="128"
              r="120"
              fill="none"
              stroke={mode === 'work' ? '#0d9488' : '#2563eb'}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-[stroke-dashoffset] duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-6xl font-mono font-bold text-white tabular-nums">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
            <span className="text-sm text-slate-400 mt-2">
              {mode === 'work' ? '工作中' : '休息中'}
            </span>
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <button
            onClick={resetTimer}
            aria-label="重置计时器"
            className="p-3 rounded-xl bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 transition-colors"
          >
            <RotateCcw size={20} />
          </button>
          <button
            onClick={toggleTimer}
            aria-label={isRunning ? '暂停' : '开始'}
            className={`p-4 rounded-xl text-white transition-colors ${
              isRunning ? 'bg-amber-600 hover:bg-amber-500' : 'bg-teal-600 hover:bg-teal-500'
            }`}
          >
            {isRunning ? <Pause size={24} /> : <Play size={24} />}
          </button>
          <button
            onClick={skipPhase}
            aria-label="跳过当前阶段"
            className="p-3 rounded-xl bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 transition-colors"
          >
            <SkipForward size={20} />
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            aria-label="设置"
            className="p-3 rounded-xl bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 transition-colors"
          >
            <Settings2 size={20} />
          </button>
        </div>
      </GlassCard>

      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            exit={{ scaleY: 0, opacity: 0 }}
            style={{ transformOrigin: 'top' }}
            className="overflow-hidden"
          >
            <GlassCard variant="paper" className="p-6">
              <h3 className="text-lg font-medium text-white mb-4">计时设置</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="work-duration" className="block text-sm text-slate-400 mb-1">工作时长（分钟）</label>
                  <input
                    id="work-duration"
                    type="number"
                    min="1"
                    max="120"
                    value={workDuration}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (val > 0) {
                        setWorkDuration(val);
                        if (mode === 'work' && !isRunning) setTimeLeft(val * 60);
                      }
                    }}
                    className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-teal-500 transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="break-duration" className="block text-sm text-slate-400 mb-1">休息时长（分钟）</label>
                  <input
                    id="break-duration"
                    type="number"
                    min="1"
                    max="60"
                    value={breakDuration}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (val > 0) {
                        setBreakDuration(val);
                        if (mode === 'break' && !isRunning) setTimeLeft(val * 60);
                      }
                    }}
                    className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-teal-500 transition-colors"
                  />
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GlassCard variant="paper" className="p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-teal-600/20">
              <CheckCircle2 size={20} className="text-teal-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{todaySessions.length}</p>
              <p className="text-sm text-slate-400">今日完成</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard variant="paper" className="p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-600/20">
              <Clock size={20} className="text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{todaySessions.reduce((acc, s) => acc + s.duration, 0)}</p>
              <p className="text-sm text-slate-400">专注分钟</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {pomodoroSessions.length > 0 && (
        <GlassCard variant="paper" className="p-5">
          <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
            <BarChart3 size={18} className="text-slate-400" />
            历史记录
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {[...pomodoroSessions].reverse().slice(0, 20).map((session) => (
              <div key={session.id} className="flex items-center justify-between py-2 border-b border-slate-700/30 last:border-0">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${session.type === 'work' ? 'bg-teal-500' : 'bg-blue-500'}`} />
                  <span className="text-sm text-slate-300">
                    {session.type === 'work' ? '工作' : '休息'} {session.duration} 分钟
                  </span>
                </div>
                <span className="text-xs text-slate-500">{session.date}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
}
