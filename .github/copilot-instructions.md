# Copilot Instructions (Workspace)

## 🧠 About this workspace
This is a **personal website** project built using **React (client-side only)** with **Vite** as the bundler. It is an **AI Travel Planner** application that will use **JavaScript scripting** to power the full model/logic in the browser.

Key technologies:
- **React (v19)** (client-side only, no server-side rendering)
- **React Router (v7)** for in-app navigation
- **React Bootstrap** for UI components and layout
- **Vite** for dev server, HMR, and build

## 🚀 Run / build commands
Use the standard Vite scripts in `package.json`:

```bash
npm install
npm run dev      # starts dev server (localhost)
npm run build    # production build
npm run preview  # preview built output locally
```

## 🗂 Project structure (high-level)
- `src/` — main application source code
  - `main.jsx` — React app bootstrap + router setup
  - `App.jsx` — top-level app component
  - `assets/` — images & static assets
- `public/` — static public assets served as-is
- `vite.config.js` — Vite configuration

## 🧩 What to focus on for this project
- Treat this as a **single-page React app** (client-only).
- Keep routing inside React Router (`HashRouter` is used by default).
- UI should use **React Bootstrap** components and layout patterns.
- The “AI travel planner” behavior is expected to be implemented in **plain JS/React logic**, not via a backend service.

## ✅ Useful notes for the AI assistant
- **Do not add backend/server code.** This project is intended to run entirely in the browser.
- If adding a new route, update `src/main.jsx` router wrapper and add a corresponding `Route` in the app’s routing layer.
- Keep dependencies minimal and aligned with the existing stack.
- When suggesting new UI, prefer React Bootstrap components already present in the project.

---

If you need a more advanced workflow (e.g., multi-step project scaffolding, custom linting rules, or agent-specific helpers), we can add a dedicated `AGENTS.md` or `.github/copilot-instructions.md` with an `applyTo` scope.
