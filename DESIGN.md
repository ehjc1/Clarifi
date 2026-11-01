---
name: Clarifi
description: One big number you can trust, six bucket cards, rules as chips. Modern consumer fintech, played straight, light and dark.
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
---

# Design System: Clarifi

## Overview

**Creative North Star: "The Trusted Balance"**

Clarifi is modern consumer fintech played straight, at the craft level of Revolut and Wise. The whole screen is organised to make one figure believable: a full-width teal-mint hero carries the headline number in a tight 700-weight display, and everything beneath it (six bucket cards on the Overview view; the rule cards that live one hash away on the Rules view) exists to explain where that number came from. Surfaces are large, white, and generously rounded; colour is scarce and rationed by role, so the one accent block and six small bucket colours do all the signalling.

The material is soft and bright in light mode (white cards floating on a cool grey canvas under a diffuse shadow) and flat and hairlined in dark mode (the same cards ringed by a 1px line on near-black). Figtree is the only face; its rounded geometry and tabular figures give the money a playful-but-precise register without ever becoming a ledger. Density is relaxed on desktop and collapses to a single column on phones without changing any component's shape.

Confirmed rejections: no paper, ledger or printed-form metaphors; no monospace face; no second accent.

**Key Characteristics:**
- One accent, used as a block (the hero) and as the primary action; nowhere else at full strength.
- Six fixed bucket colours that appear only as 10px dots, 14% chip tints and 6px progress bars.
- Figtree at every size, tabular numerals everywhere, tight negative tracking as size rises.
- Pill radius (999px) for every control; 20px cards; 28px hero; 12px rows and inputs.
- Light: soft offset shadow. Dark: 1px ring. Same tokens, swapped under `prefers-color-scheme`.
- Figures count to new values with one 500ms expoOut tween; held rows glow accent until scrolled past.

## Colors

A near-neutral stage with one teal-mint voice and six quiet bucket hues that never raise theirs.

### Primary
- **Teal Mint** (`accent`, light `#00c2a8` / dark `#2ef2d2`): the hero block background, the primary button, the focus ring (2px outline, 2px offset), text selection, and hover colour on row detail buttons. In dark mode it brightens rather than dims so the hero still reads as a block.
- **Deep Teal Ink** (`accent-ink`, `#042e28`, both themes): the only text colour allowed on the accent. Also the background of the inverted button that sits on the hero.
- **Mint Wash** (`accent-soft`, 14% accent): the held-row tint and its glow shadow; the tint behind the new-rule code chip.

### Bucket (fixed, six)
- **Income Green** (`bucket-income`), **Fixed Blue** (`bucket-fixed`), **General Amber** (`bucket-general`), **Investments Violet** (`bucket-investments`), **Savings Cyan** (`bucket-savings`), **Mortgage Red** (`bucket-mortgage`). Each bucket card sets `--c` to its colour and the colour reaches the surface only three ways: the 10px dot beside the title, the share bar fill, and the rule-code chip (`color-mix(in srgb, var(--c) 14%, transparent)` behind text in the full colour). Identical in light and dark.

### Neutral
- **Cool Canvas** (`canvas`, light `#f3f4f8` / dark `#0b0d12`): page background; also the text colour of the selected segment.
- **Surface** (`surface`, light `#ffffff` / dark `#151821`): every card, the segmented control, and the focused input.
- **Sunken Surface** (`surface-sunken`, light `#f6f7fb` / dark `#1c202b`): resting inputs, neutral pills, ghost buttons, row hover, share-bar track.
- **Ink** (`ink`, light `#0b0f19` / dark `#f3f4f8`): body text, figures, the selected segment's fill.
- **Muted Ink** (`ink-muted`, light `#626b7a` / dark `#9aa3b2`): 13px labels, line counts, zero totals, placeholders, footer links, unselected segments.
- **Line** (`line`, light `#e6e8ef` / dark `#262b38`): input hover border; in dark mode it is the 1px ring that replaces the shadow.
- **Danger** (`danger` `#e5484d`, `danger-soft` 12%): conflict chips and rows, the error card, form errors. Same in both themes.

### Named Rules
**The One Block Rule.** The accent appears at full strength exactly twice on a screen: the hero and the primary button. Everything else that wants accent gets the 14% wash.

**The Three Outlets Rule.** A bucket colour may be a dot, a bar fill, or a chip tint. It is never a text colour outside its chip, never a border, never a card background.

**The Mirrored Theme Rule.** Dark mode swaps neutrals and brightens the accent; bucket colours, danger and accent-ink do not change. Any new colour is defined once in light and once in the dark block, never inline.

## Typography

**Display Font:** Figtree (with system-ui, -apple-system, Segoe UI, sans-serif)
**Body Font:** Figtree (same face)
**Label/Mono Font:** none; figures use Figtree with `font-variant-numeric: tabular-nums` set on `body`.

