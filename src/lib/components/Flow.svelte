<script lang="ts">
	import { SvelteFlow, Background, useSvelteFlow, MiniMap } from '@xyflow/svelte';

	import '@xyflow/svelte/dist/style.css';
	import Dagre from '@dagrejs/dagre';
	import type { Interaction, Relationship } from '$lib/server/graph';
	import SimpleNode from './SimpleNode.svelte';

	const { fitView } = useSvelteFlow();
	let initialized = $state(false);

	let {
		nodes: _nodes = [],
		connections = []
	}: {
		nodes: Interaction[];
		connections: Relationship[];
	} = $props();

	let nodes = $state.raw(
		_nodes.map((node) => ({
			id: node.id,
			data: { ...node },
			position: { x: 0, y: 0 },
			type: 'simple',
			measured: {
				width: 230, // Default width, can be adjusted
				height: 60 // Default height, can be adjusted
			}
		}))
	);
	let edges = $state.raw(
		connections.map((connection) => ({
			id: `${connection.from}-${connection.to}`,
			source: connection.from,
			target: connection.to
		}))
	);

	function getLayoutedElements(nodes, edges, options) {
		const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
		g.setGraph({ rankdir: options.direction });

		edges.forEach((edge) => g.setEdge(edge.source, edge.target));
		nodes.forEach((node) =>
			g.setNode(node.id, {
				...node,
				width: node.measured?.width ?? 0,
				height: node.measured?.height ?? 0
			})
		);

		Dagre.layout(g);

		return {
			nodes: nodes.map((node) => {
				const position = g.node(node.id);
				// We are shifting the dagre node position (anchor=center center) to the top left
				// so it matches the Svelte Flow node anchor point (top left).
				const x = position.x - (node.measured?.width ?? 0) / 2;
				const y = position.y - (node.measured?.height ?? 0) / 2;

				return {
					...node,
					position: { x, y },
					sourcePosition: options.direction === 'LR' ? 'right' : 'bottom',
					targetPosition: options.direction === 'LR' ? 'left' : 'top'
				};
			}),
			edges
		};
	}

	function onLayout(direction) {
		const layouted = getLayoutedElements(nodes, edges, { direction });

		nodes = [...layouted.nodes];
		edges = [...layouted.edges];

		fitView();
	}

	const nodeTypes = {
		simple: SimpleNode
	};
</script>

<div class="{initialized ? '' : 'opacity-0'} h-screen w-full">
	<SvelteFlow
		bind:nodes
		bind:edges
		fitView
		maxZoom={1.5}
		minZoom={0.1}
		{nodeTypes}
		oninit={() => {
			setTimeout(() => {
				onLayout('LR');
				initialized = true;
			}, 10);
		}}
		nodesDraggable={false}
	>
		<Background />
		<MiniMap nodeStrokeWidth={3} nodeBorderRadius={2} />
	</SvelteFlow>
</div>
