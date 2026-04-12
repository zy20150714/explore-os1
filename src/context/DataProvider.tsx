import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { saveObjectToCookie, loadObjectFromCookie } from '../utils/cookie';

// --- Types ---
export interface TodoItem {
  id: number;
  text: string;
  urgent: boolean;
  completed: boolean;
  dueDate?: string;
}

export interface Project {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  progress: number;
  checkIns: string[]; // Array of ISO date strings (YYYY-MM-DD)
}

export interface CalendarEvent {
  id: number | string;
  title: string;
  start: Date;
  end: Date;
  color: string;
  note: string;
  isDerived?: boolean; // To distinguish manual vs auto-generated
}

export interface JournalEntry {
  time: string;
  title: string;
  desc: string;
}

export interface Habit {
  id: string;
  name: string;
  completed: boolean;
}

export interface PomodoroSession {
  id: number;
  type: 'work' | 'shortBreak' | 'longBreak';
  duration: number;
  completed: boolean;
  completedAt: string;
}

export type ThemeMode = 'glass' | 'normal';

interface DataContextType {
  // Todos
  todos: TodoItem[];
  addTodo: (text: string, urgent: boolean, dueDate?: string) => void;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
  
  // Projects
  projects: Project[];
  addProject: (project: Omit<Project, 'id' | 'progress' | 'checkIns'>) => void;
  checkInProject: (id: number) => void;
  
  // Calendar
  events: CalendarEvent[]; // Manual events
  allEvents: CalendarEvent[]; // Manual + Derived
  addEvent: (event: Omit<CalendarEvent, 'id'>) => void;

  // Journal / Widgets
  habits: Habit[];
  toggleHabit: (id: string) => void;
  addHabit: (name: string) => void;

  timeline: JournalEntry[];
  addTimelineEntry: (entry: JournalEntry) => void;

  weeklyCheckins: boolean[]; // 7 days
  toggleWeeklyCheckin: (index: number) => void;

  // Stats
  stats: {
    completedTodos: number;
    avgProjectProgress: number;
    totalEvents: number;
    habitStreak: number;
  };
  
  // Theme
  themeMode: ThemeMode;
  toggleThemeMode: () => void;
  
