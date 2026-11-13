<script lang="ts">
	import type { Snippet } from 'svelte';
	import { nzd } from '#lib/money';
	import { tweenMoney } from '#lib/motion.svelte';
	import { isoDate, runway } from '#lib/runway';
	import type { Scored } from '#lib/types';

	const TITLES: Record<Scored['bucket'], string> = { income: 'Income', fixed: 'Fixed', general: 'General', investments: 'Investments', savings: 'Savings', mortgage: 'Mortgage' };
	let { rows, value, budget, from, to, unsorted, onbudget, side }: {
		rows: Scored[]; // general-bucket lines of the current statement
		value: (r: Scored) => number; // the copy's share of a line
		budget: number; // 0 = not set yet
		from: string; to: string;
		unsorted: number; // card total of lines no rule has claimed, counted in full until sorted
		onbudget: (n: number) => void;
		side?: Snippet<[(amount: number) => number]>; // right column; receives the per-day impact of an amount over the days left
	} = $props();

	const today = isoDate(new Date());
	let whatIf = $state('');
	let selected = $state<string | null>(null);
	let editing = $state(false);
	let draft = $state('');
	const CHIPS = [0, 25, 60, 120, 250];
	const whatIfN = $derived(Number(whatIf) || 0);
	const r = $derived(runway(rows, value, budget, from, to, today, whatIfN));
	const sel = $derived(selected ?? r.day);
	const selRows = $derived(rows.filter((x) => x.date === sel && value(x) > 0).sort((a, b) => b.amount - a.amount));
	const selTotal = $derived(selRows.reduce((a, x) => a + value(x), 0));
	const maxSpend = $derived(Math.max(1, ...r.cells.map((c) => c.spend)));
	const safe = tweenMoney(() => Math.max(0, r.safeToday));
	const perDay = (amount: number) => (r.daysLeft > 0 ? amount / r.daysLeft : amount);
	const fmt = (d: string) => new Date(d).toLocaleDateString('en-NZ', { day: 'numeric', month: 'short' });
	const fmtLong = (d: string) => new Date(d).toLocaleDateString('en-NZ', { weekday: 'long', day: 'numeric', month: 'short' });
	const whole = (n: number) => nzd(n).replace(/\.\d+$/, '');
	const dot = (spend: number) => (spend > 0 ? Math.max(7, Math.min(24, Math.sqrt(spend / maxSpend) * 24)) : 4);
	function save(e: SubmitEvent) {
		e.preventDefault();
		const n = Number(draft);
		if (n > 0) { onbudget(n); editing = false; }
	}
</script>

