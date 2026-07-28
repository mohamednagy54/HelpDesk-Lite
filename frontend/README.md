# Frontend React Application

This is a production-ready enterprise React frontend initialized using Vite.

## Architecture

This project strictly adheres to a feature-based architecture to maximize scalability and readability.

- **`src/app`**: Core application setup (Router, Providers, Layouts, global App component).
- **`src/assets`**: Static assets like images, icons, and fonts.
- **`src/components`**: Generic, highly reusable UI components. 
  - `ui/`: Standard UI elements (Buttons, Inputs, Modals).
- **`src/features`**: Domain-specific feature modules (e.g., `auth`, `dashboard`). Each feature has its own `api`, `components`, `hooks`, `pages`, `schemas`, `types`, and `store`.
- **`src/hooks`**: Global reusable hooks.
- **`src/lib`**: Configurations for third-party libraries (Axios, React Query, Utility functions).
- **`src/pages`**: Global pages like Error boundaries or 404 pages.
- **`src/services`**: Global services (if any) outside specific features.
- **`src/store`**: Global Zustand stores.
- **`src/types`**: Global TypeScript types.

## Tech Stack
- **Framework**: React 19 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS, clsx, tailwind-merge
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query) + Axios
- **Routing**: React Router DOM
- **Forms & Validation**: React Hook Form + Zod
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Tooling**: ESLint, Prettier, Husky

## Available Scripts

- `npm run dev`: Start development server.
- `npm run build`: Build for production.
- `npm run lint`: Run ESLint.
