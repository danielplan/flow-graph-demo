import { StateGraph, START, END, Annotation } from '@langchain/langgraph';
import { HumanMessage } from '@langchain/core/messages';
import { BASIC_SCENES_TEMPLATE } from './prompt';
import type { Relationship, Interaction } from './graph';
import type { Source } from './source';
import { openAiModel } from './langgraph';

const AgentState = Annotation.Root({
	sources: Annotation<Source[]>,
	nodes: Annotation<Interaction[]>,
	error: Annotation<string | null>,
	relationships: Annotation<Relationship[]>
});

async function createGraph(state: typeof AgentState.State): Promise<typeof AgentState.State> {
	try {
		console.log('Creating graph from sources:', state.sources);
		const prompt = await BASIC_SCENES_TEMPLATE.format({
			sources: JSON.stringify(state.sources, null, 2)
		});

		const response = await openAiModel.invoke([new HumanMessage(prompt)], {
			response_format: {
				type: 'json_object'
			}
		});

		const { nodes, relationships } = JSON.parse(response.text);
		console.log('Generated graph nodes and relationships:', nodes, relationships);

		return {
			...state,
			nodes,
			relationships,
			error: null
		};
	} catch (error: unknown) {
		console.error('Error in generating graph:', error);
		return {
			...state,
			error: `Graph generation failed: ${error instanceof Error ? error.message : String(error)}`
		};
	}
}

function createFlowGraph() {
	const workflow = new StateGraph(AgentState)
		.addNode('create-graph', createGraph)
		.addEdge(START, 'create-graph')
		.addEdge('create-graph', END);

	return workflow.compile();
}

export async function generateBasicGraph(sources: Source[]) {
	const app = createFlowGraph();

	try {
		const result = await app.invoke({
			sources
		});

		if (result.error) {
			console.error('❌ Pipeline failed:', result.error);
			return { success: false, error: result.error };
		}

		return {
			success: true,
			data: {
				nodes: result.nodes,
				relationships: result.relationships
			}
		};
	} catch (error: unknown) {
		console.error('❌ Workflow execution failed:', error);
		return { success: false, error: error instanceof Error ? error.message : String(error) };
	}
}
