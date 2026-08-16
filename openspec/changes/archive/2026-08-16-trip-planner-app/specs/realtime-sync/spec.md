## Purpose

Provides real-time synchronization across all trip data so that changes made by any member appear instantly for all other members viewing the same trip, without requiring page refresh.

## ADDED Requirements

### Requirement: Subscribe to collection changes
The system SHALL subscribe to real-time events (create, update, delete) for all trip-related collections when a trip view is open.

#### Scenario: Another member adds a group item
- **WHEN** member A adds a group item while member B has the trip open
- **THEN** member B sees the new item appear without refreshing the page

#### Scenario: Another member toggles a checkbox
- **WHEN** member A marks a personal item as packed while member B has the trip open
- **THEN** member B sees the checkbox state update in real-time

### Requirement: Scoped subscriptions
The system SHALL filter real-time subscriptions to only the current trip's data.

#### Scenario: Events from other trips
- **WHEN** a change occurs in a different trip's data
- **THEN** the current trip view does NOT receive or display that change

### Requirement: Reconnect on connection loss
The system SHALL automatically reconnect SSE subscriptions when the connection is lost and re-sync the current state.

#### Scenario: Network interruption
- **WHEN** the SSE connection drops and recovers
- **THEN** the system re-establishes subscriptions and fetches current data to ensure consistency

### Requirement: Unsubscribe on navigation
The system SHALL unsubscribe from all real-time subscriptions when the user navigates away from the trip view.

#### Scenario: Leave trip view
- **WHEN** a user navigates from the trip view to the trip list
- **THEN** the system unsubscribes from all active SSE subscriptions for that trip
