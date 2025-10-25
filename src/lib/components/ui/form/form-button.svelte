<script lang="ts">
	import * as Button from '$lib/components/ui/button/index.js';
	import Loader2 from '@lucide/svelte/icons/loader-2';

	let {
		ref = $bindable(null),
		submitting,
		children,
		...restProps
	}: Button.Props & {
		submitting?: boolean;
	} = $props();
</script>

<Button.Root bind:ref type="submit" {...restProps}>
	{#if submitting}
		<Loader2 class="mr-2 size-4 animate-spin" />
	{/if}
	{@render children?.()}
</Button.Root>
