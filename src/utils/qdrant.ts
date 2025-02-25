
import { QdrantClient } from '@qdrant/js-client-rest';

const getMatchesFromEmbeddingsQdrant = async (embeddings: number[],
    topK: number, namespace: string): Promise<[]> => {

    const client = new QdrantClient({
        url: process.env.QDRANT_URL,
        apiKey: process.env.QDRANT_API_KEY,
    });

    try {
        const result = await client.getCollections();
        console.log('List of collections:', result.collections);
    } catch (err) {
        console.error('Could not get collections:', err);
    }

    const queryVector = embeddings;

    const queryResult = await client.search(namespace, {
        vector: queryVector,
        limit: topK,
    });
    // search result:  [
    // {
    //     id: 4,
    //     version: 3,
    //     score: 0.99248314,
    //     payload: { city: [Array] },
    //     vector: null
    // },

    // console.log('search result: ', queryResult);
    return queryResult;
}

export { getMatchesFromEmbeddingsQdrant }