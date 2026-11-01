<script lang="ts">
	import { describe } from '#lib/rules';
	import { BUCKETS, type Bucket, type Rule, type Scored } from '#lib/types';

	let { rules, scored, copy, draft = $bindable(), onadd, onremove }: {
		rules: Rule[]; scored: Scored[]; copy: 'card' | 'mine' | 'partner';
		draft: { text: string; min: string; max: string; share: string; bucket: Bucket; name: string };
		onadd: (r: Omit<Rule, 'id'>) => void; onremove: (id: string) => void;
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
			text: draft.text || undefined, min: draft.min ? Number(draft.min) : undefined, max: draft.max ? Number(draft.max) : undefined,
			share, bucket: draft.bucket
		});
		draft = { text: '', min: '', max: '', share: '0', bucket: 'general', name: '' };
	}
</script>

<aside aria-labelledby="rules-h">
	<h2 id="rules-h">Share rules</h2>
	<ol>
		{#each rules as r, i (r.id)}
			<li class="card" style="--c: var(--b-{r.bucket})">
				<div class="top">
					<span class="pill code">R{i + 1}</span>
					<span class="name">{r.name}</span>
					<button class="link" onclick={() => onremove(r.id)} aria-label="Remove rule {r.name}">Remove</button>
				</div>
				<p class="cond small">When details {describe(r)}</p>
				<div class="chips">
					<span class="pill">{shareLabel(r.share)}</span>
					<span class="pill bucket"><span class="dot"></span>{r.bucket}</span>
					<span class="pill ghost">fired {fired(r)}</span>
				</div>
			</li>
		{/each}
	</ol>

	<form class="card" onsubmit={submit} aria-label="Add a rule">
		<div class="top"><span class="pill code">R{rules.length + 1}</span><span class="name">New rule</span></div>
		<label>Details contain<input bind:value={draft.text} placeholder="pak n save" /></label>
		<div class="pair">
			<label>Amount ≥<input inputmode="decimal" bind:value={draft.min} placeholder="50" /></label>
			<label>Amount ≤<input inputmode="decimal" bind:value={draft.max} placeholder="any" /></label>
		</div>
		<label>My share
			<select bind:value={draft.share}>
				<option value="0">0% · partner's</option>
				<option value="50">50% · split</option>
				<option value="100">100% · mine</option>
				<option value="25">25%</option>
				<option value="75">75%</option>
			</select>
		</label>
		<label>Bucket
			<select bind:value={draft.bucket}>
				{#each BUCKETS as b (b)}<option value={b}>{b}</option>{/each}
			</select>
		</label>
		<label>Name<input bind:value={draft.name} placeholder="Big grocery shop is partner's" /></label>
		{#if error}<p class="err small" role="alert">{error}</p>{/if}
		<button class="btn" type="submit">Add rule</button>
	</form>
</aside>

<style>
	aside { display: flex; flex-direction: column; gap: 12px; }
	h2 { margin: 0 0 4px; font-size: 18px; font-weight: 600; letter-spacing: -0.01em; }
	ol { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 12px; }
	li, form { padding: 16px 18px; }
	.top { display: flex; align-items: center; gap: 10px; }
	.name { font-weight: 600; flex: 1; min-width: 0; }
	.code { font-size: 12px; font-weight: 600; color: var(--c, var(--accent)); background: color-mix(in srgb, var(--c, var(--accent)) 14%, transparent); }
	form .code { --c: var(--accent); }
	.cond { margin: 8px 0 10px; }
	.cond :global(.amt) { white-space: nowrap; }
	.chips { display: flex; flex-wrap: wrap; gap: 6px; }
	.bucket { text-transform: capitalize; }
	.ghost { background: transparent; color: var(--ink-2); padding-left: 0; }
	form { display: flex; flex-direction: column; gap: 10px; }
	label { display: flex; flex-direction: column; gap: 6px; font-size: 13px; font-weight: 500; color: var(--ink-2); }
	.pair { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
	.err { margin: 0; color: var(--danger); }
	form .btn { align-self: flex-start; margin-top: 4px; }
</style>
