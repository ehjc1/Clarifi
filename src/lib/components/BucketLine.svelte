<script lang="ts">
	import { nzd, pct } from '#lib/money';
	import type { Scored } from '#lib/types';
	import ShareMark from './ShareMark.svelte';

	type Copy = 'card' | 'mine' | 'partner';
	let {
		title,
		rows,
		copy,
		held,
		open = false,
		extra = 0,
		onrelease,
		onmakerule,
		codeOf,
		children
	}: {
		title: string;
		rows: Scored[];
		copy: Copy;
		held: Set<string> | import('svelte/reactivity').SvelteSet<string>;
		open?: boolean;
		extra?: number;
		onrelease: (id: string) => void;
		onmakerule: (details: string) => void;
		codeOf: (r: Scored['rule'] & {}) => string;
		children?: import('svelte').Snippet;
	} = $props();

	const shareOf = (r: Scored) => (copy === 'partner' ? 1 - r.share : r.share);
	const value = (r: Scored) => (copy === 'card' ? r.amount : copy === 'mine' ? r.mine : r.amount - r.mine);
	const total = $derived(rows.reduce((a, r) => a + value(r), 0) + extra);
	const isOpen = $derived(open || rows.some((r) => held.has(r.id)));
	const card = $derived(rows.reduce((a, r) => a + r.amount, 0));

	/** Row keeps its canary until it has been seen and then scrolled out of view once. */
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

<details open={isOpen}>
	<summary>
		<span class="t">{title}</span>
		<span class="n mono">{rows.length} {rows.length === 1 ? 'line' : 'lines'}</span>
		<span class="arith num">
			{#if copy !== 'card' && rows.length}
				<span class="dim">{nzd(card)} × share =</span>
			{/if}
			<b>{nzd(total)}</b>
		</span>
	</summary>
	{#if children}{@render children()}{/if}
	{#if rows.length}
		<table>
			<tbody>
				{#each rows as r (r.id)}
					{@const excluded = shareOf(r) === 0}
					<tr class={{ held: held.has(r.id), conflict: r.conflict, excluded }}>
						{#if held.has(r.id)}<td class="hold" {@attach hold(r.id)} aria-hidden="true"></td>{:else}<td class="hold"></td>{/if}
						<td class="date mono">{r.date.slice(5)}</td>
						<td class="det">
							<button class="det-b" onclick={() => onmakerule(r.details)} title="Start a rule from this line">{r.details}</button>
							{#if r.conflict}<span class="warn mono">{r.matches.map((m) => m.name).join(' vs ')}</span>{/if}
						</td>
						<td class="code mono" title={r.rule?.name}>{r.rule ? codeOf(r.rule) : ''}</td>
						<td class="mark"><ShareMark share={shareOf(r)} {excluded} /></td>
						<td class="num">
							{#if copy === 'card'}
								{nzd(r.amount)}
							{:else}
								<span class="dim">{nzd(r.amount)} × {pct(shareOf(r))} =</span> {nzd(value(r))}
							{/if}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</details>

<style>
	details { border-top: 1px solid var(--rule); }
	summary {
		display: grid; grid-template-columns: 8px 1fr auto auto; gap: calc(var(--s) * 2); align-items: baseline;
		padding: calc(var(--s) * 1.5) 0; cursor: pointer; list-style: none;
	}
	summary::-webkit-details-marker { display: none; }
	summary::before { content: ''; width: 8px; height: 8px; border: 1px solid var(--ink); align-self: center; transition: background-color 150ms var(--ease); }
	details[open] summary::before { background: var(--ink); }
	summary:hover .t { color: var(--blue); }
	.t { font-weight: 500; text-transform: capitalize; }
	.n { color: var(--ink-2); }
	.arith b { font-weight: 500; }
	.dim { color: var(--ink-2); }
	table { width: calc(100% - 8px); border-collapse: collapse; margin: 0 0 var(--s) 8px; }
	tr { border-top: 1px solid var(--rule); transition: background-color 400ms var(--ease); }
	tr:first-child { border-top: 0; }
	td { padding: 5px 6px; vertical-align: top; }
	td:last-child { padding-right: 0; }
	.hold { width: 2px; padding: 0; }
	tr.held { background: var(--held); }
	tr.held .hold { background: var(--blue); }
	tr.conflict {
		background-image:
			repeating-linear-gradient(45deg, transparent 0 6px, rgba(28, 34, 48, 0.09) 6px 7px),
			repeating-linear-gradient(-45deg, transparent 0 6px, rgba(28, 34, 48, 0.09) 6px 7px);
	}
	tr.excluded .det-b, tr.excluded .num { color: var(--ink-2); }
	.date { color: var(--ink-2); white-space: nowrap; }
	.det { width: 100%; }
	.det-b { background: none; border: 0; padding: 0; text-align: left; color: inherit; font: inherit; }
	.det-b:hover { color: var(--blue); text-decoration: underline; text-underline-offset: 3px; }
	.warn { display: block; color: #a3261c; }
	.code { color: var(--blue); white-space: nowrap; max-width: 18ch; overflow: hidden; text-overflow: ellipsis; }
	.mark { color: var(--ink); padding-top: 7px; }
	@media (max-width: 720px) {
		.date, .code { display: none; }
		summary { grid-template-columns: 8px 1fr auto; }
		.n { display: none; }
	}
</style>
