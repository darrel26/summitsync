## 1. Foundation: Shared Styles & Tokens

- [x] 1.1 Update `--text-muted` from `#94a3b8` to `#64748b` in `app.css` `:root` block
- [x] 1.2 Replace all hardcoded `#ffffff` / `#fff` with `var(--bg-surface)` across all component `<style>` blocks (audit: `app.css`, `ChecklistTab`, `MembersTab`, `RouteTab`, `TabNav`, `NamePromptModal`, `+page.svelte`)
- [x] 1.3 Extract shared `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-icon`, `.btn-sm`, `.card` rules into `app.css` — use the canonical padding (9px 16px for btn, 24px for card) — and remove the duplicate scoped declarations from `+page.svelte`, `ChecklistTab`, `MembersTab`, `RouteTab`, `ItineraryTab`, `NamePromptModal`
- [x] 1.4 Replace `@import url('https://fonts.googleapis.com/...')` in `app.css` with `<link rel="stylesheet" href="..." />` with `&display=swap` in `app.html`, remove the `@import` line from `app.css`

## 2. Accessibility: Contrast & ARIA

- [x] 2.1 Replace `opacity: 0.65` on `.is-packed` / `.personal-item-row.is-packed` in `ChecklistTab.svelte` with `color: var(--text-muted)` at full opacity — keep strikethrough
- [x] 2.2 Add `aria-live="polite"` and `role="status"` to the toast wrapper `<div>` in `+layout.svelte`
- [x] 2.3 Add `role="status"` and `aria-label="Loading"` to all `.spinner` / `.loading-state` divs in `+page.svelte` and `trip/[id]/+page.svelte`
- [x] 2.4 Add `aria-label` to every icon-only button in `ChecklistTab` (edit, delete, add-personal), `MembersTab` (remove), `RouteTab` (move up/down, edit, delete), `ItineraryTab` — replace reliance on `title` alone
- [x] 2.5 Add skip-to-content link as first child of `<body>` content in `+layout.svelte` — visually hidden, visible on `:focus`, linking to `<main id="main-content">`; add the `id="main-content"` to `<main>` elements in both pages

## 3. Accessibility: ARIA Tabs Pattern

- [x] 3.1 Add `role="tablist"` to `.tabs-nav` in `TabNav.svelte`, `role="tab"` + `aria-selected` to each tab button, and `aria-label` with the tab name
- [x] 3.2 Add `role="tabpanel"` and `aria-labelledby` to the `.workspace-content` container in `trip/[id]/+page.svelte`, linking it to the active tab's `id`

## 4. Accessibility: Native `<dialog>` Modals

- [x] 4.1 Convert the create-trip modal in `+page.svelte` from `div.modal-overlay` to a `<dialog>` element — use `bind:this` + `.showModal()` / `.close()`, replace `.modal-overlay` styles with `dialog::backdrop`, remove manual `onclick` overlay dismiss (use `close` event), keep form `onsubmit` as-is
- [x] 4.2 Convert `NamePromptModal.svelte` from `div.modal-backdrop` to `<dialog>` — expose `open()`/`close()` methods or accept `bind:this`, parent calls `.showModal()`
- [x] 4.3 Convert `OrganizerUnlockModal.svelte` from `div.modal-overlay` to `<dialog>` — same pattern as 4.2, wire up parent's `showUnlockModal` toggle

## 5. Accessibility: Reduced Motion

- [x] 5.1 Add `@media (prefers-reduced-motion: reduce)` block in `app.css` that sets `*, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }` — this covers spinner, modal pop, toast slide, card hover transitions globally

## 6. Responsive: Mobile Breakpoints

- [x] 6.1 Add `@media (max-width: 640px)` breakpoint to `+page.svelte`: stack `.top-bar` (brand + button), reduce `.hero-title` font size, stack `.hero-header` vertically
- [x] 6.2 Add `@media (max-width: 640px)` breakpoint to `trip/[id]/+page.svelte`: stack `.workspace-header` (title block + actions), make `.header-actions` full-width wrapping row
- [x] 6.3 Add `@media (max-width: 480px)` breakpoint to `+page.svelte`: collapse `.organizer-inputs-grid` and `.date-inputs-grid.is-range` to `grid-template-columns: 1fr`
- [x] 6.4 Add `@media (max-width: 640px)` to `ChecklistTab.svelte`: stack `.add-group-form` vertically, reduce `.personal-grid` `minmax` to `minmax(240px, 1fr)`
- [x] 6.5 Add `@media (max-width: 640px)` to `RouteTab.svelte`: collapse `.input-grid` to single-column (already has this — verify), ensure `.step-body` wraps actions below stop info
- [x] 6.6 Add `@media (max-width: 640px)` to `MembersTab.svelte`: collapse `.members-grid` to single-column

## 7. Responsive: Tab Navigation Mobile

- [x] 7.1 Add `@media (max-width: 480px)` to `TabNav.svelte`: hide `.tab-label` text, show icon-only, add `aria-label` to each tab button with the tab name
- [x] 7.2 Add right-edge fade gradient to `.tabs-nav-wrapper` using CSS `mask-image` or a `::after` pseudo-element to indicate scrollable overflow

## 8. Responsive: Safe Areas & Touch Targets

- [x] 8.1 Add `viewport-fit=cover` to the `<meta name="viewport">` tag in `app.html` and add `padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)` to `.page-wrap` / `.workspace-wrap` (additive to existing padding)
- [x] 8.2 Add `@media (max-width: 768px)` rule increasing `.btn-icon`, `.btn-tiny`, checkbox touch targets to `min-width: 44px; min-height: 44px` in `app.css`

## 9. Verification

- [x] 9.1 Run `npx sv check` to confirm no type/syntax errors after all changes
- [x] 9.2 Manual check: open landing page and trip workspace at 375px viewport width in browser devtools — confirm no horizontal overflow, forms stack, tabs show icons only
- [x] 9.3 Manual check: keyboard-navigate through create-trip modal — confirm focus trap, Esc close, focus restoration
- [x] 9.4 Manual check: verify toast is announced by screen reader (or inspect `aria-live` attribute in devtools)
