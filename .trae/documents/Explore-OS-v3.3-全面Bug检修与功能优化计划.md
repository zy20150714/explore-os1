# Explore OS v3.3 — 全面 Bug 检修与功能优化计划

## 摘要

基于 Web Interface Guidelines 审计 + 全量代码审查，共发现 **20 个问题**（6 个功能 Bug、8 个代码质量/性能问题、6 个 UI/UX 优化项）。计划分 4 个阶段，按优先级从高到低执行。

---

## 一、当前状态分析

### 已修复（v3.2.1 已完成）
- 待办完成按钮视觉反馈 ✓
- 主题切换标签显示 ✓
- 版本号 v3.2 ✓
- CSS `touch-action`、`text-wrap`、`overscroll-contain`、`-webkit-text-fill-color` ✓
- 动态 `color-scheme` ✓
- 进度条不再从 0 重新动画 ✓
- 所有 `...` → `…` ✓
- `meta theme-color` ✓

### 新发现问题（本轮）

| # | 类别 | 文件 | 问题描述 |
|---|------|------|----------|
| B1 | Bug | SplashScreen.tsx:106 | 版本号显示 "v3.0" 应为 "v3.2" |
| B2 | Bug | Calendar.tsx:60-74 | 编辑日程时时间被重置为 9:00-10:00，丢失原始时间 |
| B3 | Bug | Settings.tsx:74,80 | `setTimeout` 无清理函数，组件卸载时内存泄漏 |
| B4 | Bug | Pomodoro.tsx:18 | `todayStr` 每次渲染重新计算，放入 useEffect 依赖导致不必要的 effect 重注册 |
| B5 | Bug | Pomodoro.tsx:128 | `transition-all` 违反 Web Guidelines（应列出具体属性） |
| B6 | Bug | Sidebar.tsx:56 | 侧边栏动画使用 `width` 属性（非合成器友好，卡顿） |
| B7 | 性能 | Pomodoro.tsx:177 | 设置面板 `height: 'auto'` 动画非合成器友好 |
| B8 | 代码质量 | Journal.tsx:96 | 时间轴 `key={idx}` — 无稳定 ID，导致 React  reconciliation 问题 |
| B9 | 代码质量 | Calendar.tsx:307 | 日程颜色点 `key={idx}` |
| B10 | 代码质量 | Achievements.tsx:34,69 | 统计卡片和徽章 `key={i}` |
| B11 | 代码质量 | Home.tsx:142 | 快捷入口 `key={i}` |
| B12 | 代码质量 | Settings.tsx:274 | 预设壁纸 `key={i}` |
| B13 | 代码质量 | App.tsx:88 | 应用中心列表 `key={i}` |
| B14 | 代码质量 | Pomodoro.tsx:128 | SVG 圆环 `transition: all` → 改为 `transition: stroke-dashoffset` |
| B15 | UI | GlassCard.tsx:41 | glow 变体始终使用 teal 渐变，与主题色无关 |
| B16 | UI | Journal.tsx:80-81,164 | 时间轴和习惯输入框缺 `focus-visible:ring` |
| B17 | UI | Calendar.tsx:352,382 | 编辑弹窗内输入框缺 `focus-visible:ring` |
| B18 | UI | Projects.tsx:375 | 自定义打卡日期输入缺 `focus-visible:ring` |
| B19 | UI | Settings.tsx:310 | 壁纸透明度滑块缺 `focus-visible:ring` |
| B20 | UI | 多处 | 空状态图标/文案风格不统一，各视图各有差异 |

---

## 二、变更计划

### 阶段 1：关键 Bug 修复（6 项）

#### B1: SplashScreen 版本号修正
- **文件**: `src/components/SplashScreen.tsx`
- **位置**: 第 106 行
- **当前**: `<div className="text-xs text-slate-500 tracking-widest">v3.0</div>`
- **修改**: `v3.0` → `v3.2`

#### B2: 日历编辑日程保留原始时间
- **文件**: `src/views/Calendar.tsx`
- **位置**: `handleSaveEdit` 函数 (第 60-74 行)
- **问题**: 保存编辑时强制将 `start` 和 `end` 设为 `9:00` 和 `10:00`
- **修改**: 保留原始事件的 `start` 和 `end` 时间，只更新 `title`、`color`、`note`
```tsx
// 修改前
const newDate = new Date(editingEvent.start);
newDate.setHours(9, 0, 0, 0);
const endDate = new Date(editingEvent.start);
endDate.setHours(10, 0, 0, 0);

// 修改后
updateEvent(editingEvent.id as number, {
  title: editTitle.trim(),
  color: editColor,
  note: editNote,
});
```

