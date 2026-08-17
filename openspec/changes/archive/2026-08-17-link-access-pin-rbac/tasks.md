## 1. Schema & Backend Rules

- [x] 1.1 Restore open API rules (`""`) in `pocketbase/pb_schema.json` for trip data collections (`trips`, `members`, `group_items`, `personal_items`, `route`, `itinerary`)

## 2. Layout & UI Cleanup

- [x] 2.1 Revert `src/routes/+layout.svelte` to remove `$auth.isValid` check, user badge header, and `LoginModal` gate
- [x] 2.2 Clean up unused auth components/files or isolate them from link visitor flow

## 3. Trip Workspace & RBAC Verification

- [x] 3.1 Verify `src/routes/trip/[id]/+page.svelte` defaults to member mode with `NamePromptModal`
- [x] 3.2 Ensure personal checklist features are fully accessible for claimed member identities without organizer elevation
- [x] 3.3 Ensure organizer actions are gated behind `OrganizerUnlockModal` and 6-digit PIN verification

## 4. Verification

- [x] 4.1 Run Svelte check (`npx sv check`) and test build (`npm run build`)
