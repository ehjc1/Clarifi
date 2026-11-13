export type Swipe = 'partner' | 'mine' | 'split' | 'skip';

/** Which way a card was thrown: right = mine, left = partner's, up = split, down = skip; null inside the dead zone. */
export function swipeAction(dx: number, dy: number, threshold = 90): Swipe | null {
	if (Math.abs(dx) >= Math.abs(dy)) return dx > threshold ? 'mine' : dx < -threshold ? 'partner' : null;
	return dy < -threshold ? 'split' : dy > threshold ? 'skip' : null;
}

/** 0..1 how far a drag of `v` px has committed toward the threshold, for stamp opacity. */
export const pull = (v: number, threshold = 90) => Math.min(1, Math.max(0, (v - 20) / (threshold - 20)));
