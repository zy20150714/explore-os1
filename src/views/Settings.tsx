import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/GlassCard';
import { Settings, Cookie, Download, Upload, Trash2, Shield, Palette, Database, Save, X, Check, AlertTriangle, Image, Type, Layout, Minus, Plus, Wallpaper } from 'lucide-react';
import { useData, ThemeMode, AccentColor, DensityMode, FontSizeMode, WallpaperMode } from '@/context/DataProvider';

const THEME_MODES = [
  { id: 'glass' as ThemeMode, label: '玻璃模式', icon: 'glass', color: 'from-teal-500 to-cyan-500' },
  { id: 'normal' as ThemeMode, label: '简约模式', icon: 'paper', color: 'from-slate-500 to-slate-600' },
  { id: 'dark' as ThemeMode, label: '深邃模式', icon: 'dark', color: 'from-gray-800 to-black' },
  { id: 'warm' as ThemeMode, label: '暖色模式', icon: 'warm', color: 'from-amber-500 to-orange-500' },
  { id: 'ocean' as ThemeMode, label: '海洋模式', icon: 'ocean', color: 'from-blue-600 to-cyan-600' },
];

const ACCENT_COLORS = [
  { id: 'teal' as AccentColor, label: '青色', hex: '#14b8a6' },
  { id: 'blue' as AccentColor, label: '蓝色', hex: '#3b82f6' },
  { id: 'purple' as AccentColor, label: '紫色', hex: '#a855f7' },
  { id: 'orange' as AccentColor, label: '橙色', hex: '#f97316' },
  { id: 'green' as AccentColor, label: '绿色', hex: '#22c55e' },
  { id: 'pink' as AccentColor, label: '粉色', hex: '#ec4899' },
];

const WALLPAPER_MODES = [
  { id: 'fluid' as WallpaperMode, label: '流体渐变' },
  { id: 'gradient' as WallpaperMode, label: '经典渐变' },
  { id: 'grid' as WallpaperMode, label: '网格' },
  { id: 'dots' as WallpaperMode, label: '点阵' },
  { id: 'stars' as WallpaperMode, label: '星空' },
  { id: 'solid' as WallpaperMode, label: '纯色' },
  { id: 'custom' as WallpaperMode, label: '自定义' },
];

