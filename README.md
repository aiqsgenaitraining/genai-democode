# GenAI React Setup Guide

## 1. Install Visual Studio Code
- [VS Code for MAC](https://code.visualstudio.com/docs/setup/mac)
- [VS Code for Windows](https://code.visualstudio.com/docs/setup/windows)

## 2. Install Python
### For Windows:
1. Download and install from [Python 3.12.10](https://www.python.org/downloads/release/python-31210/)
2. Default installation path: `C:/Users/<userid>/AppData/Local/Microsoft/WindowsApps`
3. Configure Environment Variables:
   - Edit PATH to include `C:/Users/<userid>/AppData/Local/Microsoft/WindowsApps`
4. Verify installation:
   ```bash
   python --version
   pip --version
   ```

## 3. Project Setup
1. Clone the git repository (provided during the live session)
2. Open VS Code
3. Open the cloned repository folder
4. Open terminal window
5. Install dependencies:
   ```bash
   npm install
   ```

## 4. Python Environment Setup
```bash
# Create virtual environment
python -m venv genai      # For MacOS use python3 instead

# Activate virtual environment
.\genai\Scripts\activate.bat  # For MacOS use: source ./genai/bin/activate

# Install Python packages
pip install pypdf langchain langchain_community pinecone langchain_pinecone cohere
```

## 5. Environment Configuration
1. Create `.env.local` with the following variables:
   ```env
   COHERE_API_KEY=<Get from https://dashboard.cohere.com/api-keys>
   COHERE_EMBEDDING_MODEL=embed-english-v3.0
   GOOGLE_GENERATIVE_AI_API_KEY=<Your API Key>
   PINECONE_API_KEY=<Get from https://app.pinecone.io/>
   PINECONE_INDEX=genaitraining
   PINECONE_ENV=us-east-1
   ```

2. Set environment variables in terminal:
   ```bash
   # Set these variables in your terminal session
   set PINECONE_API_KEY=<your-key>
   set PINECONE_ENV=us-east-1
   set PINECONE_INDEX=genaitraining
   set COHERE_API_KEY=<your-key>
   set COHERE_EMBEDDING_MODEL=embed-english-v3.0
   ```

## 6. Pinecone Setup
Create a new index with these specifications:
- Type: Manual Index
- Name: "genaitraining"
- Dimension: 1024
- Cloud: AWS
- Region: us-east-1

## 7. Data Upload
Upload PDF to Pinecone:
```bash
python pineconeUpload.py
```

## 8. Run the Application
```bash
npm run dev
```
