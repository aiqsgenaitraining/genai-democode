from qdrant_client import QdrantClient
from qdrant_client.http import models
from langchain_community.embeddings import CohereEmbeddings
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import CharacterTextSplitter
from langchain_community.vectorstores import Qdrant as QdrantVectorStore

import os

QDRANT_URL = os.environ.get("QDRANT_URL")
QDRANT_API_KEY = os.environ.get("QDRANT_API_KEY")

print(QDRANT_URL)
print(QDRANT_API_KEY)

qdrant_client = QdrantClient(
    url=QDRANT_URL,
    api_key=QDRANT_API_KEY,
)

collections = qdrant_client.get_collections()
print(collections)

collection_name = "genaitraining"

# Initialize Cohere Embeddings (or another model of your choice)
embeddings = CohereEmbeddings(cohere_api_key=os.environ.get("COHERE_API_KEY"),
                              model=os.environ.get("COHERE_EMBEDDING_MODEL"),
                              user_agent="langchain")

facts_store = QdrantVectorStore(client=qdrant_client, 
                                collection_name=collection_name,
                                embeddings=embeddings
                                )

results = facts_store.similarity_search("What is LLM?")
print(results)
