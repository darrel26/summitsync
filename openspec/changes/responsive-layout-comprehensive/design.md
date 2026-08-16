## Context

The first responsive pass (archived `a11y-responsive-design-quality`) added 640px/480px breakpoints to page-level layouts, form grids, and tab navigation. The remaining gaps are feature-specific: inline edit rows in ChecklistTab and ItineraryTab, itinerary event cards with fixed-width time columns, the day-filter pill bar, and small touch targets on action buttons. All changes are CSS-only `@media` additions to existing component `<style>` blocks.

## Goals / Non-Goals

**Goals:**
- Every interaction pattern in every tab usable at 320px without overflow or clipping
- 44px touch targets on all icon buttons at mobile widths
- `viewport-fit=cover` so safe-area-inset values are populated

**Non-Goals:**
- Changing any data flow, PocketBase queries, or Svelte component APIs
- Redesigning layouts — additive CSS rules only
- Container queries (overkill for full-width components)

## Decisions

### 1. Stack itinerary `.event-card` at 640px via flex-direction: column

**Choice**: Add `@media (max-width: 640px)` that sets `.event-card { flex-direction: column; align-items: flex-start; }` and removes `.time-col { min-width: 90px }`.

**Why**: The fixed `min-width: 90px` on `.time-col` combined with 16px gap and 16px padding on each side leaves only ~175px for event title at 320px. Stacking eliminates the squeeze.

**Alternative considered**: Hiding day/time on mobile. Rejected — time is essential trip info.

### 2. Wrap checklist `.edit-group-row` at 480px

**Choice**: Add `@media (max-width: 480px)` that sets `.edit-group-row { flex-wrap: wrap; }` with `.edit-input-field { flex: 1 1 100%; }` (name input full-width first row), and qty/select/buttons wrap to second row.

**Why**: 5 horizontally-squeezed elements (text input, number input, select, check button, cancel button) are unusable at phone widths. Wrapping the name to its own row gives it breathing room while keeping the compact save/cancel flow.

### 3. Wrap checklist `.item-left` assignee at 480px

**Choice**: Add `@media (max-width: 480px)` that moves `.assignee-wrap { margin-left: 0; width: 100%; order: 3; }` so it wraps below the item name. The `.item-left` already has `flex-wrap: wrap`.

**Why**: Long item names + assignee dropdown compete for the same row. The `flex-wrap: wrap` is already set but never triggers because `.assignee-wrap` has `margin-left: auto` pinning it to the right. Resetting the margin and setting `width: 100%` forces the wrap.

### 4. Reduce `.trips-grid` minmax from 320px to 280px

**Choice**: Change `minmax(320px, 1fr)` to `minmax(280px, 1fr)`.

**Why**: At 320px viewport with 24px padding per side, the content area is 272px. A 320px min-width card overflows. 280px fits within the content area at the smallest supported viewport. The 40px reduction has no visual impact on wider screens.

### 5. Touch targets via padding expansion at 768px breakpoint

**Choice**: Add `@media (max-width: 768px)` rule in `app.css` that sets `min-width: 44px; min-height: 44px;` on `.btn-icon`, `.btn-tiny`, `.btn-action-check`, `.btn-action-cancel`, `.btn-personal-add`.

**Why**: These buttons are 24–30px currently. The WCAG 2.5.8 minimum is 44px. Expanding with `min-width`/`min-height` increases the tap area without changing visual icon size — the icon stays centered via existing `display: grid; place-content: center`.

### 6. Day-filter bar scroll affordance via mask-image

**Choice**: Add `mask-image: linear-gradient(to right, black 85%, transparent 100%)` on `.day-filter-bar`, same pattern as TabNav's `.tabs-nav`.

**Why**: Consistent scroll affordance pattern already established in TabNav. The hidden scrollbar (`overflow-x: auto` with no visual cue) means users won't discover more day pills.

## Risks / Trade-offs

- **[Touch target spacing]** → 44px buttons take more vertical space in action rows. Acceptable — tappability matters more than density on mobile.
- **[minmax 280px]** → On 768px+ screens, grid may fit a 3rd column slightly earlier. Negligible visual difference.
- **[Stacked event cards]** → Taller vertical footprint per event. Acceptable — content readability outweighs compactness on phone screens.
