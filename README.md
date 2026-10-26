# Tradeza

Global business directory and opportunity board — Next.js (App Router) + Supabase.

## Stack

- Next.js 16.4.2 (App Router, Cache Components, Turbopack)
- React 19, TypeScript (strict)
- Tailwind CSS 4 (existing design system, unchanged)
- Supabase: Postgres, Auth (Google OAuth), Row Level Security
- Zod 4 for server-side validation
- Vitest for unit tests

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in real values
npm run dev
```

Required environment variables (`.env.local`):

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable/anon key (RLS enforced) |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL, used for OAuth redirects (e.g. `http://localhost:3000`) |

No service-role key is used by the app. Never add one to client-visible env vars.

## Database

Migrations live in `supabase/migrations/` and are the source of truth:

| Migration | Contents |
| --- | --- |
| `20261018000000_tradeza_core_schema.sql` | profiles, categories, businesses, opportunities, RLS, triggers, indexes, seed categories |
| `20261020210000_profiles_public_security_invoker.sql` | public profile projection as a security-invoker view |
| `20261026120000_security_hardening.sql` | blocks self-assigned `verified` badges, per-column trigram search indexes |
| `20261026130000_advisor_hardening.sql` | advisor-driven policy and search-path fixes |
| `20261027120000_richer_listings.sql` | richer listing fields, 18 categories, `business-media` storage bucket + policies |

Apply them with the Supabase MCP server (`apply_migration`) or the Supabase CLI:

```bash
npx supabase link --project-ref <project-ref>
npx supabase db push
```

### Security model

RLS is enabled on every table exposed through the API:

- Anonymous visitors read only `published` businesses and `published` opportunities.
- Owners read their own rows in any status.
- Insert/update/delete require `auth.uid() = owner_id` — `owner_id` from the browser is never trusted.
- `profiles` rows are private; the `profiles_public` view exposes only `id`, `full_name`, `avatar_url`.
- The `verified` flag can only be changed by the service role / staff.
- Storage: logos and photos go to the public `business-media` bucket. Uploads/deletes are restricted to the owner's folder (`<auth.uid()>/…`), max 5 MB, JPG/PNG/WebP/AVIF only.

Verify the live project with the anon key:

```bash
npm run verify:rls
```

The script checks draft/closed invisibility, anonymous write blocking, and that the Google provider is enabled. It never prints keys.

## Google sign-in

1. Supabase Dashboard → **Authentication → Providers → Google**: enable and add the Google OAuth **Client ID** and **Client Secret**.
2. Google Cloud Console → **APIs & Services → Credentials → OAuth client**: add the authorized redirect URI
   `https://<project-ref>.supabase.co/auth/v1/callback`.
3. Supabase Dashboard → **Authentication → URL Configuration**: set **Site URL** to the deployed URL and add
   `http://localhost:3000/auth/callback` plus the production equivalent to **Redirect URLs**.
4. Set `NEXT_PUBLIC_SITE_URL` to the same canonical URL.

Sign-in flow: `/login` → Supabase OAuth → `/auth/callback` → session cookie → `next` destination (default `/my-business`). Sessions are refreshed by `src/proxy.ts`; protected routes are checked on the server.

## Scripts

```bash
npm run dev         # dev server
npm run build       # production build
npm run start       # production server
npm run lint        # ESLint
npm run typecheck   # tsc --noEmit
npm test            # Vitest unit tests
npm run verify:rls  # live RLS/auth probes against Supabase
```

## Project layout

```
src/app/            routes (home, businesses, opportunities, listings, auth callback)
src/components/     existing UI components (design unchanged)
src/lib/actions/    server actions (auth, businesses, opportunities)
src/lib/queries.ts  server-only Supabase reads
src/lib/supabase/   browser, server (SSR cookies) and public clients
src/lib/types/      database types and public projections
supabase/migrations versioned schema + RLS
scripts/            verification tooling
```

## Notes

- Listings are created as drafts; publishing is an explicit owner action.
- Draft businesses are visible to their owner only, via `/my-business/[id]/preview`.
- Business listings carry a WhatsApp number, contact person, products, price range, MOQ, service areas, year established, a logo, and up to 8 gallery photos. Photos are uploaded straight from the browser to Supabase Storage, so no server action body limits apply.
- Public listing pages only ever select public columns; `owner_id` is never exposed to visitors.
- No payments or subscriptions are wired up yet.
