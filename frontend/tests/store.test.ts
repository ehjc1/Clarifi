import { beforeEach, describe, expect, it } from 'vitest';
import { addStatement, data } from '../src/lib/store.svelte';
import type { Txn } from '../src/lib/types';

const t = (id: string, source: 'anz' | 'amex', amount = 10): Txn => ({ id, date: '2026-10-15', details: id, amount, source });

describe('addStatement', () => {
	beforeEach(() => { data.statements = []; });
	it('merges both cards into one month and replaces only the re-imported card', () => {
		addStatement([t('a1', 'anz'), t('a2', 'anz')]);
		addStatement([t('x1', 'amex')]);
		expect(data.statements).toHaveLength(1);
		expect(data.statements[0].txns.map((x) => x.id)).toEqual(['a1', 'a2', 'x1']);
		addStatement([t('a3', 'anz')]);
		expect(data.statements[0].txns.map((x) => x.id)).toEqual(['x1', 'a3']);
		expect(data.current).toBe('2026-10');
	});
});
