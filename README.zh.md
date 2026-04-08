# Explore OS

一个现代化的工作台应用，旨在帮助用户高效管理任务、项目、日程和个人手账。

## 功能特性

- **任务管理**：创建、跟踪和完成任务，支持优先级设置和截止日期
- **项目管理**：跟踪项目进度和管理截止日期
- **日历**：安排事件和查看日程
- **生活手账**：跟踪习惯、创建时间线条目和维护每周打卡
- **成就系统**：查看进度和获得的成就
- **应用中心**：访问插件和集成

## 开始使用

### 前置要求

- Node.js (v18+)
- npm 或 pnpm

### 安装

1. 克隆仓库
2. 安装依赖
   ```bash
   npm install
   # 或
   pnpm install
   ```
3. 启动开发服务器
   ```bash
   npm run dev
   # 或
   pnpm dev
   ```
4. 构建生产版本
   ```bash
   npm run build
   # 或
   pnpm build
   ```

## 项目结构

```
/src
  /components        # 可复用 UI 组件
  /context           # React 上下文提供者
  /utils            # 工具函数
  /views            # 页面组件
  App.tsx           # 主应用组件
  index.css         # 全局样式
  main.tsx          # 应用入口点
```

## 核心组件

- **SplashScreen**：动画启动屏幕
- **Layout**：带有侧边栏的主应用布局
- **Sidebar**：导航和设置
- **GlassCard**：带有玻璃态效果的可复用卡片组件
- **DataProvider**：状态管理和数据持久化

## 技术栈

- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- Date-fns

## 数据持久化

数据使用 cookie 本地存储，确保您的信息在会话之间得到保留，无需后端服务器。

## 贡献

欢迎贡献！请随时提交 Pull Request。

## 许可证

MIT

---

## English Version

[View English README](README.md)
