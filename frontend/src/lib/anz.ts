import type { Bank, Txn } from './types';

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

/** First header column matching the first key that matches any column, so "Description" beats "Extended Details". */
const find = (h: string[], ...keys: string[]) => {
	const norm = h.map((c) => c.toLowerCase().replace(/[^a-z#]/g, ''));
	for (const k of keys) { const i = norm.findIndex((c) => c.includes(k)); if (i >= 0) return i; }
	return -1;
};

export const BANKS: Record<Bank, string> = { anz: 'ANZ', amex: 'Amex' };

/** Amex exports carry Card Member / Account # columns and are usually named activity.csv; ANZ has a D/C Type column. */
export function detectBank(header: string[], filename = ''): Bank {
	if (find(header, 'cardmember', 'account#', 'extendeddetails', 'appearsonyourstatement') >= 0 || /amex|activity/i.test(filename)) return 'amex';
	return 'anz';
}

/**
 * Credit card CSV export, header-driven so column order does not matter.
 * ANZ NZ: Card, Type (D/C), Amount, Details, TransactionDate, ProcessedDate.
 * Amex NZ: Date, Description, Card Member, Account #, Amount (positive = charge, negative = payment), optional extras.
 * shortcut: column names unverified against real exports, confirm with the first real file of each.
 */
export function parseStatement(text: string, filename = ''): { bank: Bank; txns: Txn[] } {
	const rows = parseCsv(text);
	if (rows.length < 2) return { bank: detectBank(rows[0] ?? [], filename), txns: [] };
	const h = rows[0];
	const bank = detectBank(h, filename);
	const iDate = find(h, 'transactiondate', 'date');
	const iDet = find(h, 'description', 'details', 'particulars');
	const iAmt = find(h, 'amount');
	const iType = bank === 'anz' ? find(h, 'type') : -1;
	const iCard = find(h, 'cardmember', 'card', 'account#');
	if (iDate < 0 || iDet < 0 || iAmt < 0) throw new Error(`Unrecognised statement columns: ${h.join(', ')}`);
	const txns = rows.slice(1).flatMap((r, n) => {
		let amount = parseFloat(r[iAmt].replace(/[^0-9.-]/g, ''));
		if (Number.isNaN(amount)) return [];
		if (iType >= 0) amount = Math.abs(amount) * (r[iType].trim().toUpperCase().startsWith('C') ? -1 : 1);
		const date = toIso(r[iDate]);
		const card = iCard >= 0 ? r[iCard].trim() : '';
		return [{ id: `${bank}-${date}-${n}-${amount}`, date, details: r[iDet].trim(), amount, source: bank, ...(card && { card }) }];
	});
	return { bank, txns };
}

/** Short label for a card: the last four digits of a masked number ("····1234"), else the raw value (an Amex card member name). */
export const cardLabel = (card: string) => { const m = card.match(/(\d{4})\D*$/); return m && /[*xX#•·-]/.test(card) ? `····${m[1]}` : card; };

export const parseAnz = (text: string) => parseStatement(text).txns;
