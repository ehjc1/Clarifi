# Clarifi

A simple, minimal and robust financial tracker for your personal needs. Giving freedom and flexibility back to the user!

Clarifi turns a **shared credit card statement** into **your** budget. Import the ANZ CSV, write share rules ("Pak'nSave over $50 is my partner's", "Contact Energy is 50/50", "Spark is 0% mine"), and the sheet shows every line as `card amount × my share = mine`, summed into income, fixed, general, investments, savings and mortgage.

Nothing leaves your browser. Parsing and storage are local; export JSON to back up.

## Run

```bash
npm install
npm run dev            # http://localhost:5173  (add ?sample for a synthetic statement)
npm run build && npm run preview
npx vitest run
```

## How it reads

- **Card · Mine · Partner** switch: whose share every figure shows. Hero card shows the headline figure for that view.
- Six bucket cards with totals and a share bar; open one to see its lines: `date · details · rule · share% · amount`.
- Two rules disagreeing on a line mark it as a conflict and name both rules; the bucket card shows a conflict chip.
- A line moved by a new rule glows until you scroll past it.
- Click any line's details to start a rule from it.
- Light and dark follow your system setting.

## Status

Beta. CSV import only (ANZ column names unverified against a real export; the parser is header-driven). PDF import, multi-month history and accounts are not built.
