# Graph Report - Clarifi  (2026-11-14)

## Corpus Check
- 66 files · ~36,954 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 329 nodes · 503 edges · 38 communities (30 shown, 8 thin omitted)
- Extraction: 84% EXTRACTED · 16% INFERRED · 0% AMBIGUOUS · INFERRED: 80 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d76ce9cb`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]

## God Nodes (most connected - your core abstractions)
1. `Rule` - 22 edges
2. `Income` - 20 edges
3. `Statement` - 19 edges
4. `Line` - 18 edges
5. `RuleSerializer` - 14 edges
6. `OwnedViewSet` - 14 edges
7. `SnapshotView` - 14 edges
8. `Components` - 13 edges
9. `SnapshotSerializer` - 13 edges
10. `RuleViewSet` - 13 edges

## Surprising Connections (you probably didn't know these)
- `SnapshotTests` --uses--> `Rule`  [INFERRED]
  backend/finance/tests.py → backend/finance/models.py
- `LineInline` --uses--> `Income`  [INFERRED]
  backend/finance/admin.py → backend/finance/models.py
- `LineInline` --uses--> `Line`  [INFERRED]
  backend/finance/admin.py → backend/finance/models.py
- `LineInline` --uses--> `Preferences`  [INFERRED]
  backend/finance/admin.py → backend/finance/models.py
- `LineInline` --uses--> `Rule`  [INFERRED]
  backend/finance/admin.py → backend/finance/models.py

## Import Cycles
- None detected.

## Communities (38 total, 8 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.18
Nodes (26): LineInline, StatementAdmin, Income, Line, Meta, Owned, Preferences, Mirror of the frontend data shape (frontend/src/lib/types.ts), one owner per row (+18 more)

### Community 1 - "Community 1"
Cohesion: 0.08
Nodes (29): api, ApiError, call(), csrfToken(), Me, addDays(), Day, isoDate() (+21 more)

### Community 2 - "Community 2"
Cohesion: 0.08
Nodes (23): dependencies, @sveltejs/adapter-static, devDependencies, playwright, svelte-check, @sveltejs/kit, @sveltejs/vite-plugin-svelte, typescript (+15 more)

### Community 3 - "Community 3"
Cohesion: 0.17
Nodes (11): Brand Commitments, Capabilities and Constraints, Evidence on Hand, Operating Context, Platform, Positioning, Product, Product Principles (+3 more)

### Community 4 - "Community 4"
Cohesion: 0.07
Nodes (26): #lib/components/Account.svelte, #lib/anz, #lib/components/BucketLine.svelte, lines, shown, sums, total, svelte/easing (+18 more)

### Community 5 - "Community 5"
Cohesion: 0.40
Nodes (4): Clarifi — Project Context, Conventions, PKB link (read this first), Project

### Community 6 - "Community 6"
Cohesion: 0.40
Nodes (4): Clarifi, How it reads, Run, Status

### Community 7 - "Community 7"
Cohesion: 0.40
Nodes (4): compilerOptions, strict, extends, include

### Community 8 - "Community 8"
Cohesion: 0.33
Nodes (4): #lib/assets/favicon.svg, ../app.css, ./$types, ./$types

### Community 9 - "Community 9"
Cohesion: 0.16
Nodes (15): BANKS, cardLabel(), detectBank(), find(), parseAnz(), parseCsv(), parseStatement(), f (+7 more)

### Community 17 - "Community 17"
Cohesion: 0.08
Nodes (23): dependencies, @sveltejs/adapter-static, devDependencies, playwright, svelte-check, @sveltejs/kit, @sveltejs/vite-plugin-svelte, typescript (+15 more)

### Community 18 - "Community 18"
Cohesion: 0.28
Nodes (8): CsrfView, LoginView, LogoutView, me(), MeView, Session auth for the browser app: csrf, register, login, logout, me., RegisterView, APIView

### Community 19 - "Community 19"
Cohesion: 0.06
Nodes (32): Bucket (fixed, six), Buttons, Cards / Containers, Chips, Colors, Components, Design System: Clarifi, Do: (+24 more)

### Community 20 - "Community 20"
Cohesion: 0.17
Nodes (3): AuthTests, APITestCase, SnapshotTests

### Community 21 - "Community 21"
Cohesion: 0.40
Nodes (3): AccountsConfig, AppConfig, FinanceConfig

### Community 22 - "Community 22"
Cohesion: 0.40
Nodes (4): compilerOptions, strict, extends, include

## Knowledge Gaps
- **116 isolated node(s):** `PKB link (read this first)`, `Project`, `Conventions`, `Hybrid redesign (2026-11-08) — read this first`, `Overview` (+111 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Community 17` to `Community 4`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `Community 2` to `Community 4`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Why does `svelte` connect `Community 4` to `Community 17`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Are the 14 inferred relationships involving `Rule` (e.g. with `LineInline` and `StatementAdmin`) actually correct?**
  _`Rule` has 14 INFERRED edges - model-reasoned connections that need verification._
- **Are the 13 inferred relationships involving `Income` (e.g. with `LineInline` and `StatementAdmin`) actually correct?**
  _`Income` has 13 INFERRED edges - model-reasoned connections that need verification._
- **Are the 13 inferred relationships involving `Statement` (e.g. with `LineInline` and `StatementAdmin`) actually correct?**
  _`Statement` has 13 INFERRED edges - model-reasoned connections that need verification._
- **Are the 13 inferred relationships involving `Line` (e.g. with `LineInline` and `StatementAdmin`) actually correct?**
  _`Line` has 13 INFERRED edges - model-reasoned connections that need verification._