<script lang="ts">
	import { onMount } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import { parseAnz } from '#lib/anz';
	import BucketLine from '#lib/components/BucketLine.svelte';
	import Rules from '#lib/components/Rules.svelte';
	import { nzd } from '#lib/money';
	import { score } from '#lib/rules';
	import { SAMPLE_CSV } from '#lib/sample';
	import { data, load, persist, uid } from '#lib/store.svelte';
	import { BUCKETS, type Bucket, type Rule, type Scored } from '#lib/types';

	type Copy = 'card' | 'mine' | 'partner';
	const COPIES: { id: Copy; label: string; hint: string }[] = [
		{ id: 'card', label: 'Card', hint: 'every line on the statement' },
		{ id: 'mine', label: 'Mine', hint: 'my share of each line' },
		{ id: 'partner', label: 'Partner', hint: 'what is not mine' }
	];

	let copy = $state<Copy>('mine');
	const held = new SvelteSet<string>();
	let error = $state('');
	let draft = $state({ text: '', min: '', max: '', share: '0', bucket: 'general' as Bucket, name: '' });
	let incomeDraft = $state({ name: '', amount: '' });

	onMount(() => {
		Object.assign(data, load());
		if (location.search.includes('sample') && (!data.txns.length || data.synthetic)) loadCsv(SAMPLE_CSV, true); // demo/screenshot entry, never over real data
	});

	const scored = $derived(score(data.txns, data.rules));
	/** Payments and refunds to the card are not anyone's expense unless a rule claims them. */
	const payments = $derived(scored.filter((r) => r.amount < 0 && !r.rule));
	const byBucket = $derived(Object.fromEntries(BUCKETS.map((b) => [b, scored.filter((r) => r.bucket === b && !(r.amount < 0 && !r.rule))])) as Record<Bucket, Scored[]>);
	const incomeTotal = $derived(data.incomes.reduce((a, i) => a + i.amount, 0));
	const val = (r: Scored) => (copy === 'card' ? r.amount : copy === 'mine' ? r.mine : r.amount - r.mine);
	const sum = (b: Bucket) => byBucket[b].reduce((a, r) => a + val(r), 0);
	const spend = $derived(sum('fixed') + sum('general') + sum('mortgage'));
	const put = $derived(sum('savings') + sum('investments'));
	const income = $derived((copy === 'partner' ? 0 : incomeTotal) + sum('income'));
	const left = $derived(income - spend - put);
	const codeOf = (r: Rule) => `R${data.rules.findIndex((x) => x.id === r.id) + 1}`;
	const period = $derived.by(() => {
		if (!data.txns.length) return 'No statement loaded';
		const ds = data.txns.map((t) => t.date).sort();
		const f = (d: string) => new Date(d).toLocaleDateString('en-NZ', { day: 'numeric', month: 'short', year: 'numeric' });
		return `${f(ds[0])} – ${f(ds[ds.length - 1])}`;
	});

	function loadCsv(text: string, synthetic = false) {
		try {
			const txns = parseAnz(text);
			if (!txns.length) throw new Error('No transactions found in that file.');
			data.txns = txns;
			data.synthetic = synthetic;
			error = '';
			persist();
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
		}
	}
	async function onfile(e: Event) {
		const f = (e.currentTarget as HTMLInputElement).files?.[0];
		if (f) loadCsv(await f.text());
		(e.currentTarget as HTMLInputElement).value = '';
	}

	/** Rule edits: remember which rows changed bucket or share so they can hold their highlight. */
	function withDiff(fn: () => void) {
		const before = new Map(scored.map((r) => [r.id, `${r.bucket}:${r.share}`]));
		fn();
		persist();
		const changed = score(data.txns, data.rules).filter((r) => before.get(r.id) !== `${r.bucket}:${r.share}`).map((r) => r.id);
		for (const id of changed) held.add(id);
	}
	const addRule = (r: Omit<Rule, 'id'>) => withDiff(() => data.rules.push({ id: uid(), ...r }));
	const removeRule = (id: string) => withDiff(() => (data.rules = data.rules.filter((r) => r.id !== id)));
	const release = (id: string) => held.delete(id);
	function makeRule(details: string) {
		draft.text = details.replace(/\s+\S*\d\S*$/g, '').trim(); // drop trailing store numbers
		document.getElementById('rules-h')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}
	function addIncome(e: SubmitEvent) {
		e.preventDefault();
		const amount = Number(incomeDraft.amount);
		if (!incomeDraft.name || Number.isNaN(amount) || amount <= 0) return;
		data.incomes.push({ id: uid(), name: incomeDraft.name, amount, monthly: true });
		incomeDraft = { name: '', amount: '' };
		persist();
	}
	function removeIncome(id: string) {
		data.incomes = data.incomes.filter((i) => i.id !== id);
		persist();
	}
	function exportJson() {
		const a = document.createElement('a');
		a.href = URL.createObjectURL(new Blob([JSON.stringify($state.snapshot(data), null, 2)], { type: 'application/json' }));
		a.download = `clarifi-${new Date().toISOString().slice(0, 10)}.json`;
		a.click();
		URL.revokeObjectURL(a.href);
	}
	async function importJson(e: Event) {
		const f = (e.currentTarget as HTMLInputElement).files?.[0];
		if (!f) return;
		try { Object.assign(data, JSON.parse(await f.text())); persist(); error = ''; }
		catch { error = 'That file is not a Clarifi export.'; }
	}
	function clearAll() {
		if (!confirm('Remove the loaded statement and incomes? Rules stay.')) return;
		data.txns = []; data.incomes = []; persist();
	}
