## Context

Greenfield project — no existing codebase. See proposal.md for motivation. The constraint is simplicity: non-technical users, no accounts, free hosting, real-time collaboration for small groups (5-10 people).

## Goals / Non-Goals

**Goals:**
- Working collaborative trip planner with real-time sync
- Zero-friction access: shareable link, no signup
- Minimal deployment complexity: single binary backend + static frontend

**Non-Goals:**
- Map integration (route is text-only ordered list)
- User authentication / accounts / passwords
- Offline support or PWA
- Mobile native app
- Rich text editing
- File uploads (photos, documents)
- Notifications (email, push)

## Decisions

### 1. SvelteKit as static SPA (adapter-static)

**Choice**: Build as a static SPA using `adapter-static` with client-side rendering only.

**Why**: No SEO needed (private trip links), no server-side logic required — PocketBase handles all data. SPA simplifies deployment (static files on Vercel/Netlify free tier) and avoids running a Node server.

**Alternatives considered**:
- SvelteKit SSR: Adds Node server requirement for no benefit — data is fetched client-side from PocketBase anyway
- Plain Svelte (no SvelteKit): Loses file-based routing which we need for `/trip/[id]` routes

### 2. PocketBase as backend

**Choice**: PocketBase single binary with embedded SQLite.

**Why**: Real-time (SSE) built in, admin dashboard for managing collections, zero dependencies, MIT licensed, free. Perfect scale for friend-group usage.

**Alternatives considered**:
- Supabase: Free tier pauses after 1 week inactivity — bad for a trip planner checked sporadically
- Firebase/Firestore: Not open-source, vendor lock-in
- Custom backend (Hono+SQLite): More code to write and maintain for the same result

### 3. No-auth identity via localStorage

**Choice**: On first visit to a trip, prompt "What's your name?", store member ID in localStorage keyed by trip ID.

**Why**: Friends aren't tech-savvy — any login friction will kill adoption. localStorage is sufficient because:
- No sensitive data (packing lists, not banking)
- Worst case of someone "impersonating" a member in a friend group is harmless
- Different devices = different identity is acceptable for this use case

**Trade-off**: Clearing browser data loses identity. Acceptable — user can re-enter their name.

### 4. PocketBase collections with open API rules

**Choice**: Set all collection API rules to empty string (allow all) — no auth checks.

**Why**: No auth system means no auth rules. The app is inherently open — anyone with the link can view and edit. This matches the "shared Google Sheet" mental model.

**Trade-off**: Anyone with a trip URL can modify data. Acceptable for friend-group trust model. If abuse becomes a concern later, add simple PIN-per-trip.

### 5. Single Checklist tab for group + personal items

**Choice**: Combine group items and personal items in one "Checklist" tab, with group items at top and personal items grouped by member below.

**Why**: Splitting into two tabs fragments the packing view. Users want to see "what's covered" at a glance — group gear + everyone's personal lists in one scroll.

### 6. PocketBase JS SDK for real-time

**Choice**: Use the official `pocketbase` JS SDK for all data operations and real-time subscriptions.

**Why**: Handles SSE connection management, reconnection, and typed responses out of the box. One dependency.

## Risks / Trade-offs

- **[localStorage identity loss]** → User re-enters name. Could add "claim existing member" flow later if needed.
- **[No access control]** → Anyone with URL can edit. Acceptable for friend groups. → Add optional trip PIN if abuse surfaces.
- **[PocketBase single-process]** → No horizontal scaling. → Irrelevant at friend-group scale (5-10 concurrent users).
- **[VPS required for PocketBase]** → Need a free-tier VPS (Fly.io, Railway). → Single binary deploys in minutes, minimal maintenance.
- **[SQLite concurrent writes]** → WAL mode handles concurrent reads well; writes serialize. → Fine for this write volume.
