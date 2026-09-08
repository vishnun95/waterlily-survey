# Additional Notes

I enjoyed working on this assessment and tried to keep the implementation simple while still following a structure that would be easy to maintain and extend.

## Technical Approach

I used React and TypeScript for the frontend and Express/Node.js for the backend. Prisma is used for database access and managing the relationships between users, surveys, questions, responses, and answers.

For authentication, I used JWT with the token stored in a cookie. The backend has authentication middleware to protect the API endpoints that require a logged-in user.

I also tried to keep the frontend and backend responsibilities separate, so that the UI handles presentation and user interaction while the backend is responsible for authentication, validation, and database operations.

## Some Design Decisions

One of the main things I focused on was keeping the application straightforward rather than adding unnecessary complexity.

For example, I considered introducing additional state-management and data-fetching libraries, but for the size of this application I felt that the added complexity wasn't necessary. React's built-in state management was enough for the current requirements.

I also kept the API structure relatively simple so that it would be easy to understand and extend later.

## Trade-offs

Since this was a take-home assignment, I prioritized the core functionality and readability of the code over building out production-level infrastructure.

There are definitely areas where I would add more layers if this were a larger production application. For example, I would probably introduce a more formal service/repository structure, centralized validation, structured logging, and more comprehensive error handling as the application grows.

## What I Would Improve Next

If I had more time to continue developing the application, I would focus on:

- Adding unit and integration tests for the main flows.
- Improving form and API validation.
- Adding more detailed loading and error states.
- Improving accessibility across the application.
- Adding rate limiting and additional security hardening for production.
- Adding better logging and error monitoring.
- Improving the survey experience with progress indicators and the ability to resume an incomplete survey.
- Adding pagination if the number of surveys or questions becomes large.

## Final Thoughts

My main goal with the implementation was to make something that works well for the current requirements without over-engineering it.

I also tried to keep the code organized so that features can be added or changed without having to significantly rewrite the existing application.