# 🚀 Deployment Guide: SummitSync

This guide details how to deploy SummitSync to production using **Vercel** for the SvelteKit frontend SPA and **Railway** for the PocketBase backend with persistent SQLite storage.

---

## Architecture

```
┌─────────────────────────────────────────┐
│              VERCEL                     │
│    SvelteKit Static SPA Deployment      │
│    (Custom Domain or *.vercel.app)      │
└────────────────────┬────────────────────┘
                     │
             HTTPS API Requests
             & Real-time SSE Streams
                     │
                     ▼
┌─────────────────────────────────────────┐
│              RAILWAY                    │
│   PocketBase Docker Container           │
│   (https://<your-app>.up.railway.app)   │
│   ┌─────────────────────────────────┐   │
│   │ Railway Persistent Volume       │   │
│   │ (/pb/pb_data ──▶ SQLite DB)     │   │
│   └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

---

## 1. Backend Deployment: Railway (PocketBase)

### Step 1: Create Project on Railway
1. Go to [Railway.app](https://railway.app/) and log in with GitHub.
2. Click **New Project** → **Deploy from GitHub repo**.
3. Select the `summitsync` repository.

### Step 2: Configure Build & Docker Settings
1. Click on your newly deployed service in Railway.
2. Go to **Settings** tab:
   - **Dockerfile Path**: Set to `Dockerfile.pocketbase`
   - **Port**: Set to `8080` (matches `EXPOSE 8080` in `Dockerfile.pocketbase`)

### Step 3: Add Persistent Volume (Crucial for SQLite)
1. In your Railway service view, go to **Volumes** tab.
2. Click **Add Volume**.
3. Set **Mount Path** to `/pb/pb_data`.
4. *Why*: Without this volume mount, Railway will recreate the container filesystem on every deployment and wipe your SQLite database.

### Step 4: Generate Public Domain & Initial Schema Sync
1. In **Settings** → **Networking**, click **Generate Domain** (e.g. `https://mtgede-pb.up.railway.app`).
2. Open `https://<your-railway-domain>.up.railway.app/_/` in your browser.
3. Create your initial admin superuser login.
4. Go to **Settings (Gear icon) → Sync / Import collections**.
5. Click **Load from JSON file** and upload `pocketbase/pb_schema.json` (or paste its content).
6. Click **Confirm / Save changes**.

---

## 2. Frontend Deployment: Vercel (SvelteKit SPA)

### Step 1: Import Project into Vercel
1. Go to [Vercel.com](https://vercel.com/) and log in with GitHub.
2. Click **Add New** → **Project**.
3. Select the `summitsync` repository.

### Step 2: Set Environment Variables
In the project configuration under **Environment Variables**, add:
- `VITE_POCKETBASE_URL` = `https://<your-railway-domain>.up.railway.app`

### Step 3: Deploy
1. Click **Deploy**.
2. Vercel will automatically detect SvelteKit, run `npm run build`, and deploy the SPA to static edge nodes.
3. Your app is live at `https://<your-project>.vercel.app`!

---

## 3. Local Development Reminders

To test locally before deploying:

1. **PocketBase Backend**:
   ```bash
   ./pb_bin/pocketbase serve --http="127.0.0.1:8090"
   ```
2. **Frontend SPA**:
   ```bash
   npm run dev
   ```
