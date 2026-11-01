export const BUCKETS = ['income', 'fixed', 'general', 'investments', 'savings', 'mortgage'] as const;
export type Bucket = (typeof BUCKETS)[number];

export type Txn = {
	id: string;
	date: string; // ISO yyyy-mm-dd
	details: string;
	amount: number; // positive = money out (charge), negative = money in (payment/refund)
};

export type Rule = {
	id: string;
	name: string;
	text?: string; // details contains (case-insensitive)
	min?: number; // amount >= min
	max?: number; // amount <= max
	share: number; // 0..1 fraction that is mine
	bucket: Bucket;
};

export type Income = { id: string; name: string; amount: number; monthly: boolean };

export type Scored = Txn & {
	matches: Rule[];
	rule: Rule | null;
	share: number;
	mine: number;
	bucket: Bucket;
	conflict: boolean; // two matched rules disagree on share or bucket
};
