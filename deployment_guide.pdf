Running automated tests:

1. Navigate to backend folder: The backend includes both unit tests and integration tests to verify core functionality.

Unit tests validate controllers and routes in isolation (Supabase calls are mocked).

Integration tests validate real database interaction.

Run:

   cd backend

2. Run unit tests: Unit tests:

Test login rejection and success.

Test health endpoint.

Test group creation (mocked database).

Validate logic without calling the real database.

Run:


   npm test

3. Run integration tests: 

Test creating a group in the real database.

Test logging an activity and verifying leaderboard points update.

Validate full backend → database → calculation flow.

Run:


   npm run test:integration
