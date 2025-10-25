# Flow Graphs Demo

This repository is a small demo application that extracts interaction flows from unstructured source documents and visualizes them as directed graphs. It combines a Svelte frontend (with `@xyflow/svelte`) for interactive graph rendering and a LangChain-based backend workflow (using `@langchain/langgraph`) that uses an LLM to convert source documents into nodes and relationships.

I created this project to demonstrate how you can:
- Parse various document formats into plain text,
- Use an LLM to identify discrete user interactions and build a directed flow,
- Render the resulting flow visually with automatic layout (Dagre) and interactive nodes.

## Quick highlights:
- Frontend: Svelte + `@xyflow/svelte` for graph UI, Tailwind for styling.
- Graph layout: `@dagrejs/dagre`.
- LLM / workflow: `@langchain/langgraph` + Azure OpenAI chat model (via `@langchain/openai`).
- Document loaders: PDF/DOCX/CSV/TXT/JSON via LangChain community loaders.

## Prerequisites
- Node.js (v18+ recommended)
- npm
- An Azure OpenAI resource (or modify the code to use another OpenAI provider)

## Setup & Run (local)
1. Install dependencies:
   - Run `npm install`

2. Provide environment variables for Azure OpenAI (used in `src/lib/server/langgraph.ts`):
   - `AZURE_OPENAI_API_KEY`
   - `AZURE_OPENAI_API_VERSION`
   - `AZURE_OPENAI_DEPLOYMENT_NAME`
   - `AZURE_OPENAI_INSTANCE_NAME`
   These should be placed in your environment or a `.env` file consumed by your environment loader (SvelteKit/Vite). If you don't set these, the Graph generation calls will fail; you can still inspect the UI/graph components.

3. Start the dev server:
   - `npm run dev`
   - Open `http://localhost:5173` (or the port Vite reports)

## Build & Preview
- Build for production: `npm run build`
- Preview the build: `npm run preview`

## Project structure (relevant files)
- `src/lib/server/create-graph.ts` — Main workflow that invokes the LLM to generate nodes & relationships using `@langchain/langgraph`.
- `src/lib/server/prompt.ts` — Prompt template that instructs the model how to extract interaction nodes and relationships. The template enforces rules for building a directed graph (no loops, distinct interactions, etc.).
- `src/lib/server/langgraph.ts` — Model configuration (Azure ChatOpenAI wrapper).
- `src/lib/server/source.ts` — Helpers to load different file formats into plain text sources.
- `src/lib/server/graph.ts` — Types: `Interaction` and `Relationship`.
- `src/lib/components/Graph.svelte` & `src/lib/components/Flow.svelte` — UI components that render the generated graph.
- `src/lib/components/SimpleNode.svelte` — Node display with a dialog to show description/tagline.

## How it works (high level)
1. You provide one or more source documents (PDF, DOCX, CSV, TXT, JSON).
2. The app loads those files and turns them into plain text sources.
3. The `createGraph` workflow builds a prompt containing these sources and calls the LLM (via `openAiModel.invoke`) to return a JSON object with:
   - `nodes`: array of interaction nodes (id, title, tagline, description)
   - `relationships`: array of edges (label, from, to)
4. The frontend renders the nodes and edges using `@xyflow/svelte`. A Dagre layout algorithm lays out the graph, and nodes are interactive (click to view details).

## Prompt & Graph rules
- The prompt (`src/lib/server/prompt.ts`) instructs the model to:
  - Extract every distinct interaction point (merge duplicates).
  - Split large interactions into smaller steps when appropriate.
  - Build directed flows (no loops).
  - Show branching where alternatives exist.
- The app expects the LLM to return valid JSON. If the model returns invalid JSON or the call fails, the workflow will surface an error.
