import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { yup } from 'sveltekit-superforms/adapters';
import { loadSources } from '$lib/server/source';
import { generateBasicGraph } from '$lib/server/create-graph';
import { uploadFilesSchema } from '$lib/schema';

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, yup(uploadFilesSchema));
		if (!form.valid) {
			return fail(400, { form });
		}
		const files = (form.data.files ?? []).filter((f): f is File => f !== undefined && f !== null);
		if (files.length === 0) {
			return fail(400, { form });
		}
		const sources = await loadSources(files);
		const result = await generateBasicGraph(sources);
		delete form.data.files;
		if (!result || !result.success) {
			return { form };
		}
		return {
			form,
			interactions: result.data?.nodes,
			relationships: result.data?.relationships
		};
	}
};

export const load: PageServerLoad = async ({ request }) => {
	const form = await superValidate(request, yup(uploadFilesSchema));
	return {
		form
	};
};
