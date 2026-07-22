# Marketing Hub

Internal tool for the Codimite marketing team: upload work assets, tag them by
project and category, post daily updates with links, and let admins review the
team's progress per project.

**Live:** https://codimite-marketing-hub.web.app

## Tech stack

- **React 19 + Vite + TypeScript** — client-side app (SPA)
- **TanStack Router** — file-based routing (`src/routes`)
- **TanStack Query + Zustand** — server state and auth state
- **Tailwind CSS v4 + shadcn/ui (Radix)** — styling and UI primitives
- **Firebase** — Authentication (Google sign-in), Firestore (data),
  Storage (files), Hosting (deploy)

## How access works (security model)

There is **one** login: Google sign-in. Access control happens in three
server-enforced gates, defined in `firestore.rules` and `storage.rules`:

1. **Domain gate** — only verified `@codimite.com` Google accounts.
2. **Approval gate** — first sign-in creates `users/{uid}` with
   `status: "pending"`; an admin must approve before any data access.
3. **Admin gate** — admin powers belong to emails on the allow-list, which
   lives in **two places that must stay in sync**:
   - `src/config/app.ts` → `ADMIN_EMAILS` (controls what the UI shows)
   - `firestore.rules` / `storage.rules` → `isAdmin()` (the real enforcement)

The client-side checks are UX only; the rules are the security boundary.

## Getting started

```bash
npm install
cp .env.example .env   # fill in values from Firebase console → Project settings → Your apps
npm run dev            # http://localhost:5173
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Local dev server with hot reload |
| `npm run build` | Type-check + production build into `dist/` |
| `npm run lint` | ESLint over the project |
| `npm run test` | Vitest browser tests (needs `npm run test:browser:install` once) |
| `npm run knip` | Report unused files/exports/dependencies |

## Deploying

Requires the Firebase CLI (`npm i -g firebase-tools`, `firebase login`).

```bash
# Security rules (deploy BEFORE hosting when rules changed)
firebase deploy --only firestore,storage

# The app
npm run build
firebase deploy --only hosting
```

Hosting keeps a release history — one-click rollback in the Firebase console.
Deploys never touch Firestore/Storage data.

## Project structure

```
src/
├── routes/            # TanStack Router file routes (URL structure)
│   ├── sign-in/       #   /sign-in — Google login
│   ├── access-request #   /access-request — pending-approval screen
│   ├── home, my-updates
│   └── admin/         #   /admin/* — guarded by RequireAdmin
├── features/          # Screen implementations
│   ├── auth/          #   sign-in, access-request + shared auth shells
│   ├── home/          #   dashboard shell, upload dropzone, weekly stats
│   ├── my-updates/    #   user's files & links with tagging
│   └── admin/         #   members approval, projects, categories, week-updates
├── lib/firebase/      # ALL Firebase access lives here
│   ├── config.ts      #   app init from .env
│   ├── auth.ts        #   Google sign-in + domain check
│   ├── users.ts       #   profiles, approval status
│   ├── projects.ts / categories.ts / assets.ts / updates.ts
│   └── firestore.ts   #   collection names
├── hooks/use-live-data.ts  # live Firestore subscriptions as React hooks
├── components/        # shared components (auth-gate, confirm-dialog, ui/)
├── stores/auth-store.ts    # signed-in user state (Zustand)
├── providers/auth-provider.tsx  # bridges Firebase Auth → store
└── types/             # shared TypeScript types
```

### Data model (Firestore)

| Collection | Purpose |
|---|---|
| `users/{uid}` | Profile + `status` (pending/approved/rejected) + role |
| `projects` | Taggable projects (admin-managed) |
| `categories` | Taggable categories (admin-managed) |
| `assets` | Uploaded file metadata; the file itself is in Storage under `assets/{uid}/{assetId}/{fileName}` |
| `updates` | Daily updates / links with notes |

## Adding a new admin

1. Add the email to `ADMIN_EMAILS` in `src/config/app.ts`.
2. Add the same email to `isAdmin()` in **both** `firestore.rules` and `storage.rules`.
3. `firebase deploy --only firestore,storage` then `npm run build && firebase deploy --only hosting`.
