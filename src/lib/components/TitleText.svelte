<script lang="ts">
	let {
		title,
		text,
		list,
		center = false,
		size = 'lg'
	} = $props<{
		title?: string;
		text?: string;
		list?: string[];
		center?: boolean;
		size?: 'sm' | 'md' | 'lg' | 'xl';
	}>();

	const sizeClasses = {
		sm: 'text-base font-medium',
		md: 'text-xl font-semibold',
		lg: 'text-2xl font-semibold',
		xl: 'text-3xl font-semibold'
	} as const;

	const containerClasses = {
		sm: 'text-sm gap-0.5',
		md: 'text-sm gap-1',
		lg: 'text-base gap-1',
		xl: 'text-lg gap-1.5'
	} as const;
</script>

<div
	class="flex flex-col text-foreground {containerClasses[size]} {center
		? 'items-center text-center'
		: 'items-start'}"
>
	<h2 class="{sizeClasses[size]} tracking-tight">
		{title}
	</h2>
	<p class="text-muted-foreground">{text}</p>
	{#if list}
		{#if list.length > 0}
			<ul class="list-disc pl-6">
				{#each list as item (item)}
					<li class="text-muted-foreground">{item}</li>
				{/each}
			</ul>
		{:else}
			<p class="text-muted-foreground italic">No entries</p>
		{/if}
	{/if}
</div>
