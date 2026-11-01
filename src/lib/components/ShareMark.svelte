<script lang="ts">
	/** Printed mark: hollow 0%, half 50%, filled 100%, any other share shows its fill height, struck when excluded. */
	let { share, excluded = false, title = '' }: { share: number; excluded?: boolean; title?: string } = $props();
	const h = $derived(Math.round(share * 10));
</script>

<svg width="12" height="12" viewBox="0 0 12 12" role="img" aria-label={title || `${Math.round(share * 100)}% mine`}>
	<rect x="0.5" y="0.5" width="11" height="11" fill="none" stroke="currentColor" />
	{#if h > 0}<rect x="1" y={11 - h} width="10" height={h} fill="currentColor" />{/if}
	{#if excluded}<line x1="-1" y1="6" x2="13" y2="6" stroke="currentColor" stroke-width="1.5" />{/if}
</svg>
