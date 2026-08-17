## Context

See `proposal.md` for motivation. SummitSync previously introduced email/password authentication which blocked smooth link-sharing. We are removing the global auth modal gate and restoring open API rules for trip collaboration while securing organizer controls with trip PINs.

## Goals / Non-Goals

**Goals:**
- Enable immediate, frictionless link-based trip joining without login accounts.
- Allow participants to identify themselves via `NamePromptModal` and edit their own personal items.
- Protect organizer/owner powers (trip settings, group items, route, itinerary, deleting members) behind PIN unlock.

**Non-Goals:**
- Full multi-tenant enterprise RBAC.
- Password-protected encryption at the SQLite database layer.

## Decisions

1. **Remove Layout-Level Auth Gate**:
   - Revert `src/routes/+layout.svelte` to render content directly without checking `$auth.isValid` or rendering `LoginModal.svelte`.
   - *Alternative considered*: Keep optional login button. Rejected: Adds UI noise; all user collaboration happens per-trip.

2. **PocketBase Rules**:
   - Update `pocketbase/pb_schema.json` rules for collections `trips`, `members`, `group_items`, `personal_items`, `route`, `itinerary` back to open rules `""`.
   - *Alternative considered*: Token-based anonymous PB users. Rejected: Unnecessary overhead for link-based sharing app.

3. **Organizer State in Client**:
   - Maintain `trip_is_owner_${tripId}` in `localStorage` when trip is created or unlocked with correct PIN.
   - Verify PIN on client against trip's `pin` attribute (or empty/legacy trips) using `OrganizerUnlockModal.svelte`.

## Risks / Trade-offs

- [Client-side PIN verification visible if inspecting raw PocketBase records] → Accepted tradeoff for simple zero-auth serverless model; sufficient for cooperative trip planning.
