import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { SplashScreen } from "@/components/SplashScreen";
import { Layout } from "@/components/Layout";
import { ViewType } from "@/components/Sidebar";
import { Todo } from "@/views/Todo";
import { Projects } from "@/views/Projects";
import { CalendarView } from "@/views/Calendar";
import { Journal } from "@/views/Journal";
import { Achievements } from "@/views/Achievements";
import { Home } from "@/views/Home";
import { GlassCard } from "@/components/GlassCard";
import { Grid } from "lucide-react";
import { DataProvider } from "@/context/DataProvider";

export function App() {
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<ViewType>('home');

  useEffect(() => {
    // In a real app, you might check auth or load data here
  }, []);

  const renderView = () => {
    switch (currentView) {
      case 'home': return <Home onNavigate={setCurrentView} />;
      case 'todo': return <Todo />;
      case 'projects': return <Projects />;
      case 'calendar': return <CalendarView />;
      case 'journal': return <Journal />;
      case 'achievements': return <Achievements />;
      case 'apps': 
        return (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 animate-in fade-in zoom-in duration-500">
            <GlassCard className="p-12 flex flex-col items-center gap-6">
                <div className="p-6 bg-white/5 rounded-full border border-white/10">
                    <Grid size={48} className="text-blue-400" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">应用中心</h2>
                    <p className="text-slate-400 max-w-md">通过插件和集成扩展您的工作区。v2.0 版本敬请期待。</p>
                </div>
                <button className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors border border-white/10">
                    浏览目录
                </button>
            </GlassCard>
          </div>
        );
      default: return <Home onNavigate={setCurrentView} />;
    }
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <SplashScreen onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <DataProvider>
          <Layout currentView={currentView} onChangeView={setCurrentView}>
            {renderView()}
          </Layout>
        </DataProvider>
      )}
    </>
  );
}
