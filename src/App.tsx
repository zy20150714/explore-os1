import { useState, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SplashScreen } from "@/components/SplashScreen";
import { Layout } from "@/components/Layout";
import { ViewType } from "@/components/Sidebar";
import { Todo } from "@/views/Todo";
import { Projects } from "@/views/Projects";
import { CalendarView } from "@/views/Calendar";
import { Journal } from "@/views/Journal";
import { Achievements } from "@/views/Achievements";
import { Home } from "@/views/Home";
import { Pomodoro } from "@/views/Pomodoro";
import { SettingsView } from "@/views/Settings";
import { GlassCard } from "@/components/GlassCard";
import { Grid, Puzzle, Globe, Cloud, Zap, Shield, Timer, Download, Trash2 } from "lucide-react";
import { DataProvider, useData } from "@/context/DataProvider";
import { Onboarding } from "@/components/Onboarding";
import { CommandPalette } from "@/components/CommandPalette";

const THEME_BACKGROUNDS: Record<string, string> = {
  glass: 'bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900',
  normal: 'bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800',
  dark: 'bg-gradient-to-br from-black via-gray-900 to-black',
  warm: 'bg-gradient-to-br from-amber-950 via-orange-950 to-stone-900',
  ocean: 'bg-gradient-to-br from-blue-950 via-cyan-950 to-teal-900',
  light: 'bg-gradient-to-br from-slate-50 via-white to-slate-100',
  cream: 'bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50',
  mint: 'bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50',
};

function AppContent() {
  const { installApp, uninstallApp, installedApps, settings } = useData();
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);

  useEffect(() => {
    const darkThemes = ['glass', 'dark', 'ocean', 'warm', 'normal'];
    document.documentElement.style.colorScheme = darkThemes.includes(settings.themeMode) ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', settings.themeMode);
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', darkThemes.includes(settings.themeMode) ? '#020617' : '#f8fafc');
    }
  }, [settings.themeMode]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!settings.onboardingCompleted) {
      const timer = setTimeout(() => setShowOnboarding(true), 500);
      return () => clearTimeout(timer);
    }
  }, [settings.onboardingCompleted]);

  const handleInstall = useCallback((appId: string) => {
    installApp(appId);
  }, [installApp]);

  const handleUninstall = useCallback((appId: string) => {
    uninstallApp(appId);
  }, [uninstallApp]);

  const bgClass = THEME_BACKGROUNDS[settings.themeMode] || THEME_BACKGROUNDS.glass;

  const renderBackground = () => {
    if (settings.wallpaperMode === 'custom' && settings.customWallpaperUrl) {
      return (
        <div className="fixed inset-0 z-0" style={{ opacity: settings.wallpaperOpacity }}>
          <img src={settings.customWallpaperUrl} alt="" className="w-full h-full object-cover" aria-hidden="true" />
        </div>
      );
    }
    return null;
  };

  const renderView = () => {
    switch (currentView) {
      case 'home': return <Home onNavigate={setCurrentView} />;
      case 'todo': return <Todo />;
      case 'projects': return <Projects />;
      case 'calendar': return <CalendarView />;
      case 'journal': return <Journal />;
      case 'achievements': return <Achievements />;
      case 'pomodoro': return <Pomodoro />;
      case 'settings': return <SettingsView />;
      case 'apps': 
        return (
          <div className="space-y-4 md:space-y-6 slide-up">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3"
            >
              <span className="p-2.5 md:p-3 rounded-xl bg-slate-700/50 border border-slate-600/50">
                <Grid size={24} className="text-slate-300" />
              </span>
              应用中心
            </motion.h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {[
                { id: 'pomodoro', name: '番茄时钟', desc: '专注工作与休息计时器', icon: Timer, installed: installedApps?.includes('pomodoro') },
                { name: '插件市场', desc: '浏览和安装社区插件', icon: Puzzle },
                { name: '数据同步', desc: '云端数据同步与备份', icon: Cloud },
                { name: '集成中心', desc: '连接第三方服务', icon: Globe },
                { name: '自动化工具', desc: '设置自动化工作流', icon: Zap },
                { name: '安全中心', desc: '管理隐私与安全设置', icon: Shield },
              ].map((app, i) => (
                <motion.div
                  key={app.id || app.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.03 }}
                >
                  <GlassCard variant="paper" delay={0.05 + i * 0.03} className="p-4 md:p-5 flex flex-col gap-3 h-36 md:h-40">
                    <div className="flex items-start justify-between">
                      <div className="p-2 md:p-2.5 rounded-lg bg-slate-700/50">
                        <app.icon size={20} className="text-slate-300" />
                      </div>
                      {app.id && (
                        app.installed ? (
                          <button
                            onClick={() => handleUninstall(app.id)}
                            aria-label={`卸载 ${app.name}`}
                            className="flex items-center gap-1 px-2 py-1 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-full text-xs font-medium transition-colors"
                          >
                            <Trash2 size={10} /> 卸载
                          </button>
                        ) : (
                          <button
                            onClick={() => handleInstall(app.id)}
                            aria-label={`安装 ${app.name}`}
                            className="flex items-center gap-1 px-2.5 py-1 bg-teal-600 hover:bg-teal-500 text-white rounded-full text-xs font-medium transition-colors"
                          >
                            <Download size={10} /> 安装
                          </button>
                        )
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-white text-sm md:text-base">{app.name}</h3>
                      <p className="text-xs md:text-sm text-slate-400 mt-0.5">{app.desc}</p>
                    </div>
                    {!app.id && (
                      <span className="text-xs text-slate-600">即将上线</span>
                    )}
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        );
      default: return <Home onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className={bgClass}>
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:bg-teal-600 focus:text-white focus:rounded-lg"
      >
        跳转到主内容
      </a>
      {renderBackground()}
      <div className="relative z-10 min-h-screen">...
        <Layout currentView={currentView} onChangeView={setCurrentView}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </Layout>
      </div>
      {showOnboarding && <Onboarding onClose={() => setShowOnboarding(false)} />}
      {showCommandPalette && (
        <CommandPalette 
          onNavigate={(view) => setCurrentView(view)} 
          onClose={() => setShowCommandPalette(false)} 
        />
      )}
    </div>
  );
}

export function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <SplashScreen onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <DataProvider>
          <AppContent />
        </DataProvider>
      )}
    </>
  );
}
