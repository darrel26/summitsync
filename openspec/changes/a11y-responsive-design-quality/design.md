## Context

SummitSync is a SvelteKit SPA with 12 component/page files that each declare their own scoped `.btn`, `.card`, and layout styles. See proposal.md for the full motivation. Key constraints shaping the approach:

- **Svelte scoped CSS** — styles are per-component. Shared styles must go in `app.css` or a shared import.
- **No build dependencies to add** — native `<dialog>`, CSS media queries, and ARIA attributes cover everything.
- **SPA with `adapter-static`** — no SSR, so `app.html` is the single entry point for `<link>` tags and skip links.
- **PocketBase SSE real-time** — none of the UI changes affect data flow; subscriptions/stores are untouched.

## Goals / Non-Goals

**Goals:**
- WCAG AA on every screen (contrast, keyboard, screen reader, reduced motion)
- Usable on 320px–375px phone viewports without horizontal scroll
- Eliminate duplicated `.btn`/`.card` CSS across components
- Dark-mode-ready tokens (replace `#ffffff` → `--bg-surface`)

**Non-Goals:**
- Dark mode implementation (just token readiness)
- Redesign or layout overhaul — this is a quality pass, not a visual refresh
- Skeleton loading states (nice-to-have, not in scope)
- Custom confirmation dialogs to replace `confirm()` (native is accessible)

## Decisions

### 1. Native `<dialog>` over hand-rolled modal overlays

**Choice**: Replace the 3 modal components (`+page.svelte` create-trip, `NamePromptModal`, `OrganizerUnlockModal`) with native `<dialog>` elements using `.showModal()`.

**Why**: `<dialog>` gives focus trap, Esc close, `::backdrop`, and inert background for free — zero JS required for the accessibility parts. The current `div.modal-overlay` with manual `onclick`/`onkeydown` is incomplete (no focus trap, no inert).

**Alternative considered**: Adding a focus-trap JS utility. Rejected — more code for the same result, and `<dialog>` is Baseline Widely Available since March 2022.

**Migration**: Each modal becomes `<dialog bind:this={dialogEl}>`. Open via `dialogEl.showModal()`, close via `dialogEl.close()`. The `::backdrop` replaces the `.modal-overlay` background. `close` event handles focus restoration natively.

### 2. Shared `.btn` / `.card` extracted to `app.css`

**Choice**: Move the canonical `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-icon`, `.card` rules to `app.css`. Remove the ~5 duplicate declarations from component `<style>` blocks.

**Why**: The current copies have drifted (padding: 9px 16px vs 8px 14px, different gap values). One source of truth in `app.css` means consistent buttons site-wide.

**Alternative considered**: A shared `_shared.css` import. Rejected — Svelte's scoped CSS can't import shared partials without `:global()` anyway, and `app.css` already serves as the design-system file.

### 3. Contrast fix via token update, not per-element overrides

**Choice**: Update `--text-muted` from `#94a3b8` to `#64748b` (slate-500) in `app.css`. This single token change fixes contrast for all muted text.

**Why**: `#94a3b8` on `#ffffff` = 3.03:1 (fails AA). `#64748b` on `#ffffff` = 5.38:1 (passes). One line fixes every element using the token.

**Alternative considered**: Per-element color overrides. Rejected — more code, same result, fragile.

### 4. Packed-item opacity → text color change

**Choice**: Replace `opacity: 0.65` on `.is-packed` items with explicit `color: var(--text-muted)` and keep full opacity. The checkbox and strikethrough already convey "packed" visually.

**Why**: Opacity compounds with the already-borderline muted colors, dropping contrast below readable levels. Changing text color preserves the visual distinction without failing contrast.

### 5. `@import` → `<link>` for Google Fonts

**Choice**: Replace the `@import url(...)` in `app.css` with a `<link rel="stylesheet" ...>` in `app.html`, adding `&display=swap`.

**Why**: `@import` blocks CSS parsing (render-blocking chain). `<link>` with `display=swap` loads asynchronously and shows fallback text immediately (no FOIT).

### 6. Mobile breakpoints at 640px and 480px

**Choice**: Two breakpoints — `max-width: 640px` for layout stacking (grids, headers, form rows) and `max-width: 480px` for compact mode (icon-only tabs, single-column form fields).

**Why**: Matches the existing `minmax(320px, 1fr)` grid card size. 640px is where 2-column grids break; 480px is where tab labels stop fitting.

**Alternative considered**: Container queries. Rejected — adds complexity for components that are always full-width anyway; `@media` is simpler and sufficient.

### 7. Tab scroll affordance via CSS gradient mask

**Choice**: Add a right-edge fade gradient on `.tabs-nav-wrapper` when content overflows, using `mask-image: linear-gradient(...)`.

**Why**: The hidden scrollbar (`scrollbar-width: none`) means users don't know more tabs exist. A fade hint is the standard pattern (iOS Settings, Material tabs).

## Risks / Trade-offs

- **[`<dialog>` on older WebViews]** → `<dialog>` has been Baseline since March 2022 and works in all modern browsers. Android WebView 37+ and iOS Safari 15.4+ support it. The target audience (hikers with smartphones) falls well within this. No polyfill planned.
- **[Token rename side effects]** → Changing `--text-muted` value affects every use site. Mitigated by auditing all uses during implementation — the token is used for intentionally de-emphasized text, so higher contrast is universally correct.
- **[Scoped style removal]** → Removing `.btn` from component `<style>` blocks means components rely on `app.css`. If a component is ever extracted to a separate project, it loses its button styles. Acceptable for this monolithic SPA.
