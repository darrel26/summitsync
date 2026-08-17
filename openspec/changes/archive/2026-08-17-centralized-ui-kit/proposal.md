## Why

SummitSync currently uses scattered vanilla CSS classes and ad-hoc HTML controls across landing, modals, and tab views. Adding Tailwind CSS and establishing a centralized UI kit (`$lib/components/ui/`) based on shadcn-svelte architecture standardizes form controls, interactive modals, tabs, cards, and responsive layout shells, eliminating UI duplication and making layout inconsistencies immediately detectable.

## What Changes

- Install and configure Tailwind CSS and standard utility helpers (`clsx`, `tailwind-merge`, `cva`).
- Establish core atomic UI kit components in `$lib/components/ui/` (`Button`, `Input`, `Textarea`, `Dialog`, `Card`, `Badge`, `Checkbox`, `Tabs`, `DropdownMenu`).
- Standardize layout shell components (`AppHeader`, `PageContainer`, `EmptyState`) for consistent structure across all screens.
- Refactor the Create New Trip modal form into structured, validated sub-sections with standard UI kit controls.
- Refactor existing views (`+page.svelte`, `trip/[id]/+page.svelte`, tab components) to consume the centralized UI kit.

## Capabilities

### New Capabilities
- `ui-kit`: Centralized atomic UI component library, design token tokens mapping, and layout primitive components.

### Modified Capabilities
- `trip-management`: Standardize trip creation form layout, input controls, validation feedback, and empty states using UI kit primitives.
- `responsive-layout`: Integrate standardized layout containers and responsive grid primitives across landing and workspace pages.

## Impact

- **Dependencies**: Adds `tailwindcss`, `@tailwindcss/vite` (or `postcss`/`autoprefixer`), `bits-ui`, `clsx`, `tailwind-merge`, `class-variance-authority`.
- **Styling**: Maps existing `app.css` color tokens to Tailwind theme variables.
- **Components**: Introduces `$lib/components/ui/` directory and refactors existing tab and modal components to use centralized primitives.
