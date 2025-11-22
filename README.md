
1. App bootstrap
   - `app/page.tsx` runs on client. It calls `getFirebaseAuth()` from `lib/firebase.ts` and registers `onAuthStateChanged(auth, callback)`.
   - `onAuthStateChanged` sets local state `currentView: "landing" | "auth" | "app"`. Loading state is handled while waiting for Auth resolution.

2. Landing → Auth → App transitions
   - `LandingPage` component exposes `onNavigateToAuth()` prop. When invoked it sets `currentView = "auth"`.
   - `AuthPage` handles sign-in / sign-up flows (uses Firebase Auth methods). On successful auth it calls `onLoginSuccess()` which sets `currentView = "app"`.
   - `AppLayout` is the authenticated container. It receives `onLogout` which calls `signOut(getFirebaseAuth())` and resets `currentView = "landing"`.

3. App runtime composition
   - `AppLayout` mounts dashboard and workspace components (e.g., `dashboard.tsx`, `kpi-card.tsx`, `stock-chart.tsx`, `operational-filters.tsx`).
   - UI components either:
     - use custom hooks from `hooks/` (preferred pattern) which abstract data access, or
     - call `lib/firestore-operations.ts` / `lib/supabase-operations.ts` directly for one-off actions.

4. Data flow (reads / writes)
   - Read lists: `hooks/use-products.ts` calls `getProducts()` (from data module) which executes Firestore `getDocs` queries and returns typed `Product[]`.
   - Real-time updates: `hooks/useKPIs()` uses `subscribeToKPIs()` which sets up `onSnapshot` subscriptions on `products` and `move_history`, computes KPIs, and calls back with Dashboard data.
   - Writes / mutations: components call `createProduct`, `updateProduct`, `deleteProduct` (Firestore operations). For multi-step updates affecting stock and history, components call `batchUpdateStockAndMoveHistory()` which uses `writeBatch` to perform atomic commits.

5. Error handling and UX
   - Hooks return `loading` and `error` states; components render spinners or toasts (via `hooks/use-toast.ts` / `components/ui/toast.tsx`).

**Main folders and how they connect (file-level mapping)**
- `app/`
  - `page.tsx`: entry point. Auth gating and main view switcher. Controls which top-level UI is mounted.
- `components/`
  - Presentational and composed screens: `landing-page.tsx`, `auth-page.tsx`, `app-layout.tsx`, `dashboard.tsx`, `kpi-card.tsx`, `stock-chart.tsx`, `operational-filters.tsx`.
  - These components import hooks from `hooks/` for data and call `lib/*-operations.ts` for actions not abstracted in hooks.
- `components/ui/`
  - Radix-based primitives and design-system components (buttons, inputs, dialogs, table). Used by top-level components. No data logic here.
- `hooks/`
  - `use-products.ts`: `useProducts()` -> calls `getProducts()` and returns `{ products, loading, error }`.
  - `useKPIs()`: subscribes to KPI updates via `subscribeToKPIs()` and returns `{ kpis, loading }`.
  - `use-toast.ts`: toast helper used by components to surface errors and action confirmations.

- `lib/`
  - `firebase.ts`: initializes Firebase `app`, exposes `getFirebaseAuth()` and `getFirebaseDb()` singletons.
  - `firestore-operations.ts`: typed Firestore helpers for `products`, `stock_by_location`, `move_history`, `categories`, `warehouses`, and `batchUpdateStockAndMoveHistory()`.
  - `supabase.ts`: exports `supabase` client (unused or used for Postgres/Supabase features).
  - `supabase-operations.ts`: alternate data access layer if the app uses Supabase instead of Firestore for some endpoints. Hooks may import from this file instead of Firestore ops.
  - `types` / `firestore-types.ts`: TypeScript interfaces for `Product`, `MoveHistory`, `StockByLocation`, `Dashboard`, etc. (used by operations and hooks).

- `hooks` -> `components` -> `lib` call chain
  - Components call hooks (e.g., `const { products } = useProducts()`)
  - Hooks call data layer functions in `lib/firestore-operations.ts` or `lib/supabase-operations.ts`.
  - Data layer uses Firebase SDK (`getDocs`, `addDoc`, `onSnapshot`, `writeBatch`) to interact with Firestore, returning plain JS objects typed as TS interfaces.

- `scripts/setup-firestore.ts`
  - Schema documentation and a seed function `setupFirestore()` that creates sample `categories`, `warehouses`, and `products`. Intended for manual execution in a dev Firestore environment.

**Core connections (call traces)**
- Auth bootstrap: `app/page.tsx` → `lib/firebase.ts:getFirebaseAuth()` → Firebase SDK `onAuthStateChanged`.
- Product list rendering: `components/dashboard.tsx` (or other list component) → `hooks/use-products.ts` → `lib/firestore-operations.ts:getProducts()` → Firestore `getDocs`.
- KPI real-time: `components/kpi-card.tsx` → `hooks/useKPIs()` → `lib/firestore-operations.ts:subscribeToKPIs()` → Firestore `onSnapshot` on `products` + `move_history` → KPI calc in `subscribeToKPIs` → updates UI.
- Mutations: UI action → component handler → call `lib/firestore-operations.ts:createProduct|updateProduct|deleteProduct` or `batchUpdateStockAndMoveHistory` → Firestore `addDoc`/`updateDoc`/`writeBatch.commit()`.

**Files to inspect for behavior changes**
- `app/page.tsx` — auth gating and view switching
- `components/auth-page.tsx` — sign-in flows and callbacks
- `components/app-layout.tsx` — authenticated container, loads main workspace
- `lib/firestore-operations.ts` — all database read/write logic
- `hooks/use-products.ts` — hook patterns used by UI

**Notes**
- Some hooks import from `lib/supabase-operations.ts` where developers prepared an alternate backend client. The primary data layer implemented is Firestore in `lib/firestore-operations.ts`.
- `lib/firebase.ts` currently contains an inline config in the repo; it is used to initialize the Firebase SDK that the data layer depends on.

