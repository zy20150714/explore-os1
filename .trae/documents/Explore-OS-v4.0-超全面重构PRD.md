# Explore OS v4.0 — 超全面重构 PRD

> **状态**: 等待确认  
> **范围**: 全面 Bug 修复 + 主题系统重构 + 新手引导 + 功能发现 + UI/UX 全面优化  
> **涉及文件**: 15 个（全部视图 + 全部组件 + 全局 CSS + 数据层）  
> **问题总数**: 48 个

---

## 一、核心问题根因诊断

### 问题 1：待办事项"没有完成按钮"

**根因**: [Todo.tsx](file:///d:/explore-os1/src/views/Todo.tsx#L216-L223) 的完成按钮采用 `group` hover 模式——按钮主体是一个纯边框空心圆，Check 图标只在 hover 时显示。对老用户尚且不易发现，对**新用户**完全不可见。

**现状代码**:
```tsx
// 按钮主体是空心的！hover 时才出现 Check 图标
<button className="group w-5 h-5 rounded-full border-2 border-slate-500 hover:border-teal-400 ...">
  <Check size={10} className="text-teal-400 opacity-0 group-hover:opacity-100" />
</button>
```

**修复方案**: 改为双状态按钮——未完成时显示空心圆 + 浅色提示图标，已完成时显示实心绿色圆 + Check 图标。始终可见，不会丢失。

### 问题 2：主题色永远是黑色

**根因**: 整个应用只有暗色主题，没有浅色模式。证据链：

| 位置 | 硬编码 | 影响 |
|------|--------|------|
| [index.css:3-4](file:///d:/explore-os1/src/index.css#L3-L4) | `html { color-scheme: dark; }` | 浏览器强制暗色渲染 |
| [index.css:18](file:///d:/explore-os1/src/index.css#L18) | `body { color: #f1f5f9; }` | 全局文字白色 |
| [index.css:251-254](file:///d:/explore-os1/src/index.css#L251-L254) | `select, input, textarea { background-color: rgba(30, 41, 59, 0.8); color: #f1f5f9; }` | 所有表单控件黑底白字 |
| [App.tsx:18-24](file:///d:/explore-os1/src/App.tsx#L18-L24) | 5 个主题 ALL 使用 `bg-slate-900`/`bg-gray-900`/`bg-amber-950`/`bg-blue-950` | 全部是暗色渐变 |
| [GlassCard.tsx:25-35](file:///d:/explore-os1/src/components/GlassCard.tsx#L25-L35) | 所有 variant 使用 `bg-slate-800` | 所有卡片黑底 |
| [index.css:29-35](file:///d:/explore-os1/src/index.css#L29-L35) | `.glass-panel { background: rgba(15, 23, 42, ...) }` | 侧边栏黑底 |
| [index.css:47-53](file:///d:/explore-os1/src/index.css#L47-L53) | `.glass-card { background: rgba(255, 255, 255, 0.1) }` | 半透明黑底 |
| [index.html:6](file:///d:/explore-os1/index.html#L6) | `<meta name="theme-color" content="#020617">` | 浏览栏黑色 |
| [DataProvider.tsx:143-150](file:///d:/explore-os1/src/context/DataProvider.tsx#L143-L150) | `DEFAULT_SETTINGS.themeMode: 'glass'` | 默认深色 |

**修复方案**: 新增 3 个真正的浅色主题（light/cream/mint），重构 GlassCard 和 index.css 支持 CSS 变量驱动色彩，实现真正的暗色/浅色双模式切换。

### 问题 3：新用户不友好

**根因**: 零引导、零提示、零教程。

| 缺失项 | 影响 |
|--------|------|
| 无新手引导弹窗/流程 | 用户不知道从哪开始 |
| 无功能说明/提示 | 不知道每个功能有什么用 |
| 无空状态操作指引 | 空列表时只有一个图标，没有"点击这里创建" |
| 侧边栏默认展开但有 8 个菜单项 | 信息过载 |
| 首页统计卡片无解释 | 数字含义不明 |
| 无快捷键提示 | 功能入口仅靠侧边栏 |

**修复方案**: 添加 3 步新手引导流程 + 全局工具提示 + 空状态操作指引 + 首页欢迎卡片。

### 问题 4：功能找不到

**根因**: 侧边栏是唯一导航入口，折叠后看不到标签，没有搜索、没有面包屑、没有快捷入口突出显示。

**修复方案**: 添加全局搜索（Cmd+K）、首页突出显示核心功能入口卡片、侧边栏折叠时显示图标提示。

---

## 二、完整问题清单（48 项）

### 第一类：功能 Bug（8 项）

| # | 文件 | 行号 | 问题描述 |
|---|------|------|----------|
| F1 | [Todo.tsx](file:///d:/explore-os1/src/views/Todo.tsx#L216-L223) | 216-223 | 完成按钮仅 hover 时显示图标，新用户完全看不到。需改为始终可见的双状态按钮 |
| F2 | [Settings.tsx](file:///d:/explore-os1/src/views/Settings.tsx#L83) | 83 | `handleExport` 中 `setTimeout` 未使用 ref 清理，与 import 的处理不一致 |
| F3 | [Journal.tsx](file:///d:/explore-os1/src/views/Journal.tsx#L84) | 84 | 时间输入框使用 `transition-all`（违反 Web Guidelines） |
| F4 | [Journal.tsx](file:///d:/explore-os1/src/views/Journal.tsx#L85) | 85 | 标题输入框使用 `transition-all`（违反 Web Guidelines） |
| F5 | [Journal.tsx](file:///d:/explore-os1/src/views/Journal.tsx#L168) | 168 | 习惯输入框使用 `transition-all`（违反 Web Guidelines） |
| F6 | [Achievements.tsx](file:///d:/explore-os1/src/views/Achievements.tsx#L122) | 122 | 生活手账记录卡片缺少 `accentColor` prop |
| F7 | [index.html](file:///d:/explore-os1/index.html#L2) | 2 | `lang="en"` 应为 `lang="zh-CN"` |
| F8 | [DataProvider.tsx](file:///d:/explore-os1/src/context/DataProvider.tsx#L161-L164) | 161-164 | 默认习惯硬编码"喝水 2L"、"阅读 30 分钟"，新用户不应有预制数据 |

### 第二类：主题系统重构（14 项）

| # | 文件 | 行号 | 修改内容 |
|---|------|------|----------|
| T1 | [index.css](file:///d:/explore-os1/src/index.css#L3-L4) | 3-4 | `html { color-scheme: dark; }` → 改为 `light dark` 或动态切换 |
| T2 | [index.css](file:///d:/explore-os1/src/index.css#L18) | 18 | `body { color: #f1f5f9; }` → 使用 CSS 变量 `var(--text-primary)` |
| T3 | [index.css](file:///d:/explore-os1/src/index.css#L251-L254) | 251-254 | `select, input, textarea` 硬编码暗色 → 使用 CSS 变量 |
| T4 | [index.css](file:///d:/explore-os1/src/index.css#L29-L35) | 29-35 | `.glass-panel` 硬编码 `rgba(15, 23, 42, ...)` → 使用 CSS 变量 |
| T5 | [index.css](file:///d:/explore-os1/src/index.css#L47-L53) | 47-53 | `.glass-card` 硬编码暗色 → 使用 CSS 变量 |
| T6 | [App.tsx](file:///d:/explore-os1/src/App.tsx#L18-L24) | 18-24 | 新增 3 个浅色主题（light/cream/mint） |
| T7 | [GlassCard.tsx](file:///d:/explore-os1/src/components/GlassCard.tsx#L25-L35) | 25-35 | 所有 variant 的 `bg-slate-800` → 使用 CSS 变量 `var(--card-bg)` |
| T8 | [index.html](file:///d:/explore-os1/index.html#L6) | 6 | `meta theme-color` 需动态跟随主题切换 |
| T9 | [Sidebar.tsx](file:///d:/explore-os1/src/components/Sidebar.tsx#L113-L116) | 113-116 | 菜单项 active 状态 `bg-slate-700/80` → 使用 CSS 变量 |
| T10 | [Sidebar.tsx](file:///d:/explore-os1/src/components/Sidebar.tsx#L56-L59) | 56-59 | `glass-panel` 类 → 新增 `glass-panel-light` 用于浅色主题 |
| T11 | [App.tsx](file:///d:/explore-os1/src/App.tsx#L30-L33) | 30-33 | `colorScheme` 映射需更新，新增 light 主题 |
| T12 | [Settings.tsx](file:///d:/explore-os1/src/views/Settings.tsx#L7-L13) | 7-13 | 主题选项需新增 3 个浅色模式 |
| T13 | [DataProvider.tsx](file:///d:/explore-os1/src/context/DataProvider.tsx#L52) | 52 | `ThemeMode` 类型需新增 `'light' | 'cream' | 'mint'` |
| T14 | 全局 | 各处 | 所有 `text-white`、`text-slate-300`、`text-slate-400` 等硬编码文字色 → 需使用 CSS 变量或条件类名 |

### 第三类：新手引导系统（8 项）

| # | 文件 | 修改内容 |
|---|------|----------|
| G1 | 新建 `src/components/Onboarding.tsx` | 3 步新手引导弹窗：欢迎 → 功能介绍 → 开始使用 |
| G2 | 新建 `src/components/Tooltip.tsx` | 全局工具提示组件 |
| G3 | [DataProvider.tsx](file:///d:/explore-os1/src/context/DataProvider.tsx) | 新增 `onboardingCompleted` 状态（存 Cookie） |
| G4 | [App.tsx](file:///d:/explore-os1/src/App.tsx#L159-L175) | 启动完成后检查是否需要显示新手引导 |
| G5 | [Home.tsx](file:///d:/explore-os1/src/views/Home.tsx#L51-L81) | 欢迎语区域新增"快速开始"引导卡片（新用户） |
| G6 | [Todo.tsx](file:///d:/explore-os1/src/views/Todo.tsx) | 空状态增加操作指引："输入任务名称，按回车即可添加" |
| G7 | [Projects.tsx](file:///d:/explore-os1/src/views/Projects.tsx#L298-L307) | 空状态增加操作指引："创建你的第一个长期项目" |
| G8 | [Calendar.tsx](file:///d:/explore-os1/src/views/Calendar.tsx#L222-L224) | 空状态增加操作指引："选择日期，创建日程安排" |

### 第四类：功能发现性优化（6 项）

| # | 文件 | 修改内容 |
|---|------|----------|
| D1 | 新建 `src/components/CommandPalette.tsx` | 全局搜索面板（Cmd+K），可搜索所有功能/项目/待办 |
| D2 | [App.tsx](file:///d:/explore-os1/src/App.tsx) | 注册全局 Cmd/Ctrl+K 快捷键 |
| D3 | [Sidebar.tsx](file:///d:/explore-os1/src/components/Sidebar.tsx#L62-L68) | 侧边栏折叠按钮添加 tooltip 提示 |
| D4 | [Sidebar.tsx](file:///d:/explore-os1/src/components/Sidebar.tsx#L97-L137) | 折叠状态下 hover 菜单项显示浮动标签 |
| D5 | [Home.tsx](file:///d:/explore-os1/src/views/Home.tsx#L135-L161) | 快速访问区增加"搜索"入口和"最近使用" |
| D6 | [Layout.tsx](file:///d:/explore-os1/src/components/Layout.tsx) | 顶部添加面包屑导航 |

### 第五类：UI/UX 全面优化（8 项）

| # | 文件 | 行号 | 修改内容 |
|---|------|------|----------|
| U1 | [Todo.tsx](file:///d:/explore-os1/src/views/Todo.tsx) | 全局 | 完成按钮改为始终可见；新增编辑功能；动画优化 |
| U2 | [GlassCard.tsx](file:///d:/explore-os1/src/components/GlassCard.tsx) | 18-20 | `initial={{ opacity: 0, y: 20 }}` 动画在翻页时会导致所有卡片重新动画。添加 `key` 或动画控制 |
| U3 | [index.css](file:///d:/explore-os1/src/index.css#L16) | 16 | `body { overflow: hidden; }` 改为 `overflow: hidden` 仅在根布局 |
| U4 | [index.css](file:///d:/explore-os1/src/index.css#L17) | 17 | 字体 `'Inter'` → 使用更独特的中文友好字体栈 |
| U5 | [Sidebar.tsx](file:///d:/explore-os1/src/components/Sidebar.tsx#L75-L79) | 75-79 | Logo 图标改为与应用主题色关联 |
| U6 | [Calendar.tsx](file:///d:/explore-os1/src/views/Calendar.tsx#L160-L166) | 160-166 | 备注 textarea 缺少 `focus-visible:ring` |
| U7 | [Pomodoro.tsx](file:///d:/explore-os1/src/views/Pomodoro.tsx#L193-L202) | 193-202 | 设置面板输入框缺少 `focus-visible:ring` |
| U8 | [Settings.tsx](file:///d:/explore-os1/src/views/Settings.tsx#L222-L229) | 222-229 | Cookie 天数输入框缺少 `focus-visible:ring` |

### 第六类：可访问性增强（4 项）

| # | 文件 | 修改内容 |
|---|------|----------|
| A1 | [index.html](file:///d:/explore-os1/index.html) | 添加 `<meta name="description">` 和跳过导航链接 |
| A2 | [App.tsx](file:///d:/explore-os1/src/App.tsx) | 添加 `#main-content` skip link |
| A3 | 全局 | 所有 `role="button"` 的 div 改为真实 `<button>` 元素 |
| A4 | [Layout.tsx](file:///d:/explore-os1/src/components/Layout.tsx#L33-L35) | main 区域添加 `id="main-content"` 和 `aria-label` |

---

## 三、详细实现方案

### 3.1 主题系统重建（CSS 变量方案）

#### 新增 CSS 变量定义（index.css）

```css
:root {
  /* 暗色主题变量（默认） */
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --bg-tertiary: #334155;
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --text-tertiary: #64748b;
  --border-color: rgba(148, 163, 184, 0.15);
  --card-bg: rgba(30, 41, 59, 0.8);
  --glass-bg: rgba(15, 23, 42, 0.6);
  --input-bg: rgba(30, 41, 59, 0.8);
  --input-text: #f1f5f9;
  --hover-bg: rgba(51, 65, 85, 0.5);
  --active-bg: rgba(51, 65, 85, 0.8);
  
  --accent: #14b8a6;
  --accent-light: #5eead4;
  --accent-dark: #0f766e;
}

[data-theme="light"],
[data-theme="cream"],
[data-theme="mint"] {
  --bg-primary: #f8fafc;
  --bg-secondary: #ffffff;
  --bg-tertiary: #e2e8f0;
  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-tertiary: #94a3b8;
  --border-color: rgba(0, 0, 0, 0.1);
  --card-bg: rgba(255, 255, 255, 0.9);
  --glass-bg: rgba(255, 255, 255, 0.7);
  --input-bg: rgba(241, 245, 249, 0.9);
  --input-text: #0f172a;
  --hover-bg: rgba(226, 232, 240, 0.7);
  --active-bg: rgba(203, 213, 225, 0.8);
}
```

#### 新增 3 个浅色主题

```ts
// App.tsx
const THEME_BACKGROUNDS: Record<string, string> = {
  // 现有暗色主题
  glass: 'bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900',
  normal: 'bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800',
  dark: 'bg-gradient-to-br from-black via-gray-900 to-black',
  warm: 'bg-gradient-to-br from-amber-950 via-orange-950 to-stone-900',
  ocean: 'bg-gradient-to-br from-blue-950 via-cyan-950 to-teal-900',
  // 新增浅色主题
  light: 'bg-gradient-to-br from-slate-50 via-white to-slate-100',
  cream: 'bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50',
  mint: 'bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50',
};
```

#### Settings 主题选项新增

```tsx
const THEME_MODES = [
  // 深色主题
  { id: 'glass', label: '玻璃模式', color: 'from-teal-500 to-cyan-500', dark: true },
  { id: 'normal', label: '简约模式', color: 'from-slate-500 to-slate-600', dark: true },
  { id: 'dark', label: '深邃模式', color: 'from-gray-800 to-black', dark: true },
  { id: 'warm', label: '暖色模式', color: 'from-amber-500 to-orange-500', dark: true },
  { id: 'ocean', label: '海洋模式', color: 'from-blue-600 to-cyan-600', dark: true },
  // 浅色主题
  { id: 'light', label: '明亮模式', color: 'from-slate-50 to-white', dark: false },
  { id: 'cream', label: '奶油模式', color: 'from-amber-50 to-orange-50', dark: false },
  { id: 'mint', label: '薄荷模式', color: 'from-emerald-50 to-teal-50', dark: false },
];
```

#### 动态 data-theme 属性

在 `App.tsx` 的 `useEffect` 中：

```tsx
useEffect(() => {
  const darkThemes = ['glass', 'dark', 'ocean', 'warm', 'normal'];
  document.documentElement.style.colorScheme = darkThemes.includes(settings.themeMode) ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', settings.themeMode);
  // 动态更新 meta theme-color
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', darkThemes.includes(settings.themeMode) ? '#020617' : '#f8fafc');
  }
}, [settings.themeMode]);
```

### 3.2 待办完成按钮重构

**修改前**（不可见）:
```tsx
<button className="group w-5 h-5 rounded-full border-2 border-slate-500 hover:border-teal-400 ...">
  <Check size={10} className="text-teal-400 opacity-0 group-hover:opacity-100" />
</button>
```

**修改后**（始终可见）:
```tsx
<button 
  onClick={() => toggleTodo(todo.id)}
  aria-label={todo.completed ? `取消完成 "${todo.text}"` : `标记 "${todo.text}" 为完成`}
  className={cn(
    "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
    todo.completed
      ? "bg-green-500 border-green-500 text-white"
      : "border-slate-400 hover:border-teal-400 hover:bg-teal-500/20"
  )}
>
  {todo.completed ? (
    <Check size={10} strokeWidth={3} />
  ) : (
    <Check size={10} strokeWidth={2} className="text-slate-500 opacity-40" />
  )}
</button>
```

### 3.3 新手引导系统

#### 引导流程（3 步）

1. **欢迎页**: "欢迎来到 Explore OS" + 简短介绍 + Logo 动画
2. **功能介绍**: 3 个核心功能卡片（待办/项目/日程）+ 图标说明
3. **开始使用**: "去首页开始探索" 按钮

#### 实现方式

- 新建 [Onboarding.tsx](file:///d:/explore-os1/src/components/Onboarding.tsx) 组件
- 使用 framer-motion 动画
- 完成后写入 `onboarding_completed` Cookie
- 仅在首次访问时显示，可在设置中重新触发

### 3.4 全局命令面板

#### 功能

- 快捷键: `Cmd+K` / `Ctrl+K`
- 搜索范围: 所有视图、项目名称、待办事项、设置项
- 使用 [cmdk](https://cmdk.paco.me/) 或自建简洁实现

#### 实现

- 新建 [CommandPalette.tsx](file:///d:/explore-os1/src/components/CommandPalette.tsx)
- 在 App.tsx 中注册全局快捷键
- 支持模糊搜索、键盘导航

### 3.5 其他关键修复

#### GlassCard CSS 变量化

```tsx
// 所有 variant 的 bg-slate-800 → var(--card-bg)
className={cn(
  "rounded-2xl p-5 overflow-hidden relative",
  variant === 'paper' ? "bg-[var(--card-bg)] border border-[var(--border-color)] shadow-sm" : ...
)}
```

#### index.css 全局样式重构

```css
body {
  color: var(--text-primary);
  background: var(--bg-primary);
  font-family: 'Inter', 'Noto Sans SC', -apple-system, BlinkMacSystemFont, sans-serif;
}

select, input, textarea {
  background-color: var(--input-bg);
  color: var(--input-text);
  border-color: var(--border-color);
}
```

---

## 四、文件修改清单

| 文件 | 修改量 | 主要内容 |
|------|--------|----------|
| `src/index.css` | 🔴 大改 | CSS 变量系统 + 全局样式重构 |
| `src/App.tsx` | 🔴 大改 | 新增浅色主题 + data-theme + 命令面板 |
| `src/components/GlassCard.tsx` | 🟡 中改 | CSS 变量化 |
| `src/components/Sidebar.tsx` | 🟡 中改 | 浅色适配 + tooltip |
| `src/views/Todo.tsx` | 🟡 中改 | 完成按钮重构 + 编辑功能 |
| `src/views/Settings.tsx` | 🟡 中改 | 新增浅色主题选项 + F2 修复 |
| `src/views/Home.tsx` | 🟡 中改 | 新手欢迎卡片 + 搜索入口 |
| `src/context/DataProvider.tsx` | 🟡 中改 | 新增 ThemeMode + onboarding 状态 |
| `src/views/Journal.tsx` | 🟢 小改 | transition-all 修复 |
| `src/views/Achievements.tsx` | 🟢 小改 | F6 缺失 accentColor |
| `src/views/Calendar.tsx` | 🟢 小改 | focus-visible:ring |
| `src/views/Pomodoro.tsx` | 🟢 小改 | focus-visible:ring |
| `src/views/Projects.tsx` | 🟢 小改 | 空状态指引 |
| `src/components/Layout.tsx` | 🟢 小改 | main-content id |
| `index.html` | 🟢 小改 | lang + description |
| **新建** `src/components/Onboarding.tsx` | 🆕 | 新手引导组件 |
| **新建** `src/components/CommandPalette.tsx` | 🆕 | 全局命令面板 |
| **新建** `src/components/Tooltip.tsx` | 🆕 | 工具提示组件 |

---

## 五、实施阶段

### 阶段 1：地基（CSS 变量 + 主题系统）
- T1-T14：CSS 变量系统建立 + 全部组件适配
- 预计修改：5 个文件

### 阶段 2：体验（功能 Bug + 可访问性）
- F1-F8：Todos 按钮 / transition-all / 默认数据 / 语言
- A1-A4：可访问性增强
- 预计修改：6 个文件

### 阶段 3：引导（新手引导 + 命令面板）
- G1-G8：Onboarding 组件 + CommandPalette + 空状态指引
- D1-D6：功能发现性优化
- 预计修改：4 个文件 + 3 个新文件

### 阶段 4：打磨（UI/UX 优化）
- U1-U8：细节打磨
- 预计修改：3 个文件

---

## 六、验证清单

- [ ] `npx tsc --noEmit` 零错误
- [ ] `npm run build` 构建成功
- [ ] 所有 8 个主题可正常切换（暗色 x5 + 浅色 x3）
- [ ] 浅色主题下文字可读、对比度达标
- [ ] 待办完成按钮始终可见，点击切换状态
- [ ] 新用户首次访问显示 3 步引导
- [ ] Cmd+K 打开命令面板，可搜索导航
- [ ] 侧边栏折叠态 hover 显示浮动标签
- [ ] 所有空状态有操作指引文字
- [ ] 无 `transition-all` 残留
- [ ] 所有输入框有 `focus-visible:ring`
- [ ] React DevTools 无 key 警告
- [ ] 所有图片有 width/height
- [ ] `<html lang="zh-CN">`

---

## 七、假设与决策

- **决策 1**: CSS 变量方案优于 Tailwind 条件类名方案——因为 14 个文件、上百处硬编码颜色，逐个加 `dark:`/`light:` 前缀工作量大且易遗漏。CSS 变量集中管理，一处修改全局生效。
- **决策 2**: 浅色主题选 `light`（白底）、`cream`（奶白）、`mint`（薄荷绿）——覆盖冷/暖/中性三种浅色风格，与现有 5 种暗色主题形成 8 主题矩阵。
- **决策 3**: 命令面板自建而非引入 cmdk 库——保持零依赖，功能简单（搜索导航），~100 行即可实现。
- **决策 4**: Onboarding 数据存 Cookie 而非 localStorage——与现有数据存储方案一致，10 年有效期。
- **决策 5**: 不引入新的第三方依赖，保持轻量级。