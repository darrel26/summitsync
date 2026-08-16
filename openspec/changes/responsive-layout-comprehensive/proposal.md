## Why

The first a11y-responsive pass added breakpoints to page-level layouts and most component forms, but several feature-specific UI patterns still break or become unusable on narrow viewports (320–375px). Inline edit rows, itinerary event cards, checklist item rows with assignee dropdowns, and the itinerary day-filter bar all squeeze or clip on small phones. Touch targets for inline action buttons remain below 44px. These gaps affect the core trip-planning workflow — the app is shared via link to hikers on phones, and every tab needs to be fully operable at phone widths.

## What Changes

- Add 640px/480px breakpoints to ItineraryTab: stack `.event-card` (time-col, content, actions), stack `.edit-top-row` (day/time/title inputs), and stack `.notes-row` (description + add button)
- Add 640px breakpoint to ChecklistTab: stack `.edit-group-row` (name + qty + assignee + save/cancel buttons), wrap `.section-top` (title + progress pill) for long section headers
- Add scroll affordance gradient to ItineraryTab `.day-filter-bar` matching TabNav pattern
- Reduce `.trips-grid` minmax from 320px to 280px so cards don't overflow 320px viewports
- Enforce 44px minimum touch targets for `.btn-icon`, `.btn-tiny`, `.btn-action-check`, `.btn-action-cancel`, `.btn-personal-add` on mobile viewports
- Add `viewport-fit=cover` to `app.html` `<meta name="viewport">`
- Ensure `.item-row` assignee dropdown doesn't push item name off-screen on narrow viewports

## Capabilities

### New Capabilities
- `responsive-layout`: Comprehensive responsive layout behavior for all feature tabs and interaction patterns at 320px–375px phone viewports

### Modified Capabilities

_(none — no existing spec-level behavior changes; this is new responsive coverage for feature-specific UI patterns)_

## Impact

- **Files touched**: `app.html`, `app.css`, `ChecklistTab.svelte`, `ItineraryTab.svelte`, `+page.svelte` (landing)
- **Dependencies**: None added or removed (CSS-only changes)
- **Risk**: Low — presentation-layer only, no data model or API changes. All changes are additive `@media` rules or minor minmax adjustments.
