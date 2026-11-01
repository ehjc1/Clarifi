# Graph Report - Clarifi  (2026-11-01)

## Corpus Check
- 29 files · ~17,322 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 167 nodes · 181 edges · 20 communities (16 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `cae3f20d`
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
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]

## God Nodes (most connected - your core abstractions)
1. `Product` - 11 edges
2. `Components` - 10 edges
3. `Design System: Clarifi` - 9 edges
4. `scripts` - 7 edges
5. `Colors` - 5 edges
6. `Clarifi` - 4 edges
7. `Txn` - 4 edges
8. `Rule` - 4 edges
9. `Clarifi — Project Context` - 4 edges
10. `parseAnz()` - 4 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (20 total, 4 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.25
Nodes (8): devDependencies, playwright, svelte-check, @sveltejs/kit, @sveltejs/vite-plugin-svelte, typescript, vite, vitest

### Community 1 - "Community 1"
Cohesion: 0.11
Nodes (19): find(), parseAnz(), parseCsv(), composeRule(), score(), titleCase(), Data, load() (+11 more)

### Community 2 - "Community 2"
Cohesion: 0.12
Nodes (15): dependencies, @sveltejs/adapter-static, imports, #lib, name, private, scripts, build (+7 more)

### Community 3 - "Community 3"
Cohesion: 0.17
Nodes (11): Brand Commitments, Capabilities and Constraints, Evidence on Hand, Operating Context, Platform, Positioning, Product, Product Principles (+3 more)

### Community 4 - "Community 4"
Cohesion: 0.07
Nodes (23): #lib/anz, #lib/components/BucketLine.svelte, bar, conflicts, n, shown, sum, svelte/easing (+15 more)

### Community 5 - "Community 5"
Cohesion: 0.40
Nodes (4): Clarifi — Project Context, Conventions, PKB link (read this first), Project

### Community 6 - "Community 6"
Cohesion: 0.40
Nodes (4): Clarifi, How it reads, Run, Status

### Community 7 - "Community 7"
Cohesion: 0.40
Nodes (4): compilerOptions, strict, extends, include

### Community 19 - "Community 19"
Cohesion: 0.11
Nodes (18): Bucket (fixed, six), Colors, Design System: Clarifi, Do:, Do's and Don'ts, Don't:, Elevation & Depth, Hierarchy (+10 more)

### Community 20 - "Community 20"
Cohesion: 0.20
Nodes (10): Bucket Card (signature), Buttons, Cards / Containers, Chips, Components, Hero (signature), Inputs / Fields, Navigation (+2 more)

## Knowledge Gaps
- **78 isolated node(s):** `Data`, `seed`, `#lib/components/BucketLine.svelte`, `#lib/components/Rules.svelte`, `#lib/components/Triage.svelte` (+73 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Community 0` to `Community 2`, `Community 4`?**
  _High betweenness centrality (0.074) - this node is a cross-community bridge._
- **Why does `svelte` connect `Community 4` to `Community 0`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **What connects `Data`, `seed`, `#lib/components/BucketLine.svelte` to the rest of the system?**
  _78 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.11264367816091954 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._
- **Should `Community 4` be split into smaller, more focused modules?**
  _Cohesion score 0.06685633001422475 - nodes in this community are weakly interconnected._
- **Should `Community 19` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._