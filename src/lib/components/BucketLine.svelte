<script lang="ts">
	import { nzd, pct } from '#lib/money';
	import { tweenMoney } from '#lib/motion.svelte';
	import type { Scored } from '#lib/types';

	type Copy = 'card' | 'mine' | 'partner';
	let {
		title, color, rows, copy, held, open = $bindable(false), extra = 0, emptyText = 'No lines yet', total: totalOf, class: cls = '', onrelease, onmakerule, codeOf, children
	}: {
		title: string; class?: string; color: string; rows: Scored[]; copy: Copy; held: { has(id: string): boolean }; open?: boolean; extra?: number; emptyText?: string;
		total: number; // total of all buckets on this copy, for the share bar
		onrelease: (id: string) => void; onmakerule: (details: string) => void; codeOf: (r: NonNullable<Scored['rule']>) => string;
		children?: import('svelte').Snippet;
	} = $props();

	const shareOf = (r: Scored) => (copy === 'partner' ? 1 - r.share : r.share);
	const value = (r: Scored) => (copy === 'card' ? r.amount : copy === 'mine' ? r.mine : r.amount - r.mine);
	const sum = $derived(rows.reduce((a, r) => a + value(r), 0) + extra);
	const shown = tweenMoney(() => sum);
	const bar = $derived(totalOf > 0 ? Math.min(1, Math.abs(sum) / totalOf) : 0);
	$effect(() => {
		if (rows.some((r) => held.has(r.id))) open = true; // a moved row opens its new bucket
	});
	const n = $derived(rows.length + (extra ? 1 : 0));
	const conflicts = $derived(rows.filter((r) => r.conflict).length);

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

<details class={['card', cls]} bind:open style="--c: {color}">
	<summary>
		<span class="head"><span class="dot"></span><span class="t">{title}</span></span>
		<span class="count small">{n} {n === 1 ? 'line' : 'lines'}</span>
		<span class={['sum', 'num', { muted: n === 0 }]}>{nzd(shown.current)}</span>
		{#if conflicts}<span class="pill warn">{conflicts} conflict{conflicts > 1 ? 's' : ''}</span>{/if}
		{#if n === 0}
			<span class="small none">{emptyText}</span>
		{:else}
			<span class="bar" aria-hidden="true"><span style="transform: scaleX({bar})"></span></span>
		{/if}
	</summary>
	<div class="body">
		{#if children}{@render children()}{/if}
		{#if rows.length}
			<ul>
				{#each rows as r (r.id)}
					{@const s = shareOf(r)}
					<li class={{ held: held.has(r.id), conflict: r.conflict, excluded: s === 0 }} {@attach held.has(r.id) ? hold(r.id) : undefined}>
						<span class="date small">{r.date.slice(5)}</span>
						<span class="det">
							<button class="det-b" onclick={() => onmakerule(r.details)} title="Start a rule from this line">{r.details}</button>
							{#if r.conflict}<span class="pill warn">conflict · {r.matches.map((m) => m.name).join(' vs ')}</span>{/if}
						</span>
						<span class="meta">
							{#if r.rule}<span class="pill code" title={r.rule.name}>{codeOf(r.rule)}</span>{/if}
							{#if copy !== 'card'}<span class={['pill', 'share', { full: s === 1 }]}>{pct(s)}</span>{/if}
						</span>
						<span class="amt num">
							{#if copy !== 'card' && s !== 1}<span class="small">{nzd(r.amount)}</span>{/if}
							<b>{nzd(value(r))}</b>
						</span>
					</li>
				{/each}
			</ul>
		{:else if !children}
			<p class="small empty">No lines in this bucket yet. Add a rule that sends lines here.</p>
		{/if}
	</div>
</details>

<style>
	details { padding: 18px 20px; transition: box-shadow 200ms var(--ease); }
	summary { display: grid; grid-template-columns: 1fr auto; gap: 8px 12px; cursor: pointer; list-style: none; align-items: center; }
	.count { display: flex; align-items: center; gap: 8px; white-space: nowrap; }
	.sum { grid-column: 1; }
	.pill.warn { justify-self: end; }
	.t { white-space: nowrap; }
	.sum.muted { color: var(--ink-2); font-weight: 500; }
	.none { grid-column: 1 / -1; line-height: 6px; }
	summary::-webkit-details-marker { display: none; }
	.head { display: flex; align-items: center; gap: 10px; min-width: 0; }
	.t { font-weight: 600; }
	.sum { font-size: 24px; font-weight: 600; letter-spacing: -0.02em; line-height: 1.1; }
	.bar { grid-column: 1 / -1; height: 6px; border-radius: 999px; background: var(--surface-2); overflow: hidden; }
	.bar span { display: block; height: 100%; border-radius: 999px; background: var(--c); transform-origin: left; transition: transform 400ms var(--ease); }
	.body { margin-top: 14px; }
	ul { list-style: none; margin: 0; padding: 0; }
	li { position: relative; display: grid; grid-template-columns: 48px 1fr auto auto; gap: 12px; align-items: center; padding: 10px 12px; border-radius: var(--r2); transition: background-color 400ms var(--ease); }
	li + li { margin-top: 2px; }
	li:hover { background: var(--surface-2); }
	li.held { background: var(--accent-soft); box-shadow: 0 6px 18px var(--accent-soft); }
	li.conflict { background: var(--danger-soft); }
	li.excluded .det-b, li.excluded .amt b { color: var(--ink-2); font-weight: 400; }
	.det { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 10px; min-width: 0; }
	.det-b { background: none; border: 0; padding: 0; text-align: left; font-weight: 500; }
	.det-b:hover { color: var(--accent); }
	.meta { display: flex; gap: 6px; }
	.code { color: var(--c); background: color-mix(in srgb, var(--c) 14%, transparent); font-size: 12px; font-weight: 600; }
	.share { color: var(--ink-2); }
	.share.full { color: var(--ink); }
	.warn { color: var(--danger); background: transparent; padding-left: 0; }
	.amt { display: flex; gap: 8px; align-items: baseline; justify-content: flex-end; white-space: nowrap; }
	.amt b { font-weight: 600; }
	.empty { margin: 0; }
	@media (max-width: 640px) {
		li { grid-template-columns: 1fr auto; }
		.date { display: none; }
		.meta { grid-column: 1; }
		.amt { grid-column: 2; grid-row: 1 / span 2; align-self: center; flex-direction: column; align-items: flex-end; gap: 0; }
	}
</style>
