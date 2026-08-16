## Purpose

Provides lightweight identity for trip members without requiring accounts, passwords, or login. Visitors identify themselves by choosing a name, which is persisted in the browser.

## ADDED Requirements

### Requirement: First-visit name prompt
The system SHALL prompt a visitor for their name when they first open a trip and have no stored identity for that trip.

#### Scenario: New visitor opens trip
- **WHEN** a visitor opens a trip URL and has no member identity stored in localStorage for that trip
- **THEN** the system displays a name input prompt before showing the trip view

#### Scenario: Returning visitor opens trip
- **WHEN** a visitor opens a trip URL and has a stored member identity for that trip in localStorage
- **THEN** the system skips the name prompt and displays the trip view directly

### Requirement: Member record creation
The system SHALL create a member record in the backend when a visitor submits their name for a trip.

#### Scenario: Name submitted
- **WHEN** a visitor submits a name on the name prompt
- **THEN** the system creates a member record linked to the trip and stores the member ID in localStorage

### Requirement: Add member to trip
The system SHALL allow adding new members to a trip from the Members tab.

#### Scenario: Add a member
- **WHEN** a user adds a new member name in the Members tab
- **THEN** the system creates a member record for that trip visible to all participants

### Requirement: Remove member from trip
The system SHALL allow removing a member from a trip, including their personal items.

#### Scenario: Remove member
- **WHEN** a user removes a member from the Members tab
- **THEN** the system deletes the member record and all their personal items

### Requirement: Member list display
The system SHALL display all members of a trip in the Members tab.

#### Scenario: View members
- **WHEN** a user views the Members tab
- **THEN** the system lists all members belonging to that trip