#### B3: Settings setTimeout 清理
- **文件**: `src/views/Settings.tsx`
- **位置**: `handleExport` (第 74 行) 和 `handleImport` (第 80 行)
- **修改**: 使用 `useRef` 保存 timer ID，在组件卸载时清理
```tsx
const exportTimerRef = useRef<ReturnType<typeof setTimeout>>();
const importTimerRef = useRef<ReturnType<typeof setTimeout>>();

useEffect(() => {
  return () => {
    if (exportTimerRef.current) clearTimeout(exportTimerRef.current);
    if (importTimerRef.current) clearTimeout(importTimerRef.current);
  };
}, []);

// 使用: exportTimerRef.current = setTimeout(...)
```

#### B4: Pomodoro todayStr 优化
- **文件**: `src/views/Pomodoro.tsx`
- **位置**: 第 18 行
- **修改**: 将 `todayStr` 移入 `useMemo`
```tsx
const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
```

#### B5: Pomodoro transition-all 修复
- **文件**: `src/views/Pomodoro.tsx`
- **位置**: 第 128 行
- **当前**: `className="transition-all duration-1000"`
- **修改**: `className="transition-[stroke-dashoffset] duration-1000"`

#### B6: Sidebar 宽度动画优化
- **文件**: `src/components/Sidebar.tsx`
- **位置**: 第 56-57 行
- **当前**: `animate={{ width: collapsed ? 72 : 256 }}`
- **问题**: 宽度动画强制 layout 重计算，低端设备卡顿
- **修改**: 改用 CSS transition + class 切换，GPU 合成器友好
```tsx
// 移除 framer-motion 的 width 动画，改用 CSS
className={cn(
  "h-full glass-panel flex flex-col relative z-20 transition-[width] duration-300 ease-in-out",
  collapsed ? "w-[72px]" : "w-64"
)}
```
同时移除 `motion.aside` 上的 `animate` 和 `transition` props。

---

### 阶段 2：代码质量 / 性能优化（7 项）

#### B7: Pomodoro 设置面板高度动画
- **文件**: `src/views/Pomodoro.tsx`
- **位置**: 第 177-181 行
- **当前**: `animate={{ height: 'auto', opacity: 1 }}` — `height: 'auto'` 不支持 CSS transition
- **修改**: 改用 `max-height` 或 `scaleY` 动画
```tsx
// 使用 AnimatePresence + scaleY 代替 height 动画
<motion.div
  initial={{ scaleY: 0, opacity: 0 }}
  animate={{ scaleY: 1, opacity: 1 }}
  exit={{ scaleY: 0, opacity: 0 }}
  style={{ transformOrigin: 'top' }}
  className="overflow-hidden"
>
```

#### B8-B13: key={idx} 修复（6 处）
- **文件**: `src/views/Journal.tsx:96`, `src/views/Calendar.tsx:307`, `src/views/Achievements.tsx:34,69`, `src/views/Home.tsx:142`, `src/views/Settings.tsx:274`, `src/App.tsx:88`
- **修改策略**:
  - **Journal 时间轴**: 时间轴条目无 ID，添加 `id: Date.now().toString()` 到 `JournalEntry` 类型，或使用 `${item.time}-${item.title}-${idx}` 作为 key
  - **Calendar 颜色点**: 使用 `event.color + idx` 组合 key
  - **Achievements**: statCards 加 `id` 字段，badges 加 `id` 字段
  - **Home shortcuts**: 使用 `item.view` 作为 key
  - **Settings 壁纸**: 使用 `wp.url` 作为 key
  - **App 应用中心**: 使用 `app.id || app.name` 作为 key

#### B14: SVG 动画属性显式化
- **文件**: `src/views/Pomodoro.tsx`
- **与 B5 合并处理**: 第 128 行 `transition-all` → `transition-[stroke-dashoffset]`

---

### 阶段 3：UI/UX 一致性优化（6 项）

#### B15: GlassCard glow 主题色适配
- **文件**: `src/components/GlassCard.tsx`
- **位置**: 第 41-42 行
- **当前**: glow 变体始终渲染 teal→emerald 渐变
- **修改**: 通过 props 传入 accentColor 或使用 CSS 变量
```tsx
// 新增 accentColor prop 或从 context 读取
interface GlassCardProps {
  // ... 现有 props
  accentColor?: string;
}

// 在 glow 变体中
{variant === 'glow' && (
  <div 
    className="absolute inset-0 pointer-events-none"
    style={{ 
      background: `linear-gradient(to bottom right, ${accentColor}10, transparent, ${accentColor}08)` 
    }} 
  />
)}
```
- 同时更新所有使用 `variant="glow"` 的调用处传入 accentColor

#### B16: Journal 输入框焦点状态
- **文件**: `src/views/Journal.tsx`
- **位置**: 第 80 行 (时间输入)、第 81 行 (标题输入)、第 164 行 (习惯输入)
- **修改**: 添加 `focus-visible:ring-2 focus-visible:ring-pink-500`（时间轴）/ `focus-visible:ring-green-500`（习惯）

#### B17: Calendar 编辑弹窗焦点状态
- **文件**: `src/views/Calendar.tsx`
- **位置**: 第 352 行 (标题)、第 382 行 (备注)
- **修改**: 添加 `focus-visible:ring-2 focus-visible:ring-blue-500`

