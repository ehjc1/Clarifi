---
name: Clarifi
description: One big number you can trust, two group cards, rules as chips. Modern consumer fintech, played straight, light and dark.
colors:
  canvas: "#f3f4f8"
  surface: "#ffffff"
  surface-sunken: "#f6f7fb"
  ink: "#0b0f19"
  ink-muted: "#626b7a"
  line: "#e6e8ef"
  accent: "#00c2a8"
  accent-ink: "#042e28"
  accent-soft: "rgba(0, 194, 168, 0.14)"
  danger: "#e5484d"
  danger-soft: "rgba(229, 72, 77, 0.12)"
  danger-ink: "#ffffff"
  bucket-income: "#22c55e"
  bucket-fixed: "#3b82f6"
  bucket-general: "#f59e0b"
  bucket-investments: "#8b5cf6"
  bucket-savings: "#06b6d4"
  bucket-mortgage: "#ef4444"
  dark-canvas: "#0b0d12"
  dark-surface: "#151821"
  dark-surface-sunken: "#1c202b"
  dark-ink: "#f3f4f8"
  dark-ink-muted: "#9aa3b2"
  dark-line: "#262b38"
  dark-accent: "#2ef2d2"
  dark-accent-soft: "rgba(46, 242, 210, 0.14)"
typography:
  display:
    fontFamily: "Figtree, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "clamp(40px, 6vw, 64px)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Figtree, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "24px"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Figtree, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "18px"
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: "-0.01em"
  wordmark:
    fontFamily: "Figtree, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "20px"
    fontWeight: 700
    lineHeight: 1.5
    letterSpacing: "-0.03em"
  body:
    fontFamily: "Figtree, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "Figtree, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "normal"
  code:
    fontFamily: "Figtree, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "normal"
rounded:
  row: "12px"
  card: "20px"
  hero: "28px"
  pill: "999px"
spacing:
  xs: "6px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  xxl: "36px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "10px 18px"
  button-ghost:
    backgroundColor: "{colors.surface-sunken}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "10px 18px"
  button-ghost-hover:
    backgroundColor: "{colors.line}"
  button-on-accent:
    backgroundColor: "{colors.accent-ink}"
    textColor: "{colors.accent}"
    rounded: "{rounded.pill}"
    padding: "10px 18px"
  pill:
    backgroundColor: "{colors.surface-sunken}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
  pill-on-accent:
    backgroundColor: "rgba(4, 46, 40, 0.1)"
    textColor: "{colors.accent-ink}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
  month-pill:
    backgroundColor: "transparent"
    textColor: "{colors.accent-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
  month-pill-hover:
    backgroundColor: "rgba(4, 46, 40, 0.18)"
  month-pill-on:
    backgroundColor: "{colors.accent-ink}"
    textColor: "{colors.accent}"
  trend-bar-track:
    backgroundColor: "{colors.surface-sunken}"
    rounded: "{rounded.row}"
    height: "150px"
  trend-bar-fill:
    backgroundColor: "{colors.line}"
    rounded: "{rounded.row}"
  trend-bar-fill-on:
    backgroundColor: "{colors.accent}"
  trend-bar-fill-hover:
    backgroundColor: "{colors.ink-muted}"
  segment-on:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.pill}"
    padding: "7px 16px"
  segment-off:
    backgroundColor: "transparent"
    textColor: "{colors.ink-muted}"
    rounded: "{rounded.pill}"
    padding: "7px 16px"
  nav-pill:
    backgroundColor: "transparent"
    textColor: "{colors.ink-muted}"
    rounded: "{rounded.pill}"
    padding: "7px 14px"
  nav-pill-on:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "7px 14px"
  count-pill:
    backgroundColor: "{colors.surface-sunken}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.code}"
    rounded: "{rounded.pill}"
    padding: "1px 7px"
  count-pill-on:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.ink}"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "18px 20px"
  hero:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-ink}"
    rounded: "{rounded.hero}"
    padding: "24px 28px 28px"
  input:
    backgroundColor: "{colors.surface-sunken}"
    textColor: "{colors.ink}"
    rounded: "{rounded.row}"
    padding: "9px 12px"
  input-focus:
    backgroundColor: "{colors.surface}"
  row:
    backgroundColor: "transparent"
    rounded: "{rounded.row}"
    padding: "10px 12px"
  row-hover:
    backgroundColor: "{colors.surface-sunken}"
  row-held:
    backgroundColor: "{colors.accent-soft}"
    rounded: "{rounded.row}"
  row-conflict:
    backgroundColor: "{colors.danger-soft}"
    rounded: "{rounded.row}"
  choice:
    backgroundColor: "{colors.surface-sunken}"
    textColor: "{colors.ink}"
    typography: "{typography.title}"
    rounded: "{rounded.row}"
    padding: "14px 16px"
  choice-hover:
    backgroundColor: "{colors.accent-soft}"
  keycap:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.code}"
    rounded: "{rounded.pill}"
    padding: "1px 7px"
  bucket-chip-on:
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
  bucket-chip:
    backgroundColor: "{colors.surface-sunken}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
  filter-chip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
  filter-chip-on:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.canvas}"
  filter-chip-conflicts:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.danger}"
  filter-chip-conflicts-on:
    backgroundColor: "{colors.danger}"
    textColor: "{colors.danger-ink}"
  sort-pill:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "2px 10px"
  norule-chip:
    backgroundColor: "transparent"
    textColor: "{colors.ink-muted}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "4px 10px 4px 0"
  income-panel:
    backgroundColor: "{colors.surface-sunken}"
    rounded: "{rounded.row}"
    padding: "6px"
  list-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "12px 8px"
  group-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "18px 20px 10px"
  group-row:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.row}"
    padding: "9px 8px"
  group-row-hover:
    backgroundColor: "{colors.surface-sunken}"
