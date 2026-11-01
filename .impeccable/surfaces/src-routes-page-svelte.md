---
version: 1
slug: "src-routes-page-svelte"
primary_target: "src/routes/+page.svelte"
related_targets: []
---

# Surface: Clarifi app (dashboard + statement import)

Scope: the single-page app at `/`. Mode: Operate. Audience: Eugene, monthly, laptop at home. Task: import ANZ CSV, see my share per bucket, fix gaps by adding a rule. Must not change: local-only data, six buckets, share rules as the mechanism. Unresolved: real ANZ column names, PDF import, income entry model.

## Direction contract

THESIS: The budget is a payslip: every figure shows the sum that produced it. Refuses the KPI-card-plus-donut dashboard.

OWN-WORLD: Carbonless triplicate paper. Sheet #FBFBF8, ink #1C2230, carbon blue #2F4A8A for actions and rule codes, canary #F6DD8C (Mine copy) and pink #F3C4C4 (Partner copy) as whole-sheet tints, 1px hairlines #D9D6CE on an 8px grid, zero radius, no shadows. Red Hat Text for labels, Red Hat Mono tabular for every figure. Two type sizes in tables. Share state as printed marks: hollow 0%, half 50%, filled 100%, struck excluded. Conflict rows cross-hatched.

STORY: "This is the card, this is mine, this is why."

FIRST VIEWPORT: Top band: period, three copy tabs (Card · Mine · Partner), Import statement as filled blue box top right. Below: net position arithmetic line, then six bucket lines each reading card × share = mine. Right margin: numbered rule boxes.

FORM: Payslip Arithmetic, candidate 6 of 7, seed 734c3c8a. Signature interaction: switching copy tab tints the whole sheet and recomputes every line; a row moved by a new rule holds canary until scrolled past.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