  // Pomodoro
  pomodoroSessions: PomodoroSession[];
  addPomodoroSession: (session: Omit<PomodoroSession, 'id' | 'completedAt'>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  // --- State ---
  const [todos, setTodos] = useState<TodoItem[]>(() => {
    const savedTodos = loadObjectFromCookie('explore_os_todos');
    return savedTodos || [];
  });
  
  const [projects, setProjects] = useState<Project[]>(() => {
    const savedProjects = loadObjectFromCookie('explore_os_projects');
    return savedProjects || [];
  });
  
  const [manualEvents, setManualEvents] = useState<CalendarEvent[]>(() => {
    const savedEvents = loadObjectFromCookie('explore_os_events');
    return savedEvents || [];
  });
  
  // Journal States
  const [habits, setHabits] = useState<Habit[]>(() => {
    const savedHabits = loadObjectFromCookie('explore_os_habits');
    return savedHabits || [
      { id: '1', name: '喝水 2L', completed: false },
      { id: '2', name: '阅读 30 分钟', completed: false },
    ];
  });

  const [timeline, setTimeline] = useState<JournalEntry[]>(() => {
    const savedTimeline = loadObjectFromCookie('explore_os_timeline');
    return savedTimeline || [];
  });
  
  const [weeklyCheckins, setWeeklyCheckins] = useState<boolean[]>(() => {
    const savedCheckins = loadObjectFromCookie('explore_os_checkins');
    return savedCheckins || [false, false, false, false, false, false, false];
  });

  // Theme state
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const savedTheme = loadObjectFromCookie('explore_os_theme');
    return savedTheme || 'glass';
  });
  
  // Pomodoro state
  const [pomodoroSessions, setPomodoroSessions] = useState<PomodoroSession[]>(() => {
    const savedSessions = loadObjectFromCookie('explore_os_pomodoro');
    return savedSessions || [];
  });

  // Save data to cookie when it changes
  useEffect(() => {
    saveObjectToCookie('explore_os_todos', todos);
  }, [todos]);

  useEffect(() => {
    saveObjectToCookie('explore_os_projects', projects);
  }, [projects]);

  useEffect(() => {
    saveObjectToCookie('explore_os_events', manualEvents);
  }, [manualEvents]);

  useEffect(() => {
    saveObjectToCookie('explore_os_habits', habits);
  }, [habits]);

  useEffect(() => {
    saveObjectToCookie('explore_os_timeline', timeline);
  }, [timeline]);

  useEffect(() => {
    saveObjectToCookie('explore_os_checkins', weeklyCheckins);
  }, [weeklyCheckins]);

  // Save theme to cookie
  useEffect(() => {
    saveObjectToCookie('explore_os_theme', themeMode);
  }, [themeMode]);
  
  // Save pomodoro sessions to cookie
  useEffect(() => {
    saveObjectToCookie('explore_os_pomodoro', pomodoroSessions);
  }, [pomodoroSessions]);

  // --- Actions ---
  const addTodo = (text: string, urgent: boolean, dueDate?: string) => {
    setTodos(prev => [...prev, { id: Date.now(), text, urgent, completed: false, dueDate }]);
  };

  const toggleTodo = (id: number) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (id: number) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  const addProject = (project: Omit<Project, 'id' | 'progress' | 'checkIns'>) => {
    setProjects(prev => [...prev, { 
      ...project, 
      id: Date.now(),
      progress: 0,
      checkIns: []
    }]);
  };

  const checkInProject = (id: number) => {
    const today = new Date().toISOString().split('T')[0];
    setProjects(prev => prev.map(p => {
      if (p.id !== id) return p;
      
      // Prevent double check-in
      if (p.checkIns.includes(today)) return p;

      const newCheckIns = [...p.checkIns, today];
      
      // Calculate progress
      // Strategy: Progress = (CheckIns / Total Days Duration) * 100
      const start = new Date(p.startDate);
      const end = new Date(p.endDate);
      const totalTime = end.getTime() - start.getTime();
      const totalDays = Math.ceil(totalTime / (1000 * 3600 * 24)) || 1; // Avoid divide by zero
      
      // Ensure progress doesn't exceed 100%
      const newProgress = Math.min(Math.round((newCheckIns.length / totalDays) * 100), 100);

      return {
        ...p,
        checkIns: newCheckIns,
        progress: newProgress
      };
    }));
  };

  const addEvent = (event: Omit<CalendarEvent, 'id'>) => {
    setManualEvents(prev => [...prev, { ...event, id: Date.now() }]);
  };

  const toggleHabit = (id: string) => {
    // Check if it's strictly today? 
    // The prompt says "Week checkin... adjusts based on date... can only checkin today". 
    // This probably applies to habits too or specifically the "Weekly Checkin" grid.
    // I'll apply strict date checking in the UI layer (Journal.tsx) to disable interaction if needed, 
    // but the state toggle is simple here.
    setHabits(prev => prev.map(h => h.id === id ? { ...h, completed: !h.completed } : h));
  };
  
  const addHabit = (name: string) => {
      setHabits(prev => [...prev, { id: Date.now().toString(), name, completed: false }]);
  };

  const addTimelineEntry = (entry: JournalEntry) => {
      setTimeline(prev => [...prev, entry]);
  };

  const toggleWeeklyCheckin = (index: number) => {
      const newCheckins = [...weeklyCheckins];
      newCheckins[index] = !newCheckins[index];
      setWeeklyCheckins(newCheckins);
  };

  // Theme toggle
  const toggleThemeMode = () => {
    setThemeMode(prev => prev === 'glass' ? 'normal' : 'glass');
  };
  
  // Pomodoro actions
  const addPomodoroSession = (session: Omit<PomodoroSession, 'id' | 'completedAt'>) => {
    setPomodoroSessions(prev => [...prev, {
      ...session,
      id: Date.now(),
      completedAt: new Date().toISOString()
    }]);
  };

  // --- Derived Calculations ---

  // Project Events (Deadlines & Start Dates)
  const projectEvents: CalendarEvent[] = [];
  projects.forEach(p => {
    // Start
    projectEvents.push({
      id: `proj-start-${p.id}`,
      title: `项目开始: ${p.name}`,
      start: new Date(p.startDate),
      end: new Date(p.startDate),
      color: '#6366f1',
      note: '项目启动日',
      isDerived: true
    });
    // End
    projectEvents.push({
      id: `proj-end-${p.id}`,
      title: `项目截止: ${p.name}`,
      start: new Date(p.endDate),
      end: new Date(p.endDate),
      color: '#ef4444', // Red for deadline
      note: `当前进度: ${p.progress}%`,
      isDerived: true
    });
  });

  // Todo Events (if they have due dates)
  const todoEvents: CalendarEvent[] = todos
    .filter(t => t.dueDate && !t.completed)
    .map(t => ({
      id: `todo-${t.id}`,
      title: `待办: ${t.text}`,
      start: new Date(t.dueDate!),
      end: new Date(t.dueDate!),
      color: t.urgent ? '#ef4444' : '#14b8a6', // Red or Teal
      note: t.urgent ? '紧急任务' : '一般任务',
      isDerived: true
    }));

  const allEvents = [...manualEvents, ...projectEvents, ...todoEvents];

  // Stats
  const stats = {
    completedTodos: todos.filter(t => t.completed).length,
    avgProjectProgress: projects.length > 0 
        ? Math.round(projects.reduce((acc, curr) => acc + curr.progress, 0) / projects.length) 
        : 0,
    totalEvents: allEvents.length,
    habitStreak: weeklyCheckins.filter(Boolean).length
  };

  return (
    <DataContext.Provider value={{
      todos, addTodo, toggleTodo, deleteTodo,
      projects, addProject, checkInProject,
      events: manualEvents, allEvents, addEvent,
      habits, toggleHabit, addHabit,
      timeline, addTimelineEntry,
      weeklyCheckins, toggleWeeklyCheckin,
      stats,
      themeMode, toggleThemeMode,
      pomodoroSessions, addPomodoroSession
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
