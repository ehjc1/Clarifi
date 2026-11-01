# Graph Report - Clarifi  (2026-11-01)

## Corpus Check
- 27 files · ~7,743 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 144 nodes · 150 edges · 19 communities (15 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1f4b34b3`
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

## God Nodes (most connected - your core abstractions)
1. `Product` - 11 edges
2. `scripts` - 7 edges
3. `Clarifi — Project Context` - 4 edges
4. `Clarifi` - 4 edges
5. `parseAnz()` - 4 edges
6. `Txn` - 4 edges
7. `Rule` - 4 edges
8. `parseCsv()` - 3 edges
9. `Surface: Clarifi app (dashboard + statement import)` - 2 edges
10. `#lib/motion.svelte` - 2 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (19 total, 4 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.07
Nodes (22): #lib/anz, #lib/components/BucketLine.svelte, barTotal, headline, income, left, loadCsv(), onfile() (+14 more)

### Community 1 - "Community 1"
Cohesion: 0.13
Nodes (13): find(), parseAnz(), parseCsv(), score(), Data, seed, Bucket, BUCKETS (+5 more)

### Community 2 - "Community 2"
Cohesion: 0.12
Nodes (15): dependencies, @sveltejs/adapter-static, imports, #lib, name, private, scripts, build (+7 more)

### Community 3 - "Community 3"
Cohesion: 0.17
Nodes (11): Brand Commitments, Capabilities and Constraints, Evidence on Hand, Operating Context, Platform, Positioning, Product, Product Principles (+3 more)

### Community 4 - "Community 4"
Cohesion: 0.20
Nodes (9): devDependencies, playwright, svelte, svelte-check, @sveltejs/kit, @sveltejs/vite-plugin-svelte, typescript, vite (+1 more)

### Community 5 - "Community 5"
Cohesion: 0.40
Nodes (4): Clarifi — Project Context, Conventions, PKB link (read this first), Project

### Community 6 - "Community 6"
Cohesion: 0.40
Nodes (4): Clarifi, How it reads, Run, Status

### Community 7 - "Community 7"
Cohesion: 0.40
Nodes (4): compilerOptions, strict, extends, include

### Community 17 - "Community 17"
Cohesion: 0.14
Nodes (10): bar, conflicts, isOpen, n, s, shown, sum, #lib/money (+2 more)

## Knowledge Gaps
- **68 isolated node(s):** `errs`, `Direction contract`, `Platform`, `Stack`, `Users` (+63 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Community 4` to `Community 2`?**
  _High betweenness centrality (0.124) - this node is a cross-community bridge._
- **What connects `errs`, `Direction contract`, `Platform` to the rest of the system?**
  _68 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.06628787878787878 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.13 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._
- **Should `Community 17` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._