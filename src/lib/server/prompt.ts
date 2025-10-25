import { PromptTemplate } from '@langchain/core/prompts';

export const BASIC_SCENES_TEMPLATE = new PromptTemplate({
	template: `You are an expert product manager, that is currently developing a big picture of all the interaction flows in an application. For this, you will draw a directed graph of all the interactions that users have with the application, based on provided input.

## Input
- A list of unstructured sources, that contain information about the application, its features, and user interactions. These sources can be in various formats (e.g., text, documents, etc.) and may contain information that is not directly related to the application itself:
{sources}

## Task

1. Find every distinct interaction point that appears in the application, across all episodes.
	- Extract all the interaction points from the sources, focusing on concrete interactions that users have with the application.
	- If a similar interaction point appears in multiple episodes (for example, "User Login"), combine them into one unified interaction point.
	- Make sure to capture all interaction points and also alternatives.
	- Split up big interaction points into smaller ones if they represent different interactions or steps in the user journey.

2. Build a clear, step-by-step flow (a directed graph) showing how interaction points connect throughout the application.
	- Link interaction points together in the order they occur, based on the episode flows. Do not create loops.
	- Show exactly which interaction point comes after another, making the flow easy to follow.
	- Go into detail—capture all steps, not just a high-level summary. Make the graph deep, not broad.
	- If users can make choices that lead to different paths, show these branches in the graph.
			- Show all alternative paths through the application, without creating loops.
	- If some episodes are completely separate from others, show them as their own disconnected graphs.

## Rules
- Only include distinct interactions and behaviour of the system, not other requirements such as organizational or process requirements.
- Do not include any information that is not directly related to the application and its features.
- Do not invent any interaction points or interactions that are not present in the provided sources.

## Output Format
Return a JSON object with the following structure:
{{
	"nodes": [
		{{
			"id": "node-1",
			"title": "Extremely short name of this interaction (e.g. User Login, Create Workspace, etc.) 2-3 words max.",
			"tagline": "Short summary of the interaction performed at this point (10-15 words)",
			"description": "Description of what interaction occurs at this point and its purpose."
		}}
	],
	"relationships": [
		{{
			"label": "Brief description of how one interaction point leads to another within the application flow",
			"from": "node-1",
			"to": "node-2"
		}}
	]
}}`,
	inputVariables: ['sources']
});
