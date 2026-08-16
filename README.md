# 🏔️ SummitSync — Group Trip Planner

A fast, real-time collaborative web application designed for group hiking, camping, and outdoor adventures. No accounts, passwords, or login required — just share the trip link and start planning together.

## ✨ Features

- **Zero-Friction Collaboration**: Open links and pick a name on first visit; no signups or authentication walls.
- **Real-Time Sync**: Instant updates across all active participants via Server-Sent Events (SSE) — no page refresh needed.
- **Group Equipment Checklist**: Assign group gear (tents, stoves, tarps) to designated members with quantities and packed status.
- **Personal Packing Lists**: Individual checklists organized per member so everyone knows what they personally need.
- **Transportation Route**: Ordered waypoints, meeting locations, and checkpoints with notes.
- **Day-by-Day Itinerary**: Chronological schedule with time notes, activities, and details.

## 🛠️ Tech Stack

- **Frontend**: [SvelteKit](https://kit.svelte.dev/) (SPA mode with `@sveltejs/adapter-static` & Svelte 5 runes)
- **Backend & Database**: [PocketBase](https://pocketbase.io/) (Single binary, embedded SQLite, built-in SSE subscriptions)
- **SDK**: [pocketbase](https://github.com/pocketbase/js-sdk) JavaScript SDK

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [PocketBase](https://pocketbase.io/docs/) binary

### 1. Install Dependencies
```bash
npm install
```

### 2. Start PocketBase
Download the PocketBase binary for your platform into the project root or your PATH, then start it:
```bash
./pocketbase serve --http="127.0.0.1:8090"
```
The PocketBase admin dashboard will be accessible at `http://127.0.0.1:8090/_/`. You can import the collection schema from `pocketbase/pb_schema.json`.

### 3. Start Frontend Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📦 Common Commands

- `npm run dev`: Start Vite development server
- `npm run build`: Build static SPA into `build/`
- `npm run preview`: Preview built production app locally

## 🌐 Deployment

### Frontend (Static SPA)
The frontend builds to static HTML/JS/CSS assets ready for deployment on **Vercel**, **Netlify**, or **GitHub Pages**:
```bash
npm run build
```
Set the environment variable `VITE_POCKETBASE_URL` in your hosting dashboard to point to your live PocketBase instance.

### Backend (PocketBase)
PocketBase runs as a single lightweight container on VPS platforms like **Fly.io** or **Railway**:
- Configuration files are provided in `fly.toml` and `Dockerfile.pocketbase`.
- Mount a persistent volume for `/pb/pb_data` to ensure SQLite data persists across deployments.
