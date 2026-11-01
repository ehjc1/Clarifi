<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import { parseAnz } from '#lib/anz';
	import BucketLine from '#lib/components/BucketLine.svelte';
	import Lines, { type Filter } from '#lib/components/Lines.svelte';
	import Rules from '#lib/components/Rules.svelte';
	import Triage from '#lib/components/Triage.svelte';
	import { nzd } from '#lib/money';
	import { tweenMoney } from '#lib/motion.svelte';
	import { Tween } from 'svelte/motion';
	import { expoOut } from 'svelte/easing';
	import { score } from '#lib/rules';
	import { SAMPLE_CSV, SAMPLE_PREV_CSV } from '#lib/sample';
	import { data, load, makeStatement, persist, uid } from '#lib/store.svelte';
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
	type View = 'overview' | 'lines' | 'rules';
	let view = $state<View>('overview');
	let filter = $state<Filter>('all');
	let adding = $state(false);
	/** #overview · #lines · #lines/<bucket|unsorted|conflicts> · #rules */
	function readHash() {
		const [v, f] = location.hash.slice(1).split('/');
		view = v === 'rules' || v === 'lines' ? v : 'overview';
		if (v === 'lines') filter = (f as Filter) || 'all';
	}
	const go = (v: View, f?: Filter) => { location.hash = f ? `${v}/${f}` : v; };
	let error = $state('');
	let draft = $state({ text: '', min: '', max: '', share: '0', bucket: 'general' as Bucket, name: '' });
	let incomeDraft = $state({ name: '', amount: '' });
	async function focusIncome() {
		go('lines', 'income');
		await tick();
		document.getElementById('income-name')?.focus();
	}

	onMount(() => {
		Object.assign(data, load());
		readHash();
		if (location.search.includes('sample') && data.statements.every((st) => st.synthetic)) { loadCsv(SAMPLE_PREV_CSV, true); loadCsv(SAMPLE_CSV, true); } // demo/screenshot entry, never over real data
	});

	const current = $derived(data.statements.find((st) => st.id === data.current) ?? data.statements[data.statements.length - 1]);
	const txns = $derived(current?.txns ?? []);
	const scored = $derived(score(txns, data.rules));
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
		if (!current) return 'No statement yet';
		const f = (d: string) => new Date(d).toLocaleDateString('en-NZ', { day: 'numeric', month: 'short' });
		return `${f(current.from)} – ${f(current.to)} ${current.to.slice(0, 4)}`;
	});
	/** Per-statement figure on the current copy, for the trend row. */
	const trend = $derived(data.statements.map((st) => {
		const rows = score(st.txns, data.rules).filter((r) => r.amount > 0 && !(r.amount < 0 && !r.rule));
		const v = rows.reduce((a, r) => a + (copy === 'card' ? r.amount : copy === 'mine' ? r.mine : r.amount - r.mine), 0);
		return { id: st.id, label: st.label, value: v, current: st.id === current?.id };
	}));
	const trendMax = $derived(Math.max(1, ...trend.map((t) => t.value)));
	/** Trend values count to new figures on copy switch; a change in statement count snaps. */
	const trendShown = new Tween<number[]>([], { duration: 500, easing: expoOut });
	$effect(() => {
		const next = trend.map((t) => t.value);
		if (next.length !== trendShown.current.length) trendShown.set(next, { duration: 0 });
		else trendShown.target = next;
	});
	const prev = $derived.by(() => {
		const i = trend.findIndex((t) => t.current);
		return i > 0 ? trend[i - 1] : null;
	});
	const delta = $derived(prev ? trend.find((t) => t.current)!.value - prev.value : 0);

	function loadCsv(text: string, synthetic = false) {
		try {
			const txns = parseAnz(text);
			if (!txns.length) throw new Error('No transactions found in that file.');
			const st = makeStatement(txns, synthetic);
			data.statements = [...data.statements.filter((x) => x.id !== st.id), st].sort((a, b) => a.id.localeCompare(b.id));
			data.current = st.id; error = ''; persist();
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
		for (const r of score(txns, data.rules)) if (before.get(r.id) !== `${r.bucket}:${r.share}`) held.add(r.id);
	}
	function addRule(r: Omit<Rule, 'id'>) {
		withDiff(() => data.rules.push({ id: uid(), ...r }));
		if (view === 'rules') go('lines'); // show the rows the new rule moved
	}
	const removeRule = (id: string) => withDiff(() => (data.rules = data.rules.filter((r) => r.id !== id)));
	const release = (id: string) => held.delete(id);
	function makeRule(details: string) {
		draft.text = details.replace(/\s+\S*\d\S*$/g, '').trim(); // drop trailing store numbers
		adding = true;
		go('rules');
		window.scrollTo({ top: 0, behavior: 'smooth' });
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
	function removeStatement() {
		if (!current || !confirm(`Remove the ${current.label} statement? Rules and incomes stay.`)) return;
		data.statements = data.statements.filter((st) => st.id !== current.id);
		data.current = data.statements[data.statements.length - 1]?.id ?? '';
		persist();
	}
</script>

<svelte:head><title>Clarifi</title></svelte:head>
<svelte:window onhashchange={readHash} />

<main>
	<header>
		<span class="wordmark">Clarifi</span>
		<nav class="views" aria-label="Sections">
			<a href="#overview" class={{ on: view === 'overview' }} aria-current={view === 'overview' ? 'page' : undefined}>Overview</a>
			<a href="#lines" class={{ on: view === 'lines' }} aria-current={view === 'lines' ? 'page' : undefined}>Lines</a>
			<a href="#rules" class={{ on: view === 'rules' }} aria-current={view === 'rules' ? 'page' : undefined}>Rules <span class="n">{data.rules.length}</span></a>
		</nav>
		{#if view !== 'rules'}
		<div class="seg" role="group" aria-label="Which share to read">
			{#each COPIES as c (c.id)}
				<button class={{ on: copy === c.id }} aria-pressed={copy === c.id} onclick={() => (copy = c.id)}>{c.label}</button>
			{/each}
		</div>
		{/if}
		<label class="btn import" aria-label="Import statement">
			<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 10V2M4.5 5.5 8 2l3.5 3.5M2.5 10.5v2a1.5 1.5 0 0 0 1.5 1.5h8a1.5 1.5 0 0 0 1.5-1.5v-2"/></svg>
			<span class="import-t">Import statement</span>
			<input type="file" accept=".csv,text/csv" onchange={onfile} />
		</label>
	</header>

	{#if error}<p class="error card" role="alert">{error}</p>{/if}

	{#if view === 'overview'}
	<section class="hero card" aria-label="Net position">
		<div class="hero-main">
			<div class="hero-top">
				{#if data.statements.length > 1}
					<nav class="months" aria-label="Statements">
						{#each data.statements as st (st.id)}
							<button class={['pill', 'period', { on: st.id === current?.id }]} aria-pressed={st.id === current?.id} onclick={() => { data.current = st.id; persist(); }}>{st.label}</button>
						{/each}
					</nav>
				{:else}
					<span class="pill period">{period}</span>
				{/if}
				{#if current?.synthetic}<span class="pill period status">sample · synthetic data</span>{/if}
			</div>
			{#if !txns.length}
				<p class="hero-label">Your share of the card, by bucket</p>
				<p class="lede">Import your ANZ credit card CSV. Rules decide how much of each line is yours. Nothing leaves this browser.</p>
				<button class="btn dark" onclick={() => { loadCsv(SAMPLE_PREV_CSV, true); loadCsv(SAMPLE_CSV, true); }}>Try with a sample statement</button>
			{:else}
				<p class="hero-label">
					{#if copy === 'card'}Everything on the card{:else if copy === 'partner'}Partner's share{:else if !data.incomes.length}My share of the card{:else}Left over this statement{/if}
					{#if data.statements.length > 1}<span class="dim">· {period}</span>{/if}
				</p>
				<p class={['big', 'num', { neg: headline < 0 }]}>{nzd(shown.current)}</p>
				{#if unsorted.length && !triage}
					<button class="btn dark sort" onclick={() => (triage = true)}>Sort {unsorted.length} unsorted {unsorted.length === 1 ? 'line' : 'lines'}</button>
				{/if}
			{/if}
		</div>
		{#if txns.length}
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
			<BucketLine bucket="income" title={TITLES.income} color="var(--b-income)" rows={byBucket.income} extra={incomeTotal} total={barTotal} emptyText="No income entered yet" {copy} />
			{#each ['fixed', 'general', 'investments', 'savings', 'mortgage'] as const as b (b)}
				<BucketLine bucket={b} title={TITLES[b]} color="var(--b-{b})" rows={byBucket[b]} total={barTotal} {copy} />
			{/each}
			{#if trend.length > 1}
				<section class="trend card" aria-label="Spend by statement">
					<div class="trend-text">
						<span class="t">Over time</span>
						<span class="small">{copy === 'card' ? 'card total' : copy === 'mine' ? 'my share' : "partner's share"} per statement</span>
						{#if prev}
							<p class={['delta', 'num', { up: delta > 0 }]}>{delta > 0 ? '+' : delta < 0 ? '−' : ''}{nzd(Math.abs(delta))}</p>
							<p class="small">vs {prev.label}</p>
						{:else}
							<p class="delta muted">First statement</p>
							<p class="small">nothing earlier to compare</p>
						{/if}
					</div>
					<ol class="bars">
						{#each trend as t, i (t.id)}
							<li>
								<button class={{ on: t.current }} aria-pressed={t.current} onclick={() => { data.current = t.id; persist(); }}>
									<span class="num v">{nzd(trendShown.current[i] ?? t.value)}</span>
									<span class="bar"><span style="transform: scaleY({t.value / trendMax})"></span></span>
									<span class="l">{t.label}</span>
								</button>
							</li>
						{/each}
					</ol>
				</section>
			{/if}
			{#if payments.length}
				<p class="payments small">
					Payments to the card, not counted:
					{#each payments as r (r.id)}<span class="pill">{r.details} · {nzd(-r.amount)}</span>{/each}
				</p>
			{/if}
		</section>

	</div>
	{:else if view === 'lines'}
	<Lines scored={scored.filter((r) => !(r.amount < 0 && !r.rule))} {copy} {held} bind:filter {codeOf} onrelease={release} onmakerule={makeRule}>
		{#snippet income()}
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
		{/snippet}
	</Lines>
	{:else}
	<div class="rules-view">
		<Rules rules={data.rules} {scored} bind:draft bind:adding onadd={addRule} onremove={removeRule} />
	</div>
	{/if}

	<footer class="small">
		<span>Stored in this browser only.</span>
		<button class="link" onclick={exportJson}>Export JSON</button>
		<label class="link">Import JSON<input type="file" accept="application/json" onchange={importJson} hidden /></label>
		<button class="link" onclick={removeStatement} disabled={!current}>Remove this statement</button>
	</footer>
</main>

<style>
	main { max-width: 1240px; margin: 0 auto; padding: 20px 24px 48px; }
	header { display: flex; align-items: center; gap: 16px; padding: 8px 0 20px; }
	.wordmark { font-weight: 700; font-size: 20px; letter-spacing: -0.03em; }
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
	.months { display: flex; gap: 4px; flex-wrap: wrap; }
	.months .pill { border: 0; cursor: pointer; background: transparent; font-weight: 600; transition: background-color 150ms var(--ease), color 150ms var(--ease); }
	.months .pill:hover { background: rgba(4, 46, 40, 0.18); }
	.months .pill.on { background: var(--accent-ink); color: var(--accent); }
	.hero-top .status { margin-left: auto; }
	.hero-label .dim { opacity: 0.7; font-weight: 500; }
	.trend { grid-column: 1 / -1; padding: 18px 20px; display: grid; grid-template-columns: minmax(180px, 1fr) minmax(0, 2fr); gap: 24px; align-items: end; }
	.trend-text { display: flex; flex-direction: column; gap: 2px; align-self: start; }
	.trend-text .t { font-weight: 600; }
	.delta { margin: 14px 0 0; font-size: 24px; font-weight: 600; letter-spacing: -0.02em; line-height: 1.1; }
	.delta.up { color: var(--danger); }
	.delta.muted { color: var(--ink-2); font-weight: 500; }
	.bars { list-style: none; margin: 0; padding: 0; display: grid; grid-auto-flow: column; grid-auto-columns: minmax(88px, 120px); justify-content: end; gap: 12px; height: 150px; overflow-x: auto; }
	.bars li { height: 100%; }
	.bars button { display: grid; grid-template-rows: auto 1fr auto; gap: 6px; height: 100%; width: 100%; border: 0; background: none; padding: 0; text-align: center; border-radius: var(--r2); }
	.bars button:hover .bar span { background: var(--ink-2); }
	.bars .v { font-size: 13px; color: var(--ink-2); align-self: end; }
	.bars .l { font-size: 13px; font-weight: 500; color: var(--ink-2); }
	.bars button.on .v, .bars button.on .l { color: var(--ink); font-weight: 600; }
	.bars .bar { display: block; height: 100%; border-radius: var(--r2); background: var(--surface-2); overflow: hidden; }
	.bars .bar span { display: block; height: 100%; border-radius: inherit; background: var(--line); transform-origin: bottom; transition: transform 400ms var(--ease), background-color 150ms var(--ease); }
	.bars button.on .bar span { background: var(--accent); }
	.hero-label { margin: 0; font-weight: 600; font-size: 15px; opacity: 0.8; }
	.big { margin: 2px 0 0; font-size: clamp(40px, 6vw, 64px); font-weight: 700; letter-spacing: -0.04em; line-height: 1.05; }
	.big.neg::before { content: ''; }
	.lede { margin: 8px 0 18px; max-width: 48ch; font-size: 17px; }
	.btn.dark { background: var(--accent-ink); color: var(--accent); }
	.sort { margin-top: 16px; }
	.grid { margin-top: 24px; }
	.views { display: flex; gap: 2px; margin-right: auto; }
	.views a { text-decoration: none; border-radius: 999px; padding: 7px 14px; font-weight: 600; font-size: 15px; color: var(--ink-2); display: inline-flex; align-items: center; gap: 6px; transition: color 150ms var(--ease), background-color 150ms var(--ease); }
	.views a:hover { color: var(--ink); }
	.views a.on { color: var(--ink); background: var(--surface); box-shadow: var(--shadow); }
	.views .n { font-size: 12px; padding: 1px 7px; border-radius: 999px; background: var(--surface-2); color: var(--ink-2); }
	.views a.on .n { background: var(--accent-soft); color: var(--ink); }
	.rules-view { display: flex; flex-direction: column; gap: 24px; }
	footer { display: flex; flex-wrap: wrap; gap: 16px; align-items: baseline; margin-top: 32px; }
	footer label { cursor: pointer; }
	footer > span { flex-basis: 100%; }
	@media (min-width: 641px) { footer > span { flex-basis: auto; } }
	.buckets { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; align-content: start; }
	.payments { grid-column: 1 / -1; margin: 4px 4px 0; display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
	.incomes { list-style: none; margin: 0 4px 12px; padding: 0 0 12px; border-bottom: 1px solid var(--line); }
	.incomes li { display: grid; grid-template-columns: 1fr auto auto; gap: 12px; align-items: center; padding: 8px 12px; border-radius: var(--r2); }
	.incomes li:hover { background: var(--surface-2); }
	.incomes form { display: contents; }
	.incomes form input:first-child { grid-column: 1; }
	@media (max-width: 1024px) { .buckets { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
	@media (max-width: 640px) {
		main { padding: 12px 14px 40px; }
		header { flex-wrap: wrap; gap: 10px; }
		.views { order: 2; }
		.import { order: 3; margin-left: auto; }
		.seg { order: 4; flex-basis: 100%; }
		.seg button { flex: 1; }
		.import { padding: 10px 12px; }
		.import-t { display: none; }
		.hero { grid-template-columns: 1fr; align-items: start; }
		.figures { gap: 20px; flex-wrap: wrap; padding: 0; }
		.figures dd { font-size: 20px; }
		.buckets { grid-template-columns: 1fr; }
		.hero { padding: 20px; border-radius: 22px; }
		.trend { grid-template-columns: 1fr; }
		.bars { justify-content: start; }
		.incomes li { grid-template-columns: 1fr auto; }
		.incomes form { display: grid; grid-column: 1 / -1; grid-template-columns: 1fr 1fr; gap: 8px; }
		.incomes form .btn { grid-column: 1 / -1; justify-content: center; }
	}
</style>
