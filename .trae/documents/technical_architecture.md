## 1. Architecture Design
```mermaid
flowchart TD
  A[用户界面] --> B[React组件]
  B --> C[状态管理]
  C --> D[本地存储]
  D --> E[Cookie存储]
  B --> F[数据上下文]
  F --> D
```

## 2. Technology Description
- Frontend: React@19 + TailwindCSS@4 + Vite
- Initialization Tool: Vite
- Backend: None (使用本地存储)
- Database: None (使用Cookie存储)

## 3. Route Definitions
| 路由 | 目的 |
|------|------|
| /home | 主页，包含欢迎区域、快捷访问和概览 |
| /todo | 待办事项页面 |
| /projects | 项目管理页面 |
| /calendar | 日程安排页面 |
| /journal | 生活手账页面 |
| /achievements | 成就系统页面 |
| /apps | 应用中心页面 |

## 4. API Definitions
- 不适用，本项目使用本地存储，无后端API

## 5. Server Architecture Diagram
- 不适用，本项目为纯前端应用

## 6. Data Model
### 6.1 Data Model Definition
```mermaid
erDiagram
  TODO_ITEM ||--o{ PROJECT : belongs_to
  PROJECT ||--o{ CALENDAR_EVENT : generates
  TODO_ITEM ||--o{ CALENDAR_EVENT : generates
  HABIT ||--o{ JOURNAL_ENTRY : related_to
  PROJECT ||--o{ ACHIEVEMENT : unlocks
  TODO_ITEM ||--o{ ACHIEVEMENT : unlocks

  TODO_ITEM {
    number id
    string text
    boolean urgent
    boolean completed
    string dueDate
  }

  PROJECT {
    number id
    string name
    string startDate
    string endDate
    number progress
    string[] checkIns
  }

  CALENDAR_EVENT {
    number id
    string title
    date start
    date end
    string color
    string note
    boolean isDerived
  }

  HABIT {
    string id
    string name
    boolean completed
  }

  JOURNAL_ENTRY {
    string time
    string title
    string desc
  }

  ACHIEVEMENT {
    string id
    string name
    string description
    boolean unlocked
  }
```

### 6.2 Data Definition Language
- 不适用，本项目使用Cookie存储，无数据库表结构