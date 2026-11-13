# Clarifi — Project Context

## PKB link (read this first)
Registry page is the single source of truth for purpose, status, and key decisions:

`/mnt/c/Users/eugen/OneDrive/Documents/Obsidian/EC-PKB/wiki/projects/clarifi.md`

Read it at the start of a Clarifi session. Record lasting decisions there. Code lives here. The global spine (`~/.claude/CLAUDE.md`) applies.

## Project
- Purpose: turn a shared ANZ credit card statement into a personal budget. Share rules (0% / 50% / 100% / custom) decide how much of each line is mine; dashboard shows income, fixed, general, investments, savings, mortgage. See `PRODUCT.md`.
- Stack: `frontend/` SvelteKit 3 (Svelte 5 runes, TypeScript), `@sveltejs/adapter-static`. `backend/` Django 5 + Django REST Framework, session auth, Postgres (`compose.yaml`) or sqlite by default. Signed out: data in localStorage, JSON export/import, no network calls with financial data. Signed in: the same data shape is mirrored to the account via `PUT /api/finance/snapshot/`.
- Layout: `frontend/src/lib/anz.ts` (CSV parser), `rules.ts` (share rules), `store.svelte.ts` (state, localStorage, account sync), `api.ts` (fetch client, CSRF), `components/` (GroupCard, Lines, Rules, Runway, Triage, Account), `routes/+page.svelte` (the sheet). `frontend/tests/` vitest. `backend/finance/` (models mirror `types.ts`: Statement, Line, Rule, Income, Preferences; snapshot + viewsets), `backend/accounts/` (csrf, register, login, logout, me).
- Run: `cd backend && uv sync && uv run manage.py migrate && uv run manage.py runserver` (port 8000); `cd frontend && npm run dev` (proxies `/api` to 8000); `npm run build` then `npm run preview`; `npx vitest run`; `uv run manage.py test`. `?sample` on the URL loads a synthetic statement. `backend/.env` (gitignored) is read by settings; `DATABASE_URL` there points at Postgres (`compose.yaml` or local server), unset = sqlite.
- Design: Impeccable artifacts in `PRODUCT.md`, `DESIGN.md`, `.impeccable/`. Direction: modern consumer fintech at Revolut/Wise craft level (Eugene's standing preference), light + dark via `prefers-color-scheme`, Figtree self-hosted, one teal-mint accent, six fixed bucket colours. Follow `DESIGN.md` for any UI change. Screenshots: `node .impeccable/shot.mjs "$PWD/.impeccable/review"` (set `SCHEME=dark` for dark) against `npm run preview` in `frontend/` on port 4173.

## Conventions
- Svelte 5 runes only; use `class={{ ... }}` objects, `{@attach}` not `use:`; keyed `{#each}`.
- All money in NZD via `src/lib/money.ts`. Tabular mono figures everywhere.
- Rules are evaluated for every row; first match wins, disagreements are flagged `conflict` and shown cross-hatched. Never silently drop a match.
- Payments/credits to the card (negative amounts) are not expenses unless a rule claims them.
- Every backend row is owner-scoped; viewsets filter by `request.user`, never trust ids from the client for ownership. `persist()` is the single write path: localStorage always, debounced snapshot PUT when signed in.
- `svelte-check` currently fails to resolve `$app/tsconfig` under SvelteKit 3.1; `vite build` is the type gate until fixed.
