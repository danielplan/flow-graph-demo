import { object, array, mixed } from 'yup';

export const uploadFilesSchema = object({
	files: array<File>()
		.of(
			// cast to any to satisfy yup's TypeScript overloads for .of()
			mixed<File>().test(
				'is-file',
				'Each item must be a File',
				(value): value is File => value instanceof File
			)
		)
		.default([])
		.min(1, 'At least one file must be uploaded')
});
export type UploadFilesSchema = typeof uploadFilesSchema;
