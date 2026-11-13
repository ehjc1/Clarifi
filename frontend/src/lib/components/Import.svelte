<script lang="ts">
	import { BANKS, cardLabel, parseStatement } from '#lib/anz';
	import { nzd } from '#lib/money';
	import { addStatement, data, makeStatement } from '#lib/store.svelte';
	import type { Bank, Txn } from '#lib/types';

	let { open = $bindable(false) }: { open: boolean } = $props();

	type Parsed = { name: string; bank: Bank; txns: Txn[]; error: string; label: string; from: string; to: string; charges: number; credits: number; note: string };
	let files = $state<Parsed[]>([]);
	let over = $state(false);
	let dialog: HTMLDialogElement;
	let input: HTMLInputElement;

	$effect(() => { if (open && !dialog.open) dialog.showModal(); else if (!open && dialog.open) dialog.close(); });
	const ready = $derived(files.filter((f) => !f.error));

	function describe(name: string, text: string): Parsed {
		const base = { name, bank: 'anz' as Bank, txns: [], error: '', label: '', from: '', to: '', charges: 0, credits: 0, note: '' };
		try {
			const { bank, txns } = parseStatement(text, name);
			if (!txns.length) throw new Error('No transactions found in this file.');
			const st = makeStatement(txns);
			const old = data.statements.find((s) => s.id === st.id && !s.synthetic);
			const same = old?.txns.filter((t) => (t.source ?? 'anz') === bank).length ?? 0;
			const cards = [...new Set(txns.map((t) => t.card ?? ''))].filter(Boolean);
			const note = (same ? `Replaces ${same} ${BANKS[bank]} lines in ${st.label}` : old ? `Joins the ${st.label} statement` : `New ${st.label} statement`) + (cards.length > 1 ? ` · ${cards.length} cards: ${cards.map(cardLabel).join(', ')}` : '');
			return { ...base, bank, txns, label: st.label, from: st.from, to: st.to, note,
				charges: txns.filter((t) => t.amount > 0).reduce((a, t) => a + t.amount, 0),
				credits: -txns.filter((t) => t.amount < 0).reduce((a, t) => a + t.amount, 0) };
		} catch (e) { return { ...base, error: e instanceof Error ? e.message : String(e) }; }
	}
	async function take(list: FileList | null | undefined) {
		if (!list) return;
		const next = await Promise.all([...list].map(async (f) => describe(f.name, await f.text())));
		files = [...files.filter((f) => !next.some((n) => n.name === f.name)), ...next];
	}
	function confirm() {
		for (const f of ready) addStatement(f.txns);
		close();
	}
	function close() { open = false; files = []; over = false; }
	const day = (d: string) => new Date(d).toLocaleDateString('en-NZ', { day: 'numeric', month: 'short' });
</script>

<dialog bind:this={dialog} class="card" aria-labelledby="import-title" onclose={close} onclick={(e) => { if (e.target === dialog) close(); }}>
	<div class="body">
		<header>
			<h2 id="import-title">Import a statement</h2>
			<p class="small">ANZ or Amex credit card CSV. Both cards for one month read as one statement; a card re-imported for the same month replaces its lines.</p>
		</header>

		<button type="button" class={['drop', { over }]}
			ondragover={(e) => { e.preventDefault(); over = true; }} ondragleave={() => (over = false)}
			ondrop={(e) => { e.preventDefault(); over = false; take(e.dataTransfer?.files); }}
			onclick={() => input.click()}>
			<svg width="28" height="28" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 10V2M4.5 5.5 8 2l3.5 3.5M2.5 10.5v2a1.5 1.5 0 0 0 1.5 1.5h8a1.5 1.5 0 0 0 1.5-1.5v-2"/></svg>
			<span class="drop-t">Drop CSV files here</span>
			<span class="small">or <u>choose files</u> · ANZ and Amex</span>
			<input bind:this={input} type="file" accept=".csv,text/csv" multiple hidden onchange={(e) => { take(e.currentTarget.files); e.currentTarget.value = ''; }} />
		</button>

		{#if files.length}
			<ul class="files">
				{#each files as f (f.name)}
					<li class={{ bad: !!f.error }}>
						<div class="row">
							<span class={['bank', f.bank]}>{BANKS[f.bank]}</span>
							<span class="name">{f.name}</span>
							<button type="button" class="link" onclick={() => (files = files.filter((x) => x !== f))}>Remove</button>
						</div>
						{#if f.error}
							<p class="err small">{f.error}</p>
						{:else}
							<dl>
								<div><dt>Lines</dt><dd>{f.txns.length}</dd></div>
								<div><dt>Period</dt><dd>{day(f.from)} – {day(f.to)}</dd></div>
								<div><dt>Charges</dt><dd>{nzd(f.charges)}</dd></div>
								<div><dt>Payments</dt><dd>{nzd(f.credits)}</dd></div>
							</dl>
							<p class="small note">{f.note}</p>
						{/if}
					</li>
				{/each}
			</ul>
		{/if}

		<footer>
			<button type="button" class="btn" disabled={!ready.length} onclick={confirm}>
				Import {ready.length > 1 ? `${ready.length} statements` : 'statement'}
			</button>
			<button type="button" class="link" onclick={close}>Cancel</button>
		</footer>
	</div>
</dialog>

<style>
	dialog { width: min(560px, calc(100vw - 28px)); padding: 0; border: 0; color: var(--ink); }
	dialog::backdrop { background: rgba(6, 8, 14, 0.5); backdrop-filter: blur(4px); }
	.body { padding: 24px; display: grid; gap: 18px; }
	h2 { margin: 0 0 6px; font-size: 20px; font-weight: 600; letter-spacing: -0.02em; }
	.small { margin: 0; font-size: 13px; font-weight: 500; color: var(--ink-2); line-height: 1.4; }
	.drop { display: grid; justify-items: center; gap: 6px; padding: 32px 20px; border-radius: 16px; border: 2px dashed var(--line); background: var(--surface-2); color: var(--ink-2); cursor: pointer; width: 100%; transition: border-color 150ms var(--ease), background 150ms var(--ease), color 150ms var(--ease); }
	.drop:hover, .drop.over { border-color: var(--accent); background: var(--accent-soft); color: var(--ink); }
	.drop svg { margin-bottom: 4px; }
	.drop-t { font-size: 16px; font-weight: 600; color: var(--ink); }
	.files { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
	li { background: var(--surface-2); border-radius: 12px; padding: 14px 16px; display: grid; gap: 10px; }
	li.bad { box-shadow: inset 0 0 0 1px var(--danger); }
	.row { display: flex; align-items: center; gap: 10px; }
	.name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 600; font-size: 14px; }
	.bank { font-size: 12px; font-weight: 600; padding: 2px 8px; border-radius: 999px; background: var(--accent-soft); color: var(--ink); }
	dl { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin: 0; }
	dt { font-size: 12px; font-weight: 500; color: var(--ink-2); }
	dd { margin: 0; font-size: 15px; font-weight: 600; font-variant-numeric: tabular-nums; }
	.err { color: var(--danger); }
	.note { color: var(--ink); }
	footer { display: flex; align-items: center; gap: 16px; }
	@media (max-width: 640px) { .body { padding: 18px; } dl { grid-template-columns: repeat(2, 1fr); } }
</style>
