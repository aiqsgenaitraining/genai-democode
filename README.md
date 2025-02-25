1. Install vscode 
VS CODE 

For MAC - https://code.visualstudio.com/docs/setup/mac 

For Windows - https://code.visualstudio.com/docs/setup/windows  

2. Install Python. 
For Windows:  https://www.python.org/ftp/python/3.13.2/python-3.13.2-amd64.exe
It should typically install in C:/Users/<userid>/AppData/Local/Microsoft/WindowsApps
Edit Environment variables and set PATH to C:/Users/<userid>/AppData/Local/Microsoft/WindowsApps
Verify with python --version
Verify with pip --version

3. Clone git repository(mention git repository url here) in a folder

4. Open VS code

5. Open folder (where you have cloned the repository)

6. Open terminal window

7. npm install 
8. pip install langchain langchain_community pinecone
9. pip install qdrant-client
10. pip install cohere
11. SET PINECONE_API_KEY, PINECONE_ENV, PINECONE_INDEX, QDRANT_URL, QDRANT_API_KEY, COHERE_API_KEY, COHERE_EMBEDDING_MODEL in command line so that python scripts can access them
12. Set following env variables in .env.local
OPENAI_API_KEY="<>"
GOOGLE_GENERATIVE_AI_API_KEY="<>"
PINECONE_API_KEY="<>"
PINECONE_INDEX="<>"
PINECONE_ENV="<>"

Go to terminal and execute npm run dev
