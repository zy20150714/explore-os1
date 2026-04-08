# Explore OS

A modern workspace application designed to help users manage tasks, projects, schedules, and personal journals efficiently.

## Features

- **Task Management**: Create, track, and complete tasks with priority settings and due dates
- **Project Management**: Track project progress and manage deadlines
- **Calendar**: Schedule events and view your agenda
- **Journal**: Track habits, create timeline entries, and maintain weekly check-ins
- **Achievements**: View your progress and earned achievements
- **App Center**: Access plugins and integrations

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or pnpm

### Installation

1. Clone the repository
2. Install dependencies
   ```bash
   npm install
   # or
   pnpm install
   ```
3. Start the development server
   ```bash
   npm run dev
   # or
   pnpm dev
   ```
4. Build for production
   ```bash
   npm run build
   # or
   pnpm build
   ```

## Project Structure

```
/src
  /components        # Reusable UI components
  /context           # React context providers
  /utils            # Utility functions
  /views            # Page components
  App.tsx           # Main application component
  index.css         # Global styles
  main.tsx          # Application entry point
```

## Key Components

- **SplashScreen**: Animated startup screen
- **Layout**: Main application layout with sidebar
- **Sidebar**: Navigation and settings
- **GlassCard**: Reusable card component with glassmorphism effect
- **DataProvider**: State management and data persistence

## Technology Stack

- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- Date-fns

## Data Persistence

Data is stored locally using cookies, ensuring your information is preserved between sessions without the need for a backend server.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

---

## 中文版本

[查看中文 README](README.zh.md)