**Character:** One rounded geometric sans at four self-hosted weights (400/500/600/700, latin woff2, `font-display: swap`). Tracking tightens as size grows, so big money looks set rather than typed.

### Hierarchy
- **Display** (700, `clamp(40px, 6vw, 64px)`, 1.05, -0.04em): the single headline figure in the hero. Nothing else uses it.
- **Headline** (600, 24px, 1.1, -0.02em): bucket card totals and the hero's three contributing figures (20px on phones), and the current line (details and amount) in the triage card. Muted ink and 500 weight when the total is zero.
- **Title** (600, 18px, -0.01em): the "Share rules" heading of the Rules view, the triage card title and its three choice labels. Card titles and rule names are 600 at body size (15px).
- **Wordmark** (700, 20px, -0.03em): "Clarifi" in the top bar; the only logotype.
- **Body** (400, 15px, 1.5): rule conditions, the empty-state lede (17px, max 48ch), row details (500).
- **Label** (500, 13px, 1.2): pills, line counts, figure captions, form labels, footer links; usually in muted ink. Rule-code chips drop to 12px/600.

### Named Rules
**The Weight-Not-Case Rule.** Hierarchy is carried by size, weight and ink level. Nothing is uppercased or letterspaced open; the only tracking is negative and only above 15px.

**The Tabular Rule.** Every money figure is tabular so columns and tweened counts do not jitter. Figures are set in Figtree, never a mono.

## Layout

A single centred column, max 1240px, with 24px side padding (14px on phones) and 20px top. One page, two views switched by the URL hash (`#overview`, default, and `#rules`); the view is read on load and on `hashchange`, so the back button works and no router is involved. Adding a rule from the Rules view returns to Overview so the rows it moved are visible.

The top bar is a flex row with 16px gaps: wordmark left, then the pill nav (Overview, Rules with its count pill) pushed against it with `margin-right: auto`, then the segmented Card / Mine / Partner control (rendered only on Overview, since it reads the figures), then the primary Import pill. On phones the bar wraps with 10px gaps: wordmark and Import share the first row, the nav takes the second, and the segmented control drops to its own full-width row with equal-width segments; the Import pill loses its text.

**Overview** is full width: the hero, the triage card when lines are unsorted, then (24px below) the bucket section, a six-column grid with 12px gaps. Collapsed cards span 2 (three per row). An expanded card spans all 6. The trailing collapsed cards after an expansion re-span to 3 or 6 so no grid cell is left empty. At 1024px and below collapsed cards span 3 (two per row); at 640px every card spans the full width and the hero stacks its figures under the headline. A "Payments to the card" strip of neutral pills spans the full grid width beneath the cards when there are credits.

**Rules** is a 14px vertical stack: a heading row (title 18px 600 with a label-size subline on the left, the primary "New rule" pill with a 16px stroke plus on the right, `space-between`), the inline add-rule form card when open, then a two-column grid of rule cards with 12px gaps. Under 720px the rule grid is one column. The form's field grid is three columns (10px row / 12px column gaps): details spans 3, the two amount bounds and the share select sit on one row, bucket takes one cell and name spans 2; under 720px it is two columns with details and name spanning both.

The footer is shared by both views: a 13px muted-ink line ("Stored in this browser only") followed by Export JSON, Import JSON and Clear statement as link-style buttons, 16px gaps, 32px above.

Spacing rhythm is a loose 6/8/12/16/24/36 scale: 6px between chips, 8px inside stacks, 12px between cards and rows, 14px to 24px between sections, 36px between hero figures. Card interiors are 18px 20px (bucket) and 16px 18px (rule and rule form); the hero is 24px 28px 28px (20px on phones).

## Elevation & Depth

Hybrid, by theme. In light mode every card lifts off the canvas with one soft diffuse shadow (`0 10px 30px rgba(11,15,25,.06), 0 1px 2px rgba(11,15,25,.04)`); there are no borders. In dark mode the same `--shadow` token becomes a 1px ring of `--line`, so depth is a hairline rather than a glow. The hero, as the one solid colour block, sits flush with `box-shadow: none` in both themes. Within a card, depth is tonal: sunken surface for inputs, hover rows and bar tracks; accent wash for held rows; danger wash for conflicts.

### Shadow Vocabulary
- **Card lift** (`box-shadow: 0 10px 30px rgba(11, 15, 25, 0.06), 0 1px 2px rgba(11, 15, 25, 0.04)`): every `.card` and the segmented control, light mode only.
- **Dark ring** (`box-shadow: 0 0 0 1px var(--line)`): the same elements under `prefers-color-scheme: dark`.
- **Held glow** (`box-shadow: 0 6px 18px var(--accent-soft)`): a row just moved by a new rule, until it scrolls past (IntersectionObserver release).

