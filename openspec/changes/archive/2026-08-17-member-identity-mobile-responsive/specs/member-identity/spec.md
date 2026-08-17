## MODIFIED Requirements

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

## ADDED Requirements

### Requirement: Member identity switching and release
The system SHALL allow users to switch their active member identity or release their stored profile from the browser.

#### Scenario: User switches identity
- **WHEN** a user chooses to switch their identity from the Members view or profile menu
- **THEN** the system clears the current localStorage member ID and presents the member selection/prompt dialog
