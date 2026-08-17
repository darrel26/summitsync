## MODIFIED Requirements

### Requirement: Create a trip
The system SHALL allow any visitor to create a new trip by providing a name, organizer name, organizer PIN, and optional date and description through a standardized, accessible modal form built from UI kit primitives.

#### Scenario: Successful trip creation
- **WHEN** a visitor submits a trip name, organizer name, organizer PIN, date, and description
- **THEN** the system creates the trip record with the PIN, creates an owner member record, persists owner status in localStorage, and navigates to the trip view

#### Scenario: Trip creation with only a name
- **WHEN** a visitor submits a trip name, organizer name, and organizer PIN (date and description omitted)
- **THEN** the system creates the trip and owner member record with empty date/description fields

#### Scenario: Real-time form validation in Create Trip modal
- **WHEN** a visitor enters invalid inputs (e.g. empty trip name or non-numeric PIN)
- **THEN** the form highlights affected fields with UI kit error states and disables submission until inputs are valid
