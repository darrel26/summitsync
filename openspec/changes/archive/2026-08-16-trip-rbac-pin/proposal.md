## Why

Currently, any visitor with a trip link has unrestricted write permissions to all sections of a trip, including deleting the entire trip, altering shared group gear, modifying transportation routes, and editing the itinerary. As trips grow with more participants, trip organizers need role-based access control (RBAC) so that only the trip creator (Owner) maintains the master logistics, while invited participants (Members) can identify themselves, view the trip plan, check off their own assigned group gear, and manage their personal packing list.

## What Changes

- **Trip Creation with Organizer Identity & PIN**: During trip creation, the organizer specifies their name and an organizer PIN (e.g. 4–6 characters). The creator is automatically registered as the Trip Owner with owner credentials stored in their browser.
- **Organizer Unlock Modal**: Allows the trip owner to unlock/elevate to Owner permissions on any device by entering the trip's organizer PIN.
- **Role-Based Access Control (RBAC)**:
  - **Trip Owner (👑)**: Full control to edit/delete the trip, manage members, add/edit/reorder group gear items, route stops, and itinerary events.
  - **Trip Member (👤)**: View-only access to group gear, route stops, and itinerary. Can check off the `packed` status ONLY for group gear items assigned to them. Full control over their own personal packing list.
- **Disabled Action Controls**: Action buttons and form inputs that a user lacks permissions for (e.g., adding stops, editing itinerary, modifying unassigned group gear) are disabled/hidden with clear visual indicators.

## Capabilities

### New Capabilities
- `trip-rbac`: Role-based access control, organizer PIN verification, permission checks, and owner elevation flow.

### Modified Capabilities
- `trip-management`: Require organizer name and PIN on trip creation; restrict trip deletion to the trip owner.
- `member-identity`: Associate role (`owner` or `member`) with member records and distinguish owner privileges.
- `group-checklist`: Restrict group gear item creation, editing, and deletion to the owner; allow members to toggle packed status on items assigned to them.
- `transportation-route`: Restrict route waypoint creation, editing, reordering, and deletion to the trip owner.
- `itinerary`: Restrict itinerary day/event creation, editing, reordering, and deletion to the trip owner.

## Impact

- **Database**: Add `pin` text field to `trips` collection schema, and `role` text field (`owner` | `member`) to `members` collection schema.
- **Frontend State**: Add reactive permission store / derived owner state (`isOwner`, `currentMemberId`) based on `localStorage` tokens and PIN verification.
- **UI Components**: Add PIN input to Create Trip modal, Organizer Unlock button & modal to Trip Header, and conditional disabled/read-only states to `ChecklistTab`, `RouteTab`, `ItineraryTab`, and `MembersTab`.
