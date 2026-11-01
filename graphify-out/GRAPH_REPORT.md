# Graph Report - Clarifi  (2026-11-01)

## Corpus Check
- 27 files · ~7,254 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 124 nodes · 129 edges · 17 communities (14 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `85679b5a`
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
10. `svelte` - 2 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (17 total, 3 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.08
Nodes (14): #lib/anz, #lib/components/BucketLine.svelte, card, isOpen, total, ./ShareMark.svelte, #lib/money, svelte (+6 more)

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
Cohesion: 0.25
Nodes (8): devDependencies, playwright, svelte-check, @sveltejs/kit, @sveltejs/vite-plugin-svelte, typescript, vite, vitest

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
Cohesion: 0.50
Nodes (3): #lib/assets/favicon.svg, ../app.css, ./$types

## Knowledge Gaps
- **55 isolated node(s):** `./ShareMark.svelte`, `Data`, `seed`, `../app.css`, `#lib/assets/favicon.svg` (+50 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Community 4` to `Community 0`, `Community 2`?**
  _High betweenness centrality (0.110) - this node is a cross-community bridge._
- **Why does `svelte` connect `Community 0` to `Community 4`?**
  _High betweenness centrality (0.093) - this node is a cross-community bridge._
- **What connects `./ShareMark.svelte`, `Data`, `seed` to the rest of the system?**
  _55 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.07816091954022988 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.13 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._