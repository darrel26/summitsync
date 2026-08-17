## Why

SummitSync's link-sharing workflow was broken by requiring user login. Friends opening a shared trip link were forced into an email/password login screen or given organizer privileges inadvertently. We need frictionless access: opening a trip link immediately grants member access (claim/input name and manage personal checklist), while organizer/owner features remain protected by a 6-digit trip PIN.

## What Changes

- Remove mandatory email/password login gate (`LoginModal.svelte`) for visiting shared trip links.
- Restore open PocketBase collection rules (`""`) for trip data collections (`trips`, `members`, `group_items`, `personal_items`, `route`, `itinerary`) to enable unauthenticated member participation.
- Reinstate and enforce PIN-based organizer authorization (`OrganizerUnlockModal.svelte` and `isOwner` check) for organizer operations (edit/delete trip, manage route/itinerary, manage group items).
- Automatically assign member role upon opening trip link and selecting/entering name.

## Capabilities

### New Capabilities
None.

### Modified Capabilities
- `trip-rbac`: Require PIN validation to unlock organizer actions, allow unauthenticated link visitors full member capabilities (personal items, view details).
- `member-identity`: Allow unauthenticated link visitors to claim/select their member identity on first visit without login credentials.

## Impact

- **Frontend**:
  - `src/routes/+layout.svelte`: Remove `$auth.isValid` modal gate.
  - `src/routes/trip/[id]/+page.svelte`: Keep `NamePromptModal` for member identity selection; ensure member mode by default, organizer mode only after PIN unlock.
- **Backend / Schema**:
  - `pocketbase/pb_schema.json`: Set data collection rules back to `""` for frictionless link-based collaboration.
