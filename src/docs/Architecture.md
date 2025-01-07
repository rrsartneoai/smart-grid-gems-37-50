# System Architecture Documentation

## Overview
The system implements a PDF and document processing service with AI-powered chat capabilities, built using React and various cloud services.

## Core Components

### File Processing
- **Upload Handler** (`src/components/FileUpload.tsx`)
  - Accepts PDF, DOCX, and image files
  - Processes files using PDF.js, Mammoth, and Tesseract.js
  - Extracts text content for further processing

### Text Processing & Vectorization
- **RAG Utils** (`src/utils/ragUtils.ts`)
  - Implements Retrieval-Augmented Generation (RAG)
  - Splits documents into manageable chunks
  - Generates embeddings for semantic search
  - Uses TF-IDF for relevance scoring

### Chat Interface
- **Chat Component** (`src/components/Chatbot.tsx`)
  - Real-time chat interface
  - Voice input support
  - Message history management
  - Response streaming

### AI Integration
- **Gemini Integration** (`src/lib/gemini.ts`)
  - Handles communication with Google's Gemini API
  - Processes natural language queries
  - Generates contextual responses

## Data Flow

1. **Document Upload**
   ```mermaid
   graph TD
     A[User Uploads File] --> B[File Processing]
     B --> C[Text Extraction]
     C --> D[Document Chunking]
     D --> E[Vector Storage]
   ```

2. **Query Processing**
   ```mermaid
   graph TD
     A[User Query] --> B[Query Vectorization]
     B --> C[Vector Search]
     C --> D[Context Retrieval]
     D --> E[AI Response Generation]
     E --> F[User Interface]
   ```

## Key Technologies

- **Frontend**: React, TypeScript, Tailwind CSS
- **Document Processing**: PDF.js, Mammoth, Tesseract.js
- **AI/ML**: Google Gemini API
- **Vector Search**: TF-IDF implementation
- **UI Components**: shadcn/ui library

## Storage Architecture

- Document chunks stored in memory (current implementation)
- Vector embeddings generated on-the-fly
- Chat history maintained in local storage

## Future Improvements

1. Implement persistent vector storage
2. Add support for more file formats
3. Enhance search relevance with better embedding models
4. Implement user authentication and document permissions
5. Add support for concurrent document processing