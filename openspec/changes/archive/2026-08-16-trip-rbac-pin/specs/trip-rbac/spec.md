## Purpose

Provides role-based access control (RBAC) and verification mechanisms to distinguish between Trip Owners and Trip Members without requiring full account registration.

## ADDED Requirements

### Requirement: Organizer PIN verification
The system SHALL verify an organizer PIN against the trip's stored PIN to elevate a session to Owner role.

#### Scenario: Correct PIN entered
- **WHEN** a user enters the matching organizer PIN in the unlock modal
- **THEN** the system elevates the user's role to Owner in localStorage and activates owner controls

#### Scenario: Incorrect PIN entered
- **WHEN** a user enters an invalid organizer PIN
- **THEN** the system rejects the elevation, displays an error message, and retains Member permissions

### Requirement: Owner persistence
The system SHALL store and maintain owner status in browser storage for the trip creator and authenticated owners.

#### Scenario: Trip creator visits own trip
- **WHEN** the creator opens their trip on the browser where it was created
- **THEN** the system automatically recognizes them as the Trip Owner without asking for a PIN again

### Requirement: Disabled action states for non-owners
The system SHALL render modification controls in disabled or hidden states for users who are not Trip Owners.

#### Scenario: Member views restricted controls
- **WHEN** a user with Member role views the Group Gear, Route, or Itinerary sections
- **THEN** the system disables or hides creation, editing, deletion, and reordering actions
