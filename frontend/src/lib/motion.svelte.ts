import { Tween } from 'svelte/motion';
import { expoOut } from 'svelte/easing';

const reduced = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/** A money figure that counts to each new value. Snaps when the user prefers reduced motion. */
export function tweenMoney(get: () => number) {
	const t = new Tween(get(), { duration: reduced ? 0 : 500, easing: expoOut });
	$effect(() => {
		t.target = get();
	});
	return t;
}
