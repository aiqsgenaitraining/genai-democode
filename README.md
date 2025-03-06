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

8. python -m venv genai      ### MacOS would have python3 instead of python
9. .\genai\Scripts\activate.bat ### MacOS use source .\genai\bin\activate
10. pip install pypdf langchain langchain_community pinecone langchain_pinecone
11. pip install qdrant-client ### NOT REQUIRED
12. pip install cohere
13. SET PINECONE_API_KEY, PINECONE_ENV, PINECONE_INDEX, QDRANT_URL, QDRANT_API_KEY, COHERE_API_KEY, COHERE_EMBEDDING_MODEL in command line so that python scripts can access them
14. Set following env variables in .env.local
    COHERE_API_KEY=<>    From https://dashboard.cohere.com/api-keys
    COHERE_EMBEDDING_MODEL=embed-english-v3.0
    GOOGLE_GENERATIVE_AI_API_KEY=<>
    PINECONE_API_KEY=<>  From https://app.pinecone.io/
    PINECONE_INDEX=genaitraining
    PINECONE_ENV=us-east-1

15. Create Index in Pinecone -> Manual Index -> name "genaitraining" -> dimension 1024 -> aws -> Region: us-east-1

16. Upload pdf to pinecone
python pineconeUpload.py

16. To run the application:
npm run dev
