## Context

SummitSync operates as a zero-login SPA where trip participants identify themselves with a name stored in `localStorage` keyed as `trip_member_${tripId}`. When a returning participant opens the trip link in another browser or tab without local storage, the current system forces them through `handleJoinName` which unconditionally creates a new record in PocketBase. Additionally, navigation and card components break layout hierarchy on mobile viewports (< 640px).

## Goals / Non-Goals

**Goals:**
- Implement an intuitive member identification modal that presents existing roster members to claim, or lets visitors join with a new name.
- Automatically link to matching member records if a user types an existing name without creating duplicate records.
- Provide a responsive layout following mobile-first principles (adaptive tab bar, 44px min tap targets, 16px form inputs to eliminate iOS zoom, vertical timeline for routes/itinerary, compact header).
- Allow active members to switch identity or clear their local session.

**Non-Goals:**
- Introducing password auth or OAuth (preserves zero-login simplicity).
- Changing backend PocketBase schema or data structure.

## Decisions

### 1. Member Claim & Join Flow
- **Decision**: Update `NamePromptModal` with a dual-mode interface:
  - If existing members exist on the trip: show roster chips ("Select your name:") plus an "Or join with a new name" input.
  - When typing a name that matches an existing member (case-insensitive trim): claim the existing record rather than creating a new duplicate.
  - Alternatives considered: PIN/password protection per member (rejected: too friction-heavy for simple camping trips).

### 2. Mobile Tab Navigation
- **Decision**: Adapt `TabNav.svelte` on mobile (< 640px) to render a balanced 4-column bottom navigation bar with icons, compact labels, and count badges, utilizing safe-area insets. On desktop (> 640px), keep top pill navigation.
- Alternatives considered: Hamburger menu or dropdown (rejected: adds extra clicks, obscures real-time badge counts).

### 3. Mobile Form & Touch Target Architecture
- **Decision**:
  - Global CSS rule for inputs on mobile (`@media (max-width: 640px) { input, select, textarea { font-size: 16px; } }`) to prevent iOS Safari auto-zoom.
  - Explicit 44x44px minimum touch targets on checklist checkboxes, reorder arrows, edit/delete buttons.
  - Stack group item assignee chips below item title on mobile screens (< 480px) to prevent horizontal flex overflow.
  - Render Route and Itinerary lists with vertical connected timeline visual spines.

## Risks / Trade-offs

- **[Risk] Multiple people claim the same member name** → Mitigation: Open identity model by design; members can switch identity anytime from Members tab.
- **[Risk] Bottom nav bar overlaps content on mobile** → Mitigation: Add `calc(80px + env(safe-area-inset-bottom))` bottom padding to workspace container on mobile.
