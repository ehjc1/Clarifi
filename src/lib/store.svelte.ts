import { browser } from '$app/environment';
import type { Income, Rule, Txn } from './types';

const KEY = 'clarifi.v1';

type Data = { txns: Txn[]; rules: Rule[]; incomes: Income[]; period: string };

const seed: Data = {
	txns: [],
	incomes: [],
	period: '',
	rules: [
		{ id: 'r1', name: 'Big Pak’nSave shop is partner’s', text: "pak n save", min: 50, share: 0, bucket: 'general' },
		{ id: 'r2', name: 'Internet is partner’s', text: 'spark', share: 0, bucket: 'fixed' },
		{ id: 'r3', name: 'Power split 50/50', text: 'contact energy', share: 0.5, bucket: 'fixed' }
	]
};

export function load(): Data {
	if (!browser) return seed;
	try { return { ...seed, ...JSON.parse(localStorage.getItem(KEY) ?? '{}') }; } catch { return seed; }
}

export const data = $state<Data>(load());

export function persist() {
	if (browser) localStorage.setItem(KEY, JSON.stringify(data));
}

export const uid = () => Math.random().toString(36).slice(2, 9);
