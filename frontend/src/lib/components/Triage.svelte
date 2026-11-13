<script lang="ts">
	import { untrack } from 'svelte';
	import { BANKS } from '#lib/anz';
	import { nzd } from '#lib/money';
	import { composeRule, describe } from '#lib/rules';
	import { pull, swipeAction, type Swipe } from '#lib/swipe';
	import { BUCKETS, type Bucket, type Rule, type Scored } from '#lib/types';

	type Done = { id: string; rule?: string }; // line answered; the rule it wrote, or a skip when absent
	let { lines, scored, perDay, onrule, onskip, onundo, onclose }: {
		lines: Scored[]; // unsorted lines, in statement order
		scored: Scored[]; // every line, to detect rules that already claim a match
		perDay?: (amount: number) => number; // what an amount is worth per remaining day of the runway
		onrule: (r: Omit<Rule, 'id'>) => string;
		onskip: (id: string) => void;
		onundo: (d: Done) => void;
		onclose?: () => void;
	} = $props();

	const TITLES: Record<Bucket, string> = { income: 'Income', fixed: 'Fixed', general: 'General', investments: 'Investments', savings: 'Savings', mortgage: 'Mortgage' };
	const CHOICES: { key: string; label: string; share: number; swipe: Swipe }[] = [
		{ key: '1', label: 'Partner’s', share: 0, swipe: 'partner' },
		{ key: '2', label: 'Split', share: 0.5, swipe: 'split' },
		{ key: '3', label: 'Mine', share: 1, swipe: 'mine' }
	];
	const STAMPS: Record<Swipe, string> = { partner: 'Partner’s', split: 'Split', mine: 'Mine', skip: 'Skip' };
	const THROW: Record<Swipe, string> = { mine: 'translate(140%, -8%) rotate(16deg)', partner: 'translate(-140%, -8%) rotate(-16deg)', split: 'translate(0, -160%)', skip: 'translate(0, 160%)' };
	const reduced = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
	let bucket = $state<Bucket>('general');
	const total = untrack(() => lines.length); // snapshot at open: one answer may sort several lines
	const done = $derived(total - lines.length);
	const line = $derived(lines[0]);
	const next = $derived(lines[1]);
	let history = $state<Done[]>([]);
	/** Merchant stem: drop a trailing token carrying digits (store or terminal numbers). */
	const stem = $derived(line ? line.details.replace(/\s+\S*\d\S*$/g, '').trim() : '');
	/** Other unsorted lines the same answer would sort at once. */
	const alike = $derived(line ? lines.filter((l) => l.id !== line.id && l.details.toLowerCase().includes(stem.toLowerCase())).length : 0);
	const whole = (n: number) => nzd(n).replace(/\.\d+$/, '');
	const today = new Date(); today.setHours(0, 0, 0, 0);
	function when(d: string) {
		const diff = Math.round((today.getTime() - new Date(d).getTime()) / 864e5);
		return diff === 0 ? 'Today' : diff === 1 ? 'Yesterday' : new Date(d).toLocaleDateString('en-NZ', { weekday: 'short', day: 'numeric', month: 'short' });
	}

	// ── swipe: drag the line card; past the threshold it is thrown off in that direction
	let drag = $state<{ x0: number; y0: number; dx: number; dy: number } | null>(null);
	let fly = $state<Swipe | null>(null);
	const d = $derived(drag ?? { dx: 0, dy: 0 });
	const transform = $derived(fly ? THROW[fly] : `translate(${d.dx}px, ${d.dy}px) rotate(${d.dx / 20}deg)`);
	const stamp = $derived<Record<Swipe, number>>(fly ? { mine: +(fly === 'mine'), partner: +(fly === 'partner'), split: +(fly === 'split'), skip: +(fly === 'skip') } : { mine: pull(d.dx), partner: pull(-d.dx), split: pull(-d.dy), skip: pull(d.dy) });
	function down(e: PointerEvent) {
		if (fly || e.button !== 0) return;
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
		drag = { x0: e.clientX, y0: e.clientY, dx: 0, dy: 0 };
	}
	function move(e: PointerEvent) {
		if (drag) drag = { ...drag, dx: e.clientX - drag.x0, dy: e.clientY - drag.y0 };
	}
	function up() {
		if (!drag) return;
		const act = swipeAction(drag.dx, drag.dy);
		drag = null;
		if (act) act === 'skip' ? skip() : choose(CHOICES.find((c) => c.swipe === act)!.share, act);
	}
	/** Throw the card first, then answer, so the next line enters after this one has left. */
	function thrown(act: Swipe, fn: () => void) {
		if (fly) return;
		if (reduced) return fn();
		fly = act;
		setTimeout(() => { fly = null; fn(); }, 220);
	}

	/** Preview of the rule each choice would write; shares differ only in the share field, bounds depend on it. */
	const preview = $derived(line ? composeRule(stem, 1, bucket, scored) : null);
	function choose(share: number, act: Swipe = CHOICES.find((c) => c.share === share)!.swipe) {
		if (!line) return;
		const id = line.id, rule = composeRule(stem, share, bucket, scored).rule;
		thrown(act, () => { history.push({ id, rule: onrule(rule) }); bucket = 'general'; });
	}
	function skip() {
		if (!line) return;
		const id = line.id;
		thrown('skip', () => { onskip(id); history.push({ id }); });
	}
	function undo() {
		const last = history.pop();
		if (last) onundo(last);
	}
	function keys(e: KeyboardEvent) {
		if ((e.target as HTMLElement).tagName === 'INPUT') return;
		const c = CHOICES.find((x) => x.key === e.key);
		if (c) { e.preventDefault(); choose(c.share); }
		else if (e.key === 's') skip();
		else if (e.key === 'z') undo();
		else if (e.key === 'Escape') onclose?.();
	}
