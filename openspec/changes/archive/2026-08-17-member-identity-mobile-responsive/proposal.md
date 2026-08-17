## Why

When a participant opens a trip link on a new device, a private browsing tab, or a different mobile browser, the local storage identity is absent, triggering the "Join Trip" modal. If they enter their existing name (e.g. "Darrel"), the system blindly creates a duplicate member record rather than claiming or matching their existing identity.

Simultaneously, the mobile UI experience has usability friction: tab navigation hides labels below 480px leaving bare icons, workspace headers wrap awkwardly, form rows and checklist item cards crowd narrow viewports (< 480px), input font sizes below 16px trigger unwanted iOS Safari zoom, and timeline views lack clean vertical mobile hierarchy.

This change fixes the member re-joining edge cases and overhauls the mobile layout following high-standard mobile-first UI/UX practices.

## What Changes

- **Member Claim & Deduplication**:
  - Update `NamePromptModal` to support claiming existing unclaimed or matching trip members, or creating a new distinct member.
  - Add explicit identity switching / releasing from the Members tab or profile chip.
  - Prevent duplicate member record creation when matching an existing name.
- **Mobile-First Responsive Navigation**:
  - Replace broken icon-only tabs on mobile with an adaptive bottom bar or balanced 4-column tab bar preserving icon, label (compact font), and badge counts.
- **Header & Workspace Polish**:
  - Compact trip workspace header on mobile viewports (< 640px) with icon-first action cluster and clean title/badge wrapping.
  - Safe-area insets (`env(safe-area-inset-*)`) on all fixed bars, modals, and drawers.
- **Mobile-Optimized Checklist & Timeline Cards**:
  - Expand touch targets to 44x44px minimum for checkboxes and action buttons.
  - Stack group item metadata cleanly (assignee badge below item name on mobile).
  - Vertical timeline layout with connected visual indicator for Route stops and Itinerary events.
  - Set all mobile form input fonts to at least 16px to prevent automatic iOS Safari viewport zooming.

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `member-identity`: Add support for claiming existing member identity upon joining and identity switching without creating duplicate database records.
- `responsive-layout`: Refine tab navigation to retain labels on mobile viewports, enforce 16px form inputs on mobile, and establish mobile-specific stacked card and vertical timeline layouts.

## Impact

- `src/lib/components/NamePromptModal.svelte`: Added existing member selector and duplicate resolution.
- `src/lib/components/TabNav.svelte`: Mobile tab layout with preserved labels and bottom nav support.
- `src/lib/components/MembersTab.svelte`: Added identity switch/leave action and responsive card grid.
- `src/lib/components/ChecklistTab.svelte`: Mobile-optimized item rows, touch hitboxes, and personal bags.
- `src/lib/components/RouteTab.svelte`: Mobile vertical connected timeline and touch reorder buttons.
- `src/lib/components/ItineraryTab.svelte`: Mobile day filter chips and vertical schedule timeline.
- `src/routes/trip/[id]/+page.svelte`: Compact header layout and updated identity handling.
- `src/app.css`: Safe-area insets, mobile typography tokens (16px form inputs), and touch target rules.
