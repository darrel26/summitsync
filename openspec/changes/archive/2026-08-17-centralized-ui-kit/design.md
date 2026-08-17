## Context

SummitSync currently uses Svelte 5 with vanilla CSS classes scoped in `app.css` and individual component `<style>` blocks. Rebuilding into a unified UI kit requires introducing Tailwind CSS while preserving existing design tokens (Slate & Alpine Forest palette) and keeping Svelte 5 runes patterns.

## Goals / Non-Goals

**Goals:**
- Add Tailwind CSS v4 or v3 with Vite integration and CSS variable design tokens.
- Implement reusable atomic UI components in `$lib/components/ui/` using Svelte 5 snippets and runes.
- Use Bits UI for accessible primitives (Dialogs, Dropdowns, Tabs, Checkboxes).
- Establish shared layout components (`AppHeader`, `PageContainer`, `EmptyState`).
- Refactor the Create Trip modal to use structured UI kit primitives with inline field validation.
- Progressively replace duplicated view-level markup across landing and trip workspace views.

**Non-Goals:**
- Rewriting backend PocketBase schema or data models.
- Changing no-auth trip sharing or real-time sync business logic.
- Building an external npm package (the UI kit lives directly within the project repo).

## Decisions

### 1. shadcn-svelte architecture over external component package
- **Decision**: Copy/own component source files inside `src/lib/components/ui/` rather than installing an opaque component bundle.
- **Rationale**: Full customization control, zero package lock-in, easy tuning for Svelte 5 runes and custom SummitSync aesthetic.
- **Alternatives Considered**: Installing ready-made UI component libraries (Skeleton UI, Flowbite-Svelte) — rejected due to styling rigidity and heavy extra dependencies.

### 2. Bits UI for accessible headless logic
- **Decision**: Use `bits-ui` primitives for modal focus traps, dropdown positioning, and keyboard navigation.
- **Rationale**: Production-grade WAI-ARIA compliance without hand-rolling accessibility state machines.
- **Alternatives Considered**: Native HTML5 `<dialog>` and bespoke Svelte event listeners — rejected due to inconsistencies in mobile focus trapping and ESC backdrop handling.

### 3. Utility helpers (`cn`, `clsx`, `tailwind-merge`, `cva`)
- **Decision**: Provide standard `$lib/utils.ts` `cn(...)` helper and CVA variant definitions.
- **Rationale**: Allows clean variant switching (e.g. `<Button variant="outline" size="sm">`) with safe class override merging.

## Risks / Trade-offs

- [CSS Class Collisions during migration] → Wrap design tokens in `@layer base` and migrate views incrementally component by component.
- [Bundle size increase] → Tailwind tree-shakes unused classes automatically at Vite build time.