</script>

<svelte:window onkeydown={keys} />

<section class="pile" aria-label="Sort unsorted lines">
	{#if line}
		<header>
			<span class="t">{lines.length} unsorted {lines.length === 1 ? 'line' : 'lines'} to sort</span>
			<span class="acts">
				{#if total > 1}<span class="small">{done} / {total}</span>{/if}
				<button class="link accent" onclick={undo} disabled={!history.length}>Undo</button>
				{#if onclose}<button class="link" onclick={onclose}>Close</button>{/if}
			</span>
		</header>
		<div class="deck">
			{#if next}<div class="ghost" aria-hidden="true"></div>{/if}
			{#key line.id}
				<div class={['line', { drag, fly }]} style="transform: {transform}" onpointerdown={down} onpointermove={move} onpointerup={up} onpointercancel={up}>
					<div class="meta"><span><span class="dot" style="--c: var(--b-{bucket})"></span>{TITLES[bucket]}</span><span>{when(line.date)} · {BANKS[line.source ?? 'anz']}</span></div>
					<div class="mid">
						<div class="row">
							<span class="ini">{line.details.trim()[0] ?? '?'}</span>
							<span class="det">{line.details}</span>
							<span class="amt num">{nzd(line.amount)}</span>
						</div>
						<p class="impact small">
							{#if perDay}Partner’s → +{whole(perDay(line.amount))}/day · Split → +{whole(perDay(line.amount / 2))}/day{/if}
							{#if alike}{#if perDay} · {/if}+ {alike} more {alike === 1 ? 'line' : 'lines'} like this{/if}
						</p>
					</div>
					<div class="legend"><span>← Partner’s</span><span>↑ Split · ↓ Skip</span><span>Mine →</span></div>
					{#each Object.entries(STAMPS) as [k, label] (k)}
						<span class={['stamp', k]} style="opacity: {stamp[k as Swipe]}" aria-hidden="true">{label}</span>
					{/each}
				</div>
			{/key}
		</div>
		<div class="choices">
			<button class="c" onclick={() => choose(0)}>Partner’s<kbd>1</kbd></button>
			<button class="c skip" onclick={skip}>Skip<kbd>S</kbd></button>
			<button class="c" onclick={() => choose(0.5)}>Split<kbd>2</kbd></button>
			<button class="c me" onclick={() => choose(1)}>Mine<kbd>3</kbd></button>
		</div>
		<div class="foot">
			<span class="buckets" role="radiogroup" aria-label="Bucket">
				{#each BUCKETS as b (b)}
					<button class={['pill', 'b', { on: bucket === b }]} role="radio" aria-checked={bucket === b} style="--c: var(--b-{b})" onclick={() => (bucket = b)}><span class="dot"></span>{TITLES[b]}</button>
				{/each}
			</span>
			<span class="small">Rule: details {preview ? describe(preview.rule) : ''}{#if preview?.note} · <b class="note">{preview.note}</b>{/if}</span>
		</div>
	{:else}
		<div class="done"><span class="tick">✓</span><span>All sorted — this number is exact.</span>{#if onclose}<button class="link accent" onclick={onclose}>Close</button>{/if}</div>
	{/if}
</section>

<style>
	.pile { display: flex; flex-direction: column; gap: 10px; }
	header { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; }
	.t { font-weight: 700; font-size: 15px; }
	.acts { display: flex; align-items: baseline; gap: 12px; }
	.deck { position: relative; height: 172px; touch-action: none; }
	.ghost { position: absolute; inset: 0; transform: scale(0.95) translateY(12px); background: var(--surface); border: 1px solid var(--line); border-radius: var(--r); opacity: 0.8; }
	.line {
		position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: space-between; padding: 18px 20px; border-radius: var(--r);
		background: var(--surface); border: 1px solid var(--line); box-shadow: 0 12px 30px -16px rgba(23, 23, 28, 0.35);
		cursor: grab; user-select: none; animation: in 300ms var(--ease); transition: transform 240ms cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.line.drag { cursor: grabbing; transition: none; }
	.line.fly { transition: transform 320ms ease-in; }
	@media (prefers-reduced-motion: reduce) { .line, .line.fly { transition: none; animation: none; } }
	@keyframes in { from { opacity: 0; transform: translateY(6px); } }
	.meta { display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: var(--ink-2); }
	.meta > span { display: inline-flex; align-items: center; gap: 6px; }
	.meta .dot { width: 8px; height: 8px; }
	.mid { display: flex; flex-direction: column; gap: 6px; }
	.row { display: flex; align-items: center; gap: 12px; }
	.ini { width: 40px; height: 40px; border-radius: 12px; background: var(--dark); color: #fff; display: grid; place-items: center; font-weight: 800; font-size: 18px; flex: none; text-transform: uppercase; }
	.det { flex: 1; min-width: 0; font-weight: 700; font-size: 17px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
	.amt { flex: none; font-weight: 800; font-size: 22px; letter-spacing: -0.02em; }
	.impact { margin: 0; font-size: 12px; line-height: 1.3; min-height: 1.3em; }
	.legend { display: flex; justify-content: space-between; font-size: 11px; color: var(--ink-3); }
	.stamp { position: absolute; padding: 4px 10px; border: 2px solid var(--ink-2); border-radius: 999px; font-size: 12px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: var(--ink-2); background: var(--surface); pointer-events: none; transition: opacity 100ms; }
	.stamp.mine { top: 14px; right: 16px; transform: rotate(8deg); border-color: var(--accent); color: var(--accent); }
	.stamp.partner { top: 14px; left: 16px; transform: rotate(-8deg); border-color: var(--ink); color: var(--ink); }
	.stamp.split { left: 50%; top: 50%; transform: translate(-50%, -50%); }
	.stamp.skip { left: 50%; bottom: 14px; transform: translateX(-50%); border-color: var(--line); }
	.choices { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; }
	.c { display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 9px 4px; border: 1px solid var(--line); border-radius: 14px; background: var(--surface); font-weight: 700; font-size: 13px; color: var(--ink); transition: background-color 150ms var(--ease); }
	.c:hover { background: var(--surface-2); }
	.c.skip { font-weight: 600; color: var(--ink-2); }
	.c.me { background: var(--accent); border-color: var(--accent); color: #fff; }
	.c.me:hover { background: var(--accent-hover); }
	kbd { font-family: inherit; font-size: 10px; font-weight: 600; padding: 0 5px; border-radius: 999px; background: var(--surface-2); color: var(--ink-2); }
	.c.me kbd { background: rgba(255, 255, 255, 0.2); color: #fff; }
	@media (hover: none), (pointer: coarse) { kbd { display: none; } }
	.foot { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 8px 16px; }
	.foot .small { font-size: 12px; }
	.buckets { display: flex; flex-wrap: wrap; gap: 4px; }
	.pill.b { border: 0; cursor: pointer; color: var(--ink-2); font-size: 12px; padding: 3px 9px; }
	.pill.b.on { background: color-mix(in srgb, var(--c) 16%, transparent); color: var(--ink); font-weight: 600; }
	.pill.b .dot { width: 8px; height: 8px; }
	.note { color: var(--ink); font-weight: 600; }
	.done { display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-radius: 20px; background: var(--surface-2); font-size: 13px; color: var(--ink-2); }
	.done span:nth-child(2) { flex: 1; color: var(--ink); }
	.tick { width: 30px; height: 30px; border-radius: 50%; background: var(--accent); color: #fff; display: grid; place-items: center; font-weight: 800; flex: none; }
</style>
