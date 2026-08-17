## MODIFIED Requirements

### Requirement: Organizer PIN verification
The system SHALL verify an organizer PIN against the trip's stored PIN to elevate a session to Owner role without requiring full user account login.

#### Scenario: Correct PIN entered
- **WHEN** a user enters the matching organizer PIN in the unlock modal
- **THEN** the system elevates the user's role to Owner in localStorage and activates owner controls

#### Scenario: Incorrect PIN entered
- **WHEN** a user enters an invalid organizer PIN
- **THEN** the system rejects the elevation, displays an error message, and retains Member permissions

### Requirement: Disabled action states for non-owners
The system SHALL render modification controls in disabled or hidden states for users who are not Trip Owners, while allowing them full access to their own member features (personal checklist).

#### Scenario: Member views restricted controls
- **WHEN** a user with Member role views the Group Gear, Route, or Itinerary sections
- **THEN** the system disables or hides creation, editing, deletion, and reordering actions

#### Scenario: Member manages personal checklist
- **WHEN** a user with Member role views the Personal Checklist section for their claimed member identity
- **THEN** the system allows adding, toggling, and deleting personal items
