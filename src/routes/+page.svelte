<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import { parseAnz } from '#lib/anz';
	import BucketLine from '#lib/components/BucketLine.svelte';
	import Rules from '#lib/components/Rules.svelte';
	import Triage from '#lib/components/Triage.svelte';
	import { nzd } from '#lib/money';
	import { tweenMoney } from '#lib/motion.svelte';
	import { score } from '#lib/rules';
	import { SAMPLE_CSV } from '#lib/sample';
	import { data, load, persist, uid } from '#lib/store.svelte';
	import { BUCKETS, type Bucket, type Rule, type Scored } from '#lib/types';

	type Copy = 'card' | 'mine' | 'partner';
	const COPIES: { id: Copy; label: string }[] = [
		{ id: 'card', label: 'Card' }, { id: 'mine', label: 'Mine' }, { id: 'partner', label: 'Partner' }
	];
	const TITLES: Record<Bucket, string> = { income: 'Income', fixed: 'Fixed expenses', general: 'General', investments: 'Investments', savings: 'Savings', mortgage: 'Mortgage' };

	let copy = $state<Copy>('mine');
	const held = new SvelteSet<string>();
	const skipped = new SvelteSet<string>();
	let triage = $state(false);
	let error = $state('');
	let draft = $state({ text: '', min: '', max: '', share: '0', bucket: 'general' as Bucket, name: '' });
	let incomeDraft = $state({ name: '', amount: '' });
	/** Open state per bucket, so collapsed cards can re-span and leave no hole beside an expanded one. */
	let openB = $state<Record<Bucket, boolean>>({ income: false, fixed: false, general: false, investments: false, savings: false, mortgage: false });
	const collapsed = $derived(BUCKETS.filter((b) => !openB[b]));
	function span(b: Bucket) {
		if (openB[b]) return 's6';
		const i = collapsed.indexOf(b), n = collapsed.length, rem = n % 3;
		if (rem === 2 && i >= n - 2) return 's3';
		if (rem === 1 && i === n - 1) return 's6';
		return 's2';
	}
	async function focusIncome() {
		openB.income = true;
		await tick();
		document.getElementById('income-name')?.focus();
	}

	onMount(() => {
		Object.assign(data, load());
		if (location.search.includes('sample') && (!data.txns.length || data.synthetic)) loadCsv(SAMPLE_CSV, true); // demo/screenshot entry, never over real data
	});

	const scored = $derived(score(data.txns, data.rules));
	/** Payments and refunds to the card are not anyone's expense unless a rule claims them. */
	const payments = $derived(scored.filter((r) => r.amount < 0 && !r.rule));
	/** Charges no rule has claimed yet: the triage queue. */
	const unsorted = $derived(scored.filter((r) => r.amount > 0 && !r.rule && !skipped.has(r.id)));
	const byBucket = $derived(Object.fromEntries(BUCKETS.map((b) => [b, scored.filter((r) => r.bucket === b && !(r.amount < 0 && !r.rule))])) as Record<Bucket, Scored[]>);
	const incomeTotal = $derived(copy === 'partner' ? 0 : data.incomes.reduce((a, i) => a + i.amount, 0));
	const val = (r: Scored) => (copy === 'card' ? r.amount : copy === 'mine' ? r.mine : r.amount - r.mine);
	const sum = (b: Bucket) => byBucket[b].reduce((a, r) => a + val(r), 0);
	const spend = $derived(sum('fixed') + sum('general') + sum('mortgage'));
	const put = $derived(sum('savings') + sum('investments'));
	const income = $derived(incomeTotal + sum('income'));
	const left = $derived(income - spend - put);
	const headline = $derived(copy === 'mine' && data.incomes.length ? left : spend + put);
	const shown = tweenMoney(() => headline);
	const shownSpend = tweenMoney(() => spend);
	const shownPut = tweenMoney(() => put);
	const shownIncome = tweenMoney(() => income);
	const barTotal = $derived(spend + put + income);
	const codeOf = (r: Rule) => `R${data.rules.findIndex((x) => x.id === r.id) + 1}`;
	const period = $derived.by(() => {
		if (!data.txns.length) return 'No statement yet';
		const ds = data.txns.map((t) => t.date).sort();
		const f = (d: string) => new Date(d).toLocaleDateString('en-NZ', { day: 'numeric', month: 'short' });
		return `${f(ds[0])} – ${f(ds[ds.length - 1])} ${ds[ds.length - 1].slice(0, 4)}`;
	});

	function loadCsv(text: string, synthetic = false) {
		try {
			const txns = parseAnz(text);
			if (!txns.length) throw new Error('No transactions found in that file.');
			data.txns = txns; data.synthetic = synthetic; error = ''; persist();
		} catch (e) { error = e instanceof Error ? e.message : String(e); }
	}
	async function onfile(e: Event) {
		const input = e.currentTarget as HTMLInputElement;
		const f = input.files?.[0];
		if (f) loadCsv(await f.text());
		input.value = '';
	}
	/** Rule edits: remember which rows changed bucket or share so they can hold their glow. */
	function withDiff(fn: () => void) {
		const before = new Map(scored.map((r) => [r.id, `${r.bucket}:${r.share}`]));
		fn(); persist();
		for (const r of score(data.txns, data.rules)) if (before.get(r.id) !== `${r.bucket}:${r.share}`) held.add(r.id);
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
		incomeDraft = { name: '', amount: '' }; persist();
	}
	function removeIncome(id: string) { data.incomes = data.incomes.filter((i) => i.id !== id); persist(); }
	function exportJson() {
		const a = document.createElement('a');
		a.href = URL.createObjectURL(new Blob([JSON.stringify($state.snapshot(data), null, 2)], { type: 'application/json' }));
		a.download = `clarifi-${new Date().toISOString().slice(0, 10)}.json`;
		a.click(); URL.revokeObjectURL(a.href);
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

<main>
	<header>
		<span class="wordmark">Clarifi</span>
		<div class="seg" role="group" aria-label="Which share to read">
			{#each COPIES as c (c.id)}
				<button class={{ on: copy === c.id }} aria-pressed={copy === c.id} onclick={() => (copy = c.id)}>{c.label}</button>
			{/each}
		</div>
		<label class="btn import" aria-label="Import statement">
			<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 10V2M4.5 5.5 8 2l3.5 3.5M2.5 10.5v2a1.5 1.5 0 0 0 1.5 1.5h8a1.5 1.5 0 0 0 1.5-1.5v-2"/></svg>
			<span class="import-t">Import statement</span>
			<input type="file" accept=".csv,text/csv" onchange={onfile} />
		</label>
	</header>

	{#if error}<p class="error card" role="alert">{error}</p>{/if}

	<section class="hero card" aria-label="Net position">
		<div class="hero-main">
			<div class="hero-top">
				<span class="pill period">{period}</span>
				{#if data.synthetic && data.txns.length}<span class="pill period">sample · synthetic data</span>{/if}
			</div>
			{#if !data.txns.length}
				<p class="hero-label">Your share of the card, by bucket</p>
				<p class="lede">Import your ANZ credit card CSV. Rules decide how much of each line is yours. Nothing leaves this browser.</p>
				<button class="btn dark" onclick={() => loadCsv(SAMPLE_CSV, true)}>Try with a sample statement</button>
			{:else}
				<p class="hero-label">
					{#if copy === 'card'}Everything on the card{:else if copy === 'partner'}Partner's share{:else if !data.incomes.length}My share of the card{:else}Left over this statement{/if}
				</p>
				<p class={['big', 'num', { neg: headline < 0 }]}>{nzd(shown.current)}</p>
				{#if unsorted.length && !triage}
					<button class="btn dark sort" onclick={() => (triage = true)}>Sort {unsorted.length} unsorted {unsorted.length === 1 ? 'line' : 'lines'}</button>
				{/if}
			{/if}
		</div>
		{#if data.txns.length}
			<dl class="figures">
				{#if copy === 'mine'}
					<div><dt>Income</dt><dd class="num">{#if data.incomes.length}{nzd(shownIncome.current)}{:else}<button class="link add" onclick={focusIncome}>Add an income</button>{/if}</dd></div>
				{/if}
				<div><dt>Spend</dt><dd class="num">{nzd(shownSpend.current)}</dd></div>
				<div><dt>Put away</dt><dd class="num">{nzd(shownPut.current)}</dd></div>
			</dl>
		{/if}
	</section>

	{#if triage}
		<Triage lines={unsorted} {scored} onrule={addRule} onskip={(id) => skipped.add(id)} onclose={() => (triage = false)} />
	{/if}

	<div class="grid">
		<section class="buckets" aria-label="Buckets">
			<BucketLine title={TITLES.income} color="var(--b-income)" rows={byBucket.income} extra={incomeTotal} total={barTotal} emptyText="No income entered yet" bind:open={openB.income} class={span('income')} {copy} {held} {codeOf} onrelease={release} onmakerule={makeRule}>
				<ul class="incomes">
					{#each data.incomes as i (i.id)}
						<li><span>{i.name}</span><b class="num">{nzd(i.amount)}</b><button class="link" onclick={() => removeIncome(i.id)} aria-label="Remove income {i.name}">Remove</button></li>
					{/each}
					{#if copy !== 'partner'}
						<li>
							<form onsubmit={addIncome} aria-label="Add an income">
								<input id="income-name" bind:value={incomeDraft.name} placeholder="Salary" aria-label="Income name" />
								<input inputmode="decimal" bind:value={incomeDraft.amount} placeholder="0.00" aria-label="Monthly amount" />
								<button class="btn ghost" type="submit">Add income</button>
							</form>
						</li>
					{/if}
				</ul>
			</BucketLine>
			{#each ['fixed', 'general', 'investments', 'savings', 'mortgage'] as const as b (b)}
				<BucketLine title={TITLES[b]} color="var(--b-{b})" rows={byBucket[b]} total={barTotal} bind:open={openB[b]} class={span(b)} {copy} {held} {codeOf} onrelease={release} onmakerule={makeRule} />
			{/each}
			{#if payments.length}
				<p class="payments small">
					Payments to the card, not counted:
					{#each payments as r (r.id)}<span class="pill">{r.details} · {nzd(-r.amount)}</span>{/each}
				</p>
			{/if}
		</section>

		<Rules rules={data.rules} {scored} {copy} bind:draft onadd={addRule} onremove={removeRule} />
	</div>

	<footer class="small">
		<span>Stored in this browser only.</span>
		<button class="link" onclick={exportJson}>Export JSON</button>
		<label class="link">Import JSON<input type="file" accept="application/json" onchange={importJson} hidden /></label>
		<button class="link" onclick={clearAll} disabled={!data.txns.length && !data.incomes.length}>Clear statement</button>
	</footer>
</main>

<style>
	main { max-width: 1240px; margin: 0 auto; padding: 20px 24px 48px; }
	header { display: flex; align-items: center; gap: 16px; padding: 8px 0 20px; }
	.wordmark { font-weight: 700; font-size: 20px; letter-spacing: -0.03em; margin-right: auto; }
	.seg { display: inline-flex; padding: 4px; border-radius: 999px; background: var(--surface); box-shadow: var(--shadow); }
	.seg button { border: 0; background: transparent; border-radius: 999px; padding: 7px 16px; font-weight: 600; font-size: 14px; color: var(--ink-2); transition: background-color 200ms var(--ease), color 200ms var(--ease); }
	.seg button.on { background: var(--ink); color: var(--bg); }
	.import { position: relative; }
	.import input { position: absolute; width: 1px; height: 1px; opacity: 0; }
	.import:focus-within { outline: 2px solid var(--accent); outline-offset: 2px; }
	.error { margin: 0 0 16px; padding: 12px 16px; color: var(--danger); background: var(--danger-soft); box-shadow: none; }
	.hero { display: grid; grid-template-columns: 1fr auto; gap: 24px; align-items: end; background: var(--accent); color: var(--accent-ink); padding: 24px 28px 28px; border-radius: 28px; box-shadow: none; }
	.figures { display: flex; gap: 36px; margin: 0; padding: 0 8px 6px 0; }
	.figures div { display: flex; flex-direction: column; gap: 2px; }
	.figures dt { font-size: 13px; font-weight: 600; opacity: 0.75; }
	.figures dd { margin: 0; font-size: 24px; font-weight: 600; letter-spacing: -0.02em; }
	.figures .add { color: var(--accent-ink); font-size: 15px; text-decoration: underline; text-underline-offset: 3px; }
	.hero-top { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 18px; }
	.hero .pill { background: rgba(4, 46, 40, 0.1); color: var(--accent-ink); }
	.hero-label { margin: 0; font-weight: 600; font-size: 15px; opacity: 0.8; }
	.big { margin: 2px 0 0; font-size: clamp(40px, 6vw, 64px); font-weight: 700; letter-spacing: -0.04em; line-height: 1.05; }
	.big.neg::before { content: ''; }
	.lede { margin: 8px 0 18px; max-width: 48ch; font-size: 17px; }
	.btn.dark { background: var(--accent-ink); color: var(--accent); }
	.sort { margin-top: 16px; }
	.grid { display: grid; grid-template-columns: minmax(0, 1fr) 340px; gap: 24px; margin-top: 24px; }
	.buckets { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 12px; align-content: start; }
	.buckets :global(.s2) { grid-column: span 2; }
	.buckets :global(.s3) { grid-column: span 3; }
	.buckets :global(.s6) { grid-column: 1 / -1; }
	.payments { grid-column: 1 / -1; margin: 4px 4px 0; display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
	.incomes { list-style: none; margin: 0 0 12px; padding: 0; }
	.incomes li { display: grid; grid-template-columns: 1fr auto auto; gap: 12px; align-items: center; padding: 8px 12px; border-radius: var(--r2); }
	.incomes li:hover { background: var(--surface-2); }
	.incomes form { display: contents; }
	.incomes form input:first-child { grid-column: 1; }
	footer { display: flex; flex-wrap: wrap; gap: 16px; align-items: baseline; margin-top: 32px; }
	footer label { cursor: pointer; }
	@media (max-width: 1024px) { .buckets :global(.s2), .buckets :global(.s3) { grid-column: span 3; } }
	@media (max-width: 900px) { .grid { grid-template-columns: 1fr; } }
	@media (max-width: 640px) {
		main { padding: 12px 14px 40px; }
		header { flex-wrap: wrap; gap: 10px; }
		.seg { order: 3; flex-basis: 100%; }
		.seg button { flex: 1; }
		.import { padding: 10px 12px; }
		.import-t { display: none; }
		.hero { grid-template-columns: 1fr; align-items: start; }
		.figures { gap: 20px; flex-wrap: wrap; padding: 0; }
		.figures dd { font-size: 20px; }
		.buckets :global(.s2), .buckets :global(.s3) { grid-column: 1 / -1; }
		.hero { padding: 20px; border-radius: 22px; }
		.incomes li { grid-template-columns: 1fr auto; }
		.incomes form { display: grid; grid-column: 1 / -1; grid-template-columns: 1fr 1fr; gap: 8px; }
		.incomes form .btn { grid-column: 1 / -1; justify-content: center; }
	}
</style>
