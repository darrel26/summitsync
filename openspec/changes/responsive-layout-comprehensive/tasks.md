## 1. Foundation: Viewport & Touch Targets

- [x] 1.1 Add `viewport-fit=cover` to `<meta name="viewport">` in `app.html` — change to `content="width=device-width, initial-scale=1, viewport-fit=cover"`
- [x] 1.2 Add `@media (max-width: 768px)` rule in `app.css` setting `min-width: 44px; min-height: 44px` on `.btn-icon`, `.btn-tiny`, `.btn-action-check`, `.btn-action-cancel`, `.btn-personal-add`
- [x] 1.3 Change `.trips-grid` in `+page.svelte` from `minmax(320px, 1fr)` to `minmax(280px, 1fr)` so cards fit 320px viewports

## 2. ItineraryTab Responsive Breakpoints

- [x] 2.1 Add `@media (max-width: 640px)` to `ItineraryTab.svelte`: set `.event-card { flex-direction: column; align-items: flex-start; }` and `.time-col { min-width: auto; }`, move `.event-actions { align-self: flex-end; }`
- [x] 2.2 Add `@media (max-width: 480px)` to `ItineraryTab.svelte`: set `.edit-top-row { flex-direction: column; }` with `.edit-day-num, .edit-time-str, .edit-title-str { width: 100%; }`
- [x] 2.3 Add `@media (max-width: 480px)` to `ItineraryTab.svelte`: set `.notes-row { flex-direction: column; }` with `.btn { width: 100%; }`
- [x] 2.4 Add `mask-image: linear-gradient(to right, black 85%, transparent 100%)` and `-webkit-mask-image` to `.day-filter-bar` in `ItineraryTab.svelte`, matching TabNav's scroll affordance pattern

## 3. ChecklistTab Responsive Breakpoints

- [x] 3.1 Add `@media (max-width: 480px)` to `ChecklistTab.svelte`: set `.edit-group-row { flex-wrap: wrap; }` with `.edit-input-field { flex: 1 1 100%; }` (name input full-width first row, qty/select/buttons wrap to second row)
- [x] 3.2 Add `@media (max-width: 480px)` to `ChecklistTab.svelte`: set `.assignee-wrap { margin-left: 0; width: 100%; order: 3; }` so assignee wraps below item name on narrow viewports
- [x] 3.3 Add `@media (max-width: 480px)` to `ChecklistTab.svelte`: set `.section-top, .section-top-clean { flex-wrap: wrap; gap: 8px; }` so progress pill wraps below section title

## 4. Verification

- [x] 4.1 Run `npx sv check` to confirm no syntax errors
- [x] 4.2 Manual check: open ItineraryTab at 375px — confirm event cards stack, edit form stacks, day-filter bar shows gradient
- [x] 4.3 Manual check: open ChecklistTab at 320px — confirm edit row wraps, assignee wraps below item name, section header wraps
- [x] 4.4 Manual check: open landing page at 320px — confirm trip cards fit without horizontal overflow
- [x] 4.5 Manual check: tap icon buttons at 375px — confirm touch targets are at least 44px
