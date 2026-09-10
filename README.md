# NoFap Center

A private, personal recovery streak tracker. Sign up with a username and password, track your current streak, and keep your progress synchronized across devices through Supabase.

[![CI / GitHub Actions](https://github.com/SpawnLogic/my-recovery-path/actions/workflows/deploy.yml/badge.svg)](https://github.com/SpawnLogic/my-recovery-path/actions/workflows/deploy.yml)
![Maintenance](https://img.shields.io/badge/maintenance-actively%20maintained-brightgreen)
![Repo Status](https://img.shields.io/badge/repo%20status-active-brightgreen)
![Version](https://img.shields.io/github/package-json/v/SpawnLogic/my-recovery-path/main?label=version)

## Tech Stack

- **React 19** + **TypeScript**
- **TanStack Start / Router**
- **Vite**
- **Supabase** (Auth + Database)
- **Bun**
- **Tailwind CSS**
- **Progressive Web App (PWA)**

## Project Flow

```text
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────────────┐
│  Sign up / In   │────▶│    Dashboard    │────▶│  Current streak counter │
│  (username +    │     │                 │     │  + 24h progress ring    │
│   password)     │     │                 │     └─────────────────────────┘
└─────────────────┘     │                 │
                        │   Reset streak  │────▶  Type RESET to confirm
                        │   (confirmed)   │
                        └─────────────────┘
                                   │
                                   ▼
                        ┌─────────────────────────┐
                        │  Supabase Auth + RLS    │
                        │  (one row per user)     │
                        └─────────────────────────┘
```

1. **Authentication** — Users sign up or sign in with a username and password. Supabase Auth handles authentication; no email address is shown in the UI.
2. **Dashboard** — Displays the current streak, a 24-hour progress indicator, longest streak, previous completed streak, and the streak start time.
3. **Streak tracking** — The current streak is calculated live from the stored `streak_started_at` timestamp.
4. **Reset** — Resetting records the current time and archives the just-completed streak. The action requires typing `RESET` to prevent accidental triggers.
5. **Persistence** — All streak data is stored in Supabase and protected by Row Level Security so each user can only access their own record.

## How It Works

- Users sign up or sign in with a username and password. Supabase Auth manages authentication behind the scenes.
- Each user's streak data is protected by Supabase Row Level Security (RLS).
- The current streak is calculated from the stored `streak_started_at` timestamp, so it stays accurate across reloads and devices.
- The dashboard shows the current streak, previous completed streak, longest streak, and streak start time.
- Resetting requires typing `RESET` to confirm. On confirmation, the current streak becomes the previous completed streak and the timer restarts.
- Longest streak is preserved across resets.

## Privacy

Authentication is handled by Supabase Auth. The application does not publicly display usernames or recovery data. Each user's streak record is isolated by Supabase Row Level Security and can only be read or modified by that authenticated user.

## Deployment

The frontend is built as a static site and deployed through **GitHub Pages**. Supabase provides backend authentication and data persistence. The deployment workflow is defined in `.github/workflows/deploy.yml`.

## Development

```sh
bun install
bun run dev
bun run build:static
```
