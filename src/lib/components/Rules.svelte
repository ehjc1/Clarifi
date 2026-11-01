<script lang="ts">
	import { describe } from '#lib/rules';
	import { BUCKETS, type Bucket, type Rule, type Scored } from '#lib/types';
	import ShareMark from './ShareMark.svelte';

	let {
		rules,
		scored,
		copy,
		draft = $bindable(),
		onadd,
		onremove
	}: {
		rules: Rule[];
		scored: Scored[];
		copy: 'card' | 'mine' | 'partner';
		draft: { text: string; min: string; max: string; share: string; bucket: Bucket; name: string };
		onadd: (r: Omit<Rule, 'id'>) => void;
		onremove: (id: string) => void;
	} = $props();

	const fired = (r: Rule) => scored.filter((s) => s.matches.includes(r)).length;
	const shareLabel = (share: number) =>
		copy === 'partner' ? `${Math.round((1 - share) * 100)}% partner's` : `${Math.round(share * 100)}% mine`;
	let error = $state('');

	function submit(e: SubmitEvent) {
		e.preventDefault();
		const share = Number(draft.share) / 100;
		if (!draft.text && !draft.min && !draft.max) { error = 'Give the rule a condition: some text, a minimum, or a maximum.'; return; }
		if (Number.isNaN(share) || share < 0 || share > 1) { error = 'Share must be between 0 and 100.'; return; }
		error = '';
		onadd({
			name: draft.name || `${draft.text || 'amount'} → ${draft.share}%`,
			text: draft.text || undefined,
			min: draft.min ? Number(draft.min) : undefined,
			max: draft.max ? Number(draft.max) : undefined,
			share,
			bucket: draft.bucket
		});
		draft = { text: '', min: '', max: '', share: '0', bucket: 'general', name: '' };
	}
</script>

<aside aria-labelledby="rules-h">
	<h2 id="rules-h" class="label">Share rules</h2>
	<ol>
		{#each rules as r, i (r.id)}
			<li>
				<span class="code mono">R{i + 1}</span>
				<div class="body">
					<div class="name">{r.name}</div>
					<div class="cond mono">{describe(r)}</div>
					<div class="meta mono">
						<span class="nw"><ShareMark share={copy === 'partner' ? 1 - r.share : r.share} /> {shareLabel(r.share)}</span>
						<span>· {r.bucket}</span>
						<span>· fired {fired(r)}</span>
					</div>
				</div>
				<button class="quiet" onclick={() => onremove(r.id)} aria-label="Remove rule {r.name}">remove</button>
			</li>
		{/each}
	</ol>

	<form onsubmit={submit} aria-label="Add a rule">
		<span class="code mono">R{rules.length + 1}</span>
		<div class="body">
			<label>when details contain <input bind:value={draft.text} placeholder="pak n save" /></label>
			<div class="pair">
				<label>and amount ≥ <input class="mono" inputmode="decimal" bind:value={draft.min} placeholder="50" size="6" /></label>
				<label>≤ <input class="mono" inputmode="decimal" bind:value={draft.max} placeholder="" size="6" /></label>
			</div>
			<div class="pair stack">
				<label>my share
					<select bind:value={draft.share}>
						<option value="0">0% partner</option>
						<option value="50">50% split</option>
						<option value="100">100% mine</option>
						<option value="25">25%</option>
						<option value="75">75%</option>
					</select>
				</label>
				<label>bucket
					<select bind:value={draft.bucket}>
						{#each BUCKETS as b (b)}<option value={b}>{b}</option>{/each}
					</select>
				</label>
			</div>
			<label>name <input bind:value={draft.name} placeholder="Big grocery shop is partner's" /></label>
			{#if error}<p class="err" role="alert">{error}</p>{/if}
			<button class="btn ghost" type="submit">Add rule</button>
		</div>
	</form>
</aside>

<style>
	aside { border-left: 1px solid var(--rule); padding-left: calc(var(--s) * 2); }
	h2 { margin: 0 0 var(--s); font-weight: 500; }
	ol { list-style: none; margin: 0; padding: 0; }
	li, form { display: grid; grid-template-columns: 32px 1fr auto; gap: 0 var(--s); padding: var(--s) 0; border-top: 1px solid var(--rule); align-items: start; }
	form { grid-template-columns: 32px 1fr; }
	.code { color: var(--blue); font-weight: 500; }
	.name { font-weight: 500; }
	.cond { color: var(--ink-2); }
	.meta { color: var(--ink-2); display: flex; flex-wrap: wrap; align-items: center; gap: 4px; margin-top: 2px; }
	.nw { white-space: nowrap; display: inline-flex; align-items: center; gap: 4px; }
	.body { display: grid; gap: 6px; min-width: 0; }
	label { display: flex; gap: 6px; align-items: baseline; font-size: var(--t1); color: var(--ink-2); flex: 1; min-width: 0; white-space: nowrap; }
	label input, label select { flex: 1; min-width: 0; color: var(--ink); }
	.pair { display: grid; grid-template-columns: 1fr 1fr; gap: calc(var(--s) * 2); }
	.stack { grid-template-columns: 1fr; gap: 6px; }
	label input, label select { width: 100%; }
	form { min-width: 0; }
	.err { margin: 0; color: #a3261c; font-size: var(--t1); }
	form .btn { justify-self: start; margin-top: 4px; }
</style>
