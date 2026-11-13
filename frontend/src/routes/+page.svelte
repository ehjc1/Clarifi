<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import Account from '#lib/components/Account.svelte';
	import GroupCard from '#lib/components/GroupCard.svelte';
	import Import from '#lib/components/Import.svelte';
	import Lines, { type Filter } from '#lib/components/Lines.svelte';
	import Rules from '#lib/components/Rules.svelte';
	import Runway from '#lib/components/Runway.svelte';
	import Triage from '#lib/components/Triage.svelte';
	import { nzd } from '#lib/money';
	import { tweenMoney } from '#lib/motion.svelte';
	import { Tween } from 'svelte/motion';
	import { expoOut } from 'svelte/easing';
	import { score } from '#lib/rules';
	import { SAMPLE_CSV, SAMPLE_PREV_CSV } from '#lib/sample';
	import { addStatement, auth, connect, data, load, persist, uid } from '#lib/store.svelte';
	import { BUCKETS, type Bucket, type Rule, type Scored, type Txn } from '#lib/types';
	import { BANKS, cardLabel, parseStatement } from '#lib/anz';

	type Copy = 'card' | 'mine' | 'partner';
	const COPIES: { id: Copy; label: string }[] = [
		{ id: 'card', label: 'Card' }, { id: 'mine', label: 'Mine' }, { id: 'partner', label: 'Partner' }
	];
	const TITLES: Record<Bucket, string> = { income: 'Income', fixed: 'Fixed expenses', general: 'General', investments: 'Investments', savings: 'Savings', mortgage: 'Mortgage' };

	let copy = $state<Copy>('mine');
	const held = new SvelteSet<string>();
	const skipped = new SvelteSet<string>();
	let triage = $state(false); // Activity view: the pile opens on demand; on Runway it is always open
	let importOpen = $state(false);
	type View = 'overview' | 'lines' | 'card' | 'rules' | 'pots';
	const VIEWS: View[] = ['overview', 'lines', 'card', 'rules', 'pots'];
	const NAV: { id: View; label: string; icon: string }[] = [
		{ id: 'overview', label: 'Runway', icon: 'M3 3v18h18 M7 14l4-4 4 3 5-6' },
		{ id: 'lines', label: 'Activity', icon: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01' },
		{ id: 'card', label: 'Shared card', icon: 'M2 7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z M2 10h20' },
		{ id: 'rules', label: 'Rules', icon: 'M21 4h-7M10 4H3M21 12h-9M8 12H3M21 20h-5M12 20H3M14 2v4M8 10v4M16 18v4' },
		{ id: 'pots', label: 'Pots', icon: 'M12 2v20 M17 7H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' }
	];
	let view = $state<View>('overview');
	let filter = $state<Filter>('all');
	let adding = $state(false);
	/** #overview · #lines · #lines/<bucket|unsorted|conflicts> · #card · #rules · #pots */
	function readHash() {
		const [v, f] = location.hash.slice(1).split('/');
		view = VIEWS.includes(v as View) ? (v as View) : 'overview';
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
		connect();
		readHash();
		if (location.search.includes('sample') && data.statements.every((st) => st.synthetic)) { loadCsv(SAMPLE_PREV_CSV, true); loadCsv(SAMPLE_CSV, true); } // demo/screenshot entry, never over real data
	});

	const current = $derived(data.statements.find((st) => st.id === data.current) ?? data.statements[data.statements.length - 1]);
	/** Cards present on the current statement; a joint account exports every card in one file. */
	const cards = $derived([...new Set((current?.txns ?? []).map((t) => t.card ?? ''))].filter(Boolean));
	const byCard = (ts: Txn[]) => (data.card && cards.includes(data.card) ? ts.filter((t) => t.card === data.card) : ts);
	const txns = $derived(byCard(current?.txns ?? []));
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
	const unsortedTotal = $derived(unsorted.reduce((a, r) => a + r.amount, 0));
	/** How a rule reads in the Auto-sorting list. */
	const who = (r: Rule) => (r.share === 0 ? 'partner’s' : r.share === 1 ? 'me' : r.share === 0.5 ? 'split' : `${Math.round(r.share * 100)}% me`) + (r.bucket !== 'general' ? ` · ${TITLES[r.bucket].toLowerCase()}` : '');
	const hits = (r: Rule) => scored.filter((x) => x.matches.some((m) => m.id === r.id)).length;
	const codeOf = (r: Rule) => `R${data.rules.findIndex((x) => x.id === r.id) + 1}`;
	const period = $derived.by(() => {
		if (!current) return 'No statement yet';
		const f = (d: string) => new Date(d).toLocaleDateString('en-NZ', { day: 'numeric', month: 'short' });
		return `${f(current.from)} – ${f(current.to)} ${current.to.slice(0, 4)}`;
	});
	/** Per-statement figure on the current copy, for the trend row. */
	const trend = $derived(data.statements.map((st) => {
		const rows = score(byCard(st.txns), data.rules).filter((r) => r.amount > 0 && !(r.amount < 0 && !r.rule));
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
		try { addStatement(parseStatement(text).txns, synthetic); error = ''; }
		catch (e) { error = e instanceof Error ? e.message : String(e); }
	}
	/** Rule edits: remember which rows changed bucket or share so they can hold their glow. */
	function withDiff(fn: () => void) {
		const before = new Map(scored.map((r) => [r.id, `${r.bucket}:${r.share}`]));
		fn(); persist();
		for (const r of score(txns, data.rules)) if (before.get(r.id) !== `${r.bucket}:${r.share}`) held.add(r.id);
	}
	function addRule(r: Omit<Rule, 'id'>) {
		const id = uid();
		withDiff(() => data.rules.push({ id, ...r }));
		if (view === 'rules') go('lines'); // show the rows the new rule moved
		return id;
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

<div class="app">
	<aside>
		<a class="brand" href="#overview"><span class="logo"><span></span></span>Clarifi</a>
		<nav aria-label="Sections">
			{#each NAV as n (n.id)}
				<a href="#{n.id}" class={{ on: view === n.id }} aria-current={view === n.id ? 'page' : undefined}>
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d={n.icon} /></svg>
					{n.label}
					{#if n.id === 'rules' && data.rules.length}<span class="n">{data.rules.length}</span>{/if}
					{#if n.id === 'overview' && unsorted.length}<span class="n">{unsorted.length}</span>{/if}
				</a>
			{/each}
		</nav>
		<div class="aside-foot"><Account /></div>
	</aside>

	<main>
		<div class="tools">
			{#if data.statements.length > 1}
				<nav class="months" aria-label="Statements">
					{#each data.statements as st (st.id)}
						<button class={['pill', { on: st.id === current?.id }]} aria-pressed={st.id === current?.id} onclick={() => { data.current = st.id; persist(); }}>{st.label}</button>
					{/each}
				</nav>
			{:else if current}
				<span class="pill">{period}</span>
			{/if}
			{#if current?.synthetic}<span class="pill status">sample · synthetic data</span>{/if}
			{#if cards.length > 1}
				<div class="seg cards" role="group" aria-label="Which card to read">
					<button class={{ on: !cards.includes(data.card) }} aria-pressed={!cards.includes(data.card)} onclick={() => { data.card = ''; persist(); }}>All cards</button>
					{#each cards as c (c)}
						<button class={{ on: data.card === c }} aria-pressed={data.card === c} title={c} onclick={() => { data.card = c; persist(); }}>{cardLabel(c)}</button>
					{/each}
				</div>
			{/if}
			<span class="grow"></span>
			{#if view !== 'rules' && view !== 'card' && txns.length}
				<div class="seg" role="group" aria-label="Which share to read">
					{#each COPIES as c (c.id)}
						<button class={{ on: copy === c.id }} aria-pressed={copy === c.id} onclick={() => (copy = c.id)}>{c.label}</button>
					{/each}
				</div>
			{/if}
			<button class="btn import" aria-label="Import statement" onclick={() => (importOpen = true)}>
				<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 10V2M4.5 5.5 8 2l3.5 3.5M2.5 10.5v2a1.5 1.5 0 0 0 1.5 1.5h8a1.5 1.5 0 0 0 1.5-1.5v-2"/></svg>
				<span class="import-t">Import statement</span>
			</button>
		</div>
		<Import bind:open={importOpen} />

		{#if error}<p class="error" role="alert">{error}</p>{/if}

		{#if !txns.length}
			<section class="empty" aria-label="Get started">
				<p class="eyebrow">Safe to spend today</p>
				<p class="big num muted">$—</p>
				<p class="lede">Import your ANZ or Amex credit card CSV. Rules decide how much of each line is yours. {auth.user ? 'Saved to your account.' : 'Nothing leaves this browser.'}</p>
				<div class="actions">
					<button class="btn" onclick={() => (importOpen = true)}>Import a statement</button>
					<button class="link accent" onclick={() => { loadCsv(SAMPLE_PREV_CSV, true); loadCsv(SAMPLE_CSV, true); }}>Try with a sample statement</button>
				</div>
			</section>
		{:else if view === 'overview'}
			{#if copy === 'partner'}
				<p class="note small">The runway reads your own share. Switch to Mine or Card to see it.</p>
			{:else}
				<Runway rows={byBucket.general} value={val} budget={data.budget} from={current.from} to={current.to} unsorted={unsortedTotal} onbudget={(n) => { data.budget = n; persist(); }}>
					{#snippet side(perDay)}
						<Triage lines={unsorted} {scored} {perDay} onrule={addRule} onskip={(id) => skipped.add(id)} onundo={(d) => (d.rule ? removeRule(d.rule) : skipped.delete(d.id))} />
						{#if data.rules.length}
							<section class="auto" aria-label="Auto-sorting rules">
								<p class="eyebrow">Auto-sorting</p>
								<ul>
									{#each data.rules as r (r.id)}
										<li><span class="w"><b>{r.text || r.name}</b> → {who(r)}</span><span class="small num">{hits(r)}×</span><button class="x" onclick={() => removeRule(r.id)} aria-label="Remove rule {r.name}">×</button></li>
									{/each}
								</ul>
								<a class="link" href="#rules">All rules</a>
							</section>
						{/if}
					{/snippet}
				</Runway>
			{/if}
		{:else if view === 'lines'}
			{#if triage}
				<div class="pile-card card"><Triage lines={unsorted} {scored} onrule={addRule} onskip={(id) => skipped.add(id)} onundo={(d) => (d.rule ? removeRule(d.rule) : skipped.delete(d.id))} onclose={() => (triage = false)} /></div>
			{/if}
			<Lines scored={scored.filter((r) => !(r.amount < 0 && !r.rule))} {copy} {held} bind:filter {codeOf} onrelease={release} onmakerule={makeRule} onsort={() => { triage = true; window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
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
		{:else if view === 'card'}
			<section class="statements" aria-label="Statements">
				<p class="eyebrow">Statements</p>
				<ul>
					{#each data.statements as st (st.id)}
						{@const banks = [...new Set(st.txns.map((t) => t.source ?? 'anz'))]}
						{@const charges = st.txns.filter((t) => t.amount > 0).reduce((a, t) => a + t.amount, 0)}
						{@const stCards = [...new Set(st.txns.map((t) => t.card ?? ''))].filter(Boolean)}
						<li class={['card', 'st', { on: st.id === current?.id }]}>
							<button class="pick" aria-pressed={st.id === current?.id} onclick={() => { data.current = st.id; persist(); }}>
								<span class="st-l">
									<b>{st.label}</b>
									<span class="small">{new Date(st.from).toLocaleDateString('en-NZ', { day: 'numeric', month: 'short' })} – {new Date(st.to).toLocaleDateString('en-NZ', { day: 'numeric', month: 'short' })} · {st.txns.length} lines</span>
									<span class="banks">{#each banks as b (b)}<span class="pill bank">{BANKS[b]}</span>{/each}{#each stCards as c (c)}<span class="pill bank num" title={c}>{cardLabel(c)}</span>{/each}</span>
								</span>
								<b class="num">{nzd(charges)}</b>
							</button>
						</li>
					{/each}
				</ul>
			</section>
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
			<p class="small"><button class="link" onclick={removeStatement} disabled={!current}>Remove the {current?.label} statement</button></p>
		{:else if view === 'rules'}
			<div class="rules-view">
				<Rules rules={data.rules} {scored} bind:draft bind:adding onadd={addRule} onremove={removeRule} />
			</div>
		{:else}
			<dl class="figures">
				{#if copy === 'mine' || income > 0}
					<div><dt class="eyebrow">Income</dt><dd class="num">{#if income > 0}<a class="figlink" href="#lines/income">{nzd(shownIncome.current)}</a>{:else}<button class="link accent" onclick={focusIncome}>Add an income</button>{/if}</dd></div>
				{/if}
				<div><dt class="eyebrow">Spend</dt><dd class="num">{nzd(shownSpend.current)}</dd></div>
				<div><dt class="eyebrow">Put away</dt><dd class="num">{nzd(shownPut.current)}</dd></div>
				{#if copy === 'mine' && data.incomes.length}<div><dt class="eyebrow">Left over</dt><dd class={['num', { neg: left < 0 }]}>{nzd(shown.current)}</dd></div>{/if}
			</dl>
			<section class="buckets" aria-label="Buckets">
				<GroupCard title="Spend" {copy} parts={[
					{ bucket: 'fixed', title: TITLES.fixed, rows: byBucket.fixed },
					{ bucket: 'general', title: TITLES.general, rows: byBucket.general },
					{ bucket: 'mortgage', title: TITLES.mortgage, rows: byBucket.mortgage }
				]} />
				<GroupCard title="Put away" {copy} parts={[
					{ bucket: 'savings', title: TITLES.savings, rows: byBucket.savings },
					{ bucket: 'investments', title: TITLES.investments, rows: byBucket.investments }
				]} />
			</section>
		{/if}

		<footer class="small">
			<span class={{ err: !!auth.error }}>{auth.error || (auth.user ? `Saved to ${auth.user}’s account and this browser.` : 'Stored in this browser only.')}</span>
			<button class="link" onclick={exportJson}>Export JSON</button>
			<label class="link">Import JSON<input type="file" accept="application/json" onchange={importJson} hidden /></label>
		</footer>
	</main>
</div>

<style>
	:global(body) { background-image: linear-gradient(var(--grid) 1px, transparent 1px), linear-gradient(90deg, var(--grid) 1px, transparent 1px); background-size: 96px 96px; }
	.app { max-width: 1240px; min-height: calc(100vh - 80px); margin: 32px auto 48px; display: flex; background: var(--surface); border: 1px solid var(--line); border-radius: var(--r); box-shadow: var(--shadow); overflow: hidden; }
	aside { width: 220px; flex: none; border-right: 1px solid var(--line); padding: 20px 14px; display: flex; flex-direction: column; gap: 20px; }
	.brand { display: flex; align-items: center; gap: 8px; padding: 0 8px; font-weight: 700; font-size: 17px; letter-spacing: -0.01em; color: inherit; text-decoration: none; }
	.logo { width: 26px; height: 26px; border-radius: 50%; background: var(--accent); display: grid; place-items: center; }
	.logo span { width: 10px; height: 10px; border-radius: 50%; background: #fff; }
	aside nav { display: flex; flex-direction: column; gap: 2px; }
	aside nav a { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: var(--r2); font-size: 14px; font-weight: 600; color: var(--ink-2); text-decoration: none; transition: background-color 150ms var(--ease), color 150ms var(--ease); }
	aside nav a:hover { background: var(--surface-2); color: var(--ink); }
	aside nav a.on { background: var(--accent-soft); color: var(--accent-deep); }
	aside nav .n { margin-left: auto; font-size: 11px; font-weight: 700; padding: 1px 7px; border-radius: 999px; background: var(--surface-2); color: var(--ink-2); }
	aside nav a.on .n { background: var(--accent); color: #fff; }
	.aside-foot { margin-top: auto; }
	main { flex: 1; min-width: 0; padding: 24px 32px 32px; display: flex; flex-direction: column; gap: 24px; }
	.tools { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
	.tools .grow { flex: 1; }
	.months { display: flex; gap: 4px; flex-wrap: wrap; }
	.months .pill { border: 0; cursor: pointer; font-weight: 600; transition: background-color 150ms var(--ease), color 150ms var(--ease); }
	.months .pill:hover { background: var(--line); }
	.months .pill.on { background: var(--ink); color: var(--bg); }
	.status { color: var(--ink-2); }
	.seg { display: inline-flex; padding: 3px; border-radius: 999px; background: var(--surface-2); }
	.seg button { border: 0; background: transparent; border-radius: 999px; padding: 6px 14px; font-weight: 600; font-size: 13px; color: var(--ink-2); transition: background-color 200ms var(--ease), color 200ms var(--ease); }
	.seg button.on { background: var(--surface); color: var(--ink); box-shadow: 0 1px 2px rgba(23, 23, 28, 0.08); }
	.cards button { padding: 6px 12px; }
	.cards button.on { background: var(--accent); color: #fff; }
	.error { margin: 0; padding: 12px 16px; color: var(--danger); background: var(--danger-soft); border-radius: var(--r3); }
	.note { margin: 0; padding: 14px 16px; border-radius: 20px; background: var(--surface-2); }
	.empty { display: flex; flex-direction: column; gap: 4px; }
	.empty .eyebrow { margin: 0; }
	.big { margin: 0; font-size: clamp(52px, 7vw, 72px); font-weight: 800; letter-spacing: -0.04em; line-height: 0.95; }
	.big.muted { color: var(--line); }
	.lede { margin: 12px 0 18px; max-width: 48ch; font-size: 17px; }
	.actions { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
	.auto { display: flex; flex-direction: column; gap: 6px; }
	.auto .eyebrow { margin: 0; }
	.auto ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
	.auto li { display: flex; align-items: center; gap: 8px; font-size: 13px; padding: 8px 12px; border-radius: var(--r2); background: var(--surface-2); }
	.auto .w { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
	.auto .x { border: 0; background: transparent; color: var(--ink-2); font-size: 16px; line-height: 1; padding: 2px 6px; }
	.auto .x:hover { color: var(--ink); }
	.auto .link { align-self: flex-start; text-decoration: none; }
	.pile-card { padding: 20px; }
	.statements .eyebrow { margin: 0 0 8px; }
	.statements ul { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 12px; }
	.st { padding: 0; transition: border-color 150ms var(--ease); }
	.st.on { border-color: var(--accent); box-shadow: inset 0 0 0 1px var(--accent); }
	.pick { width: 100%; display: flex; align-items: center; gap: 12px; padding: 14px 16px; border: 0; background: none; text-align: left; border-radius: inherit; }
	.st-l { flex: 1; display: flex; flex-direction: column; gap: 2px; min-width: 0; }
	.st-l b { font-size: 15px; }
	.banks { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 6px; }
	.bank { font-size: 11px; padding: 2px 8px; background: var(--accent-soft); color: var(--accent-deep); font-weight: 600; }
	.trend { padding: 18px 20px; display: grid; grid-template-columns: minmax(180px, 1fr) minmax(0, 2fr); gap: 24px; align-items: end; }
	.trend-text { display: flex; flex-direction: column; gap: 2px; align-self: start; }
	.trend-text .t { font-weight: 700; }
	.delta { margin: 14px 0 0; font-size: 24px; font-weight: 700; letter-spacing: -0.02em; line-height: 1.1; }
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
	.payments { margin: 0; display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
	.figures { display: flex; gap: 36px; margin: 0; flex-wrap: wrap; }
	.figures div { display: flex; flex-direction: column; gap: 4px; }
	.figures dt { margin: 0; }
	.figures dd { margin: 0; font-size: 32px; font-weight: 800; letter-spacing: -0.03em; line-height: 1; }
	.figures .neg { color: var(--danger); }
	.figlink { color: inherit; text-decoration: none; }
	.figlink:hover { text-decoration: underline; text-underline-offset: 4px; }
	.buckets { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; align-content: start; }
	.rules-view { display: flex; flex-direction: column; gap: 24px; }
	footer { display: flex; flex-wrap: wrap; gap: 16px; align-items: baseline; margin-top: auto; padding-top: 16px; }
	footer label { cursor: pointer; }
	footer > span { flex-basis: 100%; }
	footer .err { color: var(--danger); }
	@media (min-width: 641px) { footer > span { flex-basis: auto; } }
	.incomes { list-style: none; margin: 0 4px 12px; padding: 6px; border-radius: var(--r2); background: var(--surface-2); }
	.incomes li { display: grid; grid-template-columns: 1fr auto auto; gap: 12px; align-items: center; padding: 8px 12px; border-radius: var(--r2); }
	.incomes li:hover { background: var(--surface); }
	.incomes form { display: contents; }
	.incomes form input:first-child { grid-column: 1; }

	@media (max-width: 900px) {
		:global(body) { background-image: none; }
		.app { margin: 0; min-height: 100vh; border: 0; border-radius: 0; box-shadow: none; flex-direction: column; }
		aside { width: auto; border-right: 0; border-bottom: 1px solid var(--line); padding: 14px 16px 10px; display: grid; grid-template-columns: 1fr auto; gap: 12px; align-items: center; }
		.brand { padding: 0; }
		.aside-foot { margin: 0; grid-row: 1; grid-column: 2; }
		aside nav { grid-row: 2; grid-column: 1 / -1; flex-direction: row; overflow-x: auto; gap: 4px; margin: 0 -16px; padding: 0 16px; scrollbar-width: none; }
		aside nav a { flex: none; padding: 7px 12px; font-size: 13px; }
		aside nav a .n { margin-left: 2px; }
		main { padding: 18px 16px 28px; gap: 18px; }
		.import { padding: 10px 12px; }
		.import-t { display: none; }
		.seg { order: 5; flex-basis: 100%; }
		.cards { order: 4; }
		.seg button { flex: 1; }
		.buckets { grid-template-columns: 1fr; }
		.trend { grid-template-columns: 1fr; }
		.bars { justify-content: start; }
		.figures { gap: 20px; }
		.figures dd { font-size: 26px; }
		.incomes li { grid-template-columns: 1fr auto; }
		.incomes form { display: grid; grid-column: 1 / -1; grid-template-columns: 1fr 1fr; gap: 8px; }
		.incomes form .btn { grid-column: 1 / -1; justify-content: center; }
	}
</style>
