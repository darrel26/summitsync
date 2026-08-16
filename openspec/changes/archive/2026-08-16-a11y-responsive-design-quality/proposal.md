## Why

SummitSync is a collaborative trip planner shared via link — participants include non-technical hikers on phones with varying abilities. The current UI lacks WCAG AA compliance (failing contrast ratios, no screen reader announcements, missing focus management), breaks on mobile viewports (no breakpoints, forms don't stack, tabs overflow without affordance), and has duplicated styling across components. Fixing these is prerequisite to shipping confidently to real groups.

## What Changes

- Fix color contrast to meet WCAG AA 4.5:1 minimum on all text elements
- Add `aria-live` region to toast notifications so screen readers announce them
- Convert hand-rolled modal overlays to native `<dialog>` elements for free focus trapping, Esc handling, and backdrop
- Implement ARIA tabs pattern (`role="tablist"`, `role="tab"`, `aria-selected`) on TabNav
- Add `aria-label` to all icon-only buttons currently relying on `title` alone
- Add `role="status"` and `aria-label` to loading spinners
- Add skip-to-content link
- Add `@media (prefers-reduced-motion: reduce)` to disable animations
- Add mobile breakpoints across all pages and components (stacking forms, collapsing grids, responsive header actions)
- Make TabNav show icon-only on narrow screens with visible scroll affordance
- Add `safe-area-inset` padding for notched devices
- Extract duplicated `.btn` and `.card` styles to `app.css` shared tokens
- Replace hardcoded `#ffffff` with `--bg-surface` token for dark-mode readiness
- Move Google Fonts `@import` to `<link>` with `display=swap` in `app.html`

## Capabilities

### New Capabilities

- `accessibility`: WCAG AA compliance — contrast, ARIA patterns, focus management, reduced motion, screen reader support
- `responsive-layout`: Mobile-first responsive behavior — breakpoints, touch targets, safe areas, viewport adaptations

### Modified Capabilities

_(none — these changes don't alter any existing behavioral requirements like checklist logic, member identity, or real-time sync; they change how the existing behavior is presented and operated)_

## Impact

- **Files touched**: `app.css`, `app.html`, `+layout.svelte`, `+page.svelte` (landing), `trip/[id]/+page.svelte`, `TabNav.svelte`, `NamePromptModal.svelte`, `OrganizerUnlockModal.svelte`, `ChecklistTab.svelte`, `MembersTab.svelte`, `RouteTab.svelte`, `ItineraryTab.svelte`
- **Dependencies**: None added or removed (native `<dialog>`, CSS-only responsive)
- **Risk**: Low — presentation-layer only, no data model or API changes. `<dialog>` is Baseline Widely Available.
