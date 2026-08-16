## 1. Project Setup

- [x] 1.1 Initialize SvelteKit project with `npm create svelte@latest` (skeleton project, TypeScript optional)
- [x] 1.2 Install `adapter-static` and configure `svelte.config.js` for SPA mode (`fallback: 'index.html'`)
- [x] 1.3 Install `pocketbase` JS SDK as dependency
- [x] 1.4 Create a PocketBase client instance module (`src/lib/pb.js`) pointing to a configurable backend URL
- [x] 1.5 Set up basic route structure: `/` (trip list), `/trip/[id]` (trip view)

## 2. PocketBase Collections

- [x] 2.1 Create `trips` collection: fields `name` (text, required), `date` (text), `description` (text)
- [x] 2.2 Create `members` collection: fields `name` (text, required), `trip` (relation → trips, required)
- [x] 2.3 Create `group_items` collection: fields `name` (text, required), `qty` (number, default 1), `assigned_to` (relation → members), `packed` (bool, default false), `trip` (relation → trips, required)
- [x] 2.4 Create `personal_items` collection: fields `name` (text, required), `packed` (bool, default false), `member` (relation → members, required)
- [x] 2.5 Create `route` collection: fields `label` (text, required), `description` (text), `sort_order` (number), `trip` (relation → trips, required)
- [x] 2.6 Create `itinerary` collection: fields `day` (number), `title` (text, required), `description` (text), `time` (text), `sort_order` (number), `trip` (relation → trips, required)
- [x] 2.7 Set all collection API rules to empty string (allow all — no auth)

## 3. Real-time Sync Layer

- [x] 3.1 Create a reusable Svelte store/helper that subscribes to a PocketBase collection filtered by trip ID, and returns a reactive list of records
- [x] 3.2 Handle create/update/delete events from SSE to update the local store without re-fetching
- [x] 3.3 Unsubscribe from all subscriptions on component destroy / route navigation

## 4. Trip Management

- [x] 4.1 Build trip list page (`/`): display all trips, "Create Trip" button
- [x] 4.2 Build create trip form: name (required), date, description fields → creates record and navigates to trip view
- [x] 4.3 Build trip view page (`/trip/[id]`): fetch trip by ID, display tab navigation (Members, Checklist, Route, Itinerary)
- [x] 4.4 Add share/copy-link button that copies the trip URL to clipboard
- [x] 4.5 Add delete trip action with confirmation — deletes trip and all related records (cascade)

## 5. Member Identity

- [x] 5.1 On trip view load, check localStorage for member ID keyed by trip ID
- [x] 5.2 If no stored identity, show name prompt modal/overlay — on submit, create member record and store ID in localStorage
- [x] 5.3 Build Members tab: list all members for the trip, add member form, remove member button
- [x] 5.4 When removing a member, cascade delete their personal items

## 6. Checklist (Group + Personal Items)

- [x] 6.1 Build Checklist tab layout: group items section at top, personal items section below grouped by member
- [x] 6.2 Group items: add form (name, qty), display list with packed checkbox, assigned-to dropdown (populated from members), delete button
- [x] 6.3 Group items: inline edit for name, qty, and assignment
- [x] 6.4 Personal items: add form (name) under each member's section, packed checkbox, delete button
- [x] 6.5 Personal items: inline edit for item name
- [x] 6.6 Wire all checklist operations to real-time sync store from task 3.1

## 7. Transportation Route

- [x] 7.1 Build Route tab: ordered list of stops with label and description
- [x] 7.2 Add stop form (label, description) — appends to end with next sort_order
- [x] 7.3 Reorder stops via move-up/move-down buttons (update sort_order values)
- [x] 7.4 Inline edit for stop label and description
- [x] 7.5 Delete stop button

## 8. Itinerary

- [x] 8.1 Build Itinerary tab: ordered list of day entries showing day number, title, time, description
- [x] 8.2 Add itinerary entry form (day, title, time, description) — appends with next sort_order
- [x] 8.3 Reorder entries via move-up/move-down buttons
- [x] 8.4 Inline edit for all itinerary fields
- [x] 8.5 Delete entry button

## 9. Polish & Deploy

- [x] 9.1 Add empty states for all tabs (no members, no items, no stops, no itinerary)
- [x] 9.2 Add loading states while fetching data from PocketBase
- [x] 9.3 Add basic error handling for failed API calls (toast/alert)
- [x] 9.4 Deploy PocketBase to VPS (Fly.io or Railway)
- [x] 9.5 Deploy SvelteKit static build to Vercel or Netlify
- [x] 9.6 Configure PocketBase URL environment variable for production