#### B18: Projects 自定义打卡日期焦点状态
- **文件**: `src/views/Projects.tsx`
- **位置**: 第 375 行
- **修改**: 添加 `focus-visible:ring-2 focus-visible:ring-purple-500`

#### B19: Settings 滑块焦点状态
- **文件**: `src/views/Settings.tsx`
- **位置**: 第 310 行
- **修改**: 添加 `focus-visible:ring-2 focus-visible:ring-teal-500`

#### B20: 空状态统一
- **文件**: 多个视图
- **问题**: 空状态图标尺寸、文案风格、间距不统一
- **修改**: 在各视图空状态统一使用 `text-5xl` 图标 + `text-slate-600` + `text-sm` 文案 + `py-12` 间距
  - [Todo.tsx](file:///d:/explore-os1/src/views/Todo.tsx#L245-253) — 已统一 ✓
  - [Projects.tsx](file:///d:/explore-os1/src/views/Projects.tsx#L299-307) — 图标改为 `size={48}`，文案 `text-sm`
  - [Journal.tsx](file:///d:/explore-os1/src/views/Journal.tsx#L94) — 时间轴空状态样式统一
  - [Journal.tsx](file:///d:/explore-os1/src/views/Journal.tsx#L177) — 习惯空状态样式统一
  - [Calendar.tsx](file:///d:/explore-os1/src/views/Calendar.tsx#L229) — 无日程空状态样式统一

---

### 阶段 4：Web Guidelines 合规收尾

#### 额外检查项
- [x] 所有 `<img>` 已有 `width`/`height` ✓
- [x] 表单控件有 `<label>` 或 `aria-label` ✓
- [x] 图标按钮有 `aria-label` ✓
- [x] 已提供 `prefers-reduced-motion` 媒体查询 ✓
- [x] 已有 `touch-action: manipulation` ✓
- [x] 已有 `overscroll-behavior: contain` 在弹窗中 ✓
- [x] 已有 `text-wrap: balance` 在标题中 ✓
- [x] 已有 `tabular-nums` 在数字列中 ✓
- [x] 已有 `color-scheme` 动态切换 ✓
- [x] 已有 `meta name="theme-color"` ✓

---

## 三、涉及文件清单

| 文件 | 修改内容 | 阶段 |
|------|----------|------|
| `src/components/SplashScreen.tsx` | B1: 版本号 v3.0→v3.2 | 1 |
| `src/views/Calendar.tsx` | B2: 编辑保留时间 + B9: key 修复 + B17: 焦点状态 + B20: 空状态 | 1,2,3 |
| `src/views/Settings.tsx` | B3: setTimeout 清理 + B12: key 修复 + B19: 焦点状态 | 1,2,3 |
| `src/views/Pomodoro.tsx` | B4: todayStr memo + B5: transition-all + B7: 高度动画 | 1,2 |
| `src/components/Sidebar.tsx` | B6: 宽度动画改为 CSS transition | 1 |
| `src/views/Journal.tsx` | B8: key 修复 + B16: 焦点状态 + B20: 空状态 | 2,3 |
| `src/views/Achievements.tsx` | B10: key 修复 | 2 |
| `src/views/Home.tsx` | B11: key 修复 | 2 |
| `src/App.tsx` | B13: key 修复 | 2 |
| `src/components/GlassCard.tsx` | B15: glow 主题色适配 | 3 |
| `src/views/Projects.tsx` | B18: 焦点状态 + B20: 空状态 | 3 |

---

## 四、验证步骤

1. **TypeScript 编译**: `npx tsc --noEmit` — 确保 0 错误
2. **构建**: `npm run build` — 确保构建成功
3. **功能验证**:
   - 启动画面显示 v3.2
   - 日历编辑日程保留原始时间
   - 番茄钟动画流畅，无 transition-all 警告
   - 侧边栏折叠/展开使用 CSS transition，无卡顿
   - 设置页导出/导入后 timer 正常清理
   - 所有输入框有可见焦点环
   - 空状态风格统一
   - React DevTools 无 key 警告
4. **Git 提交**: 提交到 main 分支

---

## 五、假设与决策

- **决策 1**: 侧边栏宽度动画改用 CSS transition 而非 framer-motion，因为 width 动画非合成器友好，CSS transition 配合 `will-change` 性能更优
- **决策 2**: Journal 时间轴条目使用 `time-title-idx` 组合 key，因时间轴条目没有独立 ID 且不常变动
- **决策 3**: GlassCard glow 主题色通过新增 `accentColor` prop 传入，不从 context 读取（避免循环依赖），调用方从 `useData().settings.accentColor` 获取后传入
- **决策 4**: 不改动核心数据模型（Cookie 存储结构），保持向后兼容性
- **决策 5**: 不引入新的第三方依赖，保持轻量级