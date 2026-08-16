## 1. Member Identity Claim & Deduplication

- [x] 1.1 Update `NamePromptModal.svelte` to accept `members` prop, render existing member claim chips, and handle "Claim Profile" or "Join as New"
- [x] 1.2 Update `handleJoinName` in `src/routes/trip/[id]/+page.svelte` to check existing members by name and reuse existing ID instead of creating duplicates
- [x] 1.3 Add identity switch / release action in `MembersTab.svelte` and profile tag in workspace header

## 2. Mobile Responsive Tab Navigation

- [x] 2.1 Update `TabNav.svelte` with mobile bottom navigation bar layout (< 640px) retaining icons, text labels, and count badges
- [x] 2.2 Add safe-area padding and workspace container offset in `src/routes/trip/[id]/+page.svelte` and `src/app.css`

## 3. Header & Action Layouts for Mobile

- [x] 3.1 Refactor workspace header in `src/routes/trip/[id]/+page.svelte` to compact mobile hierarchy (< 640px)
- [x] 3.2 Add 44px touch targets and icon-first action layout on mobile viewports

## 4. Mobile Checklist & Item Polish

- [x] 4.1 Refactor group items in `ChecklistTab.svelte` to stack assignee badges below item titles on mobile screens (< 480px)
- [x] 4.2 Enforce 44px min touch targets for checkbox hitboxes and item edit/delete action buttons
- [x] 4.3 Update personal bags grid in `ChecklistTab.svelte` to 1-column on mobile and highlight current user bag

## 5. Mobile Route & Itinerary Timelines

- [x] 5.1 Update `RouteTab.svelte` with vertical connected timeline layout and touch-friendly reorder buttons on mobile
- [x] 5.2 Update `ItineraryTab.svelte` with mobile day filter chips and connected schedule timeline layout

## 6. Global Typography & iOS Safari Zoom Prevention

- [x] 6.1 Set 16px minimum font size for inputs, selects, and textareas on mobile viewports in `src/app.css`
- [x] 6.2 Run `npx sv check` and `npm run build` to verify type integrity and zero regressions
