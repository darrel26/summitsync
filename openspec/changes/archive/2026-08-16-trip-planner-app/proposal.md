## Why

We need a collaborative trip planner web app for group hiking/camping trips. Currently, coordinating group gear (who's bringing the tent?), personal packing lists, transportation logistics, and day-by-day itineraries happens across scattered WhatsApp messages and notes. This leads to forgotten items, duplicate gear, and confusion about plans. The app needs to be dead simple — shareable link, no accounts, real-time sync so everyone sees changes instantly.

## What Changes

- **New web application**: SvelteKit frontend + PocketBase backend
- **Trip management**: Create, view, and share trips via link
- **Member system**: No-login identity — visitors pick a name on first visit (stored in localStorage), which creates a member record
- **Group items checklist**: Shared gear list with quantity and "assigned to" field — someone claims responsibility for bringing each item. Checkbox for packed status
- **Personal items checklist**: Each member maintains their own packing list with packed/not-packed checkboxes
- **Transportation route**: Ordered list of stops/waypoints with descriptions (no map, just structured text)
- **Day-by-day itinerary**: Multi-day plan with title, description, and time notes per day
- **Real-time collaboration**: All changes sync instantly via PocketBase SSE subscriptions — no page refresh needed

## Capabilities

### New Capabilities
- `trip-management`: Creating, viewing, listing, and sharing trips. Shareable link generation
- `member-identity`: No-auth member system — name prompt on first visit, localStorage persistence, member CRUD
- `group-checklist`: Group items with qty, assigned-to (relation to member), and packed checkbox. Real-time sync
- `personal-checklist`: Per-member personal items with packed checkbox. Real-time sync
- `transportation-route`: Ordered list of route stops/waypoints with descriptions. Reorderable
- `itinerary`: Day-by-day trip plan with day number, title, description, time. Reorderable
- `realtime-sync`: PocketBase SSE subscription layer — all collections subscribe to create/update/delete events

### Modified Capabilities
(none — greenfield project)

## Impact

- **New codebase**: SvelteKit app (frontend) + PocketBase (backend, single binary)
- **Dependencies**: SvelteKit, PocketBase JS SDK (`pocketbase`)
- **Hosting**: Frontend on Vercel/Netlify (free tier), PocketBase on a free-tier VPS (Fly.io/Railway)
- **Data**: SQLite (embedded in PocketBase) — 6 collections: trips, members, group_items, personal_items, itinerary, route
