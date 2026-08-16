## Purpose

Manages each member's personal packing list — individual items like headlamps, hiking shoes, and first aid kits that each person is responsible for bringing themselves.

## Requirements

### Requirement: Add personal item
The system SHALL allow a member to add items to their own personal checklist.

#### Scenario: Add personal item
- **WHEN** a member submits a personal item name
- **THEN** the system creates the item linked to that member, with packed status unchecked

### Requirement: Toggle personal item packed status
The system SHALL allow toggling the packed/not-packed checkbox on a personal item.

#### Scenario: Mark personal item as packed
- **WHEN** a member checks the packed checkbox on their personal item
- **THEN** the system updates the item's packed status to true, visible to all trip members

### Requirement: Remove personal item
The system SHALL allow a member to remove items from their personal checklist.

#### Scenario: Delete personal item
- **WHEN** a member deletes a personal item
- **THEN** the system removes the item record

### Requirement: View all members' personal items
The system SHALL display personal items grouped by member in the Checklist tab.

#### Scenario: View personal items
- **WHEN** a user views the Checklist tab
- **THEN** the system displays personal items organized under each member's name with their packed status

### Requirement: Edit personal item
The system SHALL allow editing a personal item's name.

#### Scenario: Edit personal item name
- **WHEN** a member edits a personal item's name
- **THEN** the system updates the record and reflects the change in real-time
