
import { CohereEmbeddings } from "@langchain/cohere";

export async function getEmbeddingsCohere(input: string) {
  try {
    const embeddings = new CohereEmbeddings({
      apiKey: process.env.COHERE_API_KEY, // In Node.js defaults to process.env.COHERE_API_KEY
      batchSize: 10, // Default value if omitted is 48. Max value is 96
      model: process.env.COHERE_EMBEDDING_MODEL,
    });

    const result = await embeddings.embedQuery(input);
    return result as number[]

  } catch (e) {
    console.log("Error calling Cohere embedding API: ", e);
    throw new Error(`Error calling Cohere embedding API: ${e}`);
  }
}