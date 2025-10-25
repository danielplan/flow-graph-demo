import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { DocxLoader } from '@langchain/community/document_loaders/fs/docx';
import { CSVLoader } from '@langchain/community/document_loaders/fs/csv';
import { TextLoader } from '@langchain/classic/document_loaders/fs/text';
import { JSONLoader } from '@langchain/classic/document_loaders/fs/json';
import { BaseDocumentLoader } from '@langchain/core/document_loaders/base';

export interface Source {
	title: string;
	content: string;
}

export async function loadSources(files: File[]): Promise<Source[]> {
	const loaders = {
		pdf: (file: File) => new PDFLoader(file),
		docx: (file: File) => new DocxLoader(file),
		txt: (file: File) => new TextLoader(file),
		csv: (file: File) => new CSVLoader(file),
		json: (file: File) => new JSONLoader(file)
	} as Record<string, (file: File) => BaseDocumentLoader>;

	const fileLoaders = files.map((file) => {
		const extension = file.name.split('.').pop()?.toLowerCase();
		let loader: BaseDocumentLoader;
		if (!extension || !(extension in loaders)) {
			loader = new TextLoader(file);
		} else {
			loader = loaders[extension](file);
		}
		return loader;
	});

	const documents = await Promise.all(fileLoaders.map((loader_1) => loader_1.load()));
	return documents.map((d, i) => ({
		title: files[i].name,
		content: d.map((doc) => doc.pageContent).join('\n')
	}));
}
