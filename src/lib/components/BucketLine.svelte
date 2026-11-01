<script lang="ts">
	import { nzd } from '#lib/money';
	import { tweenMoney } from '#lib/motion.svelte';
	import type { Bucket, Scored } from '#lib/types';

	type Copy = 'card' | 'mine' | 'partner';
	let { bucket, title, color, rows, copy, extra = 0, emptyText = 'No lines yet', total: totalOf }: {
		bucket: Bucket; title: string; color: string; rows: Scored[]; copy: Copy; extra?: number; emptyText?: string;
		total: number; // total of all buckets on this copy, for the share bar
	} = $props();

	const value = (r: Scored) => (copy === 'card' ? r.amount : copy === 'mine' ? r.mine : r.amount - r.mine);
	const sum = $derived(rows.reduce((a, r) => a + value(r), 0) + extra);
	const shown = tweenMoney(() => sum);
	const bar = $derived(totalOf > 0 ? Math.min(1, Math.abs(sum) / totalOf) : 0);
	const n = $derived(rows.length + (extra ? 1 : 0));
	const conflicts = $derived(rows.filter((r) => r.conflict).length);
</script>

<a class="card" href="#lines/{bucket}" style="--c: {color}" aria-label="{title}: {nzd(sum)}, {n} lines. Open lines.">
	<span class="head"><span class="dot"></span><span class="t">{title}</span></span>
	<span class="count small">{n} {n === 1 ? 'line' : 'lines'}<svg class="chev" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3.5 10.5 8 6 12.5"/></svg></span>
	<span class={['sum', 'num', { muted: n === 0 }]}>{nzd(shown.current)}</span>
	{#if conflicts}<span class="pill warn">{conflicts} conflict{conflicts > 1 ? 's' : ''}</span>{/if}
	{#if n === 0}
		<span class="small none">{emptyText}</span>
	{:else}
		<span class="bar" aria-hidden="true"><span style="transform: scaleX({bar})"></span></span>
	{/if}
</a>

<style>
	a { display: grid; grid-template-columns: 1fr auto; gap: 8px 12px; align-items: center; padding: 18px 20px; color: inherit; text-decoration: none; transition: transform 150ms var(--ease), box-shadow 200ms var(--ease); }
	a:hover { transform: translateY(-1px); }
	a:hover .t { color: var(--accent); }
	.head { display: flex; align-items: center; gap: 10px; min-width: 0; }
	.t { font-weight: 600; white-space: nowrap; transition: color 150ms var(--ease); }
	.count { white-space: nowrap; display: inline-flex; align-items: center; gap: 4px; }
	.chev { color: var(--ink-2); transition: transform 150ms var(--ease), color 150ms var(--ease); }
	a:hover .chev { transform: translateX(2px); color: var(--accent); }
	.sum { grid-column: 1; font-size: 24px; font-weight: 600; letter-spacing: -0.02em; line-height: 1.1; }
	.sum.muted { color: var(--ink-2); font-weight: 500; }
	.pill.warn { justify-self: end; color: var(--danger); background: var(--danger-soft); }
	.none { grid-column: 1 / -1; line-height: 6px; }
	.bar { grid-column: 1 / -1; height: 6px; border-radius: 999px; background: var(--surface-2); overflow: hidden; }
	.bar span { display: block; height: 100%; border-radius: 999px; background: var(--c); transform-origin: left; transition: transform 400ms var(--ease); }
</style>
