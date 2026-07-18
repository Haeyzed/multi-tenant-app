# Central auth + public signup (frontend)

## Context

| Project | Role |
| --- | --- |
| `c:\Users\IT\Herd\multi-tenant-api` | Laravel Central API (`/api/v1`) |
| `c:\devs\multi-tenant-app` | **New** Next.js 16 app (Base UI / ReUI kit; login UI only) |
| `c:\development\multi-tenants-app` | **Old** reference (full central auth + providers + config-drawer) |

API contract (already live):

- Auth: `POST /auth/login`, `POST /auth/two-factor/confirm`, forgot/reset, `POST /auth/logout`, `GET|PUT /profile`
- Public: `GET /public/plans`, `GET /public/plans/options`, `POST /public/signup`
- Envelope: `{ status, message, data, meta, errors }` + `Authorization: Bearer {token}`

## Structure improvement (new app)

Avoid old deep nesting `components/central/components/auth`. Prefer:

```text
app/(central)/
  (auth)/login|two-factor|forgot-password|reset-password|signup/
  layout.tsx
features/central/auth/
  components/
  schemas/
  hooks/
lib/api/central-client.ts
lib/services/central/auth-service.ts
lib/services/central/public-signup-service.ts
lib/providers/
components/ui/                  # Base UI shadcn only
components/reui/                # stepper, phone-input (already present)
components/layout/
components/config-drawer.tsx    # port from old app
```

Aliases stay `@/*`. Keep `components/ui` Base UI-only — **do not add Radix**.

## Port / add missing pieces from old app → new

| Item | Action |
| --- | --- |
| `config-drawer.tsx` (+ layout/theme/direction providers, cookies) | Port from old app |
| `password-input` | Missing in new app — port Base UI version |
| form/API helpers | Port `form-api-errors` / `toast-api` patterns |
| `globals.css` utilities | Merge `no-scrollbar`, `container`, mobile 16px inputs if missing |
| ReUI stepper + phone-input | **Already in new app** — use for signup |
| confetti-fireworks | Not in old repo — add Magic UI / canvas-confetti for signup success if needed; no Radix |

## Phase 1 — Foundation

1. `.env.local`: `NEXT_PUBLIC_CENTRAL_API_URL=http://multi-tenant-api.test/api/v1`
2. `lib/api/central-client.ts` — Bearer from `localStorage` key `central_token`
3. Providers: QueryClient, theme, direction, central auth
4. Port password-input + config-drawer + CSS utilities
5. Zod schemas for **this** API (token reset; 2FA with `two_factor_token`)

## Phase 2 — Central auth UI + wiring

| Route | API |
| --- | --- |
| `/login` | `POST /auth/login` → optional `/two-factor` |
| `/two-factor` | `POST /auth/two-factor/confirm` |
| `/forgot-password` | `POST /auth/forgot-password` |
| `/reset-password` | `POST /auth/reset-password` |

Guards: guest-only on auth pages; authenticated redirect to `/` or `/dashboard` placeholder.

## Phase 3 — Public signup (ReUI stepper + phone)

Route: `/signup`

Steps:

1. Plan — `GET /public/plans/options`
2. Organization — name, optional slug/domain
3. Owner — owner_name, email, phone (ReUI phone-input), password
4. Review — `POST /public/signup`
5. Success — `login.primary_domain` CTA (+ optional confetti)

## Phase 4 — Polish

- Replace stub `login-form.tsx`
- Document env vars
- Smoke against API

## Out of scope

- Tenant-domain auth/admin
- Full central dashboard modules
- Old landlord `POST /auth/register` (separate from public store signup)

## Locked defaults

- Token key: `central_token`
- Post-signup: success step with link to tenant domain
- Base UI only; ReUI for stepper + phone
- Folder: `features/central/auth` + `lib/services/central`
