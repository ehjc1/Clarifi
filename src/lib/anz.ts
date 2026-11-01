import type { Txn } from './types';

/** Minimal RFC-4180 CSV reader: quotes, escaped quotes, CRLF. */
export function parseCsv(text: string): string[][] {
	const rows: string[][] = [];
	let row: string[] = [], cell = '', q = false;
	for (let i = 0; i < text.length; i++) {
		const c = text[i];
		if (q) {
			if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
			else if (c === '"') q = false;
			else cell += c;
		} else if (c === '"') q = true;
		else if (c === ',') { row.push(cell); cell = ''; }
		else if (c === '\n' || c === '\r') {
			if (c === '\r' && text[i + 1] === '\n') i++;
			row.push(cell); rows.push(row); row = []; cell = '';
		} else cell += c;
	}
	if (cell || row.length) { row.push(cell); rows.push(row); }
	return rows.filter((r) => r.some((v) => v.trim()));
}

function toIso(d: string): string {
	const m = d.trim().match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{2,4})$/); // dd/mm/yyyy
	if (m) return `${m[3].length === 2 ? '20' + m[3] : m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
	return d.slice(0, 10);
}

const find = (h: string[], ...keys: string[]) =>
	h.findIndex((c) => keys.some((k) => c.toLowerCase().replace(/\s/g, '').includes(k)));

/**
 * ANZ NZ credit card CSV export. Header-driven so column order does not matter.
 * Expected columns include Details, Amount, TransactionDate (or Date), optional Type (D/C).
 * shortcut: column names unverified against a real export, confirm with first real file.
 */
export function parseAnz(text: string): Txn[] {
	const rows = parseCsv(text);
	if (rows.length < 2) return [];
	const h = rows[0];
	const iDate = find(h, 'transactiondate', 'date');
	const iDet = find(h, 'details', 'description', 'particulars');
	const iAmt = find(h, 'amount');
	const iType = find(h, 'type');
	if (iDate < 0 || iDet < 0 || iAmt < 0) throw new Error(`Unrecognised statement columns: ${h.join(', ')}`);
	return rows.slice(1).flatMap((r, n) => {
		let amount = parseFloat(r[iAmt].replace(/[^0-9.-]/g, ''));
		if (Number.isNaN(amount)) return [];
		if (iType >= 0) amount = Math.abs(amount) * (r[iType].trim().toUpperCase().startsWith('C') ? -1 : 1);
		const date = toIso(r[iDate]);
		return [{ id: `${date}-${n}-${amount}`, date, details: r[iDet].trim(), amount }];
	});
}
