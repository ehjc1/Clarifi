<script lang="ts">
	import { nzd, pct } from '#lib/money';
	import { tweenMoney } from '#lib/motion.svelte';
	import { BUCKETS, type Bucket, type Scored } from '#lib/types';

	type Copy = 'card' | 'mine' | 'partner';
	export type Filter = 'all' | 'unsorted' | 'conflicts' | Bucket;
	let { scored, copy, held, filter = $bindable('all'), onrelease, onmakerule, onsort, codeOf, income }: {
		scored: Scored[]; copy: Copy; held: { has(id: string): boolean }; filter?: Filter;
		onrelease: (id: string) => void; onmakerule: (details: string) => void; onsort: () => void; codeOf: (r: NonNullable<Scored['rule']>) => string;
		income?: import('svelte').Snippet;
	} = $props();

	const TITLES: Record<Bucket, string> = { income: 'Income', fixed: 'Fixed', general: 'General', investments: 'Investments', savings: 'Savings', mortgage: 'Mortgage' };
	let query = $state('');
	const shareOf = (r: Scored) => (copy === 'partner' ? 1 - r.share : r.share);
	const value = (r: Scored) => (copy === 'card' ? r.amount : copy === 'mine' ? r.mine : r.amount - r.mine);
	const unsorted = $derived(scored.filter((r) => !r.rule).length);
	const conflicts = $derived(scored.filter((r) => r.conflict).length);
	const rows = $derived(scored.filter((r) =>
		(filter === 'all' || (filter === 'unsorted' ? !r.rule : filter === 'conflicts' ? r.conflict : r.bucket === filter)) &&
		(!query || r.details.toLowerCase().includes(query.toLowerCase()))
	).sort((a, b) => a.date.localeCompare(b.date)));
	const cardSum = $derived(rows.reduce((a, r) => a + r.amount, 0));
	const sum = $derived(rows.reduce((a, r) => a + value(r), 0));
	const shownCard = tweenMoney(() => cardSum);
	const shownSum = tweenMoney(() => sum);

	/** Row keeps its glow until it has been seen and then scrolled out of view once. */
	const hold = (id: string) => (node: HTMLElement) => {
		let seen = false;
		const io = new IntersectionObserver(([e]) => {
			if (e.isIntersecting) seen = true;
			else if (seen) { onrelease(id); io.disconnect(); }
		}, { threshold: 0.6 });
		io.observe(node);
		return () => io.disconnect();
	};
</script>