### Named Rules
**The One Shadow Rule.** There is one shadow token. Cards use it; nothing invents another. The only exception is the held-row glow, which is a state, not a surface.

**The Flush Block Rule.** A full-colour block (the hero) never carries a shadow or ring; its colour is its edge.

## Shapes

Everything is rounded and nothing is square. Radius scales with the size of the thing: 999px for every control that reads as a chip or button (pills, buttons, segments, the share bar and its fill, the 10px dot as a circle), 12px for rows and inputs that sit inside a card, 20px for cards, 28px for the hero (22px on phones). Borders are absent in light mode; inputs use a transparent 1px border that becomes `--line` on hover and `--accent` on focus so layout never shifts. The select is a native element with its chevron drawn as two 5px gradient triangles in muted ink. No dividers between rows; 2px of air and hover tint separate them.

## Components

### Buttons
- **Shape:** full pill (999px), 10px 18px, 600 weight at 14px, 8px gap to an inline 16px stroke icon.
- **Primary:** accent fill with accent-ink text ("Import statement", "New rule" with a 16px 1.8-stroke plus drawn inline, "Add rule").
- **Hover / Focus:** `brightness(1.06)` and a 1px lift, 150ms on the shared `--ease` (`cubic-bezier(0.19, 1, 0.22, 1)`); active returns to rest; focus-visible is the global 2px accent outline. Disabled drops to 45% opacity.
- **Ghost:** sunken surface fill with ink text, hover to `--line` ("Add income").
- **On-accent (inverted):** accent-ink fill with accent text, used only inside the hero ("Try with a sample statement", "Sort N unsorted lines").
- **Link:** bare text, 13px 500 muted ink, hover to ink. Footer actions (Export JSON, Import JSON, Clear statement), "Remove" and "Cancel". On the hero it is accent-ink and underlined (3px offset).

### Chips
- **Style:** pill, 4px 10px, 13px 500, 6px gap, sunken surface with ink text; never wraps.
- **On accent:** 10% accent-ink tint with accent-ink text (period, "sample · synthetic data").
- **Code chip:** 12px 600, bucket colour text on a 14% mix of the same colour (R1, R2…); the new-rule form uses the accent as its colour.
- **Share chip:** muted ink text ("0% mine"), ink when the share is 100%.
- **Bucket chip:** dot plus capitalised bucket name, neutral fill, muted ink. As a radio in the triage card the selected chip takes a 16% `color-mix` tint of the bucket colour with ink text at 600 and no border (the colour is a tint only; Three Outlets holds). Unselected stays sunken and muted.
- **Keycap:** 12px 600 pill, surface fill, muted ink, 1px 7px, trailing a label with an 8px gap (inline variant: sunken fill, 0 5px, 4px margin). Hidden under `@media (hover: none)`.
- **Warn chip:** danger text on transparent, no left padding ("conflict · A vs B", "2 conflicts").
- **Ghost chip:** transparent, muted ink, no left padding ("fired 1").

### Cards / Containers
- **Corner Style:** 20px; hero 28px.
- **Background:** surface; hero is accent with accent-ink text; error card is danger-soft with danger text and no shadow.
- **Shadow Strategy:** the single card lift (light) or dark ring; see Elevation.
- **Border:** none.
- **Internal Padding:** 18px 20px (bucket), 16px 18px (rule), 24px 28px 28px (hero).

### Inputs / Fields
- **Style:** sunken surface, transparent 1px border, 12px radius, 9px 12px, inherits body font; full width; placeholder in muted ink. Labels sit above at 13px 500 muted ink with a 6px gap; paired fields split 1fr 1fr with 10px gap.
- **Focus:** border to accent, background to surface, 150ms; no extra outline.
- **Hover:** border to `--line`.
- **Error:** a body-size line in danger below the form.

### Navigation
- **Top bar:** wordmark (700, 20px, -0.03em) left; pill nav beside it; segmented control (Overview only) and primary Import pill right.
- **Pill nav:** two anchors (`#overview`, `#rules`) at 15px 600 in muted ink, 7px 14px, 2px apart, 150ms colour and background on `--ease`. Hover lifts the text to ink; the active link (`aria-current="page"`) becomes a surface pill carrying the card shadow (dark ring in dark mode). The Rules link trails a count pill: 12px 600, 1px 7px, sunken surface and muted ink at rest, accent wash with ink text when its view is active. On phones the nav drops to the second row of the bar.
- **Segmented control:** a surface pill with 4px inner padding and the card shadow; segments are pills at 7px 16px, 600/14px, muted ink; the selected segment fills with ink and flips text to canvas, 200ms. On phones it moves to its own row and segments share width equally.
- **Footer:** 13px muted-ink links at baseline, 16px gaps, 32px above; the same footer under both views.

