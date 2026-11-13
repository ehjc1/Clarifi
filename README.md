# Clarifi

A simple, minimal and robust financial tracker for your personal needs. Giving freedom and flexibility back to the user!

Clarifi turns a **shared credit card statement** into **your** budget. Import the ANZ CSV, write share rules ("Pak'nSave over $50 is my partner's", "Contact Energy is 50/50", "Spark is 0% mine"), and the sheet shows every line as `card amount × my share = mine`, summed into income, fixed, general, investments, savings and mortgage.

Signed out, nothing leaves your browser: parsing and storage are local, export JSON to back up. Sign in and the same data is saved to your account (Django + Postgres) so it follows you between devices.

## Run

Backend (needs [uv](https://docs.astral.sh/uv/); settings read `backend/.env` if present, copy `backend/.env.example`; sqlite unless `DATABASE_URL` is set, Postgres via `compose.yaml`):

```bash
cd backend
uv sync
uv run manage.py migrate
uv run manage.py runserver     # http://localhost:8000/api/
uv run manage.py test
```

Frontend (proxies `/api` to the backend; works without it, local-only):

```bash
cd frontend
npm install
npm run dev            # http://localhost:5173  (add ?sample for a synthetic statement)
npm run build && npm run preview
npx vitest run
```

API: `/api/auth/{csrf,register,login,logout,me}/`, `/api/finance/snapshot/` (GET / PUT the whole per-user data set), `/api/finance/{statements,rules,incomes}/`.

## How it reads

- **Statements stack up.** Each import is kept by month; pills in the hero switch between them, and an "Over time" card compares your share across statements. Re-importing the same month replaces it.
- **Overview** is the monthly read: hero figure, two group cards (Spend = fixed · general · mortgage, Put away = savings · investments) with a stacked share bar and a row per bucket linking to its lines, sort prompt, Over time. **Lines** (`#lines`, `#lines/<bucket>`) is every charge with filters (All / Unsorted / Conflicts / bucket) and search. **Rules** (`#rules`) holds share rules and the New rule form (collapsed until needed). Export / import / remove live in the footer.
- **Card · Mine · Partner** switch: whose share every figure shows. Hero card shows the headline figure for that view.
- Six bucket cards with totals and a share bar; open one to see its lines: `date · details · rule · share% · amount`.
- Two rules disagreeing on a line mark it as a conflict and name both rules; the bucket card shows a conflict chip.
- A line moved by a new rule glows until you scroll past it.
- Click any line's details to start a rule from it.
- **Sort your lines**: when charges have no rule, the hero offers "Sort N unsorted lines". One line at a time, three big answers (Partner's / Split / Mine, keys 1/2/3), pick a bucket, and each answer becomes a rule so next month sorts itself.
- Light and dark follow your system setting.

## Status

Beta. CSV import only (ANZ column names unverified against a real export; the parser is header-driven). PDF import is not built.
