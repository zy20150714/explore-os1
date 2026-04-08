此次合并将应用从 Liquid OS 更名为 Explore OS，同时将主题色调从蓝色系改为青色系。主要变更包括添加了数据持久化功能，通过 cookie 存储用户数据，以及简化了界面动画和样式，提升了性能。
| 文件 | 变更 |
|------|------|
| /workspace/index.html | - 将语言从 zh-CN 改为 en<br>- 将标题从 "Liquid OS 液态玻璃工作台" 改为 "Explore OS 我的工作台"
| /workspace/src/App.tsx | - 将网格图标颜色从 blue-400 改为 teal-400<br>- 将版本号从 v2.1 改为 v2.0 |
| /workspace/src/components/GlassCard.tsx | - 调整悬停效果：阴影从 shadow-xl 改为 shadow-lg，颜色从 blue-500 改为 teal-500，缩放从 1.02 改为 1.01，过渡时间从 500ms 改为 300ms<br>- 调整初始动画位置从 y: 20 改为 y: 10，动画过渡时间从 0.5s 改为 0.3s |
| /workspace/src/components/Layout.tsx | - 移除了鼠标移动背景效果和粒子效果，简化了布局 |
| /workspace/src/components/Sidebar.tsx | - 将图标背景从 blue-400/purple-600 改为 teal-400/emerald-600<br>- 将标题从 Liquid OS 改为 Explore OS<br>- 将文本渐变从 blue-200/purple-300 改为 teal-200/white<br>- 将版本号文本从 LIQUID OS v2.1 改为 EXPLORE OS v2.1 |
| /workspace/src/components/SplashScreen.tsx | - 将背景颜色从 #0a1128 改为 #0f172a，文本颜色从 blue-100 改为 teal-100<br>- 调整加载动画参数：等待时间从 800ms 改为 1500ms，更新间隔从 30ms 改为 50ms<br>- 简化背景效果，移除复杂动画和粒子效果<br>- 将标题从 Liquid OS 改为 EXPLORE OS<br>- 调整进度条颜色从 blue-400/indigo-500 改为 teal-400/emerald-500 |
| /workspace/src/context/DataProvider.tsx | - 添加了从 cookie 加载初始状态的逻辑<br>- 添加了状态变化时保存到 cookie 的 useEffect<br>- 添加了 timeline 和 weeklyCheckins 的 cookie 保存/加载 |
| /workspace/src/index.css | - 简化了玻璃效果样式，移除了多个工具类<br>- 将背景颜色从蓝色系改为青色系<br>- 调整了 mountain 元素的样式和动画<br>- 移除了粒子效果和渐变动画 |
| /workspace/src/utils/cookie.ts | - 新增文件，包含 cookie 操作工具函数，用于数据持久化 |
| /workspace/src/views/Home.tsx | - 移除了 motion 导入和所有动画效果<br>- 将标题渐变从 blue-200/purple-300 改为 teal-200/white<br>- 简化了专注任务卡片和快捷方式的样式<br>- 调整了快捷方式图标背景和悬停效果 |