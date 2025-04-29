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
if collection_name not in [c.name for c in collections.collections]:
    qdrant_client.recreate_collection(
        collection_name=collection_name,
        vectors_config=models.VectorParams(
            size=1024,  # TODO: Cohere Embeddings 256 or 512
            distance=models.Distance.COSINE,
        ),
    )

pdf_file = "./Maharashtra-web.pdf"  # Path to your PDF file

# Load PDF using LangChain's PyPDFLoader
pdf_loader = PyPDFLoader(pdf_file)
document = pdf_loader.load()
print("Loaded document")

# Split the document's text into pages or smaller sections
text_splitter = CharacterTextSplitter(separator="\f", chunk_size=1000, chunk_overlap=0)
pages = text_splitter.split_documents(document)
print("Split document into pages")

# Initialize Cohere Embeddings (or another model of your choice)
embeddings = CohereEmbeddings(cohere_api_key=os.environ.get("COHERE_API_KEY"),
                              model=os.environ.get("COHERE_EMBEDDING_MODEL"),
                              user_agent="langchain")

texts = [x.page_content for x in pages]
metadatas = [x.metadata for x in pages]

facts_store = QdrantVectorStore.from_texts(
    texts, embeddings, metadatas,
    location=QDRANT_URL,
    api_key=QDRANT_API_KEY,
    collection_name=collection_name,
)
print(f"Inserted {len(pages)} pages into Qdrant Collection: {collection_name}")

results = facts_store.similarity_search("What is LLM?")
print(results)
