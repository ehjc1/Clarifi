import { browser } from '$app/environment';
import type { Income, Rule, Statement, Txn } from './types';

const KEY = 'clarifi.v1';

type Data = { statements: Statement[]; current: string; rules: Rule[]; incomes: Income[] };

const seed: Data = {
	statements: [],
	current: '',
	incomes: [],
	rules: [
		{ id: 'r1', name: 'Big Pak’nSave shop is partner’s', text: "pak n save", min: 50, share: 0, bucket: 'general' },
		{ id: 'r2', name: 'Internet is partner’s', text: 'spark', share: 0, bucket: 'fixed' },
		{ id: 'r3', name: 'Power split 50/50', text: 'contact energy', share: 0.5, bucket: 'fixed' }
	]
};

export function load(): Data {
	if (!browser) return seed;
	try {
		const raw = JSON.parse(localStorage.getItem(KEY) ?? '{}');
		if (Array.isArray(raw.txns) && raw.txns.length && !raw.statements) { // v1 shape: one statement
			const st = makeStatement(raw.txns, !!raw.synthetic);
			raw.statements = [st]; raw.current = st.id;
		}
		delete raw.txns; delete raw.synthetic; delete raw.period;
		return { ...seed, ...raw };
	} catch { return seed; }
}

const month = (d: string) => new Date(d).toLocaleDateString('en-NZ', { month: 'short', year: 'numeric' });

/** A statement is labelled by the month its last transaction falls in; same month re-imported replaces it. */
export function makeStatement(txns: Txn[], synthetic = false): Statement {
	if (!txns.length) throw new Error('A statement needs at least one transaction.');
	const ds = txns.map((t) => t.date).sort();
	const to = ds[ds.length - 1];
	return { id: to.slice(0, 7), label: month(to), from: ds[0], to, txns, synthetic };
}

export const data = $state<Data>(load());

export function persist() {
	if (browser) localStorage.setItem(KEY, JSON.stringify(data));
}

export const uid = () => Math.random().toString(36).slice(2, 9);