---

# Design System: Clarifi

## Overview

**Creative North Star: "The Trusted Balance"**

Clarifi is modern consumer fintech played straight, at the craft level of Revolut and Wise. The whole screen is organised to make one figure believable: a full-width teal-mint hero carries the headline number in a tight 700-weight display, and everything beneath it (two group cards, Spend and Put away, on the Overview view; the line list one hash away on the Lines view; the rule cards on the Rules view) exists to explain where that number came from. Surfaces are large, white, and generously rounded; colour is scarce and rationed by role, so the one accent block, the small accent "Sort n unsorted" pill that points at it, and six small bucket colours do all the signalling.

The material is soft and bright in light mode (white cards floating on a cool grey canvas under a diffuse shadow) and flat and hairlined in dark mode (the same cards ringed by a 1px line on near-black). Figtree is the only face; its rounded geometry and tabular figures give the money a playful-but-precise register without ever becoming a ledger. Density is relaxed on desktop and collapses to a single column on phones without changing any component's shape.

Confirmed rejections: no paper, ledger or printed-form metaphors; no monospace face; no second accent.

**Key Characteristics:**
- One accent, used as a block (the hero) and as the primary action; nowhere else at full strength.
- Six fixed bucket colours that appear only as 10px dots, 14% chip tints and segments of an 8px stacked bar.
- Figtree at every size, tabular numerals everywhere, tight negative tracking as size rises.
- Pill radius (999px) for every control; 20px cards; 28px hero; 12px rows and inputs.
- Light: soft offset shadow. Dark: 1px ring. Same tokens, swapped under `prefers-color-scheme`.
- Figures count to new values with one 500ms expoOut tween; held rows (on the Lines view) glow accent until scrolled past.
- Bucket rows are links, not drawers: every row in a group card opens the Lines view pre-filtered to its bucket (`#lines/<bucket>`), and the hero Income figure links to `#lines/income`.
- Several statements live side by side: a month nav of pills on the hero and an "Over time" bar card beneath the buckets, both selecting the current statement.

## Colors

A near-neutral stage with one teal-mint voice and six quiet bucket hues that never raise theirs.

### Primary
- **Teal Mint** (`accent`, light `#00c2a8` / dark `#2ef2d2`): the hero block background, the primary button, the focus ring (2px outline, 2px offset), text selection, hover colour on row detail buttons, and the fill of the current-statement bar in the Over time card (same precedent as the triage progress bar). In dark mode it brightens rather than dims so the hero still reads as a block.
- **Deep Teal Ink** (`accent-ink`, `#042e28`, both themes): the only text colour allowed on the accent. Also the background of the inverted button and the selected month pill that sit on the hero; the selected month pill flips its text to the accent.
- **Mint Wash** (`accent-soft`, 14% accent): the held-row tint and its glow shadow; the tint behind the new-rule code chip.

