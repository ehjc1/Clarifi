import type { Scored } from './types';

export type Day = { date: string; spend: number; allowance: number; past: boolean; today: boolean; projected: number };

const DAY = 864e5;
export const isoDate = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const parse = (s: string) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
export const addDays = (s: string, n: number) => { const d = parse(s); d.setDate(d.getDate() + n); return isoDate(d); };
const span = (a: string, b: string) => Math.round((parse(b).getTime() - parse(a).getTime()) / DAY) + 1; // inclusive days

/**
 * Even-paced runway over a cycle: each remaining day gets an equal slice of what is left.
 * `today` outside the cycle is clamped to its ends, so a past statement reads as a finished cycle.
 */
export function runway(rows: Scored[], value: (r: Scored) => number, budget: number, from: string, to: string, today: string, whatIf = 0) {
	const day = today < from ? from : today > to ? to : today;
	const ended = today > to;
	const days = span(from, to);
	const daysLeft = ended ? 0 : span(day, to);
	const byDay: Record<string, number> = {};
	for (const r of rows) byDay[r.date] = (byDay[r.date] ?? 0) + value(r);
	const spentBefore = Object.entries(byDay).filter(([d]) => d >= from && d < day).reduce((a, [, v]) => a + v, 0);
	const spentToday = byDay[day] ?? 0;
	const remaining = budget - spentBefore;
	const allowance = budget / days;
	const safeToday = ended ? remaining - spentToday : remaining / daysLeft - spentToday;
	const perDayAfter = daysLeft > 1 ? (remaining - spentToday - whatIf) / (daysLeft - 1) : 0;
	const baselineTomorrow = daysLeft > 1 ? (remaining - spentToday) / (daysLeft - 1) : 0;
	const elapsed = ended ? days : span(from, day) - 1;
	const pace = allowance * elapsed - spentBefore; // >0 ahead, <0 behind
	const cells: Day[] = [];
	for (let i = 0; i < days; i++) {
		const date = addDays(from, i);
		const past = date < day || ended, isToday = date === day && !ended;
		cells.push({ date, spend: byDay[date] ?? 0, allowance, past, today: isToday, projected: past ? 0 : isToday ? Math.max(0, safeToday) : Math.max(0, perDayAfter) });
	}
	return { day, ended, days, daysLeft, remaining, spentToday, safeToday, tomorrow: perDayAfter, baselineTomorrow, pace, cells, left: remaining - spentToday };
}
