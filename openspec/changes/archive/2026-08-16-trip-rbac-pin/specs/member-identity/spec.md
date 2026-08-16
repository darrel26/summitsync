## MODIFIED Requirements

### Requirement: Member record creation
The system SHALL create a member record with a designated role (`owner` or `member`) in the backend.

#### Scenario: Creator member created as owner
- **WHEN** a visitor creates a new trip
- **THEN** the system creates a member record linked to the trip with role set to `owner` and stores the ID and owner status in localStorage

#### Scenario: Name submitted
- **WHEN** a visitor joins via a shared trip link and submits their name on the prompt
- **THEN** the system creates a member record linked to the trip with role set to `member` and stores the member ID in localStorage

### Requirement: Remove member from trip
The system SHALL allow removing a member from a trip only by the Trip Owner.

#### Scenario: Remove member
- **WHEN** the trip owner removes a member from the Members tab
- **THEN** the system deletes the member record and all their personal items

#### Scenario: Member views remove buttons
- **WHEN** a non-owner views the Members tab
- **THEN** the remove member buttons are hidden or disabled
