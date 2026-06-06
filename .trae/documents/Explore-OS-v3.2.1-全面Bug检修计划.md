# Explore OS v3.2.1 全面 Bug 检修与功能优化计划

## 摘要

对 Explore OS 进行全面审查，发现 35+ 个 Bug 和 Web 界面规范违规项，涵盖交互缺陷、无障碍问题、UI 设计不一致、动画不当、代码规范遗漏等。本计划按优先级分 4 批次修复。

---

## Phase 1: 🚨 关键交互 Bug（影响功能正常运行）

### Bug #1: 待办事项完成按钮无视觉反馈
- **位置**: `src/views/Todo.tsx` L213-216
- **问题**: 空心圆按钮点击后无任何视觉反馈过渡，用户无法确认操作
- **修复**:
  - 在 Todo 的待办按钮上添加 `hover:bg-teal-600/20` 和 hover 时显示 Check 图标
  - 用 CSS group hover 效果：圆内淡入 Check 图标
  - 已完成任务中的完成按钮保持不变

### Bug #2: 侧边栏"切换主题"按钮始终显示错误文案
- **位置**: `src/components/Sidebar.tsx` L181
- **问题**: 始终只显示 "玻璃模式" 或 "简约模式"，未反映实际 5 种 theme
- **修复**: 改为动态映射 `themeMode` 到对应 label，例如 `{ glass: '玻璃模式', normal: '简约模式', dark: '深邃模式', warm: '暖色模式', ocean: '海洋模式' }[settings.themeMode]`

### Bug #3: 版本号错误
- **位置**: `src/components/Sidebar.tsx` L191
- **问题**: 显示 v3.1 实际为 v3.2
- **修复**: `'Explore OS v3.2'`

### Bug #4: CSS 动画 `transition: all` 违反 Web 规范
- **位置**: `src/index.css` L233 (scrollbar)、L239 (scrollbar hover)
- **问题**: `transition: background 0.3s ease` 用于 scrollbar-thumb，应改用纯 CSS 过渡
- **修复**: 改为 `transition: background-color 0.3s ease`

### Bug #5: `outline-none` 缺少 focus-visible 替换
- **位置**: 多个文件（Todo.tsx, Projects.tsx, Calendar.tsx 等）中 `focus:outline-none focus:border-*` 
- **问题**: Web 规范要求 outline-none 需提供 focus-visible 替代方案
- **修复**: 添加 `focus-visible:ring-2 focus-visible:ring-*` 到所有交互元素

### Bug #6: 首页统计卡片"日程总数"文案误导
- **位置**: `src/views/Home.tsx` L112
- **问题**: 标签"日程总数"实际显示的是今日日程数 `stats.todayEvents`
- **修复**: 改为"今日日程"

---

## Phase 2: 🛠️ 功能修复与 UI 和谐性优化

### Bug #7: 待办事项空状态图标语义不匹配
- **位置**: `src/views/Todo.tsx` L249
- **问题**: 无待办时显示 `Check` ✓ 图标，但用户理解是"未完成"
- **修复**: 改用 `ClipboardList` 或 `ListTodo` 图标

### Bug #8: 成就页 `gradient-text` 可能在某些浏览器下不可见
- **位置**: `src/views/Achievements.tsx` L24, L49 — 使用 `gradient-text` 类
- **修复**: 添加 `-webkit-text-fill-color: transparent` 增强兼容性，或改用普通白色文字+彩色 Accent 边框

### Bug #9: 主题色设置从未生效
- **位置**: `src/context/DataProvider.tsx` L60 — 定义了 `accentColor` 字段，但无任何组件读取使用
- **修复**: 在玻璃卡片、按钮、进度条等关键交互元素中使用 `settings.accentColor` 来动态调整色彩

### Bug #10: 各页面 Header 风格不统一
- **位置**: 6 个视图页面中标题样式各异
- **问题**: Home 用 h1 大标题，Todo 用 ListChecks 图标，Achievements 用 gradient-text，Journal 用 gradient-text+渐变背景
- **修复**: 统一为一致的 header 组件模式（图标 + 标题文字），移除 `gradient-text`

### Bug #11: 多个交互元素缺少 hover/focus 状态
- **位置**: Sidebar 中菜单项、设置页 Tab、应用中心卡片
- **修复**: 补充 `hover:bg-*` 和 `focus-visible:ring-*`

### Bug #12: 进度条动画每次重渲染都会从 0 动画到目标值
- **位置**: `src/views/Projects.tsx` L252-257
- **问题**: `motion.div` 的 `initial={{width: 0}}` 导致每当列表更新时所有进度条都重新动画
- **修复**: 移除 `initial` 并只保留 `animate`，或使用 `layout` 属性代替

### Bug #13: GlassCard 泛光 hover 效果始终是 teal 色
- **位置**: `src/index.css` L51-53
- **问题**: `.glass-card:hover { box-shadow: 0 10px 30px rgba(45, 212, 191, 0.15) }` — 不管主题色是什么
- **修复**: 改为中立色系 `rgba(148, 163, 184, 0.1)` 或通过 CSS 变量传递主题色

