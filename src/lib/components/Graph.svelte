<script lang="ts">
	import { SvelteFlowProvider } from '@xyflow/svelte';

	import '@xyflow/svelte/dist/style.css';
	import Flow from '$lib/components/Flow.svelte';
	import type { Interaction, Relationship } from '$lib/server/graph';

	let {
		nodes = [],
		connections = []
	}: {
		nodes: Interaction[];
		connections: Relationship[];
	} = $props();
</script>

<SvelteFlowProvider>
	<Flow {nodes} {connections} />
</SvelteFlowProvider>
