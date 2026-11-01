<script lang="ts">
	import { nzd } from '#lib/money';
	import { BUCKETS, type Bucket, type Rule, type Scored } from '#lib/types';

	let { lines, onrule, onskip, onclose }: {
		lines: Scored[]; // unsorted lines, in statement order
		onrule: (r: Omit<Rule, 'id'>) => void;
		onskip: (id: string) => void;
		onclose: () => void;
	} = $props();

	const TITLES: Record<Bucket, string> = { income: 'Income', fixed: 'Fixed', general: 'General', investments: 'Investments', savings: 'Savings', mortgage: 'Mortgage' };
	const CHOICES = [
		{ key: '1', label: 'Partner’s', share: 0, hint: 'leave it out' },
		{ key: '2', label: 'Split', share: 0.5, hint: 'half each' },
		{ key: '3', label: 'Mine', share: 1, hint: 'all of it' }
	];
	let bucket = $state<Bucket>('general');
	let done = $state(0);
	const total = $derived(done + lines.length);
	const line = $derived(lines[0]);
	/** Merchant stem: drop a trailing token carrying digits (store or terminal numbers). */
	const stem = $derived(line ? line.details.replace(/\s+\S*\d\S*$/g, '').trim() : '');

	function choose(share: number) {
		if (!line) return;
		const label = share === 0 ? 'partner’s' : share === 1 ? 'mine' : 'split';
		onrule({ name: `${stem} is ${label}`, text: stem.toLowerCase(), share, bucket });
		done++;
		bucket = 'general';
	}
	function skip() {
		if (!line) return;
		onskip(line.id);
		done++;
	}
	function keys(e: KeyboardEvent) {
		if ((e.target as HTMLElement).tagName === 'INPUT') return;
		const c = CHOICES.find((x) => x.key === e.key);
		if (c) { e.preventDefault(); choose(c.share); }
		else if (e.key === 's') skip();
		else if (e.key === 'Escape') onclose();
	}
</script>

<svelte:window onkeydown={keys} />

<section class="card triage" aria-label="Sort unsorted lines">
	<header>
		<div>
			<h2>Sort your lines</h2>
			<p class="small">Each answer becomes a rule, so next month sorts itself.</p>
		</div>
		<div class="progress" aria-label="{done} of {total} sorted">
			<span class="small">{done} / {total}</span>
			<span class="bar"><span style="transform: scaleX({total ? done / total : 1})"></span></span>
		</div>
		<button class="link" onclick={onclose}>Close</button>
	</header>

	{#if line}
		{#key line.id}
			<div class="line">
				<span class="small">{line.date.slice(5)}</span>
				<span class="det">{line.details}</span>
				<span class="amt num">{nzd(line.amount)}</span>
			</div>
		{/key}
		<div class="choices">
			{#each CHOICES as c (c.key)}
				<button class="choice" onclick={() => choose(c.share)}>
					<span class="k">{c.key}</span>
					<span class="l">{c.label}</span>
					<span class="small">{c.hint}</span>
				</button>
			{/each}
		</div>
		<div class="foot">
			<span class="buckets" role="radiogroup" aria-label="Bucket">
				{#each BUCKETS as b (b)}
					<button class={['pill', 'b', { on: bucket === b }]} role="radio" aria-checked={bucket === b} style="--c: var(--b-{b})" onclick={() => (bucket = b)}><span class="dot"></span>{TITLES[b]}</button>
				{/each}
			</span>
			<span class="small">Rule will match lines containing “{stem.toLowerCase()}” · <button class="link" onclick={skip}>Skip (S)</button></span>
		</div>
	{:else}
		<p class="done">All sorted. Every line now has a rule.</p>
	{/if}
</section>

<style>
	.triage { padding: 20px 24px 22px; margin-top: 16px; border: 2px solid var(--accent); }
	header { display: flex; align-items: center; gap: 24px; }
	header div:first-child { flex: 1; }
	h2 { margin: 0; font-size: 18px; font-weight: 600; letter-spacing: -0.01em; }
	header p { margin: 2px 0 0; }
	.progress { display: flex; align-items: center; gap: 10px; }
	.bar { width: 120px; height: 6px; border-radius: 999px; background: var(--surface-2); overflow: hidden; }
	.bar span { display: block; height: 100%; background: var(--accent); transform-origin: left; transition: transform 400ms var(--ease); }
	.line { display: grid; grid-template-columns: 48px 1fr auto; gap: 16px; align-items: baseline; padding: 22px 0 18px; animation: in 300ms var(--ease); }
	@keyframes in { from { opacity: 0; transform: translateY(6px); } }
	.det { font-size: 24px; font-weight: 600; letter-spacing: -0.02em; }
	.amt { font-size: 24px; font-weight: 600; letter-spacing: -0.02em; }
	.choices { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
	.choice { display: flex; flex-direction: column; align-items: flex-start; gap: 2px; padding: 14px 16px; border: 0; border-radius: var(--r2); background: var(--surface-2); text-align: left; transition: background-color 150ms var(--ease), transform 150ms var(--ease); }
	.choice:hover { background: var(--accent-soft); transform: translateY(-1px); }
	.choice .k { font-size: 12px; font-weight: 600; color: var(--ink-2); }
	.choice .l { font-size: 18px; font-weight: 600; }
	.foot { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 10px 16px; margin-top: 14px; }
	.buckets { display: flex; flex-wrap: wrap; gap: 6px; }
	.pill.b { border: 1px solid transparent; cursor: pointer; }
	.pill.b.on { background: color-mix(in srgb, var(--c) 16%, transparent); border-color: var(--c); }
	.done { margin: 20px 0 4px; font-size: 18px; font-weight: 600; }
	@media (max-width: 640px) {
		.triage { padding: 16px; }
		header { flex-wrap: wrap; gap: 10px; }
		header div:first-child { flex-basis: 100%; }
		.progress { flex: 1; }
		.progress .bar { flex: 1; width: auto; }
		.line { grid-template-columns: 1fr; gap: 4px; padding: 16px 0 12px; }
		.choices { grid-template-columns: 1fr; }
	}
</style>
