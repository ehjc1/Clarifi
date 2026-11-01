---
version: 1
slug: "src-routes-page-svelte"
primary_target: "src/routes/+page.svelte"
related_targets: []
---

# Surface: Clarifi app (dashboard + statement import)

Scope: the single-page app at `/`. Mode: Operate. Audience: Eugene, monthly, laptop or phone at home. Task: import ANZ CSV, see my share per bucket, fix gaps by adding a rule. Must not change: local-only data, six buckets, share rules as the mechanism. Unresolved: real ANZ column names, PDF import, income entry model.

Direction history: "Payslip Arithmetic" (seed 734c3c8a) built, reviewed, then rejected by the user on 2026-11-01 ("It looks horrible, I want something modern"). Replaced by the standing exit: the category standard at Revolut / Wise craft level. Canon is now the commitment, recorded in PRODUCT.md.

## Direction contract

THESIS: Modern consumer fintech, played straight: one big number you can trust, six bucket cards, rules as chips. Refuses paper, ledger and form metaphors.

OWN-WORLD: Light and dark themes via prefers-color-scheme. Surfaces #FFFFFF on #F3F4F8 (light) / #151821 on #0B0D12 (dark). One accent, teal-mint (#00C2A8 light, #2EF2D2 dark) carrying the hero block and primary action. Six fixed bucket colours as dots, chips and progress bars. Figtree for everything (one face; Geist was the first pick but is on the detector's overused list, and Figtree's rounded geometric reads closer to the Revolut/Wise playful-precise register), tabular figures. No mono. 20px card radius, 999px pills, soft offset shadow in light, hairline border in dark.

STORY: "Here is what is mine this month, by bucket, and the rules that decided it."

FIRST VIEWPORT: Top bar with wordmark, segmented Card · Mine · Partner control, Import pill. Below, a full-width accent hero card: the headline figure (left over / card total / partner's share) with the three contributing figures as pills. Then a 3-column grid of bucket cards (total, line count, share bar), rules column to the right.

FORM: Category canon (standing exit), bar set by Revolut and Wise; replaces roll seed 734c3c8a after user rejection. Signature interaction: segmented control switches copy; hero figure and every card total count to the new value; a row moved by a new rule glows accent until scrolled past.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
