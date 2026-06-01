# Explore OS v3.1 全面优化计划

## 一、浏览器兼容性与适配性优化

### 1.1 CSS 兼容性增强（支持 Chrome 109+ / Edge 109+）

**问题：**
- Chrome 109 不支持 `backdrop-filter` 的某些新语法
- Edge 109 不支持 `text-wrap: balance`
- 部分旧内核浏览器不支持 `@layer` 指令
- `bg-clip-text` 需要 `-webkit-` 前缀

**实施步骤：**
1. `src/index.css` 中添加浏览器前缀和降级方案：
   - `backdrop-filter: blur()` 添加 `-webkit-backdrop-filter` 前缀
   - 移除 `@layer` 语法，改用传统 CSS 层级
   - 为 `bg-clip-text` 添加 `-webkit-background-clip` 前缀
   - 为 `animate-in` 等 Tailwind 动画添加降级 CSS
   - 添加 `color-scheme: dark` 到 html 元素
   - 为 `<select>` 等原生控件添加显式背景色（Windows 暗色模式兼容）
2. 添加 `prefers-reduced-motion` 媒体查询，减少动画对敏感用户的影响
3. 为不支持 `gap` 的旧版 flex 布局添加 margin 降级方案
4. 移除 `transition: all`，明确指定过渡属性

### 1.2 JavaScript 兼容性

**问题：**
- framer-motion 可能在旧内核浏览器上运行异常
- 部分现代 JS API 可能不被支持

**实施步骤：**
1. 在 `vite.config.ts` 中配置 `@vitejs/plugin-legacy` 为旧浏览器生成兼容代码
2. 添加 `browserslist` 到 `package.json`：
   ```json
   "browserslist": ["Chrome >= 109", "Edge >= 109", "Firefox >= 100", "Safari >= 15"]
   ```
3. 确保所有 `Date` 操作使用标准 API（避免 `Temporal` 等新 API）

### 1.3 响应式适配全面增强

**实施步骤：**
1. 所有组件添加完整的断点支持：
   - 超小屏幕（< 480px）
   - 小屏幕（480px - 768px）
   - 中等屏幕（768px - 1024px）
   - 大屏幕（1024px - 1440px）
   - 超大屏幕（> 1440px）
2. 添加安全区域支持：`env(safe-area-inset-*)`
3. 触摸设备优化：`touch-action: manipulation`
4. 横向屏幕适配

---

## 二、UI 设计系统全面重构（去除 AI 感）

### 2.1 打破死板的 UI 模式

**问题：**
- 过度依赖渐变和发光效果
- 所有卡片样式过于统一
- 过度使用 emoji 表情
- 动画效果过于花哨

**实施步骤：**
1. 重构 `src/index.css`：
   - 创建更多样化的卡片变体（不只是玻璃态）
   - 添加纸质/扁平风格的备选设计
   - 减少全局发光效果的使用频率
   - 移除或减少 emoji 的使用，改用 Lucide 图标
2. 重构 `src/components/GlassCard.tsx`：
   - 添加 `paper` 变体（纯扁平风格）
   - 添加 `minimal` 变体（极简边框）
   - 优化 `glow` 变体，减少发光强度
3. 优化所有视图组件：
   - 用 Lucide 图标替换 emoji
   - 增加留白和呼吸感
   - 使用更自然的色彩搭配
   - 减少动画数量，提高动画质量

### 2.2 设计令牌系统

**实施步骤：**
1. 创建 `src/styles/tokens.css`：
   - 定义统一的颜色变量（CSS 自定义属性）
   - 定义间距系统
   - 定义圆角系统
   - 定义阴影系统
2. 在组件中使用 CSS 变量代替硬编码值

---

## 三、设置功能

### 3.1 设置页面

**实施步骤：**
1. 创建 `src/views/Settings.tsx`：
   - 主题设置（玻璃模式/简约模式/暗色模式/亮色模式）
   - Cookie 管理（查看、清除、修改保存时间）
   - 数据管理（导出/导入数据）
   - 关于信息
2. 在 Sidebar 中添加"设置"入口
3. 更新 `DataProvider` 添加设置相关状态

### 3.2 Cookie 管理系统

**需求：**
- Cookie 默认保存时间为 10 年
- 每次重新登录都会更新 Cookie 保存时间
- 用户可自定义保存时间

**实施步骤：**
1. 修改 `src/utils/cookie.ts`：
   - 修改默认保存时间为 10 年（3650 天）
   - 添加 `refreshCookie()` 函数，更新现有 Cookie 的过期时间
2. 修改 `src/context/DataProvider.tsx`：
   - 在每次应用加载时，刷新所有 Cookie 的过期时间
   - 添加 `cookieExpiryDays` 状态，默认 3650
3. 在设置页面添加 Cookie 管理 UI：
   - 显示当前 Cookie 状态
   - 可调整保存时间
   - 一键清除所有数据

---

## 四、番茄时钟功能

