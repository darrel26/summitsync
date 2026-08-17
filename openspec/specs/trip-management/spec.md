## Purpose

Allows users to create, view, list, and share collaborative trips. Each trip is identified by a unique shareable link that anyone can open without authentication.

## Requirements

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

### Requirement: View trip list
The system SHALL display all existing trips on the landing page.

#### Scenario: Landing page with trips
- **WHEN** a visitor opens the application root URL
- **THEN** the system displays a list of all trips showing name and date

#### Scenario: Landing page with no trips
- **WHEN** a visitor opens the application and no trips exist
- **THEN** the system displays an empty state with a prompt to create a trip

### Requirement: View a single trip
The system SHALL display a trip's details organized in tabs: Members, Checklist, Route, and Itinerary.

#### Scenario: Open trip by link
- **WHEN** a visitor opens a trip URL (e.g. `/trip/<id>`)
- **THEN** the system displays the trip view with all tabs accessible

### Requirement: Share trip via link
The system SHALL provide a copyable shareable link for each trip.

#### Scenario: Copy share link
- **WHEN** a member clicks the share/copy-link action on a trip view
- **THEN** the system copies the trip URL to the clipboard

### Requirement: Delete a trip
The system SHALL allow deletion of a trip and all its associated data ONLY by an authenticated Trip Owner.

#### Scenario: Delete trip with confirmation
- **WHEN** the trip owner triggers trip deletion and confirms
- **THEN** the system removes the trip and all related records and navigates back to the trip list

#### Scenario: Delete trip attempt by non-owner
- **WHEN** a member views the trip header
- **THEN** the delete trip option is hidden or disabled