</script>

<svelte:head><title>Clarifi</title></svelte:head>

<main data-copy={copy}>
	<header>
		<div class="brand">
			<span class="wordmark">Clarifi</span>
			<h1>{period} {#if data.synthetic && data.txns.length}<span class="label synth">sample statement · synthetic data</span>{/if}</h1>
		</div>
		<nav class="copies" aria-label="Which copy of the statement to read">
			{#each COPIES as c (c.id)}
				<button class={['tab', { on: copy === c.id }]} data-copy={c.id} aria-pressed={copy === c.id} onclick={() => (copy = c.id)} title={c.hint}>{c.label}</button>
			{/each}
		</nav>
		<label class="btn import">
			Import statement
			<input type="file" accept=".csv,text/csv" onchange={onfile} />
		</label>
	</header>

	{#if error}<p class="error" role="alert">{error}</p>{/if}

	<div class="sheet">
		<section class="lines" aria-label="Budget lines">
			{#if !data.txns.length}
				<div class="empty">
					<p>Export your ANZ credit card statement as CSV and import it. Nothing leaves this browser: parsing and storage happen locally.</p>
					<p>Or <button class="quiet" onclick={() => loadCsv(SAMPLE_CSV, true)}>load a sample statement</button> <span class="label">synthetic data</span> to see how rules shape the sheet.</p>
				</div>
			{:else}
				<p class="net num" aria-label="Net position">
					{#if copy === 'card'}
						<span class="dim">card total</span> <b>{nzd(spend + put)}</b>
					{:else if copy === 'partner'}
						<span class="dim">partner's share</span> <b>{nzd(spend + put)}</b>
					{:else if !data.incomes.length}
						<span class="dim">income</span> <b class="dim">— not entered</b>
						<span class="dim">− spend {nzd(spend)} − put away {nzd(put)}</span>
					{:else}
						<span class="dim">income {nzd(income)} − spend {nzd(spend)} − put away {nzd(put)} =</span>
						<b class={{ neg: left < 0 }}>{nzd(left)}</b>
						<span class="dim">left over</span>
					{/if}
				</p>
			{/if}

			<BucketLine title="Income" rows={byBucket.income} extra={copy === 'partner' ? 0 : incomeTotal} {copy} {held} {codeOf} onrelease={release} onmakerule={makeRule} open>
				<ul class="incomes">
					{#each data.incomes as i (i.id)}
						<li><span>{i.name}</span><span class="num">{nzd(i.amount)}</span><button class="quiet" onclick={() => removeIncome(i.id)} aria-label="Remove income {i.name}">remove</button></li>
					{/each}
					<li>
						<form onsubmit={addIncome} aria-label="Add an income">
							<input bind:value={incomeDraft.name} placeholder="Salary" aria-label="Income name" />
							<input class="mono" inputmode="decimal" bind:value={incomeDraft.amount} placeholder="0.00" size="9" aria-label="Monthly amount" />
							<button class="quiet" type="submit">add income</button>
						</form>
					</li>
				</ul>
			</BucketLine>
			<BucketLine title="Fixed expenses" rows={byBucket.fixed} {copy} {held} {codeOf} onrelease={release} onmakerule={makeRule} open />
			<BucketLine title="General expenses" rows={byBucket.general} {copy} {held} {codeOf} onrelease={release} onmakerule={makeRule} open />
			<BucketLine title="Investments" rows={byBucket.investments} {copy} {held} {codeOf} onrelease={release} onmakerule={makeRule} />
			<BucketLine title="Savings" rows={byBucket.savings} {copy} {held} {codeOf} onrelease={release} onmakerule={makeRule} />
			<BucketLine title="Mortgage" rows={byBucket.mortgage} {copy} {held} {codeOf} onrelease={release} onmakerule={makeRule} />
			{#if payments.length}
				<p class="payments mono" aria-label="Payments and credits to the card">
					<span class="dim">payments to the card, not counted:</span>
					{#each payments as r (r.id)}<span class="pay">{r.date.slice(5)} {r.details} <b>{nzd(-r.amount)}</b></span>{/each}
				</p>
			{/if}
		</section>

		<Rules rules={data.rules} {scored} {copy} bind:draft onadd={addRule} onremove={removeRule} />
	</div>

	<footer>
		<span class="label">Stored in this browser only</span>
		<button class="quiet" onclick={exportJson}>export JSON</button>
		<label class="quiet">import JSON<input type="file" accept="application/json" onchange={importJson} hidden /></label>
		<button class="quiet" onclick={clearAll} disabled={!data.txns.length && !data.incomes.length}>clear statement</button>
	</footer>
</main>

<style>
	main {
		max-width: 1280px; margin: 24px auto; padding: calc(var(--s) * 3) calc(var(--s) * 4) calc(var(--s) * 4);
		background: var(--sheet); border: 1px solid var(--rule); min-height: calc(100vh - 48px);
		transition: background-color 250ms var(--ease), border-color 250ms var(--ease);
	}
	header { display: grid; grid-template-columns: 1fr auto auto; gap: calc(var(--s) * 3); align-items: end; padding-bottom: calc(var(--s) * 2); border-bottom: 1px solid var(--ink); }
	.wordmark { display: block; font-size: var(--t1); letter-spacing: 0.18em; text-transform: uppercase; color: var(--blue); font-weight: 600; }
	h1 { margin: 2px 0 0; font-size: 22px; font-weight: 500; letter-spacing: -0.01em; }
	.synth { display: inline-block; margin-left: 12px; vertical-align: middle; color: var(--blue); }
	.copies { display: flex; }
	.tab {
		border: 1px solid var(--rule); border-bottom: 0; background: #fff; padding: 6px 16px 8px; font-size: var(--t1); font-weight: 500;
		margin-bottom: -1px; margin-left: -1px; position: relative; transition: transform 150ms var(--ease);
	}
	.tab[data-copy='mine'] { background: var(--canary); }
	.tab[data-copy='partner'] { background: var(--pink); }
	.tab.on { border-color: var(--ink); z-index: 1; transform: translateY(-3px); box-shadow: 0 1px 0 var(--sheet); }
	.import input { position: absolute; width: 1px; height: 1px; opacity: 0; }
	.import { position: relative; }
	.import:focus-within { outline: 2px solid var(--blue); outline-offset: 2px; }
	.error { margin: var(--s) 0 0; padding: var(--s); border: 1px solid #a3261c; color: #a3261c; font-size: var(--t1); }
	.sheet { display: grid; grid-template-columns: minmax(0, 1fr) 320px; gap: calc(var(--s) * 4); margin-top: calc(var(--s) * 2); }
	.net { margin: 0 0 calc(var(--s) * 2); padding: var(--s) 0; font-size: var(--t2); text-align: left; white-space: normal; }
	.payments { margin: 0; padding: calc(var(--s) * 1.5) 0 0 8px; border-top: 1px solid var(--rule); display: flex; flex-wrap: wrap; gap: 4px calc(var(--s) * 2); color: var(--ink-2); }
	.payments b { font-weight: 500; color: var(--ink); }
	.net b { font-weight: 500; font-size: 22px; margin: 0 6px; }
	.net .neg { color: #a3261c; }
	.dim { color: var(--ink-2); }
	.empty { padding: calc(var(--s) * 2) 0 calc(var(--s) * 3); max-width: 60ch; }
	.empty p { margin: 0 0 var(--s); }
	.incomes { list-style: none; margin: 0 0 var(--s) 8px; padding: 0; }
	.incomes li { display: grid; grid-template-columns: 1fr auto auto; gap: calc(var(--s) * 2); padding: 5px 0; border-top: 1px solid var(--rule); align-items: baseline; }
	.incomes form { display: contents; }
	footer { display: flex; gap: calc(var(--s) * 3); align-items: baseline; margin-top: calc(var(--s) * 4); padding-top: var(--s); border-top: 1px solid var(--rule); }
	footer label { cursor: pointer; }
	@media (max-width: 900px) {
		.sheet { grid-template-columns: 1fr; }
		header { grid-template-columns: 1fr auto; }
		.import { grid-column: 1 / -1; justify-self: start; }
	}
	@media (max-width: 520px) {
		main { margin: 0; padding: calc(var(--s) * 2); border: 0; }
		header { grid-template-columns: 1fr; }
		.copies { justify-self: start; }
		.net b { display: block; margin: 4px 0; }
	}
</style>
