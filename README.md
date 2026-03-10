# TaskFlow — Task Management Dashboard

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js_16-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query_v5-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)

A professional, fully-featured **Task Management Dashboard** built with the Next.js App Router, TanStack Query v5, and a hand-crafted shadcn/ui design system — using [JSONPlaceholder](https://jsonplaceholder.typicode.com/) as a mock CRUD API.

</div>

---

## 📸 Overview

> **Deep Charcoal + Electric Blue** theme · Dual Table/Kanban views · Full CRUD with optimistic updates · Responsive across all screen sizes

---

## ✨ Features

### 🗂️ Core CRUD

| Operation  | Detail |
| ---------- | ------ |
| **Read**   | Fetches 100 posts from `/posts` and enriches them as typed `Task` objects with status, priority, and timestamps |
| **Create** | "New Task" button opens a shadcn `Dialog` with a fully validated form (zod + react-hook-form) |
| **Update** | Edit icon opens a pre-filled Dialog; status can also be changed inline via the Kanban dropdown |
| **Delete** | Trash icon triggers a Confirmation Dialog before permanently removing the task |

### 🏗️ Architecture

- **Server Components** — `layout.tsx` and `page.tsx` handle metadata and the static shell with zero client JS
- **Client Components** — all interactive elements use `"use client"` with a clean component boundary
- **TanStack Query v5** — `useQuery` for data fetching; `useMutation` with `onMutate` / `onError` / `onSuccess` lifecycle for full optimistic updates
- **Optimistic UI** — every Create, Update, and Delete is reflected in the UI instantly, before the API responds, with automatic rollback on failure

### 🎨 UI / UX

- **Dual Views** — switch between a sortable/filterable **Table** and a column-based **Kanban Board**
- **Stats Dashboard** — 6 live summary cards (Total, Completed, In Progress, To Do, High Priority, Assignees) + animated completion progress bar
- **Loading Skeletons** — full-page skeleton placeholders while data is fetching (shadcn `Skeleton`)
- **Toast Notifications** — contextual success / error / warning toasts on every mutation
- **Search & Filters** — live full-text search + Status and Priority dropdowns with instant client-side filtering
- **Sortable Columns** — click any table header to sort ascending / descending
- **Pagination** — configurable page size (10 / 20 / 50 rows) with smart page number display
- **Responsive** — fully functional on mobile, tablet, and desktop

### 🎨 Design System

- **Deep Charcoal** (`#0f1117`) background with **Electric Blue** (`#3b82f6`) accent
- All shadcn/ui components (Button, Input, Dialog, Select, Badge, Card, Toast, Skeleton, Progress, DropdownMenu) built from Radix UI primitives
- Custom CSS variables via Tailwind v4 `@theme`, custom scrollbar, focus rings, and fade-in animations

---

## 🚀 Tech Stack

| Layer          | Technology                          |
| -------------- | ----------------------------------- |
| Framework      | Next.js 16 (App Router)             |
| Language       | TypeScript 5                        |
| Styling        | Tailwind CSS v4                     |
| UI Primitives  | Radix UI / shadcn/ui                |
| Data Fetching  | TanStack Query v5 + Axios           |
| Form Handling  | react-hook-form + zod               |
| Icons          | lucide-react                        |
| API            | JSONPlaceholder (mock REST API)     |

---

## 🏃 Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### Installation & Development

```bash
# Clone the repository
git clone https://github.com/sajjadhossain67/task-managment.git
cd task-managment

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx                  # Root layout — Server Component, injects providers
│   ├── page.tsx                    # Home page — Server Component, metadata + shell
│   └── globals.css                 # Global styles, Tailwind @theme variables
│
├── components/
│   ├── dashboard/
│   │   ├── dashboard-client.tsx    # Top-level Client Component — view toggle, dialogs
│   │   ├── stats-cards.tsx         # 6 KPI cards + progress bar
│   │   ├── task-table.tsx          # Sortable, filterable, paginated table
│   │   ├── task-table-skeleton.tsx # Skeleton loading state for table
│   │   ├── kanban-board.tsx        # 3-column Kanban with inline status change
│   │   ├── create-task-dialog.tsx  # Create modal with form validation
│   │   ├── edit-task-dialog.tsx    # Edit modal pre-filled from task data
│   │   └── delete-task-dialog.tsx  # Confirmation dialog
│   │
│   ├── layout/
│   │   └── app-header.tsx          # Sticky top navigation bar
│   │
│   ├── providers/
│   │   └── query-provider.tsx      # TanStack QueryClientProvider
│   │
│   └── ui/                         # Handcrafted shadcn/ui components
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── dropdown-menu.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── progress.tsx
│       ├── select.tsx
│       ├── skeleton.tsx
│       ├── textarea.tsx
│       ├── toast.tsx
│       └── toaster.tsx
│
├── hooks/
│   ├── use-tasks.ts                # useQuery + useMutation hooks (CRUD)
│   └── use-toast.ts                # Global toast state manager
│
└── lib/
    ├── api.ts                      # Axios instance + taskApi / userApi
    ├── helpers.ts                  # Enriches JSONPlaceholder posts → Task objects
    ├── types.ts                    # Shared TypeScript interfaces & enums
    └── utils.ts                    # cn() class-name utility
```

---

## 📝 Notes

- **JSONPlaceholder** is a read-only mock API. Mutations return a success response but do not actually persist data server-side. The UI uses **optimistic updates** so all changes are reflected immediately in local state, with automatic rollback if the request fails.
- Tasks are derived from `/posts` and enriched client-side with a deterministic `status`, `priority`, and `createdAt` based on the post ID.
- User avatars and names are fetched from `/users` and displayed as color-coded initials throughout the Table, Kanban, and dialogs.

---

## 📄 License

MIT
