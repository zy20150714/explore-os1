import { createContext, useContext, useState, ReactNode, useEffect, useCallback, useMemo } from 'react';
import { isSameDay } from 'date-fns';
import { saveObjectToCookie, loadObjectFromCookie, refreshCookie, DEFAULT_COOKIE_DAYS, clearAllExploreOSCookies } from '../utils/cookie';

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
  checkIns: string[];
}

export interface CalendarEvent {
  id: number | string;
  title: string;
  start: Date;
  end: Date;
  color: string;
  note: string;
  isDerived?: boolean;
  type?: 'manual' | 'project' | 'todo' | 'project-day';
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
  date: string;
  duration: number;
  type: 'work' | 'break';
}

export type ThemeMode = 'glass' | 'normal' | 'dark' | 'warm' | 'ocean';
export type AccentColor = 'teal' | 'blue' | 'purple' | 'orange' | 'green' | 'pink';
export type DensityMode = 'compact' | 'standard' | 'spacious';
export type FontSizeMode = 'small' | 'medium' | 'large';
export type WallpaperMode = 'gradient' | 'fluid' | 'grid' | 'dots' | 'stars' | 'solid' | 'custom';

interface UserSettings {
  themeMode: ThemeMode;
  accentColor: AccentColor;
  densityMode: DensityMode;
  fontSizeMode: FontSizeMode;
  wallpaperMode: WallpaperMode;
  wallpaperOpacity: number;
  customWallpaper?: string;
}

interface DataContextType {
  todos: TodoItem[];
  addTodo: (text: string, urgent: boolean, dueDate?: string) => void;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
  
  projects: Project[];
  addProject: (project: Omit<Project, 'id' | 'progress' | 'checkIns'>) => void;
  checkInProject: (id: number) => void;
  canCheckInToday: (projectId: number) => boolean;
  
  events: CalendarEvent[];
  allEvents: CalendarEvent[];
  addEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  updateEvent: (id: number, updates: Partial<Omit<CalendarEvent, 'id'>>) => void;
  deleteEvent: (id: number | string) => void;

  habits: Habit[];
  toggleHabit: (id: string) => void;
  addHabit: (name: string) => void;
  deleteHabit: (id: string) => void;

  timeline: JournalEntry[];
  addTimelineEntry: (entry: JournalEntry) => void;
  deleteTimelineEntry: (index: number) => void;

  weeklyCheckins: boolean[];
  toggleWeeklyCheckin: (index: number) => void;

  stats: {
    completedTodos: number;
    avgProjectProgress: number;
    todayEvents: number;
    upcoming7DaysEvents: number;
    totalProjects: number;
    habitStreak: number;
    pomodoroToday: number;
  };
  
  settings: UserSettings;
  updateSettings: (updates: Partial<UserSettings>) => void;

  installedApps: string[];
  installApp: (appId: string) => void;
  uninstallApp: (appId: string) => void;

  cookieExpiryDays: number;
  setCookieExpiryDays: (days: number) => void;

  pomodoroSessions: PomodoroSession[];
  addPomodoroSession: (session: Omit<PomodoroSession, 'id'>) => void;
  clearPomodoroHistory: () => void;

  hasUnsavedChanges: boolean;

