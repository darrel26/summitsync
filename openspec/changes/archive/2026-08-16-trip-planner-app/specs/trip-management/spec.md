## Purpose

Allows users to create, view, list, and share collaborative trips. Each trip is identified by a unique shareable link that anyone can open without authentication.

## ADDED Requirements

### Requirement: Create a trip
The system SHALL allow any visitor to create a new trip by providing a name and optional date and description.

#### Scenario: Successful trip creation
- **WHEN** a visitor submits a trip name, date, and description
- **THEN** the system creates a new trip record and navigates the visitor to the trip view

#### Scenario: Trip creation with only a name
- **WHEN** a visitor submits only a trip name (date and description omitted)
- **THEN** the system creates the trip with the name and empty date/description fields

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
The system SHALL allow deletion of a trip and all its associated data (members, items, route stops, itinerary days).

#### Scenario: Delete trip with confirmation
- **WHEN** a user triggers trip deletion and confirms
- **THEN** the system removes the trip and all related records and navigates back to the trip list
