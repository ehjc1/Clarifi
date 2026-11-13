import { browser } from '$app/environment';
import { api, ApiError } from './api';
import type { Bank, Income, Rule, Statement, Txn } from './types';

const KEY = 'clarifi.v1';

type Data = { statements: Statement[]; current: string; card: string; rules: Rule[]; incomes: Income[]; budget: number }; // budget: general spend per statement cycle, 0 = unset; card: chosen card, '' = all

const seed: Data = {
	statements: [],
	current: '',
	card: '',
	incomes: [],
	budget: 0,
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

/**
 * Add a card's lines to the month statement they fall in. Lines from the same card for that month are replaced;
 * lines from the other card stay, so ANZ and Amex for one month read as one statement.
 */
export function addStatement(txns: Txn[], synthetic = false): Statement {
	const bank: Bank = txns[0]?.source ?? 'anz';
	const fresh = makeStatement(txns, synthetic);
	const old = data.statements.find((s) => s.id === fresh.id);
	const kept = old && !old.synthetic ? old.txns.filter((t) => (t.source ?? 'anz') !== bank) : [];
	const st = makeStatement([...kept, ...txns], synthetic);
	data.statements = [...data.statements.filter((s) => s.id !== st.id), st].sort((a, b) => a.id.localeCompare(b.id));
	data.current = st.id;
	persist();
	return st;
}

/** Signed-in account, if any. Local storage stays the source while signed out; the server mirrors it while signed in. */
export const auth = $state<{ user: string | null; busy: boolean; error: string; offline: boolean }>({ user: null, busy: false, error: '', offline: false });

let pushTimer: ReturnType<typeof setTimeout> | undefined;

export function persist() {
	if (!browser) return;
	localStorage.setItem(KEY, JSON.stringify(data));
	if (auth.user) { clearTimeout(pushTimer); pushTimer = setTimeout(push, 400); }
}

async function push() {
	try { await api.putSnapshot($state.snapshot(data)); auth.error = ''; }
	catch (e) { auth.error = e instanceof ApiError && e.status === 403 ? 'Signed out. Sign in again to keep saving.' : 'Could not save to your account.'; }
}

/** First sign-in on a device with local data: an empty account takes the local copy; otherwise the account wins. */
async function pull() {
	const snap = await api.getSnapshot<Data>();
	if (!snap.statements.length && !snap.rules.length && !snap.incomes.length) await api.putSnapshot($state.snapshot(data));
	else { Object.assign(data, snap); localStorage.setItem(KEY, JSON.stringify(data)); }
}

/** On boot: find out whether a session exists. No backend reachable means local-only, silently. */
export async function connect() {
	try {
		const me = await api.csrf();
		if (me.username) { auth.user = me.username; await pull(); }
	} catch { auth.offline = true; }
}

export async function signIn(username: string, password: string, register = false) {
	auth.busy = true; auth.error = '';
	try {
		const me = await (register ? api.register : api.login)(username, password);
		auth.user = me.username;
		await pull();
	} catch (e) { auth.error = e instanceof Error ? e.message : String(e); }
	auth.busy = false;
}

export async function signOut() {
	clearTimeout(pushTimer);
	try { await api.logout(); } catch { /* session already gone */ }
	auth.user = null; auth.error = '';
}

export const uid = () => Math.random().toString(36).slice(2, 9);
