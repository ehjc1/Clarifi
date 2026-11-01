# Clarifi — Project Context

## PKB link (read this first)
Registry page is the single source of truth for purpose, status, and key decisions:

`/mnt/c/Users/eugen/OneDrive/Documents/Obsidian/EC-PKB/wiki/projects/clarifi.md`

Read it at the start of a Clarifi session. Record lasting decisions there. Code lives here. The global spine (`~/.claude/CLAUDE.md`) applies.

## Project
- Purpose: turn a shared ANZ credit card statement into a personal budget. Share rules (0% / 50% / 100% / custom) decide how much of each line is mine; dashboard shows income, fixed, general, investments, savings, mortgage. See `PRODUCT.md`.
- Stack: SvelteKit 3 (Svelte 5 runes, TypeScript), `@sveltejs/adapter-static`, browser-only. Data in localStorage, JSON export/import. No backend, no network calls with financial data.
- Layout: `src/lib/anz.ts` (CSV parser), `src/lib/rules.ts` (share rules), `src/lib/store.svelte.ts` (state + persistence), `src/lib/components/` (BucketLine, Rules, ShareMark), `src/routes/+page.svelte` (the sheet). `tests/` vitest.
- Run: `npm run dev`; `npm run build` then `npm run preview`; `npx vitest run`. `?sample` on the URL loads a synthetic statement.
- Design: Impeccable artifacts in `PRODUCT.md`, `DESIGN.md`, `.impeccable/`. Direction: modern consumer fintech at Revolut/Wise craft level (Eugene's standing preference), light + dark via `prefers-color-scheme`, Figtree self-hosted, one teal-mint accent, six fixed bucket colours. Follow `DESIGN.md` for any UI change. Screenshots: `node .impeccable/shot.mjs "$PWD/.impeccable/review"` (set `SCHEME=dark` for dark) against `npm run preview` on port 4173.

## Conventions
- Svelte 5 runes only; use `class={{ ... }}` objects, `{@attach}` not `use:`; keyed `{#each}`.
- All money in NZD via `src/lib/money.ts`. Tabular mono figures everywhere.
- Rules are evaluated for every row; first match wins, disagreements are flagged `conflict` and shown cross-hatched. Never silently drop a match.
- Payments/credits to the card (negative amounts) are not expenses unless a rule claims them.
- `svelte-check` currently fails to resolve `$app/tsconfig` under SvelteKit 3.1; `vite build` is the type gate until fixed.
