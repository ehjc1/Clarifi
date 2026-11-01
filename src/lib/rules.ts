import type { Rule, Scored, Txn } from './types';

export function matches(rule: Rule, t: Txn): boolean {
	if (rule.text && !t.details.toLowerCase().includes(rule.text.toLowerCase())) return false;
	if (rule.min != null && t.amount < rule.min) return false;
	if (rule.max != null && t.amount > rule.max) return false;
	return true;
}

/** Every rule is evaluated; the first match sets share and bucket, disagreement among matches is flagged. */
export function score(txns: Txn[], rules: Rule[]): Scored[] {
	return txns.map((t) => {
		const ms = rules.filter((r) => matches(r, t));
		const rule = ms[0] ?? null;
		const share = rule ? rule.share : t.amount < 0 ? 0 : 1; // payments to the card are nobody's expense
		const bucket = rule?.bucket ?? 'general';
		const conflict = ms.some((r) => r.share !== rule!.share || r.bucket !== rule!.bucket);
		return { ...t, matches: ms, rule, share, mine: round2(t.amount * share), bucket, conflict };
	});
}

export const round2 = (n: number) => Math.round(n * 100) / 100;

export function describe(r: Rule): string {
	const parts = [];
	if (r.text) parts.push(`contains “${r.text}”`);
	if (r.min != null) parts.push(`≥ $${r.min}`);
	if (r.max != null) parts.push(`≤ $${r.max}`);
	return parts.join(' and ') || 'everything';
}

/** Title-case a merchant stem for a readable rule name. */
export const titleCase = (s: string) => s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

/**
 * Compose a share rule on a merchant stem without silently colliding with rules that already
 * claim some matching lines: bound it by amount when the claimed and unclaimed lines separate cleanly.
 */
export function composeRule(stem: string, share: number, bucket: Rule['bucket'], scored: Scored[]) {
	const text = stem.toLowerCase();
	const hits = scored.filter((r) => r.amount > 0 && r.details.toLowerCase().includes(text));
	const claimed = hits.filter((r) => r.rule && r.rule.share !== share);
	const free = hits.filter((r) => !r.rule);
	const rule: Omit<Rule, 'id'> = { name: `${titleCase(stem)} is ${share === 0 ? 'partner’s' : share === 1 ? 'mine' : 'split'}`, text, share, bucket };
	let note = '';
	if (claimed.length && free.length) {
		const loFree = Math.min(...free.map((r) => r.amount)), hiFree = Math.max(...free.map((r) => r.amount));
		const loCl = Math.min(...claimed.map((r) => r.amount)), hiCl = Math.max(...claimed.map((r) => r.amount));
		const codes = [...new Set(claimed.map((r) => r.rule!.name))].join(', ');
		if (hiFree < loCl) { rule.max = hiFree; note = `under $${hiFree} only, so ${codes} keeps the bigger ones`; }
		else if (loFree > hiCl) { rule.min = loFree; note = `$${loFree} and up only, so ${codes} keeps the smaller ones`; }
		else note = `also matches ${claimed.length} line${claimed.length > 1 ? 's' : ''} ${codes} already claims; that rule wins there`;
	}
	return { rule, note, claimed: claimed.length };
}