### Bucket (fixed, six)
- **Income Green** (`bucket-income`), **Fixed Blue** (`bucket-fixed`), **General Amber** (`bucket-general`), **Investments Violet** (`bucket-investments`), **Savings Cyan** (`bucket-savings`), **Mortgage Red** (`bucket-mortgage`). Each bucket row and stacked-bar segment sets `--c` to its colour and the colour reaches the surface only three ways: the 10px dot beside the name, the stacked-bar segment, and the rule-code chip (`color-mix(in srgb, var(--c) 14%, transparent)` behind text in the full colour). Identical in light and dark.

### Neutral
- **Cool Canvas** (`canvas`, light `#f3f4f8` / dark `#0b0d12`): page background; also the text colour of the selected segment.
- **Surface** (`surface`, light `#ffffff` / dark `#151821`): every card, the segmented control, and the focused input.
- **Sunken Surface** (`surface-sunken`, light `#f6f7fb` / dark `#1c202b`): resting inputs, neutral pills, ghost buttons, row hover, share-bar track, and the income panel inside the Lines list card (12px radius, no divider).
- **Ink** (`ink`, light `#0b0f19` / dark `#f3f4f8`): body text, figures, the selected segment's fill.
- **Muted Ink** (`ink-muted`, light `#626b7a` / dark `#9aa3b2`): 13px labels, line counts, zero totals, placeholders, footer links, unselected segments.
- **Line** (`line`, light `#e6e8ef` / dark `#262b38`): input hover border, the 1px hairline at the one group boundary (state filters vs bucket filters on Lines); in dark mode it is also the 1px ring that replaces the shadow.
- **Danger Ink** (`danger-ink`, `#ffffff` in both themes): the only text colour on a danger fill; today that is the active Conflicts filter chip.
- **Danger** (`danger` `#e5484d`, `danger-soft` 12%): conflict chips and rows, the Conflicts filter chip (danger text at rest; danger fill with `danger-ink` text when active), the error card, form errors, and the Over time delta figure when spend rose against the previous statement. Same in both themes.

### Named Rules
**The One Block Rule.** The accent appears at full strength exactly twice on a screen: the hero and the primary button. Everything else that wants accent gets the 14% wash. The single exception is a progress or statement bar whose fill marks "the one that is current" (triage progress, the current month in Over time); the fill is a few pixels wide and never a surface. The "Sort n unsorted" pill in the Lines summary line is the primary button at label size, not a third outlet.

**The Three Outlets Rule.** A bucket colour may be a dot, a bar fill or segment, or a chip tint. It is never a text colour outside its chip, never a border, never a card background.

**The Mirrored Theme Rule.** Dark mode swaps neutrals and brightens the accent; bucket colours, danger, danger-ink and accent-ink do not change. Any new colour is defined once in light and once in the dark block, never inline.

## Typography

**Display Font:** Figtree (with system-ui, -apple-system, Segoe UI, sans-serif)
**Body Font:** Figtree (same face)
**Label/Mono Font:** none; figures use Figtree with `font-variant-numeric: tabular-nums` set on `body`.

**Character:** One rounded geometric sans at four self-hosted weights (400/500/600/700, latin woff2, `font-display: swap`). Tracking tightens as size grows, so big money looks set rather than typed.

### Hierarchy
- **Display** (700, `clamp(40px, 6vw, 64px)`, 1.05, -0.04em): the single headline figure in the hero. Nothing else uses it.
- **Headline** (600, 24px, 1.1, -0.02em): group card totals and the hero's three contributing figures (20px on phones), the current line (details and amount) in the triage card, the Lines heading at title size, and the Over time delta ("+$312.40"), which turns danger when positive. Muted ink and 500 weight when the total is zero.
- **Title** (600, 18px, -0.01em): the "Lines" and "Share rules" view headings, the triage card title and its three choice labels. Card titles and rule names are 600 at body size (15px).
- **Wordmark** (700, 20px, -0.03em): "Clarifi" in the top bar; the only logotype.
- **Body** (400, 15px, 1.5): rule conditions, the empty-state lede (17px, max 48ch), row details (500).
- **Label** (500, 13px, 1.2): pills, filter chips, line counts, the group card hint after a middle dot and its bucket-row percentages, the Lines summary line ("12 lines · card $x · mine $y", the copy figure at 600 ink), figure captions, form labels, footer links, the values and month labels over and under the Over time bars (ink and 600 on the current month); usually in muted ink. Rule-code chips drop to 12px/600. The hero label appends "· date range" at 500 and 70% opacity when more than one statement is loaded.

