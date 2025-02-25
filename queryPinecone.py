from pinecone import Pinecone, ServerlessSpec
import os
from langchain_community.embeddings import OpenAIEmbeddings

# Initialize Pinecone
PINECONE_API_KEY = os.environ.get('PINECONE_API_KEY')
PINECONE_ENV = os.environ.get('PINECONE_ENV')

# Connect to Pinecone
client = Pinecone(api_key=PINECONE_API_KEY)

# Specify your index (make sure it exists)
index_name = os.environ.get('PINECONE_INDEX')
index = client.Index(index_name)

# Initialize OpenAI Embeddings (or another model of your choice)
embeddings = OpenAIEmbeddings()

# Query the index
def query_index(query_text, top_k=3):
    # Generate embeddings for the query text
    query_embedding = embeddings.embed_query(query_text)
    
    # Query Pinecone
    query_response = index.query(
        vector=query_embedding,
        top_k=top_k,
        include_metadata=True
    )
    
    # Extract and return the results
    results = []
    for match in query_response.matches:
        results.append({
            'score': match.score,
            'text': match.metadata['text'],
            'page': match.metadata['page']
        })
    return results

# Test
query = "What are the key Generative AI principles?"
results = query_index(query)

print("\nSearch Results:")
for i, result in enumerate(results, 1):
    print(f"\nResult {i} (Score: {result['score']:.4f})")
    print(f"Text: {result['text']}")
    print(f"Page: {result['page']}")
