## 1. Environment & Foundation Setup

- [x] 1.1 Install Tailwind CSS, PostCSS, Autoprefixer, Bits UI, `clsx`, `tailwind-merge`, and `class-variance-authority`
- [x] 1.2 Configure Tailwind and PostCSS in Vite and map color tokens / typography in `src/app.css`
- [x] 1.3 Create `$lib/utils.ts` with `cn()` class merging utility

## 2. Core UI Kit Primitives ($lib/components/ui/)

- [x] 2.1 Implement `Button` component with CVA variants (default, outline, ghost, destructive) and sizes
- [x] 2.2 Implement `Input` and `Textarea` components with focus styles and error states
- [x] 2.3 Implement `Badge` component for roles, dates, and status pills
- [x] 2.4 Implement `Card`, `CardHeader`, `CardTitle`, `CardContent`, and `CardFooter` components
- [x] 2.5 Implement `Dialog` component using Bits UI primitives (Dialog.Root, Content, Header, Title, Footer, Close)
- [x] 2.6 Implement `Checkbox` and `DropdownMenu` components with Bits UI primitives

## 3. Layout Shell Primitives

- [x] 3.1 Implement `AppHeader` component for consistent top navigation across landing and trip views
- [x] 3.2 Implement `PageContainer` component for max-width clamping and responsive padding
- [x] 3.3 Implement `EmptyState` component for zero-data views across tabs

## 4. Create Trip Form & Landing Refactor

- [x] 4.1 Refactor Create New Trip modal form into structured sub-sections using UI kit inputs, date controls, and validation
- [x] 4.2 Refactor landing page (`src/routes/+page.svelte`) to use `PageContainer`, `AppHeader`, `Card`, and `Button`
- [x] 4.3 Verify responsive behavior on landing page (mobile stacking, touch targets)

## 5. Workspace & Tab Views Migration

- [x] 5.1 Refactor workspace header and tab navigation in `src/routes/trip/[id]/+page.svelte`
- [x] 5.2 Refactor `NamePromptModal` and `OrganizerUnlockModal` to use UI kit `Dialog` and `Input`
- [x] 5.3 Refactor `ChecklistTab`, `MembersTab`, `RouteTab`, and `ItineraryTab` to consume UI kit primitives
- [x] 5.4 Run type diagnostics and build check (`npx sv check && npm run build`)