### Named Rules
**The Weight-Not-Case Rule.** Hierarchy is carried by size, weight and ink level. Nothing is uppercased or letterspaced open; the only tracking is negative and only above 15px.

**The Tabular Rule.** Every money figure is tabular so columns and tweened counts do not jitter. Figures are set in Figtree, never a mono.

## Layout

A single centred column, max 1240px, with 24px side padding (14px on phones) and 20px top. One page, three views switched by the URL hash (`#overview`, default; `#lines`, optionally `#lines/<bucket|unsorted|conflicts>` to preset the filter; `#rules`); the view is read on load and on `hashchange`, so the back button works and no router is involved. Adding a rule from the Rules view lands on Lines so the rows it moved are visible with their held glow.

The top bar is a flex row with 16px gaps: wordmark left, then the pill nav (Overview, Lines, Rules with its count pill) pushed against it with `margin-right: auto`, then the segmented Card / Mine / Partner control (rendered on Overview and Lines, the two views that show figures; absent on Rules), then the primary Import pill. On phones the bar wraps with 10px gaps: wordmark and Import share the first row, the nav takes the second, and the segmented control drops to its own full-width row with equal-width segments; the Import pill loses its text.

**Overview** is full width: the hero, the triage card when lines are unsorted, then (24px below) the bucket section, a plain two-column grid (`repeat(2, minmax(0, 1fr))`, 12px gaps, `align-content: start`) of two group cards: Spend (fixed, general, mortgage) and Put away (savings, investments). Income has no card; it is a hero figure that links to `#lines/income`. At 640px the grid is one column and the hero stacks its figures under the headline. Nothing on Overview expands; the bucket rows link out to Lines. When more than one statement is loaded, an "Over time" card spans the full grid width (`grid-column: 1 / -1`) after the group cards: two columns `minmax(180px, 1fr) minmax(0, 2fr)` with a 24px gap, aligned to the end; a text block on the left and a 150px-tall bar row on the right whose columns are `minmax(88px, 120px)` justified to the end with 12px gaps and `overflow-x: auto` when months outgrow the width. At 640px it drops to one column and the bars justify to the start. A "Payments to the card" strip of neutral pills spans the full grid width beneath the cards when there are credits.

