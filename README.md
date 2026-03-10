# TaskFlow — Task Management Dashboard

A professional, fully-featured **Task Management Dashboard** built with Next.js App Router, TanStack Query v5, and a custom shadcn/ui design system.

## ✨ Features

### Core CRUD

| Feature    | Detail                                                                             |
| ---------- | ---------------------------------------------------------------------------------- |
| **Read**   | Fetches 100 posts from JSONPlaceholder and enriches them into Tasks                |
| **Create** | "New Task" button opens a Dialog with form validation (zod + react-hook-form)      |
| **Update** | Edit button opens a pre-filled Dialog; status can also be changed inline in Kanban |
| **Delete** | Confirmation Dialog prevents accidental deletions                                  |

### Architecture

- **Server Components** — layout, metadata, root page
- **Client Components** — all interactive elements wrapped in `"use client"` boundary
- **TanStack Query v5** — `useQuery` for fetching, `useMutation` with optimistic updates for CUD
- **Optimistic UI** — changes are reflected instantly before the API responds

### UI/UX

- **Dual Views** — Table view (sortable, filterable, paginated) and Kanban board
- **Stats Dashboard** — 6 summary cards + completion progress bar
- **Loading Skeletons** — full skeleton placeholders while data loads
- **Toast Notifications** — success/error/warning toasts for every mutation
- **Search & Filters** — live search + status/priority filters with instant results
- **Sortable Table** — click column headers to sort ascending/descending
- **Pagination** — configurable page size (10/20/50 rows)
- **Responsive** — fully functional on mobile, tablet, and desktop

### Design System

- **Deep Charcoal + Electric Blue** professional theme
- All custom shadcn/ui components (no CLI required)
- Custom scrollbar, focus rings, and CSS animations

## 🚀 Tech Stack

| Layer         | Technology                      |
| ------------- | ------------------------------- |
| Framework     | Next.js 16 (App Router)         |
| Styling       | Tailwind CSS v4                 |
| UI Components | shadcn/ui (Radix UI primitives) |
| Data Fetching | TanStack Query v5 + Axios       |
| Forms         | react-hook-form + zod           |
| API           | JSONPlaceholder                 |
| Language      | TypeScript                      |

## 🏃 Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout (Server Component)
│   ├── page.tsx            # Home page (Server Component)
│   └── globals.css         # Global styles + theme variables
├── components/
│   ├── dashboard/
│   │   ├── dashboard-client.tsx    # Main dashboard (Client Component)
│   │   ├── stats-cards.tsx         # Summary statistics
│   │   ├── task-table.tsx          # Sortable/filterable table
│   │   ├── task-table-skeleton.tsx # Loading skeleton
│   │   ├── kanban-board.tsx        # Kanban view
│   │   ├── create-task-dialog.tsx  # Create modal
│   │   ├── edit-task-dialog.tsx    # Edit modal
│   │   └── delete-task-dialog.tsx  # Delete confirmation
│   ├── layout/
│   │   └── app-header.tsx
│   ├── providers/
│   │   └── query-provider.tsx      # TanStack Query provider
│   └── ui/                         # shadcn/ui components
├── hooks/
│   ├── use-tasks.ts        # All TanStack Query hooks
│   └── use-toast.ts        # Toast state management
└── lib/
    ├── api.ts              # Axios API client
    ├── helpers.ts          # Post → Task enrichment
    ├── types.ts            # TypeScript interfaces
    └── utils.ts            # cn() utility
```

## 📝 Notes

- JSONPlaceholder is a mock API — mutations return success but don't persist server-side. The UI uses **optimistic updates** so your local state always reflects the changes immediately.
- Tasks are enriched from `/posts` with deterministic `status`, `priority`, and `createdAt` values.
- User avatars are pulled from `/users` and displayed with color-coded initials.
