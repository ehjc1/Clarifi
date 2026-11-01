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

- **Card · Mine · Partner** tabs are the three copies of a carbonless statement. Mine is canary, Partner is pink. Switching recomputes every line.
- Each line: `date · details · rule code · share mark · $card × share% = $yours`.
- Share marks: hollow 0%, half 50%, filled 100%, struck when excluded.
- Two rules disagreeing on a line cross-hatch it and name both rules.
- A line moved by a new rule holds a highlight until you scroll past it.
- Click any line's details to start a rule from it.

## Status

Beta. CSV import only (ANZ column names unverified against a real export; the parser is header-driven). PDF import, multi-month history and accounts are not built.
