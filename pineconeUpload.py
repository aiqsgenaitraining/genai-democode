from langchain_community.embeddings import OpenAIEmbeddings, CohereEmbeddings
from langchain.text_splitter import CharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader
from langchain_community.vectorstores import Pinecone as PineconeVectorStore
from pinecone import Pinecone, ServerlessSpec
import os

# Initialize Pinecone
PINECONE_API_KEY = os.environ.get('PINECONE_API_KEY')
PINECONE_ENV = os.environ.get('PINECONE_ENV')

# Connect to Pinecone
client = Pinecone(api_key=PINECONE_API_KEY)

# Specify your index (make sure it exists)
index_name = os.environ.get('PINECONE_INDEX')
index = client.Index(index_name)

pdf_file = "./genai-principles.pdf"  # Path to your PDF file

# Load PDF using LangChain's PyPDFLoader
pdf_loader = PyPDFLoader(pdf_file)
document = pdf_loader.load()
print("Loaded document")

# Initialize OpenAI Embeddings (or another model of your choice)
# embeddings = OpenAIEmbeddings()
# Initialize Cohere Embeddings (or another model of your choice)
embeddings = CohereEmbeddings(cohere_api_key=os.environ.get("COHERE_API_KEY"),
                              model=os.environ.get("COHERE_EMBEDDING_MODEL"),
                              user_agent="langchain")

# Split the document's text into pages or smaller sections
text_splitter = CharacterTextSplitter(separator="\f", chunk_size=1000, chunk_overlap=0)
pages = text_splitter.split_documents(document)
print("Split document into pages")

# Insert data into Pinecone
PineconeVectorStore.from_documents(pages, embeddings, index_name=index_name)
print(f"Inserted {len(pages)} pages into Pinecone Index: {index_name}")

