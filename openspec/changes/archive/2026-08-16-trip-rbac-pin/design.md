## Context

Greenfield SvelteKit SPA connected to PocketBase backend with no email/password user accounts. See `proposal.md` for motivation. We need lightweight Role-Based Access Control (RBAC) to distinguish the Trip Creator (Owner) from invited participants (Members) using a secret Organizer PIN and `localStorage` session state.

## Goals / Non-Goals

**Goals:**
- Zero-friction identity: No username/password database tables or email verification flows.
- Creator identity creation at trip inception with role `owner`.
- Simple PIN unlock mechanism for the creator to manage their trip across multiple devices/browsers.
- Clean permission gates across Svelte components disabling unauthorized actions while preserving full personal packing list capabilities for members.
- Allow members to check off group gear items assigned to them.

**Non-Goals:**
- Multi-tier granular permissions (e.g. co-hosts, moderators).
- Email-based password recovery.
- Hardened cryptographic zero-trust security (this is tailored for small friend groups coordinating outdoor adventures).

## Decisions

### 1. Trip Schema PIN Field
- **Choice**: Add an optional or required `pin` text field (4–6 digits/chars) to the `trips` collection.
- **Why**: Allows the creator to set a memorable passcode when creating the trip. If they visit the trip link on their smartphone, they can enter the PIN to immediately gain Owner privileges.
- **Alternatives Considered**:
  - *Admin Secret URL Token (`?key=xyz`)*: Fragile if the link gets copied/shared accidentally to the group chat.
  - *Full PocketBase Auth (Users collection)*: Introduces heavy registration/login friction that deters non-technical friends.

### 2. Member Role Field & Auto-Creation on Trip Create
- **Choice**: When a user creates a trip, prompt for their Organizer Name and create both the `trips` record and a `members` record with `role: "owner"`. Store `trip_member_<tripId>` and `trip_is_owner_<tripId>: "true"` in the creator's `localStorage`.
- **Why**: Eliminates the extra "What is your name?" modal for the creator when they land on the newly created trip workspace.
- **Alternatives Considered**:
  - Separate creator prompt after redirection: Leads to awkward double-prompting.

### 3. Client-Side Permission Store & Visual Disabling
- **Choice**: Provide reactive state `isOwner` and `currentMemberId` in the trip workspace. Pass `isOwner` and `currentMemberId` as props to tab components.
- **Behavior**:
  - `ChecklistTab`: Group gear add form, edit, delete, and assignee selector disabled for non-owners. Checkbox active for owner OR if `item.assigned_to === currentMemberId`.
  - `RouteTab`: Add stop form disabled; move up/down, edit, and delete icons hidden for non-owners.
  - `ItineraryTab`: Add event form disabled; move up/down, edit, and delete icons hidden for non-owners.
  - `MembersTab`: Remove member button hidden for non-owners.
  - Header: Delete trip button hidden for non-owners; "Organizer Login / Unlock" button shown when `!isOwner`.

### 4. PIN Verification Flow
- **Choice**: When a user clicks "Organizer Unlock", a modal opens prompting for the trip's PIN. On submit, the client verifies `enteredPin === trip.pin`. If valid, it saves `trip_is_owner_<tripId> = "true"` in `localStorage` and elevates the UI.
- **Why**: Instant feedback, offline-resilient, zero server overhead.

## Risks / Trade-offs

- **[Client-side inspection]** → The PIN is stored on the `trips` record accessible via open read rules. Acceptable because friend-group trip packing lists do not contain financial or sensitive secrets. If strict hidden PIN is needed later, a PocketBase custom hook or view rule can redact it.
- **[Clearing browser storage]** → Organizer loses owner state on device. Mitigation: Click "Organizer Unlock" and enter PIN.