const PRESET_WALLPAPERS = [
  { name: '山景', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80' },
  { name: '海浪', url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1920&q=80' },
  { name: '森林', url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1920&q=80' },
  { name: '星空', url: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=1920&q=80' },
];

export function SettingsView() {
  const { 
    cookieExpiryDays, setCookieExpiryDays,
    clearAllData, exportData, importData,
    settings, updateSettings,
  } = useData();
  
  const [activeTab, setActiveTab] = useState<'theme' | 'personalize' | 'data' | 'about'>('theme');
  const [customDays, setCustomDays] = useState(cookieExpiryDays.toString());
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [importText, setImportText] = useState('');
  const [importResult, setImportResult] = useState<'success' | 'error' | null>(null);
  const [exportResult, setExportResult] = useState(false);
  const [uploadingWallpaper, setUploadingWallpaper] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const exportTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const importTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (exportTimerRef.current) clearTimeout(exportTimerRef.current);
      if (importTimerRef.current) clearTimeout(importTimerRef.current);
    };
  }, []);

  const handleSaveDays = () => {
    const days = parseInt(customDays, 10);
    if (days > 0 && days <= 36500) {
      setCookieExpiryDays(days);
    }
  };

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `explore-os-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExportResult(true);
    setTimeout(() => setExportResult(false), 2000);
  };

  const handleImport = () => {
    const success = importData(importText);
    setImportResult(success ? 'success' : 'error');
    importTimerRef.current = setTimeout(() => setImportResult(null), 3000);
    if (success) setImportText('');
  };

  const handleClearData = () => {
    clearAllData();
    setShowClearConfirm(false);
  };

  const handleWallpaperUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    setUploadingWallpaper(true);
    const reader = new FileReader();
    reader.onload = () => {
      updateSettings({ customWallpaper: reader.result as string, wallpaperMode: 'custom' });
      setUploadingWallpaper(false);
    };
    reader.readAsDataURL(file);
  };

  const tabs = [
    { id: 'theme' as const, label: '主题', icon: Palette },
    { id: 'personalize' as const, label: '个性化', icon: Wallpaper },
    { id: 'data' as const, label: '数据', icon: Database },
    { id: 'about' as const, label: '关于', icon: Shield },
  ];

  return (
    <div className="space-y-4 slide-up">
      <motion.h2 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3"
      >
        <span className="p-2.5 md:p-3 rounded-xl bg-slate-700/50 border border-slate-600/50">
          <Settings size={24} className="text-slate-300" />
        </span>
        设置
      </motion.h2>

      <div className="flex gap-1.5 overflow-x-auto pb-2 -mx-2 px-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            aria-label={tab.label}
            className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-xl text-xs md:text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id 
                ? 'bg-slate-700 text-white' 
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <tab.icon size={14} aria-hidden="true" />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'theme' && (
          <motion.div
            key="theme"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <GlassCard variant="paper" className="p-4 md:p-6">
              <h3 className="text-base md:text-lg font-medium text-white mb-4 flex items-center gap-2">
                <Palette size={16} className="text-slate-400" />
                显示模式
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {THEME_MODES.map(mode => (
                  <button
                    key={mode.id}
                    onClick={() => updateSettings({ themeMode: mode.id })}
                    aria-label={`选择${mode.label}`}
                    className={`relative overflow-hidden rounded-xl border-2 transition-all p-3 text-center ${
                      settings.themeMode === mode.id 
                        ? 'border-teal-500 shadow-lg shadow-teal-500/20' 
                        : 'border-slate-600/50 hover:border-slate-500'
                    }`}
                  >
                    <div className={`h-12 rounded-lg bg-gradient-to-br ${mode.color} mb-2`} />
                    <span className="text-xs text-slate-300">{mode.label}</span>
                    {settings.themeMode === mode.id && (
                      <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-teal-500 rounded-full flex items-center justify-center">
                        <Check size={10} className="text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </GlassCard>

            <GlassCard variant="paper" className="p-4 md:p-6">
              <h3 className="text-base md:text-lg font-medium text-white mb-4 flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-teal-500" />
                主题色
              </h3>
              <div className="flex gap-3 flex-wrap">
                {ACCENT_COLORS.map(color => (
                  <button
                    key={color.id}
                    onClick={() => updateSettings({ accentColor: color.id })}
                    aria-label={`选择${color.label}`}
                    className={`w-10 h-10 rounded-full border-2 transition-all hover:scale-110 ${
                      settings.accentColor === color.id 
                        ? 'border-white scale-110 shadow-lg' 
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
              </div>
            </GlassCard>

            <GlassCard variant="paper" className="p-4 md:p-6">
              <h3 className="text-base md:text-lg font-medium text-white mb-4 flex items-center gap-2">
                <Cookie size={16} className="text-slate-400" />
                Cookie 管理
              </h3>
              <div className="space-y-4">
                <p className="text-xs md:text-sm text-slate-400">
                  设置数据保存时间。每次访问会自动更新 Cookie 有效期。
                </p>
                <div className="flex gap-2 items-center flex-wrap">
                  <label htmlFor="cookie-days" className="text-xs md:text-sm text-slate-400 whitespace-nowrap">
                    保存天数
                  </label>
                  <input
                    id="cookie-days"
                    type="number"
                    min="1"
                    max="36500"
                    value={customDays}
                    onChange={(e) => setCustomDays(e.target.value)}
                    className="w-24 md:w-32 bg-slate-700/50 border border-slate-600/50 rounded-lg px-2 md:px-3 py-2 text-white text-xs md:text-sm focus:outline-none focus:border-teal-500 transition-colors"
                  />
                  <span className="text-xs md:text-sm text-slate-500">天</span>
                  <button
                    onClick={handleSaveDays}
                    aria-label="保存 Cookie 设置"
                    className="flex items-center gap-1 px-3 md:px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs md:text-sm font-medium transition-colors"
                  >
                    <Save size={12} />
                    保存
                  </button>
                </div>
                <div className="flex gap-4 text-xs text-slate-500">
                  <span>默认: 3650 天 (10 年)</span>
                  <span>当前: {cookieExpiryDays} 天</span>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {activeTab === 'personalize' && (
          <motion.div
            key="personalize"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <GlassCard variant="paper" className="p-4 md:p-6">
              <h3 className="text-base md:text-lg font-medium text-white mb-4 flex items-center gap-2">
                <Image size={16} className="text-slate-400" />
                背景壁纸
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-4 md:grid-cols-6 gap-1.5">
                  {WALLPAPER_MODES.map(mode => (
                    <button
                      key={mode.id}
                      onClick={() => updateSettings({ wallpaperMode: mode.id })}
                      className={`px-2 py-1.5 md:px-3 md:py-2 rounded-lg text-xs transition-colors ${
                        settings.wallpaperMode === mode.id
                          ? 'bg-teal-600 text-white'
                          : 'bg-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-700'
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
                {settings.wallpaperMode === 'custom' && (
                  <div className="space-y-3 pt-3 border-t border-slate-700/50">
                    <p className="text-xs text-slate-400">选择预设壁纸或上传自定义图片</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {PRESET_WALLPAPERS.map((wp) => (
                        <button
                          key={wp.url}
                          onClick={() => updateSettings({ customWallpaper: wp.url })}
                          className={`relative rounded-xl overflow-hidden border-2 transition-all ${
                            settings.customWallpaper === wp.url ? 'border-teal-500' : 'border-transparent hover:border-slate-500'
                          }`}
                        >
                          <img src={wp.url} alt={wp.name} width="480" height="270" className="w-full h-20 md:h-24 object-cover" loading="lazy" />
                          <span className="absolute bottom-1 left-1 text-[10px] bg-black/60 text-white px-1.5 py-0.5 rounded">{wp.name}</span>
                        </button>
                      ))}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleWallpaperUpload}
                      className="hidden"
                      aria-label="上传自定义壁纸"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingWallpaper}
                      className="w-full py-2.5 border-2 border-dashed border-slate-600 rounded-xl text-slate-400 hover:text-white hover:border-slate-500 transition-colors text-sm flex items-center justify-center gap-2"
                    >
                      <Upload size={14} />
                      {uploadingWallpaper ? '上传中…' : '上传自定义壁纸'}
                    </button>
                  </div>
                )}
                {settings.wallpaperMode !== 'custom' && (
                  <div>
                    <label className="text-xs text-slate-400 mb-2 block">壁纸透明度</label>
                    <div className="flex items-center gap-3">
                      <Minus size={14} className="text-slate-500" />
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={Math.round(settings.wallpaperOpacity * 100)}
                        onChange={(e) => updateSettings({ wallpaperOpacity: parseInt(e.target.value) / 100 })}
                        className="flex-1 h-1.5 bg-slate-700 rounded-full appearance-none cursor-pointer focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-800"
                      />
                      <Plus size={14} className="text-slate-500" />
                      <span className="text-xs text-slate-400 w-12 text-right">{Math.round(settings.wallpaperOpacity * 100)}%</span>
                    </div>
                  </div>
                )}
              </div>
            </GlassCard>

            <GlassCard variant="paper" className="p-4 md:p-6">
              <h3 className="text-base md:text-lg font-medium text-white mb-4 flex items-center gap-2">
                <Layout size={16} className="text-slate-400" />
                布局密度
              </h3>
              <div className="flex gap-2">
                {([
                  { id: 'compact' as DensityMode, label: '紧凑' },
                  { id: 'standard' as DensityMode, label: '标准' },
                  { id: 'spacious' as DensityMode, label: '宽松' },
                ]).map(mode => (
                  <button
                    key={mode.id}
                    onClick={() => updateSettings({ densityMode: mode.id })}
                    className={`flex-1 py-2 rounded-lg text-xs md:text-sm transition-colors ${
                      settings.densityMode === mode.id
                        ? 'bg-teal-600 text-white'
                        : 'bg-slate-700/50 text-slate-400 hover:text-white'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </GlassCard>

            <GlassCard variant="paper" className="p-4 md:p-6">
              <h3 className="text-base md:text-lg font-medium text-white mb-4 flex items-center gap-2">
                <Type size={16} className="text-slate-400" />
                字体大小
              </h3>
              <div className="flex gap-2">
                {([
                  { id: 'small' as FontSizeMode, label: '小' },
                  { id: 'medium' as FontSizeMode, label: '中' },
                  { id: 'large' as FontSizeMode, label: '大' },
                ]).map(mode => (
                  <button
                    key={mode.id}
                    onClick={() => updateSettings({ fontSizeMode: mode.id })}
                    className={`flex-1 py-2 rounded-lg text-xs md:text-sm transition-colors ${
                      settings.fontSizeMode === mode.id
                        ? 'bg-teal-600 text-white'
                        : 'bg-slate-700/50 text-slate-400 hover:text-white'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}

        {activeTab === 'data' && (
          <motion.div
            key="data"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <GlassCard variant="paper" className="p-4 md:p-6">
              <h3 className="text-base md:text-lg font-medium text-white mb-4 flex items-center gap-2">
                <Download size={16} className="text-slate-400" />
                导出数据
              </h3>
              <p className="text-xs md:text-sm text-slate-400 mb-4">
                将所有数据导出为 JSON 文件，用于备份或迁移。
              </p>
              <button
                onClick={handleExport}
                aria-label="导出数据"
                className="flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs md:text-sm font-medium transition-colors"
              >
                <Download size={14} />
                导出备份
              </button>
              {exportResult && (
                <p className="mt-2 text-xs md:text-sm text-green-400 flex items-center gap-1" role="status">
                  <Check size={12} /> 导出成功
                </p>
              )}
            </GlassCard>

            <GlassCard variant="paper" className="p-4 md:p-6">
              <h3 className="text-base md:text-lg font-medium text-white mb-4 flex items-center gap-2">
                <Upload size={16} className="text-slate-400" />
                导入数据
              </h3>
              <p className="text-xs md:text-sm text-slate-400 mb-4">
                从备份文件导入数据。导入将覆盖现有数据。
              </p>
              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="粘贴 JSON 备份数据…"
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white text-xs md:text-sm h-24 resize-none focus:outline-none focus:border-teal-500 transition-colors font-mono"
              />
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleImport}
                  disabled={!importText.trim()}
                  aria-label="导入数据"
                  className="flex items-center gap-1.5 px-4 md:px-5 py-2 md:py-2.5 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-xs md:text-sm font-medium transition-colors"
                >
                  <Upload size={14} />
                  导入
                </button>
              </div>
              {importResult && (
                <p className={`mt-2 text-xs md:text-sm flex items-center gap-1 ${importResult === 'success' ? 'text-green-400' : 'text-red-400'}`} role="status">
                  {importResult === 'success' ? <Check size={12} /> : <X size={12} />}
                  {importResult === 'success' ? '导入成功' : '导入失败，请检查数据格式'}
                </p>
              )}
            </GlassCard>

            <GlassCard variant="paper" className="p-4 md:p-6 border-red-500/30">
              <h3 className="text-base md:text-lg font-medium text-red-300 mb-4 flex items-center gap-2">
                <Trash2 size={16} className="text-red-400" />
                清除所有数据
              </h3>
              <p className="text-xs md:text-sm text-slate-400 mb-4">
                清除所有待办、项目、日程、习惯等数据。此操作不可撤销。
              </p>
              {!showClearConfirm ? (
                <button
                  onClick={() => setShowClearConfirm(true)}
                  aria-label="清除所有数据"
                  className="flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 rounded-xl text-xs md:text-sm font-medium transition-colors"
                >
                  <Trash2 size={14} />
                  清除数据
                </button>
              ) : (
                <div className="flex gap-2 items-center flex-wrap">
                  <span className="text-xs md:text-sm text-red-400 flex items-center gap-1">
                    <AlertTriangle size={12} /> 确认清除？
                  </span>
                  <button
                    onClick={handleClearData}
                    aria-label="确认清除"
                    className="px-3 md:px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs md:text-sm font-medium transition-colors"
                  >
                    确认
                  </button>
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    aria-label="取消"
                    className="px-3 md:px-4 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs md:text-sm font-medium transition-colors"
                  >
                    取消
                  </button>
                </div>
              )}
            </GlassCard>
          </motion.div>
        )}

        {activeTab === 'about' && (
          <motion.div
            key="about"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <GlassCard variant="paper" className="p-4 md:p-6">
              <h3 className="text-base md:text-lg font-medium text-white mb-4">Explore OS</h3>
              <div className="space-y-3 text-xs md:text-sm text-slate-400">
                <p>版本: v3.2</p>
                <p>现代化个人管理工作台</p>
                <p>功能包括：待办事项、项目管理、日程安排、生活手账、成就系统、番茄时钟、个性化设置等。</p>
                <div className="pt-3 border-t border-slate-700/50">
                  <p className="text-xs text-slate-500">
                    数据存储在浏览器 Cookie 中，清除浏览器数据会导致数据丢失。建议定期导出备份。
                  </p>
                  <p className="text-xs text-slate-600 mt-1">
                    AI 辅助开发 · 提升开发效率 · 持续优化中
                  </p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
