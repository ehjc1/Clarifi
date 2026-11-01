# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

SvelteKit (Svelte 5, TypeScript) with `@sveltejs/adapter-static`, browser-only. No backend. Statements are parsed in the browser and all data lives in the browser (localStorage/IndexedDB) with JSON export/import. Chosen by Eugene on 2026-11-01 so bank data never leaves the device and hosting is free static files.

## Users

Primary: Eugene, at home on a laptop, once or twice a month after an ANZ credit card statement arrives. The card is shared with a partner, so the statement mixes his expenses, hers, and split household bills. Job: get an honest monthly picture of *his* money (income, fixed, general, savings, investments; mortgage later) without hand-sorting rows in a spreadsheet.

Future: public users with the same shared-card problem ("me now, public later"). No accounts or multi-tenant yet; structure must not block adding them.

## Product Purpose

Clarifi turns a shared credit card statement into a personal budget. Upload the statement, rules decide what share of each transaction is yours (0%, 50%, 100%, or custom), and the dashboard shows your real position. Success: a statement goes from upload to trusted dashboard in under two minutes, with every row's share explainable by a rule the user wrote.

## Positioning

Share rules, not categories, are the primary mechanism. Every budgeting app categorises; Clarifi first asks "how much of this is mine?" and answers it with user-written conditions (merchant contains "Pak n Save" AND amount > 50 → 0% mine; "Contact Energy" → 50%; "Spark" → 0%). Local-only processing is the second claim: nothing is uploaded anywhere.

## Operating Context

- Input: ANZ (New Zealand) credit card statements. CSV export from ANZ internet banking first; PDF statements later.
- Currency NZD. Merchants are NZ: Pak'nSave, Countdown/Woolworths, Spark, Contact Energy, etc.
- Shared expenses: partner's purchases (ignore → 0% mine), split bills (50% or other %), own purchases (100%).
- Monthly ritual: upload, review rows the rules did not cover, add/adjust a rule, read the dashboard.
- Dashboard buckets: income(s), fixed expenses, general expenses, investments, savings, mortgage (future).

## Capabilities and Constraints

- Confirmed: statement upload (CSV now, PDF later), share rules with conditions on merchant text and amount, per-rule share %, dashboard across the six buckets, data stays in browser, JSON export.
- Undecided: exact ANZ CSV column names (verify against a real export), how income enters (manual entry vs. second statement), PDF parsing approach, multi-month history depth.
- Terminology: "share" = the fraction of a transaction that counts as mine. "Rule" = condition + share + bucket. "Bucket" = one of the six dashboard groups.

## Brand Commitments

Name: Clarifi. README tagline: "A simple, minimal and robust financial tracker for your personal needs. Giving freedom and flexibility back to the user!" Repo: github.com/ehjc1/Clarifi. No logo.

Standing visual preference (Eugene, 2026-11-01, after rejecting the "Payslip Arithmetic" direction as "horrible, I want something modern"): the category standard for modern consumer fintech, executed at the craft level of Revolut and Wise. Bold colour blocks, large rounded cards, playful but precise. Light and dark themes following the system setting. No paper, ledger, or printed-form metaphors. Typeface: Figtree, self-hosted (chosen over Geist, which the design detector flags as overused; Figtree's rounded geometric fits the playful-but-precise register).

## Evidence on Hand

None. No real statement in the repo; demonstration data must be authored and labelled synthetic. No testimonials, pricing, or usage numbers exist and must not be invented.

## Product Principles

1. Explain every number: any dashboard figure traces back to rows and the rule that set their share.
2. Rules over manual edits: a fix should become a rule so next month is automatic.
3. Local by default: no network calls with financial data.
4. Minimal and robust (the README's own words): few screens, no decoration that slows the monthly ritual.
5. Leave the door open for public use without building it now.
