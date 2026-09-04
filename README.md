# My Recovery Path

Build a complete responsive web application called "NoFap Center", a private personal recovery streak tracker.

IMPORTANT:

• Build the application directly. Do not create a plan, explain the plan, or ask me questions.

• Use the connected Supabase project "No Fap Center NFC Project" as the backend.

• Do NOT use Lovable Cloud as the backend.

• Use Supabase Auth for username/password authentication.

• Store all user streak data persistently in Supabase so it synchronizes across devices.

• Enable and correctly configure Row Level Security so each authenticated user can only access their own data.

• Keep the architecture simple and suitable for deployment as a static web application.

• Make the application mobile first and fully responsive.

• Make it installable as a PWA.

AUTHENTICATION:

• Provide Sign up and Sign in using username and password.

• The user should interact with a username field rather than being required to understand or enter an email address.

• Store authentication securely using Supabase Auth.

• Keep the user's recovery data private.

• Provide sign out functionality.

CORE TRACKING:

• Track the exact timestamp of the latest reset.

• Calculate the current streak dynamically from that timestamp.

• Display the current streak prominently in days, with hours and minutes available for more precise progress.

• Show the date and time the current streak started.

• Show the longest streak ever achieved.

• Show the previous/latest completed streak.

• Do not store unnecessary per day records. Use timestamps and aggregate values to keep the database minimal.

• The streak must continue correctly across refreshes, browser sessions, and different devices.

RESET:

• Provide a clearly visible but deliberately non prominent Reset option.

• Require confirmation before resetting.

• On confirmation, record the reset timestamp and set the current streak to zero.

• Preserve the longest streak.

• Preserve the latest completed streak.

• Calculate the completed streak from the previous reset timestamp when resetting.

• Make the reset action impossible to trigger accidentally.

MOTIVATION AND UX:

• The primary purpose is to encourage the user to make it through the next day.

• The dashboard should make the passage of time visually motivating.

• Show a large current streak counter.

• Include a visual progress indicator toward the next 24 hour milestone.

• Show encouraging but restrained messages that reinforce continuing the streak.

• Make the interface feel private, focused, calm, disciplined, and purposeful.

• Avoid imagery, language, animations, colors, or visual elements that could be sexually suggestive or triggering.

• Do not include pornography, sexual imagery, feeds, social features, advertisements, or unnecessary distractions.

• The reset action should visually communicate that it is a setback without being shaming or hostile.

• The overall aesthetic should help the user stay focused on reaching the next milestone.

DASHBOARD:

• Current streak

• 24 hour progress indicator

• Longest streak

• Previous completed streak

• Streak start timestamp

• Reset button with confirmation

• Sign out

• A simple motivational section

DATABASE:

Create the minimum necessary Supabase tables and schema required for this application.

Use the authenticated user's ID as the ownership relationship.

Enable RLS on user data tables.

Create policies for authenticated users so they can only select, insert, and update their own records.

Do not expose private user data publicly.

IMPLEMENTATION:

• Use clean reusable components.

• Handle loading states.

• Handle authentication errors.

• Handle database errors.

• Handle empty/new user state correctly.

• Ensure timestamps are handled consistently and displayed in the user's local timezone.

• Ensure streak calculations remain correct when the user changes devices.

• Do not create unnecessary tables, features, dependencies, or functionality.

• Complete the application rather than leaving placeholders or TODOs.

• Verify the authentication flow, database operations, streak calculation, reset flow, responsive layout, and PWA behavior before finishing.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/0a98a9d5-f926-4ea3-8486-db1bdb86e1a4).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