  clearAllData: () => void;
  exportData: () => string;
  importData: (jsonString: string) => boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const COOKIE_NAMES = [
  'explore_os_todos',
  'explore_os_projects',
  'explore_os_events',
  'explore_os_habits',
  'explore_os_timeline',
  'explore_os_checkins',
  'explore_os_settings',
  'explore_os_installed_apps',
  'explore_os_pomodoro',
  'explore_os_cookie_expiry',
];

const DEFAULT_SETTINGS: UserSettings = {
  themeMode: 'glass',
  accentColor: 'teal',
  densityMode: 'standard',
  fontSizeMode: 'medium',
  wallpaperMode: 'fluid',
  wallpaperOpacity: 1,
};

export function DataProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useState<TodoItem[]>(() => loadObjectFromCookie('explore_os_todos') || []);
  const [projects, setProjects] = useState<Project[]>(() => loadObjectFromCookie('explore_os_projects') || []);
  const [manualEvents, setManualEvents] = useState<CalendarEvent[]>(() => {
    const saved = loadObjectFromCookie('explore_os_events') || [];
    return saved.map((e: any) => ({ ...e, start: new Date(e.start), end: new Date(e.end) }));
  });
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = loadObjectFromCookie('explore_os_habits');
    return saved || [
      { id: '1', name: '喝水 2L', completed: false },
      { id: '2', name: '阅读 30 分钟', completed: false },
    ];
  });
  const [timeline, setTimeline] = useState<JournalEntry[]>(() => loadObjectFromCookie('explore_os_timeline') || []);
  const [weeklyCheckins, setWeeklyCheckins] = useState<boolean[]>(() => loadObjectFromCookie('explore_os_checkins') || [false, false, false, false, false, false, false]);
  const [settings, setSettings] = useState<UserSettings>(() => loadObjectFromCookie('explore_os_settings') || DEFAULT_SETTINGS);
  const [installedApps, setInstalledApps] = useState<string[]>(() => loadObjectFromCookie('explore_os_installed_apps') || []);
  const [cookieExpiryDays, setCookieExpiryDays] = useState<number>(() => loadObjectFromCookie('explore_os_cookie_expiry') || DEFAULT_COOKIE_DAYS);
  const [pomodoroSessions, setPomodoroSessions] = useState<PomodoroSession[]>(() => loadObjectFromCookie('explore_os_pomodoro') || []);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    COOKIE_NAMES.forEach(name => refreshCookie(name, cookieExpiryDays));
  }, []);

  useEffect(() => { saveObjectToCookie('explore_os_todos', todos); setHasUnsavedChanges(true); }, [todos]);
  useEffect(() => { saveObjectToCookie('explore_os_projects', projects); setHasUnsavedChanges(true); }, [projects]);
  useEffect(() => { saveObjectToCookie('explore_os_events', manualEvents); setHasUnsavedChanges(true); }, [manualEvents]);
  useEffect(() => { saveObjectToCookie('explore_os_habits', habits); setHasUnsavedChanges(true); }, [habits]);
  useEffect(() => { saveObjectToCookie('explore_os_timeline', timeline); setHasUnsavedChanges(true); }, [timeline]);
  useEffect(() => { saveObjectToCookie('explore_os_checkins', weeklyCheckins); setHasUnsavedChanges(true); }, [weeklyCheckins]);
  useEffect(() => { saveObjectToCookie('explore_os_settings', settings); }, [settings]);
  useEffect(() => { saveObjectToCookie('explore_os_installed_apps', installedApps); }, [installedApps]);
  useEffect(() => { saveObjectToCookie('explore_os_cookie_expiry', cookieExpiryDays); }, [cookieExpiryDays]);
  useEffect(() => { saveObjectToCookie('explore_os_pomodoro', pomodoroSessions); }, [pomodoroSessions]);

  const addTodo = useCallback((text: string, urgent: boolean, dueDate?: string) => {
    setTodos(prev => [...prev, { id: Date.now(), text, urgent, completed: false, dueDate }]);
  }, []);

  const toggleTodo = useCallback((id: number) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  }, []);

  const deleteTodo = useCallback((id: number) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  }, []);

  const addProject = useCallback((project: Omit<Project, 'id' | 'progress' | 'checkIns'>) => {
    setProjects(prev => [...prev, { ...project, id: Date.now(), progress: 0, checkIns: [] }]);
  }, []);

  const checkInProject = useCallback((id: number) => {
    const today = new Date().toISOString().split('T')[0];
    setProjects(prev => prev.map(p => {
      if (p.id !== id || p.checkIns.includes(today)) return p;
      if (today < p.startDate || today > p.endDate) return p;
      const newCheckIns = [...p.checkIns, today];
      const start = new Date(p.startDate);
      const end = new Date(p.endDate);
      const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) || 1;
      const newProgress = Math.min(Math.round((newCheckIns.length / totalDays) * 10000) / 100, 100);
      return { ...p, checkIns: newCheckIns, progress: newProgress };
    }));
  }, []);

  const canCheckInToday = useCallback((projectId: number) => {
    const today = new Date().toISOString().split('T')[0];
    const project = projects.find(p => p.id === projectId);
    if (!project) return false;
    if (project.checkIns.includes(today)) return false;
    return today >= project.startDate && today <= project.endDate;
  }, [projects]);

  const addEvent = useCallback((event: Omit<CalendarEvent, 'id'>) => {
    setManualEvents(prev => [...prev, { ...event, id: Date.now() }]);
  }, []);

  const updateEvent = useCallback((id: number, updates: Partial<Omit<CalendarEvent, 'id'>>) => {
    setManualEvents(prev => prev.map(e => {
      if (e.id !== id) return e;
      const updated = { ...e, ...updates };
      if (updates.start) updated.start = new Date(updates.start);
      if (updates.end) updated.end = new Date(updates.end);
      return updated;
    }));
  }, []);

  const deleteEvent = useCallback((id: number | string) => {
    setManualEvents(prev => prev.filter(e => e.id !== id));
  }, []);

  const toggleHabit = useCallback((id: string) => {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, completed: !h.completed } : h));
  }, []);

  const addHabit = useCallback((name: string) => {
    setHabits(prev => [...prev, { id: Date.now().toString(), name, completed: false }]);
  }, []);

  const deleteHabit = useCallback((id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  }, []);

  const addTimelineEntry = useCallback((entry: JournalEntry) => {
    setTimeline(prev => [...prev, entry]);
  }, []);

  const deleteTimelineEntry = useCallback((index: number) => {
    setTimeline(prev => prev.filter((_, i) => i !== index));
  }, []);

  const toggleWeeklyCheckin = useCallback((index: number) => {
    const newCheckins = [...weeklyCheckins];
    newCheckins[index] = !newCheckins[index];
    setWeeklyCheckins(newCheckins);
  }, [weeklyCheckins]);

  const updateSettings = useCallback((updates: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, []);

  const installApp = useCallback((appId: string) => {
    setInstalledApps(prev => prev.includes(appId) ? prev : [...prev, appId]);
  }, []);

  const uninstallApp = useCallback((appId: string) => {
    setInstalledApps(prev => prev.filter(id => id !== appId));
  }, []);

  const addPomodoroSession = useCallback((session: Omit<PomodoroSession, 'id'>) => {
    setPomodoroSessions(prev => [...prev, { ...session, id: Date.now() }]);
  }, []);

  const clearPomodoroHistory = useCallback(() => {
    setPomodoroSessions([]);
  }, []);

  const clearAllData = useCallback(() => {
    clearAllExploreOSCookies();
    setTodos([]);
    setProjects([]);
    setManualEvents([]);
    setHabits([
      { id: '1', name: '喝水 2L', completed: false },
      { id: '2', name: '阅读 30 分钟', completed: false },
    ]);
    setTimeline([]);
    setWeeklyCheckins([false, false, false, false, false, false, false]);
    setPomodoroSessions([]);
    setHasUnsavedChanges(false);
  }, []);

  const exportData = useCallback(() => {
    return JSON.stringify({
      todos, projects, manualEvents, habits, timeline, weeklyCheckins, pomodoroSessions, settings, cookieExpiryDays
    }, null, 2);
  }, [todos, projects, manualEvents, habits, timeline, weeklyCheckins, pomodoroSessions, settings, cookieExpiryDays]);

  const importData = useCallback((jsonString: string) => {
    try {
      const data = JSON.parse(jsonString);
      if (data.todos) setTodos(data.todos);
      if (data.projects) setProjects(data.projects);
      if (data.manualEvents) setManualEvents(data.manualEvents.map((e: any) => ({ ...e, start: new Date(e.start), end: new Date(e.end) })));
      if (data.habits) setHabits(data.habits);
      if (data.timeline) setTimeline(data.timeline);
      if (data.weeklyCheckins) setWeeklyCheckins(data.weeklyCheckins);
      if (data.pomodoroSessions) setPomodoroSessions(data.pomodoroSessions);
      if (data.settings) setSettings(data.settings);
      if (data.cookieExpiryDays) setCookieExpiryDays(data.cookieExpiryDays);
      return true;
    } catch {
      return false;
    }
  }, []);

  const projectEvents: CalendarEvent[] = useMemo(() => {
    const events: CalendarEvent[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + 365);
    
    projects.forEach(p => {
      const endDate = new Date(p.endDate);
      endDate.setHours(0, 0, 0, 0);
      if (endDate < today) return;
      
      const start = new Date(p.startDate);
      start.setHours(0, 0, 0, 0);
      const actualEndDate = endDate > maxDate ? maxDate : endDate;
      const firstDay = start > today ? start : today;
      const diffTime = firstDay.getTime() - new Date(p.startDate).getTime();
      const startDayNum = Math.ceil(diffTime / (1000 * 3600 * 24)) + 1;
      
      let dayNum = startDayNum;
      for (let d = new Date(firstDay); d <= actualEndDate; d.setDate(d.getDate() + 1)) {
        const checkInDate = d.toISOString().split('T')[0];
        const isCheckedIn = p.checkIns.includes(checkInDate);
        events.push({
          id: `proj-day-${p.id}-${checkInDate}`,
          title: `${p.name} · 第${dayNum}天${isCheckedIn ? ' (已打卡)' : ''}`,
          start: new Date(d),
          end: new Date(d),
          color: isCheckedIn ? '#22c55e' : '#a855f7',
          note: isCheckedIn ? `第${dayNum}天，已打卡` : `第${dayNum}天，待打卡`,
          isDerived: true,
          type: 'project-day'
        });
        dayNum++;
      }
    });
    return events;
  }, [projects]);

  const todoEvents: CalendarEvent[] = useMemo(() => 
    todos.filter(t => t.dueDate && !t.completed).map(t => ({
      id: `todo-${t.id}`,
      title: `待办: ${t.text}`,
      start: new Date(t.dueDate!),
      end: new Date(t.dueDate!),
      color: t.urgent ? '#ef4444' : '#14b8a6',
      note: t.urgent ? '紧急任务' : '一般任务',
      isDerived: true,
      type: 'todo' as const
    })), [todos]);

  const allEvents = useMemo(() => [...manualEvents, ...projectEvents, ...todoEvents], [manualEvents, projectEvents, todoEvents]);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayDate = useMemo(() => { const d = new Date(); d.setHours(0,0,0,0); return d; }, []);
  
  const todayEventsCount = useMemo(() => {
    return allEvents.filter(e => isSameDay(e.start, todayDate)).length;
  }, [allEvents, todayDate]);

  const upcoming7DaysCount = useMemo(() => {
    const end7 = new Date(todayDate);
    end7.setDate(end7.getDate() + 7);
    return allEvents.filter(e => {
      const d = new Date(e.start);
      d.setHours(0,0,0,0);
      return d >= todayDate && d <= end7;
    }).length;
  }, [allEvents, todayDate]);

  const pomodoroToday = useMemo(() => 
    pomodoroSessions.filter(s => s.date === todayStr && s.type === 'work').length
  , [pomodoroSessions, todayStr]);

  const stats = useMemo(() => ({
    completedTodos: todos.filter(t => t.completed).length,
    avgProjectProgress: projects.length > 0 ? Math.round(projects.reduce((acc, c) => acc + c.progress, 0) / projects.length * 100) / 100 : 0,
    todayEvents: todayEventsCount,
    upcoming7DaysEvents: upcoming7DaysCount,
    totalProjects: projects.length,
    habitStreak: weeklyCheckins.filter(Boolean).length,
    pomodoroToday,
  }), [todos, projects, todayEventsCount, upcoming7DaysCount, weeklyCheckins, pomodoroToday]);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [hasUnsavedChanges]);

  return (
    <DataContext.Provider value={{
      todos, addTodo, toggleTodo, deleteTodo,
      projects, addProject, checkInProject, canCheckInToday,
      events: manualEvents, allEvents, addEvent, updateEvent, deleteEvent,
      habits, toggleHabit, addHabit, deleteHabit,
      timeline, addTimelineEntry, deleteTimelineEntry,
      weeklyCheckins, toggleWeeklyCheckin,
      stats,
      settings, updateSettings,
      installedApps, installApp, uninstallApp,
      cookieExpiryDays, setCookieExpiryDays,
      pomodoroSessions, addPomodoroSession, clearPomodoroHistory,
      hasUnsavedChanges,
      clearAllData, exportData, importData,
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
