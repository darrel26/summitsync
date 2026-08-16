## MODIFIED Requirements

### Requirement: Create a trip
The system SHALL allow any visitor to create a new trip by providing a name, organizer name, organizer PIN, and optional date and description.

#### Scenario: Successful trip creation
- **WHEN** a visitor submits a trip name, organizer name, organizer PIN, date, and description
- **THEN** the system creates the trip record with the PIN, creates an owner member record, persists owner status in localStorage, and navigates to the trip view

#### Scenario: Trip creation with only a name
- **WHEN** a visitor submits a trip name, organizer name, and organizer PIN (date and description omitted)
- **THEN** the system creates the trip and owner member record with empty date/description fields

### Requirement: Delete a trip
The system SHALL allow deletion of a trip and all its associated data ONLY by an authenticated Trip Owner.

#### Scenario: Delete trip with confirmation
- **WHEN** the trip owner triggers trip deletion and confirms
- **THEN** the system removes the trip and all related records and navigates back to the trip list

#### Scenario: Delete trip attempt by non-owner
- **WHEN** a member views the trip header
- **THEN** the delete trip option is hidden or disabled