### 4.1 番茄时钟组件

**实施步骤：**
1. 创建 `src/components/PomodoroTimer.tsx`：
   - 计时器显示（分:秒）
   - 开始/暂停/重置按钮
   - 工作/休息模式切换
   - 完成次数统计
   - 自定义工作时间（默认 25 分钟）
   - 自定义休息时间（默认 5 分钟）
2. 创建 `src/views/Pomodoro.tsx`：
   - 完整的番茄时钟界面
   - 今日完成统计
   - 历史记录
3. 在 `DataProvider` 中添加番茄时钟状态：
   - `pomodoroSessions`: 今日完成次数
   - `pomodoroHistory`: 历史记录
   - `addPomodoroSession()`: 添加完成记录
4. 在应用中心添加"番茄时钟"应用
5. 安装后可在 Sidebar 中显示

---

## 五、待办事项功能优化

### 5.1 添加界面动画与表单验证

**需求：**
- 与长期事项相同的添加界面动画
- 未填写任务名不可添加
- 未选择时间不可添加
- 添加失败时显示提示

**实施步骤：**
1. 修改 `src/views/Todo.tsx`：
   - 将添加表单改为可展开/收起模式（与 Projects 一致）
   - 添加展开/收起动画（使用 `AnimatePresence`）
   - 添加表单验证：
     - 任务名为空时，添加按钮禁用
     - 未选择日期时，添加按钮禁用
     - 显示验证错误提示
   - 添加错误提示组件（使用 `aria-live="polite"`）
2. 添加输入字段的 `label` 和 `aria-label`（无障碍访问）

---

## 六、长期事项功能优化

### 6.1 表单验证增强

**实施步骤：**
1. 修改 `src/views/Projects.tsx`：
   - 添加表单验证：
     - 项目名称为空时，创建按钮禁用
     - 未选择开始/结束日期时，创建按钮禁用
     - 显示验证错误提示
   - 添加错误提示组件

### 6.2 自动生成日程

**需求：**
- 每个长期事项的每一天都要在日历中显示
- 显示为"XXX长期事项的第N天"

**实施步骤：**
1. 修改 `src/context/DataProvider.tsx`：
   - 在 `projectEvents` 计算中，为每个项目的每一天生成日程事件
   - 计算当前是第几天：`Math.ceil((today - startDate) / (1000 * 3600 * 24)) + 1`
   - 生成事件标题格式：`${projectName} · 第${dayNum}天`
   - 只生成从今天开始到结束日期的事件（避免生成过多历史事件）
2. 优化日历视图显示：
   - 项目日程使用独特的颜色标识
   - 显示"第X天"标记

---

## 七、日程管理再次优化

### 7.1 日程视图增强

**实施步骤：**
1. 修改 `src/views/Calendar.tsx`：
   - 优化日历网格布局（更紧凑、更美观）
   - 添加日程类型筛选（全部/手动/项目/待办）
   - 优化日程列表显示（添加类型图标）
   - 改进日期选择器的视觉反馈
   - 添加"今天"快捷按钮
2. 优化日程事件显示：
   - 区分手动创建和自动生成的事件
   - 项目日程显示进度信息
   - 待办日程显示紧急程度

---

## 八、无障碍访问（Accessibility）

### 8.1 根据 Web Interface Guidelines 修复

**实施步骤：**
1. 所有图标按钮添加 `aria-label`
2. 所有表单控件添加 `<label>` 或 `aria-label`
3. 所有交互元素添加键盘事件处理（`onKeyDown`）
4. 使用语义化 HTML（`<button>` 用于操作，`<a>` 用于导航）
5. 装饰性图标添加 `aria-hidden="true"`
6. 异步更新添加 `aria-live="polite"`
7. 标题层级保持正确（`<h1>` → `<h2>` → `<h3>`）
8. 交互元素添加可见焦点状态：`focus-visible:ring-*`
9. 表单输入添加 `autocomplete` 和正确的 `type`
10. 添加 `beforeunload` 警告（有未保存更改时）

---

## 九、性能优化

### 9.1 动画性能

**实施步骤：**
1. 所有动画只使用 `transform` 和 `opacity`（合成器友好）
2. 移除 `transition: all`，明确指定过渡属性
3. 为长列表添加虚拟滚动（如果列表项 > 50）

### 9.2 渲染性能

**实施步骤：**
1. 使用 `React.memo` 优化不需要重新渲染的组件
2. 使用 `useCallback` 和 `useMemo` 优化函数和计算
3. 避免在渲染中读取布局属性

---

## 十、实施顺序

1. **第一阶段**：浏览器兼容性 + UI 去 AI 感
2. **第二阶段**：设置功能 + Cookie 管理
3. **第三阶段**：待办事项优化 + 长期事项优化
4. **第四阶段**：番茄时钟功能
5. **第五阶段**：日程管理优化
6. **第六阶段**：无障碍访问修复
7. **第七阶段**：性能优化 + 测试验证
