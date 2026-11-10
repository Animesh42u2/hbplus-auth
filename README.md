# HB+ Auth: Google login restricted to @hbplus.fit

Cross-platform app (React Native + Expo Router + React Native for Web) with Google
sign-in limited to one email domain. The same codebase runs on web, Android and iOS.

**Live demo:** <your-netlify-url>

## Features

- Google sign-in (Firebase Authentication)
- Domain restriction: only `@hbplus.fit` emails can log in
- Protected dashboard (no access by direct URL without login)
- Logout, loading states and error handling
- Role-based UI (Admin / User), user profiles stored in Firestore

## Tech stack

React Native, Expo SDK, Expo Router, React Native for Web, TypeScript,
Firebase Authentication and Firestore, Netlify (web hosting)

## Setup

```bash
git clone <this-repo-url>
cd <repo-folder>
npm install
cp .env.example .env     # then fill in the values
npx expo start --web     # web
npx expo start           # then press a (Android) or i (iOS)
```

### Environment variables

| Variable | Purpose |
| --- | --- |
| `EXPO_PUBLIC_FIREBASE_API_KEY`, `..._AUTH_DOMAIN`, `..._PROJECT_ID`, `..._APP_ID` | Firebase web app config |
| `EXPO_PUBLIC_ALLOWED_DOMAIN` | Allowed email domain (default `hbplus.fit`) |
| `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`, `..._ANDROID_CLIENT_ID`, `..._IOS_CLIENT_ID` | Google OAuth client IDs, needed for native login only |

### Firebase setup

1. Create a Firebase project and enable **Authentication, Google** sign-in.
2. Add your site's domain (localhost and the Netlify domain) under
   **Authentication, Settings, Authorized domains**.
3. Create a Firestore database and publish `firestore.rules`.

## Authentication flow

1. The user clicks **Login with Google**. On web this opens the Firebase popup; on
   mobile it uses native Google Sign-In.
2. Firebase returns the signed-in user. `AuthContext` listens to `onAuthStateChanged`.
3. The email is checked against the allowed domain and must be verified.
4. If allowed, the user profile is created or updated in Firestore (`users/{uid}`, default
   role `user`) and the user is sent to the dashboard.
5. If not allowed, the user is signed out immediately and sees:
   *"Access restricted. Please login using your official domain email."*
6. Logout calls `signOut` and returns to the login page.

Tokens are stored and refreshed by the Firebase SDK. The app never handles raw tokens.

## How the domain restriction works

Three layers, so no single check is a point of failure:

1. **UI hint:** the Google `hd` parameter filters the account picker. It is only a hint
   and is not treated as security.
2. **Client check:** `isAllowedEmail()` (`src/utils/domain.ts`) requires the email to end
   with `@hbplus.fit` (exact suffix match, so `a@hbplus.fit.evil.com` fails). It runs in
   `AuthContext` for every auth state change.
3. **Server rules:** `firestore.rules` accepts requests only from verified emails on the
   allowed domain, so a tampered client cannot read or write data.

## Protected routes

`app/_layout.tsx` uses `Stack.Protected` guards: the `(app)` group (dashboard) is only
reachable when a user is signed in, and the login page only when signed out. The auth
state resolves first (loader shown), so there is no flash of the wrong page.

## Roles

New users are created with `role: "user"`. To make someone an admin, edit the `role`
field of their document in **Firestore, users** to `admin`. Firestore rules prevent users
from changing their own role.

## Testing notes

- A non-domain Gmail account is rejected with the access-restricted error.
- No `@hbplus.fit` account was available during development, so the success path was
  verified by temporarily setting `EXPO_PUBLIC_ALLOWED_DOMAIN=gmail.com` and the matching
  Firestore rule, then restoring the real domain.
- Native (Android/iOS) login requires the three Google client IDs above.

## Project structure

```
app/                 routes (login, index, (app)/dashboard)
src/components/      GoogleButton, ErrorBanner, Loader
src/config/          Firebase setup
src/context/         AuthContext (auth state, domain gate)
src/services/        Google login (web and native), user profiles
src/utils/           domain validation
firestore.rules      server-side security rules
netlify.toml         build and SPA redirect config
```

## Deployment

Netlify builds with `npx expo export --platform web` and publishes `dist`. Set all
`EXPO_PUBLIC_*` variables in Netlify, then redeploy after any change, because Expo reads
them at build time.