<div class="runway">
	<header class="hero">
		<div class="lead">
			<p class="eyebrow">{r.ended && budget ? 'Left at the end of the cycle' : 'Safe to spend today'}</p>
			{#if !budget || editing}
				<form class="setup" onsubmit={save} aria-label="Set a general spending budget">
					<p class="small">One number that is safe to spend today. Set what your general spending may reach over this cycle; fixed bills and savings are not counted.</p>
					<div class="row">
						<input inputmode="decimal" bind:value={draft} placeholder="1800" aria-label="Budget per statement" />
						<button class="btn" type="submit">Start the runway</button>
						{#if budget}<button class="link" type="button" onclick={() => (editing = false)}>Cancel</button>{/if}
					</div>
				</form>
			{:else}
				<p class={['big', 'num', { neg: (r.ended ? r.left : r.safeToday) < 0 }]}>{r.ended ? nzd(r.left) : whole(safe.current)}</p>
				<div class="chips">
					<span class={['pill', 'pace', { behind: r.pace < -1 }]}><span class="d"></span>{Math.abs(r.pace) < 1 ? 'On pace' : r.pace > 0 ? `${whole(r.pace)} ahead of pace` : `${whole(-r.pace)} behind pace`}</span>
					{#if unsorted > 0}<span class="pill note">{whole(unsorted)} unsorted · counted as mine</span>{/if}
				</div>
			{/if}
		</div>
		{#if budget && !editing}
			<div class="aside">
				{#if !r.ended}<div><strong class="num">{whole(Math.max(0, r.left))}</strong> left this cycle</div><div>{r.daysLeft} {r.daysLeft === 1 ? 'day' : 'days'} to the end of the cycle</div>{/if}
				<button class="link" onclick={() => { draft = String(budget); editing = true; }}>Budget {whole(budget)} · change</button>
			</div>
		{/if}
	</header>

	{#if budget}
		<div class="col">
			<section class="card cal" aria-label="Cycle calendar">
				<div class="phead"><span class="t">Cycle · {fmt(from)} – {fmt(to)}</span><span class="small">Even · {whole(budget)}</span></div>
				<div class="days" role="listbox" aria-label="Days in the cycle">
					{#each r.cells as c (c.date)}
						<button class={['day', { on: sel === c.date, today: c.today }]} role="option" aria-selected={sel === c.date} title="{c.date}: {nzd(c.spend)}" onclick={() => (selected = c.date)}>
							<span class={['n', { past: c.past || c.today }]}>{Number(c.date.slice(8))}</span>
							<span class="well"><span class={['spot', { over: c.spend > c.allowance, none: !c.spend, future: !c.past && !c.today }]} style="transform: scale({dot(c.past || c.today ? c.spend : 0) / 24})"></span></span>
							<span class="proj num">{c.today ? 'today' : !c.past ? whole(c.projected) : ''}</span>
						</button>
					{/each}
				</div>
				<p class="legend"><span><span class="spot"></span>under allowance</span><span><span class="spot over"></span>over</span><span><span class="spot none"></span>projected</span></p>
			</section>

			{#if !r.ended && r.daysLeft > 1}
				<section class="whatif" aria-label="What if I spend today">
					<div class="row">
						<span class="m">If I spend</span>
						<input inputmode="decimal" bind:value={whatIf} placeholder="$0" aria-label="Amount to spend today" />
						<span class="m">today, tomorrow is <strong class={['num', { low: r.tomorrow < r.baselineTomorrow * 0.7 }]}>{whole(Math.max(0, r.tomorrow))}</strong></span>
					</div>
					<div class="chips">
						{#each CHIPS as n (n)}
							<button class={['chip', { on: whatIfN === n && (whatIf !== '' || n === 0) }]} onclick={() => (whatIf = n ? String(n) : '')}>{n ? whole(n) : 'Nothing'}</button>
						{/each}
					</div>
				</section>
			{/if}

			<section class="sel" aria-label="Selected day">
				<p class="phead eyebrow"><span>{sel === today ? 'Today' : sel > r.day ? fmtLong(sel) : fmt(sel)}</span><span class="num">{selRows.length ? nzd(selTotal) : ''}</span></p>
				{#if selRows.length}
					<ul>
						{#each selRows as x (x.id)}
							<li class={{ unsorted: !x.rule }}>
								<span class="ini">{x.details.trim()[0] ?? '?'}</span>
								<span class="txt"><span class="det">{x.details}</span><span class="small">{TITLES[x.bucket]}{#if !x.rule} · unsorted, counted in full{:else if value(x) !== x.amount} · your share of {nzd(x.amount)}{/if}</span></span>
								<b class="num">{nzd(value(x))}</b>
							</li>
						{/each}
					</ul>
				{:else}
					<p class="small empty">{sel > r.day ? 'Nothing yet — the grey figure is what you can safely spend that day.' : 'Nothing counted this day.'}</p>
				{/if}
			</section>
		</div>
	{/if}

	<div class="col side">{@render side?.(perDay)}</div>
</div>

<style>
	.runway { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 28px; align-items: start; }
	.hero { grid-column: 1 / -1; display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; flex-wrap: wrap; }
	.lead { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
	.eyebrow { margin: 0; }
	.big { margin: 0; font-size: clamp(52px, 7vw, 72px); font-weight: 800; letter-spacing: -0.04em; line-height: 0.95; }
	.neg { color: var(--danger); }
	.chips { display: flex; align-items: center; gap: 8px; margin-top: 8px; flex-wrap: wrap; }
	.pill { font-size: 12px; font-weight: 600; padding: 5px 10px; }
	.pace { background: var(--accent-soft); color: var(--accent-deep); }
	.pace .d { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
	.pace.behind { background: var(--danger-soft); color: var(--danger-deep); }
	.note { background: var(--surface-2); color: var(--ink-2); }
	.aside { text-align: right; font-size: 14px; color: var(--ink-2); display: flex; flex-direction: column; gap: 2px; align-items: flex-end; }
	.aside strong { color: var(--ink); font-size: 20px; }
	.setup { display: flex; flex-direction: column; gap: 12px; max-width: 56ch; }
	.setup p { margin: 0; font-size: 15px; }
	.setup .row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
	.setup input { width: 140px; font-weight: 700; }
	.col { display: flex; flex-direction: column; gap: 18px; min-width: 0; }
	.cal { padding: 16px; display: flex; flex-direction: column; gap: 10px; }
	.phead { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; margin: 0; }
	.t { font-weight: 700; font-size: 14px; }
	.days { display: grid; grid-template-columns: repeat(7, 1fr); gap: 3px; }
	.day { display: flex; flex-direction: column; align-items: center; gap: 2px; padding: 5px 0 4px; border: 0; border-radius: var(--r2); background: transparent; transition: background-color 150ms var(--ease); }
	.day:hover { background: var(--surface-2); }
	.day.on { background: var(--accent-soft); }
	.day.today { box-shadow: inset 0 0 0 2px var(--accent); }
	.day .n { font-size: 11px; font-weight: 500; color: var(--ink-3); }
	.day .n.past { color: var(--ink); }
	.day.today .n { font-weight: 800; }
	.well { width: 24px; height: 24px; display: grid; place-items: center; }
	.spot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: var(--accent); }
	.well .spot { width: 24px; height: 24px; transition: transform 300ms var(--ease); }
	.spot.over { background: var(--ink); }
	.spot.none, .spot.future { background: var(--line); }
	.proj { font-size: 9px; height: 10px; color: var(--ink-3); }
	.legend { display: flex; flex-wrap: wrap; gap: 4px 12px; margin: 0; font-size: 11px; color: var(--ink-2); }
	.legend span { display: inline-flex; align-items: center; gap: 4px; }
	.whatif { display: flex; flex-direction: column; gap: 8px; padding: 14px 16px; border-radius: var(--r); background: var(--dark); color: #fff; }
	.whatif .row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
	.whatif .m { font-size: 13px; color: var(--dark-ink-2); }
	.whatif .m:last-child { flex: 1; }
	.whatif input { width: 84px; padding: 6px 10px; border: 1px solid var(--dark-line); background: var(--dark-2); color: #fff; font-weight: 700; font-size: 15px; }
	.whatif input:focus { border-color: var(--accent-light); background: var(--dark-2); }
	.whatif strong { color: var(--accent-light); font-size: 16px; }
	.whatif strong.low { color: #ff8a80; }
	.whatif .chips { gap: 6px; margin: 0; }
	.chip { padding: 5px 11px; border-radius: 999px; border: 1px solid var(--dark-line); background: transparent; color: var(--dark-ink-2); font-size: 12px; font-weight: 600; transition: background-color 150ms var(--ease), color 150ms var(--ease); }
	.chip:hover { background: var(--dark-2); color: #fff; }
	.chip.on { background: var(--accent); border-color: var(--accent); color: #fff; }
	.sel { display: flex; flex-direction: column; gap: 6px; }
	.sel ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
	.sel li { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border: 1px solid var(--line); border-radius: var(--r3); }
	.sel li.unsorted { opacity: 0.6; }
	.ini { width: 32px; height: 32px; border-radius: 10px; background: var(--surface-2); display: grid; place-items: center; font-weight: 700; font-size: 14px; flex: none; text-transform: uppercase; }
	.txt { flex: 1; min-width: 0; display: flex; flex-direction: column; }
	.det { font-weight: 600; font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
	.txt .small { font-size: 12px; }
	.sel b { font-weight: 700; }
	.empty { margin: 0; padding: 6px 2px; }
	@media (max-width: 760px) {
		.runway { grid-template-columns: 1fr; gap: 18px; }
		.hero { order: -2; }
		.side { order: -1; }
		.aside { text-align: left; align-items: flex-start; }
		.aside strong { font-size: 16px; }
	}
</style>
