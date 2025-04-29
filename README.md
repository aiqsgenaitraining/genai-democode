# GenAI React Setup Guide

## 1. Install Visual Studio Code
- [VS Code for MAC](https://code.visualstudio.com/docs/setup/mac)
- [VS Code for Windows](https://code.visualstudio.com/docs/setup/windows)

## 2. Project Setup
1. Clone the git repository (provided during the live session)
2. Open VS Code
3. Open the cloned repository folder
4. Open terminal window
5. Install dependencies:
   ```bash
   npm install
   ```

## 3. Environment Configuration
1. Create `.env.local` with the following variables:
   ```env
   COHERE_API_KEY=<Get from https://dashboard.cohere.com/api-keys>
   COHERE_EMBEDDING_MODEL=embed-english-v3.0
   GOOGLE_GENERATIVE_AI_API_KEY=<Your API Key>
   PINECONE_API_KEY=<Get from https://app.pinecone.io/>
   PINECONE_INDEX=genaitraining
   PINECONE_ENV=us-east-1
   ```

## 4. Pinecone Setup
Create a new index with these specifications:
- Type: Manual Index
- Name: "genaitraining"
- Dimension: 1024
- Cloud: AWS
- Region: us-east-1

## 5. Data Upload
Trainers will guide you in using Google Collab workspace to upload the PDF to Pinecone

## 6. Run the Application
```bash
npm run dev
```
