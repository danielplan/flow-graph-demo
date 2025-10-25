<script lang="ts">
	import { displaySize, MEGABYTE, type FileDropZoneProps } from '$lib/components/ui/file-drop-zone';
	import type { Interaction, Relationship } from '$lib/server/graph';
	import { Button } from '$lib/components/ui/button';
	import * as Form from '$lib/components/ui/form';
	import { XIcon, File } from '@lucide/svelte/icons';
	import { type SuperValidated, filesProxy, superForm, type Infer } from 'sveltekit-superforms';
	import { onMount } from 'svelte';
	import { uploadFilesSchema, type UploadFilesSchema } from '$lib/schema';
	import { yup } from 'sveltekit-superforms/adapters';
	import FileDropZone from '$lib/components/ui/file-drop-zone/file-drop-zone.svelte';
	import TitleText from '$lib/components/TitleText.svelte';

	export let data: {
		form: SuperValidated<Infer<UploadFilesSchema>>;
	};

	let graphData: {
		interactions: Interaction[];
		relationships: Relationship[];
	} | null = null;

	let GraphComponent = null;

	onMount(async () => {
		const module = await import('$lib/components/Graph.svelte');
		GraphComponent = module.default;
	});

	const form = superForm(data.form, {
		validators: yup(uploadFilesSchema),
		onResult: ({ result }) => {
			if (result.type === 'success' && result.data) {
				graphData = {
					interactions: result.data.interactions,
					relationships: result.data.relationships
				};
			}
			return result;
		}
	});

	const { enhance, submitting } = form;
	const files = filesProxy(form, 'files');
	const onUpload: FileDropZoneProps['onUpload'] = async (uploadedFiles) => {
		files.set([...Array.from($files), ...uploadedFiles]);
	};
</script>

{#if graphData?.interactions && graphData?.relationships && GraphComponent}
	<svelte:component
		this={GraphComponent}
		nodes={graphData.interactions}
		connections={graphData.relationships}
	/>
{:else}
	<div class="flex min-h-screen items-center justify-center p-10">
		<div class="mx-auto flex w-full max-w-6xl flex-col gap-6 p-10">
			<TitleText
				title="Create Flow Graph"
				text="Upload files to create a flow graph. Supported formats: PDF, Word documents, and text files."
				size="lg"
			/>
			<form
				method="POST"
				enctype="multipart/form-data"
				use:enhance
				class="flex w-full flex-col gap-2"
			>
				<Form.Field {form} name="files">
					<Form.Control>
						<Form.Label>Files</Form.Label>
						<FileDropZone
							{onUpload}
							maxFileSize={20 * MEGABYTE}
							accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/*"
						/>

						<input name="files" type="file" bind:files={$files} class="hidden" />
						<div class="flex flex-col gap-2">
							{#each Array.from($files) as file, i (file.name)}
								<div
									class="flex place-items-center justify-between gap-2 rounded-lg border bg-white p-2"
								>
									<div class="flex items-center gap-2">
										<File class="size-6" />
										<div class="flex flex-col">
											<span class="font-semibold">{file.name}</span>
											<span class="text-xs text-muted-foreground">{displaySize(file.size)}</span>
										</div>
									</div>
									<Button
										variant="destructive"
										size="icon"
										onclick={() => {
											files.set([
												...Array.from($files).slice(0, i),
												...Array.from($files).slice(i + 1)
											]);
										}}
									>
										<XIcon />
									</Button>
								</div>
							{/each}
						</div>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Button submitting={$submitting}>Submit</Form.Button>
			</form>
		</div>
	</div>
{/if}
