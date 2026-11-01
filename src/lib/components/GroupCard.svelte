<script lang="ts">
	import { nzd } from '#lib/money';
	import { tweenMoney } from '#lib/motion.svelte';
	import type { Bucket, Scored } from '#lib/types';

	type Copy = 'card' | 'mine' | 'partner';
	type Part = { bucket: Bucket; title: string; rows: Scored[] };
	let { title, hint, parts, copy }: { title: string; hint: string; parts: Part[]; copy: Copy } = $props();

	const value = (r: Scored) => (copy === 'card' ? r.amount : copy === 'mine' ? r.mine : r.amount - r.mine);
	const sums = $derived(parts.map((p) => ({ ...p, sum: p.rows.reduce((a, r) => a + value(r), 0), conflicts: p.rows.filter((r) => r.conflict).length })));
	const total = $derived(sums.reduce((a, p) => a + p.sum, 0));
	const shown = tweenMoney(() => total);
	const lines = $derived(parts.reduce((a, p) => a + p.rows.length, 0));
</script>

<section class="card group" aria-label="{title}: {nzd(total)}">
	<header>
		<div><span class="t">{title}</span><span class="small">&nbsp;·&nbsp;{hint}</span></div>
		<span class="small">{lines} {lines === 1 ? 'line' : 'lines'}</span>
	</header>
	<p class={['sum', 'num', { muted: !lines }]}>{nzd(shown.current)}</p>
	<div class="stack" aria-hidden="true">
		{#each sums as p (p.bucket)}
			{#if p.sum > 0}<span style="--c: var(--b-{p.bucket}); flex: {p.sum}"></span>{/if}
		{/each}
		{#if total <= 0}<span class="none"></span>{/if}
	</div>
	<ul>
		{#each sums as p (p.bucket)}
			<li>
				<a href="#lines/{p.bucket}" class={{ empty: !p.rows.length }} style="--c: var(--b-{p.bucket})">
					<span class="dot"></span>
					<span class="name">{p.title}</span>
					{#if p.conflicts}<span class="pill warn">{p.conflicts} conflict{p.conflicts > 1 ? 's' : ''}</span>{/if}
					<span class="pct small">{total > 0 && p.sum > 0 ? `${Math.round((p.sum / total) * 100)}%` : ''}</span>
					<span class="v num">{p.rows.length ? nzd(p.sum) : '—'}</span>
					<svg class="chev" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3.5 10.5 8 6 12.5"/></svg>
				</a>
			</li>
		{/each}
	</ul>
</section>

<style>
	.group { padding: 18px 20px 10px; display: flex; flex-direction: column; gap: 8px; }
	header { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; }
	.t { font-weight: 600; }
	.sum { margin: 0; font-size: 24px; font-weight: 600; letter-spacing: -0.02em; line-height: 1.1; }
	.sum.muted { color: var(--ink-2); font-weight: 500; }
	.stack { display: flex; gap: 3px; height: 8px; border-radius: 999px; overflow: hidden; margin: 2px 0 6px; }
	.stack span { display: block; height: 100%; background: var(--c); border-radius: 999px; transition: flex 400ms var(--ease); }
	.stack .none { flex: 1; background: var(--surface-2); }
	ul { list-style: none; margin: 0 -8px; padding: 0; }
	a { display: grid; grid-template-columns: 10px 1fr auto auto auto 16px; gap: 10px; align-items: center; padding: 9px 8px; border-radius: var(--r2); color: inherit; text-decoration: none; transition: background-color 150ms var(--ease); }
	a:hover { background: var(--surface-2); }
	a:hover .chev { color: var(--accent); transform: translateX(2px); }
	.name { font-weight: 500; }
	a.empty .name, a.empty .v { color: var(--ink-2); font-weight: 400; }
	.pct { min-width: 3ch; text-align: right; }
	.v { font-weight: 600; }
	.pill.warn { color: var(--danger); background: var(--danger-soft); }
	.chev { color: var(--ink-2); transition: transform 150ms var(--ease), color 150ms var(--ease); }
</style>
