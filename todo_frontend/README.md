# Simple To‑do (React)

A lightweight To‑do list app with a clean UI. Local‑first CRUD with optional API sync. Built with React and vanilla CSS.

## Features

- Add, edit (inline), delete, and mark tasks complete
- Filter by All / Active / Completed
- Toggle all, clear completed
- Local storage persistence
- Optional API integration via environment variables
- Accessible and keyboard-friendly

## Quick start

- Install: `npm install`
- Run dev: `npm start` (http://localhost:3000)
- Test: `npm test`
- Build: `npm run build`

## Structure

- `src/components/Header.jsx`
- `src/components/TodoInput.jsx`
- `src/components/TodoItem.jsx`
- `src/components/TodoList.jsx`
- `src/hooks/useTodos.js` — local-first state + optional API sync
- `src/services/localStorageService.js`
- `src/services/apiService.js`
- `src/utils/env.js`
- `src/App.js`, `src/App.css`

## Environment variables

Create a `.env` based on `.env.example`. The app reads CRA-style variables (must begin with REACT_APP_).

- `REACT_APP_API_BASE` — Optional REST API base URL, e.g. `https://api.example.com`
- `REACT_APP_BACKEND_URL` — Alternative base URL (fallback)
- `REACT_APP_WS_URL` — If only WS URL is available, origin is derived
- `REACT_APP_NODE_ENV` — Environment label for display (dev/stage/prod)
- Others are supported by template but not required for To‑do

When no API base is detected, the app runs entirely offline using localStorage.

## API expectations (optional)

If you wire up a backend, the app will attempt:
- `GET  /health` — returns 200 when alive
- `POST /todos` — body: full todo
- `PATCH /todos/:id` — body: partial `{ text?, completed? }`
- `DELETE /todos/:id`
- `POST /todos/bulk-delete` — `{ ids: string[] }`
- `POST /todos/bulk-update` — `{ items: { id, completed }[] }`

Failures do not block local usage.

## Styling

Follows the style guide accents (#3b82f6 primary, #06b6d4 success) with a modern light theme and dark mode toggle.

## Accessibility

- Keyboard submit/edit
- ARIA labels for controls and live regions for status