### Bucket Card (signature)
A `details` card: summary row of dot, title (600), line count (13px muted), the tweened total (headline) and an optional conflict chip; beneath, a 6px share bar (sunken track, bucket-colour fill scaled on X over 400ms) or a 13px empty text. Open, the body lists rows at 12px radius with 48px date, details, chips, amount: hover sunken; **held** rows get accent wash plus the held glow and are released by IntersectionObserver once scrolled past; **conflict** rows get danger wash and the warn chip; **excluded** (0% share) rows fade details and amount to muted ink at 400 weight. Card spans follow the Layout grid (2 / 3 / 6).

### Rule Card (signature)
Surface card, 16px 18px, laid two per row (one under 720px): code chip, name (600), Remove link on one line; the condition sentence in label size; a chip row of share, bucket (dot + name) and "fired n". The add-rule form is the same card, revealed inline beneath the heading row by the "New rule" button and dismissed by a Cancel link: a header row of accent-tinted code chip (R n+1), "New rule" and Cancel, the three-column field grid described in Layout, an optional danger error line, and the primary "Add rule" pill aligned left. The form card is the only card on the Rules view that is not a rule.

### Triage Card (signature)
"Sort your lines": a plain `.card` (surface, 20px, `--shadow`, no accent border), 20px 24px 22px, mounted between the hero and the bucket grid 16px below the hero. Header is one flex row with 24px gaps: title (18px 600) over a label-size subline, a progress group of "done / total" in label plus a 120px by 6px pill bar (sunken track, accent fill, `scaleX` over 400ms `--ease`), and a Close link. The current line sits in a 48px / 1fr / auto grid at 22px 0 18px: date in label, details and amount at headline size; each new line enters with a 300ms `--ease` fade and 6px rise, keyed per line. Three **choice** buttons share a 3-column grid with 10px gaps: sunken surface at 12px radius, 14px 16px, label 18px 600 with a trailing keycap pill, hint in label size; hover to accent wash with a 1px lift at 150ms. The foot wraps a bucket radio group (bucket chips, 6px gaps) against a label-size line stating the exact rule condition, any collision note in ink 600, and a Skip link with an inline keycap. Keys: 1 / 2 / 3 choose, S skips, Escape closes. Phone: 16px padding, header wraps and the bar stretches, line and choices stack to one column. Done state is one 18px 600 line.

<!-- review: triage first pass disposition fix, seven findings, all applied; verdict pass pending at time of writing. -->
<!-- review: views IA (hash nav, full-width overview, rules view) first pass disposition fix, six findings, all applied; verdict pass pending at time of writing. -->

### Hero (signature)
Accent block, 28px radius, two columns on desktop (`1fr auto`, aligned to the end): on the left a row of on-accent pills, a 15px 600 label at 80% opacity, and the display figure; on the right a `dl` of up to three figures with 13px 600 captions at 75% opacity and 24px 600 values, 36px apart. Empty state swaps the figure for a 17px lede and the inverted button.

## Do's and Don'ts

### Do:
- **Do** render every card from the one `.card` utility (surface, 20px, `--shadow`) and let the theme swap the shadow for the ring.
- **Do** keep the accent to the hero block and the primary button; use `accent-soft` for any other accent presence.
- **Do** express a bucket only as its dot, its bar fill, or a 14% `color-mix` chip tint behind text in the full colour.
- **Do** use pills (999px) for every chip, button and segment, 12px for rows and inputs, 20px for cards, 28px for the hero.
- **Do** tween money with `tweenMoney` (500ms expoOut, 0ms under reduced motion) and run state transitions on `--ease` at 150 to 400ms.
- **Do** mark a conflict with the danger wash and a "conflict · A vs B" chip; mark a freshly moved row with the accent wash and glow, released on scroll.
- **Do** show a keyboard shortcut as a 12px 600 keycap pill trailing its label, and hide it under `hover: none`.
- **Do** keep every bucket grid row full: collapsed cards span 2, an expanded card spans 6, trailing cards re-span to 3 or 6.
- **Do** switch top-level views by hash (`#overview` / `#rules`) through the pill nav; the active link is a surface pill with the card shadow, and controls that only make sense on one view (the segmented control) render only there.

### Don't:
- **Don't** use a second accent, a gradient, or a bucket colour as a card background, border or heading colour.
- **Don't** add borders or dividers in light mode; separation is shadow, radius and sunken tint.
- **Don't** use a monospace face, uppercase labels, or open letterspacing; hierarchy is weight, size and ink level.
- **Don't** put a shadow or ring on a solid colour block (the hero).
- **Don't** add a side stripe to held or conflict rows; the tint and chip are the state.
- **Don't** reintroduce paper, ledger, grid-paper or printed-form metaphors.
- **Don't** hard-code theme colours; every colour is a `--token` defined in both the light root and the dark block.
