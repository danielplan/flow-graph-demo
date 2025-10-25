import { AzureChatOpenAI } from '@langchain/openai';
import {
	AZURE_OPENAI_API_KEY,
	AZURE_OPENAI_API_VERSION,
	AZURE_OPENAI_DEPLOYMENT_NAME,
	AZURE_OPENAI_INSTANCE_NAME
} from '$env/static/private';

export const openAiModel = new AzureChatOpenAI({
	azureOpenAIApiKey: AZURE_OPENAI_API_KEY,
	azureOpenAIApiInstanceName: AZURE_OPENAI_INSTANCE_NAME,
	azureOpenAIApiDeploymentName: AZURE_OPENAI_DEPLOYMENT_NAME,
	azureOpenAIApiVersion: AZURE_OPENAI_API_VERSION,
	temperature: 0
});
