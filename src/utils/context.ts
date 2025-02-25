import { ScoredPineconeRecord } from "@pinecone-database/pinecone";
import { getMatchesFromEmbeddings } from "./pinecone";
import { getMatchesFromEmbeddingsQdrant } from "./qdrant";
import { getEmbeddings } from './embeddings'
import { getEmbeddingsCohere } from './embeddingsCohere'

export type Metadata = {
  url: string,
  text: string,
  chunk: string,
}

// The function `getContext` is used to retrieve the context of a given message
export const getContext = async (message: string, namespace: string, maxTokens = 3000, 
  minScore = 0.5, getOnlyText = true): Promise<string | ScoredPineconeRecord[]> => {

  // Get the embeddings of the input message
  // const embedding = await getEmbeddings(message);
  const embedding = await getEmbeddingsCohere(message);
  console.log("Embedding length: ", embedding.length)

  // Retrieve the matches for the embeddings from the specified namespace
  // const matches = await getMatchesFromEmbeddings(embedding, 3, namespace); // pinecone
  const matchesQdrant = await getMatchesFromEmbeddingsQdrant(embedding, 3, "genaitraining"); 

  // const docs = await getMatches(matches, minScore, getOnlyText); // pinecone
  const docs = await getMatchesQdrant(matchesQdrant, minScore, getOnlyText); // qdrant

  console.log("Docs length: ", docs.length)
  // console.log("Docs 0: ", docs[0])
  // Join all the chunks of text together, truncate to the maximum number of tokens, and return the result
  return docs.join("\n").substring(0, maxTokens)
}

async function getMatches(matches: ScoredPineconeRecord<Metadata>[], 
  minScore: number, getOnlyText: boolean){
    // Filter out the matches that have a score lower than the minimum score
    const qualifyingDocs = matches // matches.filter(m => m.score && m.score > minScore);
    console.log("Qualifying docs length: ", qualifyingDocs.length)
  
    if (!getOnlyText) {
      // Use a map to deduplicate matches by URL
      return qualifyingDocs
    }
  
    // let docs = matches ? qualifyingDocs.map(match => (match.metadata as Metadata).chunk) : [];
    let docs = matches ? qualifyingDocs.map(match => (match.metadata as Metadata).text) : [];
    return docs;
}
async function getMatchesQdrant(matches: [], minScore: number, getOnlyText: boolean){
    // Filter out the matches that have a score lower than the minimum score
    const qualifyingDocs = matches // matches.filter(m => m.score && m.score > minScore);
    console.log("Qualifying docs length: ", qualifyingDocs.length)
  
    if (!getOnlyText) {
      // Use a map to deduplicate matches by URL
      return qualifyingDocs
    }
  
    // let docs = matches ? qualifyingDocs.map(match => (match.metadata as Metadata).chunk) : [];
    let docs = matches ? qualifyingDocs.map(match => (match.payload.page_content)) : [];
    // console.log("Docs: ", docs);
    return docs;
}