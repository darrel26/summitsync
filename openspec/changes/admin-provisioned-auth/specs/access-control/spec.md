## Purpose

Provides secure, admin-provisioned access control and session management to prevent unauthorized access to trip data.

## ADDED Requirements

### Requirement: Authentication Gate
The application SHALL require a valid authenticated PocketBase user session before granting access to trip planning views and API operations.

#### Scenario: Unauthenticated visitor blocked
- **WHEN** an unauthenticated visitor opens any page in the application
- **THEN** the application displays a login interface and prevents viewing trip details or trip creation controls

#### Scenario: Valid login grants access
- **WHEN** a user enters valid email and password credentials provisioned by the admin
- **THEN** the application establishes an authenticated session, stores the auth token securely in client storage, and renders the requested view

#### Scenario: Invalid login shows error
- **WHEN** a user submits incorrect email or password credentials
- **THEN** the application rejects authentication and displays a clear error message without revealing sensitive internal details

### Requirement: Session Management and Sign Out
The application SHALL allow authenticated users to view their active identity and terminate their session.

#### Scenario: User logs out
- **WHEN** an authenticated user clicks the sign-out button
- **THEN** the application clears the stored authentication token and immediately returns to the login screen

#### Scenario: Session restoration
- **WHEN** a user with a non-expired token returns or refreshes the page
- **THEN** the application restores the active session automatically without prompting for credentials

### Requirement: Database API Rule Protection
The backend database SHALL reject unauthenticated read and write requests across all trip data collections and restrict account creation to administrators.

#### Scenario: Direct unauthenticated API request rejected
- **WHEN** an unauthenticated client requests records from `trips`, `members`, `group_items`, `personal_items`, `route`, or `itinerary`
- **THEN** the backend responds with a 401/403 forbidden error

#### Scenario: Public user self-registration blocked
- **WHEN** an unauthenticated request attempts to create a new user record in the `users` collection
- **THEN** the backend rejects the creation request
