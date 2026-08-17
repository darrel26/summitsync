## Purpose

Provides lightweight identity for trip members without requiring accounts, passwords, or login. Visitors identify themselves by choosing a name, which is persisted in the browser.

## Requirements

### Requirement: First-visit name prompt
The system SHALL prompt a visitor to identify themselves when they open a trip workspace without a stored identity for that trip, allowing them to either select/claim their existing member profile or join with a new name.

#### Scenario: New visitor opens trip
- **WHEN** a visitor opens a trip URL and has no member identity stored in localStorage for that trip
- **THEN** the system displays a name input prompt before showing the trip view

#### Scenario: Returning visitor opens trip
- **WHEN** a visitor opens a trip URL and has a stored member identity for that trip in localStorage
- **THEN** the system skips the name prompt and displays the trip view directly

#### Scenario: New visitor opens trip with no prior members
- **WHEN** a visitor opens a trip URL with no member identity in localStorage and no existing members on the trip
- **THEN** the system displays a name input prompt to enter a new name before showing the trip view

#### Scenario: Returning visitor with existing localStorage identity
- **WHEN** a visitor opens a trip URL and has a valid stored member identity for that trip in localStorage
- **THEN** the system skips the identity prompt and displays the trip view directly

#### Scenario: Visitor joins with matching existing name
- **WHEN** a visitor joins without localStorage identity and enters a name matching an existing member on that trip
- **THEN** the system claims the existing member identity without creating a duplicate record, saving the ID to localStorage

#### Scenario: Visitor selects existing member from roster
- **WHEN** a visitor joins without localStorage identity and selects an existing member name from the list
- **THEN** the system links their browser session to that member record and stores the ID in localStorage

### Requirement: Member record creation
The system SHALL create a member record with a designated role (`owner` or `member`) in the backend.

#### Scenario: Creator member created as owner
- **WHEN** a visitor creates a new trip
- **THEN** the system creates a member record linked to the trip with role set to `owner` and stores the ID and owner status in localStorage

#### Scenario: Name submitted
- **WHEN** a visitor joins via a shared trip link and submits their name on the prompt
- **THEN** the system creates a member record linked to the trip with role set to `member` and stores the member ID in localStorage

### Requirement: Add member to trip
The system SHALL allow adding new members to a trip from the Members tab.

#### Scenario: Add a member
- **WHEN** a user adds a new member name in the Members tab
- **THEN** the system creates a member record for that trip visible to all participants

### Requirement: Remove member from trip
The system SHALL allow removing a member from a trip only by the Trip Owner.

#### Scenario: Remove member
- **WHEN** the trip owner removes a member from the Members tab
- **THEN** the system deletes the member record and all their personal items

#### Scenario: Member views remove buttons
- **WHEN** a non-owner views the Members tab
- **THEN** the remove member buttons are hidden or disabled

### Requirement: Member list display
The system SHALL display all members of a trip in the Members tab.

#### Scenario: View members
- **WHEN** a user views the Members tab
- **THEN** the system lists all members belonging to that trip

### Requirement: Member identity switching and release
The system SHALL allow users to switch their active member identity or release their stored profile from the browser.

#### Scenario: User switches identity
- **WHEN** a user chooses to switch their identity from the Members view or profile menu
- **THEN** the system clears the current localStorage member ID and presents the member selection/prompt dialog
