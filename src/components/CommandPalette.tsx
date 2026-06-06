import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Home, CheckSquare, Briefcase, Calendar, BookOpen, Award, Settings, Timer, Grid, ArrowRight } from 'lucide-react';
import { useData } from '@/context/DataProvider';
import type { ViewType } from '@/components/Sidebar';

const viewIcons: Record<string, any> = {
  home: Home, todo: CheckSquare, projects: Briefcase, calendar: Calendar,
  journal: BookOpen, achievements: Award, settings: Settings, pomodoro: Timer, apps: Grid,
};

const viewLabels: Record<string, string> = {
  home: '我的主页', todo: '待办事项', projects: '长期事项', calendar: '日程管理',
  journal: '生活手账', achievements: '我的成就', settings: '设置', pomodoro: '番茄时钟', apps: '应用中心',
};

interface Props {
  onNavigate: (view: ViewType) => void;
  onClose: () => void;
}

export function CommandPalette({ onNavigate, onClose }: Props) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { todos, projects } = useData();

  useEffect(() => {
    inputRef.current?.focus();
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const views = Object.keys(viewLabels) as ViewType[];
  const filteredViews = query
    ? views.filter(v => viewLabels[v].toLowerCase().includes(query.toLowerCase()))
    : views;

  const filteredTodos = query
    ? todos.filter(t => t.text.toLowerCase().includes(query.toLowerCase())).slice(0, 3)
    : [];

  const filteredProjects = query
    ? projects.filter(p => p.name.toLowerCase().includes(query.toLowerCase())).slice(0, 3)
    : [];

  const allResults = [
    ...filteredViews.map(v => ({ type: 'view' as const, view: v, label: viewLabels[v], icon: viewIcons[v] })),
    ...filteredTodos.map(t => ({ type: 'todo' as const, label: t.text, icon: CheckSquare })),
    ...filteredProjects.map(p => ({ type: 'project' as const, label: p.name, icon: Briefcase })),
  ];

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, allResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const result = allResults[selectedIndex];
      if (result) {
        if (result.type === 'view') {
          onNavigate(result.view);
        } else if (result.type === 'todo') {
          onNavigate('todo');
        } else if (result.type === 'project') {
          onNavigate('projects');
        }
        onClose();
      }
    }
  }, [allResults, selectedIndex, onNavigate, onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: -10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: -10 }}
          transition={{ duration: 0.15 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg bg-slate-800 border border-slate-700/50 rounded-xl shadow-2xl overflow-hidden"
        >
          <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-700/50">
            <Search size={18} className="text-slate-400 shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
              onKeyDown={handleKeyDown}
              placeholder="搜索功能、项目、待办…"
              className="flex-1 bg-transparent border-none outline-none text-white text-sm placeholder-slate-500"
              spellCheck={false}
            />
            <kbd className="text-xs text-slate-500 bg-slate-700 px-1.5 py-0.5 rounded font-mono">ESC</kbd>
          </div>

          <div className="max-h-64 overflow-y-auto py-2">
            {allResults.length === 0 && query && (
              <div className="px-4 py-8 text-center text-sm text-slate-500">未找到结果</div>
            )}
            {allResults.length === 0 && !query && (
              <div className="px-4 py-8 text-center text-sm text-slate-500">输入关键词搜索…</div>
            )}
            {allResults.map((result, i) => {
              const Icon = result.icon;
              return (
                <button
                  key={result.type === 'view' ? result.view : `${result.type}-${result.label}-${i}`}
                  onClick={() => {
                    if (result.type === 'view') {
                      onNavigate(result.view);
                    } else if (result.type === 'todo') {
                      onNavigate('todo');
                    } else {
                      onNavigate('projects');
                    }
                    onClose();
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                    i === selectedIndex ? 'bg-slate-700/80 text-white' : 'text-slate-300 hover:bg-slate-700/50'
                  }`}
                >
                  <Icon size={16} className={result.type === 'view' ? 'text-slate-400' : 'text-slate-500'} />
                  <span className="flex-1 text-left truncate">{result.label}</span>
                  <span className="text-xs text-slate-500">
                    {result.type === 'view' ? '页面' : result.type === 'todo' ? '待办' : '项目'}
                  </span>
                  <ArrowRight size={14} className="text-slate-600" />
                </button>
              );
            })}
          </div>

          <div className="px-4 py-2 border-t border-slate-700/50 flex gap-4 text-xs text-slate-500">
            <span><kbd className="bg-slate-700 px-1 py-0.5 rounded">↑↓</kbd> 导航</span>
            <span><kbd className="bg-slate-700 px-1 py-0.5 rounded">Enter</kbd> 打开</span>
            <span><kbd className="bg-slate-700 px-1 py-0.5 rounded">Esc</kbd> 关闭</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}