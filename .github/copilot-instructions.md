## Quick context

This is an Expo + React Native app using the Expo Router (file-based routing). The app lives in `app/` and routes are defined by filenames (see `app/_layout.tsx`). TypeScript is enabled (strict mode) and `@/*` is mapped to the repo root via `tsconfig.json`.

## Architecture highlights (what matters to an AI coder)

- Routing / screens: `app/` is the source of truth for routes. `app/_layout.tsx` mounts the global UI (see `Modal` being mounted here) and registers Stack screens.
- Global modal pattern: a zustand store at `components/modal/store.ts` (ModalType enum + `useModalStore`) drives the modal. The `Modal` component (`components/modal/modal.tsx`) is mounted in the layout so any route can open it.
- Secure storage & auth: `services/secure-storage-service.ts` centralizes token and user data access. Code often uses `SecureStorageService.isAuthenticated()` and `getAuthToken()` before navigating.
- API client: `services/axios-instance.ts` creates the `api` axios instance, sets `API_BASE` (currently a local IP) and installs request/response interceptors that attach the auth token via `SecureStorageService.getAuthToken()`.
- API surface: thin wrappers live in `services/*.api.ts` (e.g. `auth.api.ts`, `subscriptions.api.ts`) that call `api.post`/`api.get` and return `res.data`.

## Conventions & patterns to follow

- Use the `@/` import alias when referring to project modules (configured in `tsconfig.json`). Example: `import { SecureStorageService } from "@/services/secure-storage-service";`
- Route components live in `app/`. Prefer adding a new route file instead of editing router wiring. To add a screen, create `app/my-screen.tsx` or `app/my-screen/index.tsx`.
- Global UI: mount global overlays (toasts/modals) in `_layout.tsx` so they render across routes.
- State: small global state uses `zustand`. Follow the pattern in `components/modal/store.ts` for shape and API (openModal/closeModal/toggleModal).
- API error handling: keep using the axios interceptors pattern in `services/axios-instance.ts` and the thin wrappers in `services/*.api.ts` for retry/logic. If you need to change API base, edit `API_BASE` in `axios-instance.ts` (common local IP placeholder used now).

## Developer workflows & commands

- Install and run: `npm install` then `npm run start` (runs `expo start`). Mobile/emulator flows use `npm run android` / `npm run ios`.
- Project reset helper: `npm run reset-project` runs `scripts/reset-project.js` which will move existing starter code to `app-example` and create a blank `app/` (interactive prompt).
- Linting: `npm run lint` uses Expo's ESLint config. Keep formatting compatible with the repo's Prettier/ESLint setup.

## Quick examples (copyable patterns)

- Open the OFFER modal from any component:

  const { openModal } = useModalStore();
  openModal(ModalType.OFFER_MODAL);

- Check auth and navigate (pattern used in `app/index.tsx`):

  const isAuthenticated = await SecureStorageService.isAuthenticated();
  if (isAuthenticated) navigate('/qr');

- API call pattern (from `services/auth.api.ts`):

  const res = await api.post('/auth/login', { emailOrPhone, password });
  return res.data;

## Practical gotchas for an AI

- The app uses a local API base: `API_BASE` in `services/axios-instance.ts` often points to a LAN IP. Don't assume a public URL — update `API_BASE` when running on different networks or simulate responses in tests/mocks.
- Modal is globally mounted in `_layout.tsx`. To change modal behavior, update `components/modal/*` and you won't need to touch individual route files.
- There are both `app/` routes and a `screens/` directory. Prefer editing/adding files in `app/` for routing and UI; `screens/` may exist as legacy or shared components.
- Keep TypeScript `strict` expectations in mind; functions and stores are typed (look at `services/*.ts` and `components/*/store.ts`).

If any section is unclear or you want more detail (examples for tests, mocked API, or CI steps), tell me which area to expand and I will iterate.