---

## Phase 3: ♿ 无障碍 & Web 接口规范合规

### Bug #14: 缺少 `focus-visible` 样式
- **位置**: 全局所有交互元素
- **修复**: 在 Tailwind 里全局设置 `ring-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500`

### Bug #15: 单引号 `...` 应改为省略号 `…`
- **位置**: Todo.tsx L86 `"输入任务内容..."`、Journal.tsx L67 `"写下你的心情..."` 等多处
- **修复**: 全局替换 `...` → `…`

### Bug #16: 弹窗缺少 `overscroll-behavior: contain`
- **位置**: Projects.tsx 删除确认弹窗、日历编辑弹窗
- **修复**: 在弹窗容器添加 `overscroll-behavior-contain` CSS 类

### Bug #17: 无 `touch-action: manipulation` 设置
- **位置**: 全局
- **修复**: 在 `body` 或 `#root` 上添加 `touch-action: manipulation` 以禁用双击缩放延迟

### Bug #18: 部分图片缺少 `width`/`height` 属性
- **位置**: `src/views/Settings.tsx` L282 — 壁纸预览 `<img>`
- **修复**: 添加 `width="480" height="270"`

### Bug #19: 标题缺少 `text-wrap: balance` 或 `text-pretty`
- **位置**: 所有视图的标题元素
- **修复**: 在 `index.css` 里为 `h1, h2, h3` 添加 `text-wrap: balance`

### Bug #20: 无 `<meta name="theme-color">` 设置
- **位置**: `index.html`
- **修复**: 添加 `<meta name="theme-color" content="#020617">`

### Bug #21: 侧边栏导航 `<nav>` 中应使用 `<a>`/`<Link>` 而非 `<button>`
- **位置**: `src/components/Sidebar.tsx` L97-L128
- **问题**: 使用 `<button>` 做导航不符合 Web 规范
- **评估**: 因为这是 SPA 内部路由切换，实际用 `<button>` 是合理的。跳过此项

---

## Phase 4: 🎨 设计体系强化

### Bug #22: 主题 `color-scheme` 属性未随主题切换
- **位置**: `src/index.css` L3
- **问题**: `html { color-scheme: dark }` 只设置了暗色模式，但 warm/normal 主题下应使用 `light`
- **修复**: 根据主题动态设置 `document.documentElement.style.colorScheme`

### Bug #23: emoji 使用过度（Journal.tsx）
- **位置**: `src/views/Journal.tsx` L54-L63
- **问题**: 心情表情使用了 6 个 emoji 按钮
- **修复**: 保留但减少为 3 个，添加 `aria-label`

### Bug #24: 成就徽章"习惯大师"条件不准确
- **位置**: `src/views/Achievements.tsx` L68
- **问题**: `stats.habitStreak >= 7` — 但 `habitStreak` 是 `weeklyCheckins.filter(Boolean).length`（本周打卡天数），并非连续天数
- **修复**: 改为计算实际连续打卡天数

### Bug #25: `default` variant 不应同时出现在多处
- **位置**: `src/components/GlassCard.tsx` L34
- **问题**: `default` variant 使用了 `bg-slate-800/60` 而 `paper` variant 使用 `bg-slate-800`，两者非常接近
- **修复**: 统一为 paper variant

---

## 实施清单

### 文件变更列表

| 文件 | 改动项 |
|------|--------|
| `src/views/Todo.tsx` | #1 完成按钮视觉反馈、#7 空状态图标、#15 省略号 |
| `src/components/Sidebar.tsx` | #2 主题切换文案、#3 版本号 |
| `src/index.css` | #4 transition 属性、#13 泛光颜色、#17 touch-action、#19 text-wrap、#20 meta theme-color |
| `src/views/Home.tsx` | #6 错误卡片标签 |
| `src/views/Achievements.tsx` | #8 gradient-text 兼容、#24 习惯大师条件 |
| `src/views/Projects.tsx` | #12 进度条动画修复、#16 overscroll-behavior |
| `src/views/Calendar.tsx` | #5 focus-visible ring、#16 overscroll-behavior |
| `src/views/Settings.tsx` | #18 img 尺寸 |
| `src/views/Journal.tsx` | #23 emoji 优化、#15 省略号 |
| `src/components/GlassCard.tsx` | #25 variant 统一 |
| `src/context/DataProvider.tsx` | #9 主题色应用到实际 UI |
| `index.html` | #20 meta theme-color |
| `src/App.tsx` | #22 动态 color-scheme、#9 accent 色应用到背景 |
| 全局 | #5 所有 `focus:outline-none` 添加 `focus-visible:ring-2` 替代 |

### 验证步骤
1. `npx tsc --noEmit` — TypeScript 编译 0 错误
2. `npm run build` — Vite 构建成功
3. 手动测试：每个页面交互、主题切换、待办勾选/删除、长期事项打卡/删除、日历事件编辑