# Explore OS v3.2 全面优化 PRD

## 一、问题分析

### 1.1 统计显示 Bug（严重）
**问题：** 首页显示"今日有 23 个日程安排"，但实际日历中只有 1 个
**根因：** `stats.totalEvents` 使用了 `allEvents.length`，`allEvents` 包含了所有历史+未来的项目日程和待办日程，不是今日的
**修复：** `stats.todayEvents` 应只统计 `isSameDay(event.start, new Date())` 的事件

### 1.2 长期事项打卡逻辑 Bug
**问题：** 明天开始的项目今天可以打卡
**根因：** `checkInProject` 没有检查 `today >= startDate`
**修复：** 打卡前验证今天是否在项目日期范围内

### 1.3 进度百分比精度
**问题：** `Math.round` 四舍五入到整数，不够精确
**修复：** 改为保留两位小数：`Math.round(value * 100) / 100`

### 1.4 动画问题
**问题：** 
- 待办/长期事项的新建表单展开动画生硬（高度 0→auto）
- 新建项目按钮点击后，表单区域没有明显的"弹出"感觉
**修复：** 使用 `scale + opacity` 组合动画，从中心椭圆展开为圆角矩形

### 1.5 日程编辑功能缺失
**问题：** 手动创建的日程、项目日程、待办日程都无法编辑
**修复：** 添加日程编辑/删除功能

---

## 二、优化需求清单

### 2.1 流畅度与性能优化
1. **低配电脑优化：**
   - framer-motion 动画降级：检测 `prefers-reduced-motion` 时禁用复杂动画
   - 使用 `will-change` 优化关键动画元素
   - 长列表使用 `content-visibility: auto`
   - 避免同时运行超过 10 个动画
   - 移除不必要的 `AnimatePresence` 嵌套

2. **渲染优化：**
   - `projectEvents` 计算限制最大生成天数（最多未来 365 天）
   - 日历视图避免每天重新计算事件（使用缓存 Map）
   - 使用 `React.memo` 包裹 GlassCard、Sidebar 项等纯展示组件

3. **CSS 性能：**
   - `backdrop-filter` 在不支持的设备上使用降级背景色
   - 避免 `filter: blur()` 在大面积元素上使用
   - 滚动使用 `transform` 代替 JS 滚动

### 2.2 动画优化
1. **表单展开动画重构：**
   - 待办事项：点击"新建任务"后，输入框从按钮位置以 scale(0.3) + opacity(0) 展开到完整表单
   - 长期事项：同样效果，从按钮位置弹出
   - 使用 `layoutId` 实现共享元素过渡

2. **页面切换动画：**
   - 减少动画时长（从 0.3s 降到 0.2s）
   - 使用更自然的缓动曲线 `ease-out`

3. **列表项动画：**
   - 待办项使用 `layout` 属性实现平滑重排
   - 删除动画改为收缩到 0 高度

### 2.3 个性化自定义
1. **自定义壁纸：**
   - 设置页添加"背景设置"tab
   - 预设壁纸：纯色渐变、流体渐变（现有）、网格线、点阵、星空
   - 支持上传自定义图片作为背景（转为 base64 存入 Cookie）
   - 壁纸透明度可调

2. **更多主题：**
   - 当前：玻璃模式、简约模式
   - 新增：暗色模式（纯黑底）、暖色模式、海洋模式
   - 主题色可选：teal（默认）、blue、purple、orange、green

3. **布局密度：**
   - 紧凑/标准/宽松 三档可选
   - 字体大小可调：小/中/大

### 2.4 功能优化
1. **应用管理：**
   - 应用中心支持卸载已安装应用
   - 卸载后从 Sidebar 移除

2. **日程编辑：**
   - 点击手动创建的日程可编辑（标题、颜色、备注、时间）
   - 项目日程可标记为特殊备注
   - 待办日程可快速标记完成

3. **首页统计修正：**
   - `stats.todayEvents`：今日事件数量
   - `stats.upcomingEvents`：未来 7 天事件数量
   - `stats.totalProjects`：项目总数

### 2.5 响应式优化
1. **多屏幕适配：**
   - 超小屏 (<480px)：单列布局，减小间距和字体
   - 小屏 (480-768px)：适当紧凑
   - 中屏 (768-1024px)：标准布局
   - 大屏 (1024-1440px)：宽松布局
   - 超大屏 (>1440px)：最大宽度限制，居中显示

2. **日历视图响应式：**
   - 移动端：上下布局（日历上，事件下）
   - 桌面端：左右布局（表单左，日历右）

3. **侧边栏响应式：**
   - 移动端默认收起，点击汉堡菜单展开
   - 桌面端默认展开

---

## 三、实施计划

### Phase 1: Bug 修复（优先级：最高）
1. `stats.todayEvents` 修正
2. `checkInProject` 日期范围验证
3. 进度精度改为两位小数
4. 项目日程生成限制 365 天

### Phase 2: 动画优化（优先级：高）
1. 表单展开动画重构（scale + opacity）
2. 页面切换动画优化
3. 列表项平滑重排
4. prefers-reduced-motion 支持

### Phase 3: 性能优化（优先级：高）
1. projectEvents 计算优化
2. React.memo / useMemo 优化
3. CSS 性能优化
4. content-visibility 优化

### Phase 4: 个性化自定义（优先级：中）
1. 自定义壁纸功能
2. 更多主题模式
3. 布局密度/字体大小调节
4. 背景透明度调节

### Phase 5: 功能增强（优先级：中）
1. 应用卸载功能
2. 日程编辑功能
3. 首页统计修正
4. 响应式布局优化

---

## 四、技术细节

### 4.1 首页统计修正
```typescript
const todayEvents = useMemo(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return allEvents.filter(e => {
    const eventDate = new Date(e.start);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate.getTime() === today.getTime();
  });
}, [allEvents]);
```

### 4.2 打卡验证
```typescript
const checkInProject = useCallback((id: number) => {
  const today = new Date().toISOString().split('T')[0];
  setProjects(prev => prev.map(p => {
    if (p.id !== id) return p;
    if (p.checkIns.includes(today)) return p;
    // 验证今天是否在项目日期范围内
    if (today < p.startDate || today > p.endDate) return p;
    // ... 打卡逻辑
  }));
}, []);
```

### 4.3 表单展开动画
```tsx
<AnimatePresence>
  {showForm && (
    <motion.div
      initial={{ scale: 0.3, opacity: 0, borderRadius: "50%" }}
      animate={{ scale: 1, opacity: 1, borderRadius: "16px" }}
      exit={{ scale: 0.3, opacity: 0, borderRadius: "50%" }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      {/* 表单内容 */}
    </motion.div>
  )}
</AnimatePresence>
```

### 4.4 项目日程限制
```typescript
// 最多生成未来 365 天的日程
const maxDate = new Date(today);
maxDate.setDate(maxDate.getDate() + 365);

const actualEndDate = endDate > maxDate ? maxDate : endDate;
```

---

## 五、验证清单
- [ ] 首页"今日日程"显示正确
- [ ] 明天开始的项目今天不能打卡
- [ ] 进度显示两位小数
- [ ] 表单展开动画流畅
- [ ] 自定义壁纸功能正常
- [ ] 应用可卸载
- [ ] 日程可编辑
- [ ] 响应式布局在各屏幕正常
- [ ] 低配电脑不卡顿
- [ ] prefers-reduced-motion 生效
