import { describe, expect, it } from 'vitest';
import { parseAnz, parseCsv } from '../src/lib/anz';
import { composeRule, score } from '../src/lib/rules';
import type { Rule } from '../src/lib/types';

const csv = `Card,Type,Amount,Details,TransactionDate,ProcessedDate
4321-****-1234,D,86.40,"PAK N SAVE ALBANY",03/10/2026,04/10/2026
4321-****-1234,D,32.10,"PAK N SAVE ALBANY",05/10/2026,05/10/2026
4321-****-1234,D,89.00,"SPARK NZ ""BROADBAND""",01/10/2026,01/10/2026
4321-****-1234,D,210.55,CONTACT ENERGY,02/10/2026,02/10/2026
4321-****-1234,C,1500.00,PAYMENT RECEIVED THANK YOU,06/10/2026,06/10/2026`;

const rules: Rule[] = [
	{ id: 'a', name: 'big shop', text: 'pak n save', min: 50, share: 0, bucket: 'general' },
	{ id: 'b', name: 'internet', text: 'spark', share: 0, bucket: 'fixed' },
	{ id: 'c', name: 'power', text: 'contact', share: 0.5, bucket: 'fixed' },
	{ id: 'd', name: 'clash', text: 'contact', share: 1, bucket: 'general' }
];

describe('anz', () => {
	it('parses quoted cells, dd/mm/yyyy and D/C sign', () => {
		expect(parseCsv('a,"b,""c""",d\n1,2,3')).toEqual([['a', 'b,"c"', 'd'], ['1', '2', '3']]);
		const t = parseAnz(csv);
		expect(t).toHaveLength(5);
		expect(t[0]).toMatchObject({ date: '2026-10-03', details: 'PAK N SAVE ALBANY', amount: 86.4 });
		expect(t[2].details).toBe('SPARK NZ "BROADBAND"');
		expect(t[4].amount).toBe(-1500);
	});
});

describe('rules', () => {
	it('applies share, first-match bucket, flags conflicts, leaves payments out', () => {
		const s = score(parseAnz(csv), rules);
		expect(s.map((x) => x.mine)).toEqual([0, 32.1, 0, 105.28, -0]);
		expect(s[1].rule).toBeNull(); // under $50: mine, general
		expect(s[1].bucket).toBe('general');
		expect(s[3].conflict).toBe(true);
		expect(s[3].bucket).toBe('fixed');
		expect(s[4].share).toBe(0);
	});
});

describe('composeRule', () => {
	it('bounds a triage rule so it does not collide with a rule that already claims bigger lines', () => {
		const s = score(parseAnz(csv), rules.slice(0, 1)); // R "big shop": pak n save >= 50 is partner's
		const { rule, note, claimed } = composeRule('PAK N SAVE ALBANY', 1, 'general', s);
		expect(rule).toMatchObject({ name: 'Pak N Save Albany is mine', text: 'pak n save albany', share: 1, max: 32.1 });
		expect(claimed).toBe(1);
		expect(note).toContain('up to $32.10');
		expect(score(parseAnz(csv), [...rules.slice(0, 1), { id: 'z', ...rule }]).some((r) => r.conflict)).toBe(false);
	});
	it('writes an unbounded rule when nothing else claims a match', () => {
		const s = score(parseAnz(csv), []);
		expect(composeRule('contact energy', 0.5, 'fixed', s)).toMatchObject({ note: '', claimed: 0, rule: { text: 'contact energy', share: 0.5 } });
	});
});

describe('statements', () => {
	it('labels a statement by the month of its last line and keys it YYYY-MM', async () => {
		const { makeStatement } = await import('../src/lib/store.svelte');
		const st = makeStatement(parseAnz(csv), true);
		expect(st).toMatchObject({ id: '2026-10', from: '2026-10-01', to: '2026-10-06', synthetic: true });
		expect(st.label).toMatch(/Oct(ober)? 2026/);
	});
});
