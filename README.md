# COM2020 Team Project — Prototype

 This repository contains a Node.js/Express backend and a React + Vite frontend. The app uses Supabase for its database and auth integrations and includes unit and integration tests for the backend.

## Table of contents

- [Repository layout](#repository-layout)
- [Quick start](#quick-start)
	- [Prerequisites](#prerequisites)
	- [Run the backend](#run-the-backend)
	- [Run the frontend](#run-the-frontend)
- [Testing](#testing)
- [Environment variables](#environment-variables)
- [API](#api)
- [License](#license)

## Repository layout

- `backend/` - Node.js + Express API
	- `src/` - server, app, controllers, routes, services
	- `tests/` - unit and integration tests (Jest + Supertest)
- `frontend/` - React + Vite TypeScript single-page app
- `docs/` - project documentation and drafts

## Quick start

These instructions get the project running locally (development mode).

### Prerequisites

- Node.js (v18+ recommended)
- npm (or yarn/pnpm)
- A Supabase project (for the database & auth) or a compatible Postgres + auth backend

You'll need to provide a few environment variables before starting services (see Environment variables below).

### Run the backend

1. Change into the backend folder and install dependencies:

```bash
cd backend
npm install
```

2. Provide environment variables (example `.env` placed inside `backend/`):

```env
SUPABASE_URL=https://your-supabase-url
SUPABASE_PUBLISHABLE_KEY=public-anon-key
SUPABASE_SECRET_KEY=service-role-key
PORT=8000
# (optional) NODE_ENV=development
```

3. Start the server in development mode (uses nodemon):

```bash
npm run dev
```

Or start the production server:

```bash
npm start
```

The backend default port is picked up from `process.env.PORT` (default 8000).

### Run the frontend

1. Change into the frontend folder and install dependencies:

```bash
cd frontend
npm install
```

2. Provide the frontend environment variable to point at the backend API (optional; defaults to `http://localhost:3000`):

Create a file named `.env` (or use your shell environment):

```env
VITE_API_BASE_URL=http://localhost:8000
```

3. Start the dev server:

```bash
npm run dev
```

By default Vite will serve the frontend on `http://localhost:5173` (or another port Vite chooses). Ensure `VITE_API_BASE_URL` points to the running backend.

## Testing

Backend tests use Jest and Supertest. From the `backend/` folder:

```bash
# run unit + integration tests
npm test

# run integration tests only (separate config)
npm run test:integration
```

Frontend linting is available via:

```bash
cd frontend
npm run lint
```

## Environment variables

Backend (required):

- `SUPABASE_URL` — your Supabase project URL
- `SUPABASE_PUBLISHABLE_KEY` — Supabase public (anon) key used by user-level client
- `SUPABASE_SECRET_KEY` — Supabase service key (server/admin operations)
- `PORT` — (optional) port to run the backend server (default 8000)

Frontend (optional):

- `VITE_API_BASE_URL` — base URL for API requests (defaults to `http://localhost:3000` in code)

Notes: the backend reads variables with `dotenv` (see `backend/src/lib/supabaseClient.js`). The app will throw on startup if required Supabase variables are missing.

## API

The backend exposes REST endpoints organized under `src/routes/` and implemented in `src/controllers/`. Major areas include:

- authentication (`/auth`)
- groups (`/groups`)
- challenges (`/challenges`)
- action logs / submissions
- leaderboards

For a quick exploration, browse the route files in `backend/src/routes/` to see paths and expected request shapes. Controllers are in `backend/src/controllers/`.

Example: the frontend API code uses a small wrapper (`frontend/src/api/client.ts`) that expects `VITE_API_BASE_URL`.

## License

This project is released under the MIT License. See the `backend/package.json` which lists `MIT`.