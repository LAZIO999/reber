# Security Specification - Reber Learn Kurdish

## Data Invariants
- A user can only read and write their own profile data.
- User XP and streak must be non-negative.
- Lessons and Courses are read-only for public but writable only by admins (or system).
- Progress documents are specific to a user and can only be managed by that user.
- Words are read-only for all authenticated users.

## The "Dirty Dozen" Payloads (Denial Expected)
1. Update another user's email: `PATCH /users/victim-uid { email: "attacker@gmail.com" }`
2. Set own XP to 999,999: `PATCH /users/my-uid { xp: 999999 }` (Assuming strict validation or admin only)
3. Create a course as a regular user: `POST /courses { ... }`
4. Delete a lesson as a student: `DELETE /courses/course-id/lessons/lesson-id`
5. Read all users summary: `GET /users` (Blanket read)
6. Update a word definition as a student: `PATCH /words/word-id { kurdish: "Malicious" }`
7. Set streak to a negative value: `PATCH /users/my-uid { streak: -10 }`
8. Inject 1MB string into `username`: `PATCH /users/my-uid { username: "A..." }`
9. Create progress for another user: `POST /users/other-uid/progress { ... }`
10. Bypass email verification: `GET /users/my-uid` with `email_verified: false` (if required)
11. Modify `id` of a word: `PATCH /words/word-id { id: "new-id" }`
12. Shadow update a system field in profile: `PATCH /users/my-uid { isAdmin: true }`

## Test Runner
(Tests will be simulated or implemented as security rules verification)
