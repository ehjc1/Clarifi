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