<section class="lines" aria-labelledby="lines-h">
	<div class="head">
		<div>
			<h2 id="lines-h">Lines</h2>
			<p class="small">Every charge on this statement and the rule that decided its share.</p>
		</div>
		<label class="search"><span class="sr">Search details</span><input type="search" bind:value={query} placeholder="Search details" /></label>
	</div>

	<div class="filters" role="group" aria-label="Filter lines">
		<button class={['pill', 'f', { on: filter === 'all' }]} aria-pressed={filter === 'all'} onclick={() => (filter = 'all')}>All</button>
		<button class={['pill', 'f', { on: filter === 'unsorted' }]} aria-pressed={filter === 'unsorted'} onclick={() => (filter = 'unsorted')}>Unsorted <span class="n">{unsorted}</span></button>
		{#if conflicts}<button class={['pill', 'f', 'warn', { on: filter === 'conflicts' }]} aria-pressed={filter === 'conflicts'} onclick={() => (filter = 'conflicts')}>Conflicts <span class="n">{conflicts}</span></button>{/if}
		<span class="sep" aria-hidden="true"></span>
		{#each BUCKETS as b (b)}
			<button class={['pill', 'f', { on: filter === b }]} style="--c: var(--b-{b})" aria-pressed={filter === b} onclick={() => (filter = b)}><span class="dot"></span>{TITLES[b]}</button>
		{/each}
	</div>

	<div class="card list">
		{#if filter === 'income' && income}{@render income()}{/if}
		<p class="sumline small">
			<span>{rows.length} {rows.length === 1 ? 'line' : 'lines'}{#if unsorted && (filter === 'all' || filter === 'unsorted')}&nbsp;·&nbsp;<button class="link sort" onclick={onsort}>Sort {unsorted} unsorted</button>{/if}</span>
			<span class="num">card {nzd(shownCard.current)}{#if copy !== 'card'}&nbsp;·&nbsp;{copy === 'mine' ? 'mine' : "partner's"} <b>{nzd(shownSum.current)}</b>{/if}</span>
		</p>
		{#if rows.length}
			<ul>
				{#each rows as r (r.id)}
					{@const s = shareOf(r)}
					<li class={{ held: held.has(r.id), conflict: r.conflict, excluded: s === 0, unsorted: !r.rule }} style="--c: var(--b-{r.bucket})" {@attach held.has(r.id) ? hold(r.id) : undefined}>
						<span class="date small">{r.date.slice(5)}</span>
						<span class="det">
							<span class="date-inline small">{r.date.slice(5)}</span>
							<button class="det-b" onclick={() => onmakerule(r.details)} title="Start a rule from this line">{r.details}</button>
							{#if r.conflict}<span class="pill warn">conflict · {r.matches.map((m) => m.name).join(' vs ')}</span>{/if}
						</span>
						<span class="meta">
							<span class="pill bucket"><span class="dot"></span>{TITLES[r.bucket]}</span>
							{#if r.rule}<span class="pill code" title={r.rule.name}>{codeOf(r.rule)}</span>{:else}<span class="pill norule">no rule</span>{/if}
							{#if copy !== 'card' && s !== 1}<span class="pill share">{pct(s)}</span>{:else}<span></span>{/if}
						</span>
						<span class="amt num">
							{#if copy !== 'card' && s !== 1}<span class="small">{nzd(r.amount)}</span>{/if}
							<b>{nzd(value(r))}</b>
						</span>
					</li>
				{/each}
			</ul>
		{:else}
			<p class="small empty">{query ? `Nothing matches “${query}”.` : filter === 'unsorted' ? 'Every line has a rule.' : filter === 'conflicts' ? 'No conflicts.' : 'No lines here yet.'}</p>
		{/if}
	</div>
</section>

<style>
	.lines { display: flex; flex-direction: column; gap: 14px; }
	.head { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
	h2 { margin: 0; font-size: 18px; font-weight: 600; letter-spacing: -0.01em; }
	.head p { margin: 2px 0 0; }
	.search { width: 260px; }
	.sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
	.filters { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
	.f { border: 0; cursor: pointer; color: var(--ink-2); background: var(--surface); box-shadow: var(--shadow); transition: background-color 150ms var(--ease), color 150ms var(--ease); }
	.f:hover { color: var(--ink); }
	.f.on { background: var(--ink); color: var(--bg); }
	.f.on .dot { background: var(--bg); }
	.f .n { font-size: 12px; opacity: 0.7; }
	.f.warn { color: var(--danger); }
	.f.warn.on { background: var(--danger); color: var(--danger-ink); }
	.sep { width: 1px; height: 18px; background: var(--line); margin: 0 4px; }
	.list { padding: 12px 8px; }
	.sumline { display: flex; justify-content: space-between; gap: 12px; margin: 0 12px 6px; }
	.sumline b { color: var(--ink); font-weight: 600; }
	.sort { color: var(--ink); background: var(--accent-soft); padding: 2px 10px; border-radius: 999px; font-weight: 600; }
	.sort:hover { background: var(--accent); color: var(--accent-ink); }
	.sumline .num { white-space: nowrap; }
	ul { list-style: none; margin: 0; padding: 0; }
	li { position: relative; display: grid; grid-template-columns: 48px 1fr auto 168px; gap: 12px; align-items: center; padding: 10px 12px; border-radius: var(--r2); transition: background-color 400ms var(--ease); }
	li + li { margin-top: 2px; }
	li:hover { background: var(--surface-2); }
	li.held { background: var(--accent-soft); box-shadow: 0 6px 18px var(--accent-soft); }
	li.conflict { background: var(--danger-soft); }
	li.excluded .det-b, li.excluded .amt b { color: var(--ink-2); font-weight: 400; }
	.det { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 10px; min-width: 0; }
	.det-b { background: none; border: 0; padding: 0; text-align: left; font-weight: 500; }
	.det-b:hover { color: var(--accent); }
	.meta { display: grid; grid-template-columns: 112px 44px 52px; gap: 6px; justify-items: start; }
	.meta .share { justify-self: end; }
	.bucket { color: var(--ink-2); }
	li.unsorted .bucket { opacity: 0.6; }
	.norule { background: transparent; color: var(--ink-2); padding-left: 0; font-weight: 500; }
	.date-inline { display: none; white-space: nowrap; }
	.code { color: var(--c); background: color-mix(in srgb, var(--c) 14%, transparent); font-size: 12px; font-weight: 600; }
	.share { color: var(--ink-2); }
	.warn { color: var(--danger); background: transparent; padding-left: 0; }
	.amt { display: flex; gap: 8px; align-items: baseline; justify-content: flex-end; white-space: nowrap; }
	.amt b { font-weight: 600; }
	.empty { margin: 8px 12px 4px; }
	@media (max-width: 640px) {
		.head { flex-direction: column; }
		.search { width: 100%; }
		li { grid-template-columns: 1fr auto; }
		.sumline { flex-wrap: wrap; }
		.date { display: none; }
		.date-inline { display: inline; }
		.meta { grid-column: 1; grid-template-columns: auto auto auto; }
		.amt { grid-column: 2; grid-row: 1 / span 2; align-self: center; flex-direction: column; align-items: flex-end; gap: 0; }
	}
</style>