**Lines** is a 14px vertical stack: a heading row (`space-between`, 16px gap) of title plus label-size subline on the left and a 260px search input on the right; a wrapping row of filter chips at 6px gaps (All, Unsorted n, Conflicts n when any, then a 1px by 18px `--line` separator with 4px side margins, then the six bucket chips), each a surface pill carrying the card shadow; then one list card at 12px 8px holding the optional income panel (Income filter only; a sunken 12px panel, 6px padding, inset 4px, 12px below), a 13px summary line inset 12px (count left, followed by the accent "Sort n unsorted" pill when unsorted lines exist; card total and the copy's total right), and the rows. Rows are a 48px / 1fr / auto / auto grid (date, details + conflict chip, chip meta, amount) with 12px gaps, 10px 12px padding, 2px apart, sorted by date. The chip meta is a fixed three-column grid (bucket 112px / code 44px / share 52px, 6px gaps, share right-aligned) so chips line up down the list. Under 640px the heading stacks and the search goes full width; rows become `1fr auto`, the date column hides and the date moves inline before the details, the meta grid turns `auto auto auto` with the bucket chip kept, and the amount spans both rows on the right.

**Rules** is a 14px vertical stack: a heading row (title 18px 600 with a label-size subline on the left, the primary "New rule" pill with a 16px stroke plus on the right, `space-between`), the inline add-rule form card when open, then a two-column grid of rule cards with 12px gaps. Under 720px the rule grid is one column. The form's field grid is three columns (10px row / 12px column gaps): details spans 3, the two amount bounds and the share select sit on one row, bucket takes one cell and name spans 2; under 720px it is two columns with details and name spanning both.

The footer is shared by both views: a 13px muted-ink line ("Stored in this browser only") followed by Export JSON, Import JSON and Remove this statement (disabled when nothing is loaded) as link-style buttons, 16px gaps, 32px above.

Spacing rhythm is a loose 6/8/12/16/24/36 scale: 6px between chips, 8px inside stacks, 12px between cards and rows, 14px to 24px between sections, 36px between hero figures. Card interiors are 18px 20px 10px (group; its bucket rows bleed 8px into the side padding so their hover tint aligns with the header), 12px 8px (the Lines list, whose rows carry their own 10px 12px and whose income panel is 6px around 8px 12px rows) and 16px 18px (rule and rule form); the hero is 24px 28px 28px (20px on phones).

## Elevation & Depth

Hybrid, by theme. In light mode every card lifts off the canvas with one soft diffuse shadow (`0 10px 30px rgba(11,15,25,.06), 0 1px 2px rgba(11,15,25,.04)`); there are no borders. In dark mode the same `--shadow` token becomes a 1px ring of `--line`, so depth is a hairline rather than a glow. The hero, as the one solid colour block, sits flush with `box-shadow: none` in both themes. Within a card, depth is tonal: sunken surface for inputs, hover rows, bar tracks and the income panel; accent wash for held rows; danger wash for conflicts.

### Shadow Vocabulary
- **Card lift** (`box-shadow: 0 10px 30px rgba(11, 15, 25, 0.06), 0 1px 2px rgba(11, 15, 25, 0.04)`): every `.card`, the segmented control, the active nav pill and the Lines filter chips at rest, light mode only.
- **Dark ring** (`box-shadow: 0 0 0 1px var(--line)`): the same elements under `prefers-color-scheme: dark`.
- **Held glow** (`box-shadow: 0 6px 18px var(--accent-soft)`): a Lines row just moved by a new rule, until it scrolls past (IntersectionObserver release at 0.6 threshold).
- **Card hover lift** (`transform: translateY(-1px)`, 150ms): buttons and triage choices; the shadow token is unchanged, only the surface moves. Group cards do not lift; their bucket rows take the sunken row-hover tint and the chevron slides 2px right and turns accent.

### Named Rules
**The One Shadow Rule.** There is one shadow token. Cards use it; nothing invents another. The only exception is the held-row glow, which is a state, not a surface.

**The Flush Block Rule.** A full-colour block (the hero) never carries a shadow or ring; its colour is its edge.

## Shapes

Everything is rounded and nothing is square. Radius scales with the size of the thing: 999px for every control that reads as a chip or button (pills, buttons, segments, the stacked bar and each of its segments, the 10px dot as a circle), 12px for rows, inputs and the tall Over time bar tracks (and the focus shape of the button wrapping each bar) that sit inside a card, 20px for cards, 28px for the hero (22px on phones). Borders are absent in light mode; inputs use a transparent 1px border that becomes `--line` on hover and `--accent` on focus so layout never shifts. The select is a native element with its chevron drawn as two 5px gradient triangles in muted ink. No dividers between rows; 2px of air and hover tint separate them. A 1px `--line` hairline is allowed only at a group boundary; today the sole instance is the vertical separator between state and bucket filter chips. The income block is a sunken 12px panel, not a hairlined section.

## Components

### Buttons
- **Shape:** full pill (999px), 10px 18px, 600 weight at 14px, 8px gap to an inline 16px stroke icon.
- **Primary:** accent fill with accent-ink text ("Import statement", "New rule" with a 16px 1.8-stroke plus drawn inline, "Add rule").
- **Hover / Focus:** `brightness(1.06)` and a 1px lift, 150ms on the shared `--ease` (`cubic-bezier(0.19, 1, 0.22, 1)`); active returns to rest; focus-visible is the global 2px accent outline. Disabled drops to 45% opacity.
- **Ghost:** sunken surface fill with ink text, hover to `--line` ("Add income").
- **On-accent (inverted):** accent-ink fill with accent text, used only inside the hero ("Try with a sample statement", "Sort N unsorted lines").
- **Link:** bare text, 13px 500 muted ink, hover to ink. Footer actions (Export JSON, Import JSON, Remove this statement), "Remove" and "Cancel". On the hero it is accent-ink and underlined (3px offset).

### Chips
- **Style:** pill, 4px 10px, 13px 500, 6px gap, sunken surface with ink text; never wraps.
- **On accent:** 10% accent-ink tint with accent-ink text (the single period chip, "sample · synthetic data" status chip pushed to the end of the hero's top row with `margin-left: auto`).
- **Month pill (nav on accent):** the period chip as a toggle when several statements exist: transparent at rest with accent-ink text at 600, hover to an 18% accent-ink tint, selected fills accent-ink with accent text (`aria-pressed`); 150ms colour and background on `--ease`, 4px apart.
- **Code chip:** 12px 600, bucket colour text on a 14% mix of the same colour (R1, R2…); the new-rule form uses the accent as its colour.
- **Share chip:** muted ink text ("0% mine"), ink when the share is 100%.
- **Bucket chip:** dot plus capitalised bucket name, sunken fill, muted ink; on a Lines row it leads the chip meta, stays on phones, and drops to 60% opacity on an unsorted row. As a radio in the triage card the selected chip takes a 16% `color-mix` tint of the bucket colour with ink text at 600 and no border (the colour is a tint only; Three Outlets holds). Unselected stays sunken and muted.
- **Keycap:** 12px 600 pill, surface fill, muted ink, 1px 7px, trailing a label with an 8px gap (inline variant: sunken fill, 0 5px, 4px margin). Hidden under `@media (hover: none)`.
- **Warn chip:** danger text on transparent, no left padding ("conflict · A vs B" on a row). On a group card's bucket row the conflict count sits on the danger wash instead ("2 conflicts", `danger-soft` fill).
- **Filter chip (Lines):** a borderless surface pill carrying the card shadow (dark ring in dark mode), muted ink, hover to ink; the count trails at 12px and 70% opacity; active (`aria-pressed`) fills ink with canvas text and the bucket dot turns canvas. The Conflicts chip is danger text at rest and danger fill with `danger-ink` text when active. 150ms colour and background on `--ease`.
- **Ghost chip:** transparent, muted ink, 500, no left padding ("fired 1" on a rule card; "no rule" in the code slot of an unsorted Lines row).
- **Sort pill (Lines):** the primary button at chip scale: accent fill, accent-ink text, 600, 2px 10px, 999px, hover `brightness(1.06)`; sits after the count in the list summary line and mounts the triage card above the list, scrolling to the top.

### Cards / Containers
- **Corner Style:** 20px; hero 28px.
- **Background:** surface; hero is accent with accent-ink text; error card is danger-soft with danger text and no shadow.
- **Shadow Strategy:** the single card lift (light) or dark ring; see Elevation.
- **Border:** none.
- **Internal Padding:** 18px 20px 10px (group), 16px 18px (rule), 24px 28px 28px (hero).

### Inputs / Fields
- **Style:** sunken surface, transparent 1px border, 12px radius, 9px 12px, inherits body font; full width; placeholder in muted ink. Labels sit above at 13px 500 muted ink with a 6px gap; paired fields split 1fr 1fr with 10px gap.
- **Focus:** border to accent, background to surface, 150ms; no extra outline.
- **Hover:** border to `--line`.
- **Error:** a body-size line in danger below the form.

### Navigation
- **Top bar:** wordmark (700, 20px, -0.03em) left; pill nav beside it; segmented control (Overview and Lines) and primary Import pill right.
- **Pill nav:** three anchors (`#overview`, `#lines`, `#rules`) at 15px 600 in muted ink, 7px 14px, 2px apart, 150ms colour and background on `--ease`. Hover lifts the text to ink; the active link (`aria-current="page"`) becomes a surface pill carrying the card shadow (dark ring in dark mode). The Rules link trails a count pill: 12px 600, 1px 7px, sunken surface and muted ink at rest, accent wash with ink text when its view is active. On phones the nav drops to the second row of the bar.
- **Segmented control:** shown on Overview and Lines; a surface pill with 4px inner padding and the card shadow; segments are pills at 7px 16px, 600/14px, muted ink; the selected segment fills with ink and flips text to canvas, 200ms. On phones it moves to its own row and segments share width equally.
- **Footer:** 13px muted-ink links at baseline, 16px gaps, 32px above; the same footer under both views.

### Group Card (signature)
A `<section class="card">` at 18px 20px 10px, a column flex with 8px gaps; two per Overview (Spend, Put away). Header row (`space-between`, baseline): title (600 body) followed by a label-size hint after a middle dot ("Spend · bills, everyday, mortgage"), line count at label size on the right. Below it the tweened group total at headline size (muted ink and 500 when the group has no lines). Then a stacked bar, 8px tall at pill radius with 3px gaps: one segment per bucket with a positive sum, flex-weighted by that sum in the bucket colour, its flex animating over 400ms `--ease`; a sunken full-width track when the group is empty. Then the bucket rows, each an `<a href="#lines/<bucket>">` grid of 10px dot / 1fr name (500) / auto conflict chip (danger on danger-soft) / auto percent (label, 3ch, right) / auto amount (600) / 16px 1.8-stroke chevron, 10px gaps, 9px 8px padding, 12px radius, bled 8px into the card's side padding. Hover tints the row sunken (150ms) and slides the chevron 2px right in accent. An empty bucket row drops name and amount to muted ink at 400 with an em dash for the amount and no percent. Nothing expands; the card itself has no hover state.

### Lines List (signature)
The Lines view's single list card, 12px 8px, carrying a 13px summary line (count, then the accent Sort pill when any line is unsorted on the All or Unsorted filter; card and copy totals on the right, both tweened with the shared 500ms expoOut) and the rows. Each row is a 48px / 1fr / auto / auto grid at 12px radius: date (13px muted), details as a bare 500-weight button (hover accent; click starts a rule from the line) with the warn chip beside it on conflict, a three-column chip meta (bucket chip 112px, code chip 44px, share chip 52px right-aligned; the share chip renders only when the copy is not Card and the share is not 100%, otherwise its cell stays empty; an unsorted row shows the ghost "no rule" chip in the code cell and its bucket chip at 60%), and the amount (card amount in 13px muted before the copy's share at 600 when they differ). Hover sunken; **held** rows get accent wash plus the held glow and are released by IntersectionObserver once scrolled past; **conflict** rows get danger wash; **excluded** (0% share) rows fade details and amount to muted ink at 400 weight. Empty filters show one 13px muted line ("Every line has a rule.", "No conflicts.", "Nothing matches …"). With the Income filter the income panel (a sunken 12px surface, 6px padding, holding 8px 12px rows of name / amount / Remove that lift to surface on hover, and the add-income form of two inputs and a ghost button as one more row) sits above the summary line; on phones the form drops to its own two-column row with the button spanning it.

### Rule Card (signature)
Surface card, 16px 18px, laid two per row (one under 720px): code chip, name (600), Remove link on one line; the condition sentence in label size; a chip row of share, bucket (dot + name) and "fired n". The add-rule form is the same card, revealed inline beneath the heading row by the "New rule" button and dismissed by a Cancel link: a header row of accent-tinted code chip (R n+1), "New rule" and Cancel, the three-column field grid described in Layout, an optional danger error line, and the primary "Add rule" pill aligned left. The form card is the only card on the Rules view that is not a rule.

### Triage Card (signature)
"Sort your lines": a plain `.card` (surface, 20px, `--shadow`, no accent border), 20px 24px 22px, mounted between the hero and the bucket grid 16px below the hero. Header is one flex row with 24px gaps: title (18px 600) over a label-size subline, a progress group of "done / total" in label plus a 120px by 6px pill bar (sunken track, accent fill, `scaleX` over 400ms `--ease`), and a Close link. The current line sits in a 48px / 1fr / auto grid at 22px 0 18px: date in label, details and amount at headline size; each new line enters with a 300ms `--ease` fade and 6px rise, keyed per line. Three **choice** buttons share a 3-column grid with 10px gaps: sunken surface at 12px radius, 14px 16px, label 18px 600 with a trailing keycap pill, hint in label size; hover to accent wash with a 1px lift at 150ms. The foot wraps a bucket radio group (bucket chips, 6px gaps) against a label-size line stating the exact rule condition, any collision note in ink 600, and a Skip link with an inline keycap. Keys: 1 / 2 / 3 choose, S skips, Escape closes. Phone: 16px padding, header wraps and the bar stretches, line and choices stack to one column. Done state is one 18px 600 line.

<!-- review: triage first pass disposition fix, seven findings, all applied; verdict pass pending at time of writing. -->
### Over Time Card (signature)
A plain `.card` spanning the full bucket grid, shown only when more than one statement is loaded (18px 20px). Left, a text block (2px gaps, top-aligned): "Over time" at 600 body size, a label-size subline naming the copy ("my share per statement"), the delta at headline size (24/600/-0.02em, 14px above) signed with + or − and coloured danger when spend rose, then "vs <previous month>" in label size. Right, one button per statement in a column grid: value / bar / label stacked with 6px gaps, text centred, 12px radius as the focus shape; the bar is a 12px-radius sunken track filling the 150px height, its fill `--line` scaled on Y from the bottom over 400ms `--ease` (bar height is the statement's share of the largest), hover to muted ink; the current month's fill is the accent and its value and label turn ink at 600. Clicking a bar selects that statement, the same as a month pill. Values tween with the shared 500ms expoOut; a change in statement count snaps instead of tweening.

<!-- review: multi-statement (month nav, status chip, Over time card) first pass disposition fix, six findings, all applied; verdict pass pending at time of writing. -->
<!-- review: views IA (hash nav, full-width overview, rules view) first pass disposition fix, six findings, all applied; verdict pass pending at time of writing. -->
<!-- review: Lines view and summary bucket cards first pass disposition fix, eight findings, all applied; verdict pass pending at time of writing. -->
<!-- review: Overview group cards (GroupCard replaces the six bucket cards; hero Income figure links to #lines/income) first pass in progress at time of writing. -->

### Hero (signature)
Accent block, 28px radius, two columns on desktop (`1fr auto`, aligned to the end): on the left a top row (8px gaps, wrapping, 18px below) holding either the period chip or the month nav of month pills, with the status chip pushed to the row's end; then a 15px 600 label at 80% opacity (with "· date range" appended at 500 and 70% opacity when several statements are loaded) and the display figure; on the right a `dl` of up to three figures with 13px 600 captions at 75% opacity and 24px 600 values, 36px apart; the Income figure (Mine copy only) is a link to `#lines/income` in inherited ink, underlined at a 4px offset on hover, or an "Add an income" link when none is set. Empty state swaps the figure for a 17px lede and the inverted button.

## Do's and Don'ts

### Do:
- **Do** render every card from the one `.card` utility (surface, 20px, `--shadow`) and let the theme swap the shadow for the ring.
- **Do** keep the accent to the hero block and the primary button; use `accent-soft` for any other accent presence.
- **Do** express a bucket only as its dot, its stacked-bar segment, or a 14% `color-mix` chip tint behind text in the full colour.
- **Do** use pills (999px) for every chip, button and segment, 12px for rows and inputs, 20px for cards, 28px for the hero.
- **Do** tween money with `tweenMoney` (500ms expoOut, 0ms under reduced motion) and run state transitions on `--ease` at 150 to 400ms.
- **Do** style a filter as a borderless surface pill with the card shadow and muted ink whose active state is ink on canvas; only the Conflicts filter may use danger, and its active text is `danger-ink`.
- **Do** mark a conflict with the danger wash and a "conflict · A vs B" chip; mark a freshly moved row with the accent wash and glow, released on scroll.
- **Do** show a keyboard shortcut as a 12px 600 keycap pill trailing its label, and hide it under `hover: none`.
- **Do** keep the Overview as two equal group cards (Spend, Put away) in a plain 2 / 1 column grid (640px breakpoint); each bucket is a row link whose only affordance is the 16px stroke chevron and the sunken hover; drill-down happens on Lines, never inside a card.
- **Do** let the current statement be chosen from two places that agree: the month pill on the hero (accent-ink fill, accent text) and the accent bar in the Over time card; every other month is a transparent pill or a `--line` bar.
- **Do** switch top-level views by hash (`#overview` / `#lines` / `#rules`, with `#lines/<filter>` presetting a filter) through the pill nav; the active link is a surface pill with the card shadow, and controls that only make sense on one view (the segmented control) render only there.

### Don't:
- **Don't** use a second accent, a gradient, or a bucket colour as a card background, border or heading colour.
- **Don't** add borders to cards, inputs at rest, or dividers between rows in light mode; separation is shadow, radius and sunken tint. The one permitted hairline is a 1px `--line` at a group boundary (the filter separator); a block inside a card is a sunken 12px panel, never a hairlined section.
- **Don't** use a monospace face, uppercase labels, or open letterspacing; hierarchy is weight, size and ink level.
- **Don't** put a shadow or ring on a solid colour block (the hero).
- **Don't** add a side stripe to held or conflict rows; the tint and chip are the state.
- **Don't** reintroduce paper, ledger, grid-paper or printed-form metaphors.
- **Don't** hard-code theme colours; every colour is a `--token` defined in both the light root and the dark block.
