<script lang="ts">
	import { Handle, type NodeProps, Position } from '@xyflow/svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import type { Interaction } from '$lib/server/graph';
	import TitleText from './TitleText.svelte';

	let {
		data
	}: NodeProps & {
		data: Interaction;
	} = $props();
</script>

<Handle type="target" position={Position.Left} />
<Dialog.Root>
	<Dialog.Trigger class="text-left">
		<div
			class="flex max-w-2xs cursor-pointer flex-col rounded-sm border border-gray-400 bg-white p-3 transition-colors hover:bg-gray-50"
		>
			<div class="text-sm font-semibold">
				{data.title}
			</div>
			<div class="text-xs text-gray-600">
				{data.tagline}
			</div>
		</div>
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-3xl">
		<Dialog.Header>
			<Dialog.Title>{data.title}</Dialog.Title>
			<Dialog.Description>
				{data.tagline}
			</Dialog.Description>
		</Dialog.Header>
		<div class="mt-2 flex flex-col gap-2 rounded-lg border p-2">
			<TitleText title="Description" text={data.description} size="sm" />
		</div>
	</Dialog.Content>
</Dialog.Root>

<Handle type="source" position={Position.Right} id="b" />
