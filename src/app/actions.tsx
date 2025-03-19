'use server';

import { createStreamableValue } from 'ai/rsc';
import { CoreMessage, generateText, streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';


import { ReactNode } from 'react';
import { getContext } from '@/utils/context';


export interface Message {
  role: 'user' | 'assistant';
  content: string;
  display?: ReactNode;
}

const sqlSchema: string = `
CREATE TABLE [Albums]
(
    [AlbumId] INTEGER  NOT NULL,
    [Title] NVARCHAR(160)  NOT NULL,
    [ArtistId] INTEGER  NOT NULL,
    CONSTRAINT [PK_Album] PRIMARY KEY  ([AlbumId]),
    FOREIGN KEY ([ArtistId]) REFERENCES [Artist] ([ArtistId]) 
		ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TABLE [Artists]
(
    [ArtistId] INTEGER  NOT NULL,
    [Name] NVARCHAR(120),
    CONSTRAINT [PK_Artist] PRIMARY KEY  ([ArtistId])
);

CREATE TABLE [Customers]
(
    [CustomerId] INTEGER  NOT NULL,
    [FirstName] NVARCHAR(40)  NOT NULL,
    [LastName] NVARCHAR(20)  NOT NULL,
    [Company] NVARCHAR(80),
    [Address] NVARCHAR(70),
    [City] NVARCHAR(40),
    [State] NVARCHAR(40),
    [Country] NVARCHAR(40),
    [PostalCode] NVARCHAR(10),
    [Phone] NVARCHAR(24),
    [Fax] NVARCHAR(24),
    [Email] NVARCHAR(60)  NOT NULL,
    [SupportRepId] INTEGER,
    CONSTRAINT [PK_Customer] PRIMARY KEY  ([CustomerId]),
    FOREIGN KEY ([SupportRepId]) REFERENCES [Employee] ([EmployeeId]) 
		ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TABLE [Employees]
(
    [EmployeeId] INTEGER  NOT NULL,
    [LastName] NVARCHAR(20)  NOT NULL,
    [FirstName] NVARCHAR(20)  NOT NULL,
    [Title] NVARCHAR(30),
    [ReportsTo] INTEGER,
    [BirthDate] DATETIME,
    [HireDate] DATETIME,
    [Address] NVARCHAR(70),
    [City] NVARCHAR(40),
    [State] NVARCHAR(40),
    [Country] NVARCHAR(40),
    [PostalCode] NVARCHAR(10),
    [Phone] NVARCHAR(24),
    [Fax] NVARCHAR(24),
    [Email] NVARCHAR(60),
    CONSTRAINT [PK_Employee] PRIMARY KEY  ([EmployeeId]),
    FOREIGN KEY ([ReportsTo]) REFERENCES [Employee] ([EmployeeId]) 
		ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TABLE [Genres]
(
    [GenreId] INTEGER  NOT NULL,
    [Name] NVARCHAR(120),
    CONSTRAINT [PK_Genre] PRIMARY KEY  ([GenreId])
);

CREATE TABLE [Invoices]
(
    [InvoiceId] INTEGER  NOT NULL,
    [CustomerId] INTEGER  NOT NULL,
    [InvoiceDate] DATETIME  NOT NULL,
    [BillingAddress] NVARCHAR(70),
    [BillingCity] NVARCHAR(40),
    [BillingState] NVARCHAR(40),
    [BillingCountry] NVARCHAR(40),
    [BillingPostalCode] NVARCHAR(10),
    [Total] NUMERIC(10,2)  NOT NULL,
    CONSTRAINT [PK_Invoice] PRIMARY KEY  ([InvoiceId]),
    FOREIGN KEY ([CustomerId]) REFERENCES [Customer] ([CustomerId]) 
		ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TABLE [Invoice_items]
(
    [InvoiceLineId] INTEGER  NOT NULL,
    [InvoiceId] INTEGER  NOT NULL,
    [TrackId] INTEGER  NOT NULL,
    [UnitPrice] NUMERIC(10,2)  NOT NULL,
    [Quantity] INTEGER  NOT NULL,
    CONSTRAINT [PK_InvoiceLine] PRIMARY KEY  ([InvoiceLineId]),
    FOREIGN KEY ([InvoiceId]) REFERENCES [Invoice] ([InvoiceId]) 
		ON DELETE NO ACTION ON UPDATE NO ACTION,
    FOREIGN KEY ([TrackId]) REFERENCES [Track] ([TrackId]) 
		ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TABLE [Media_Types]
(
    [MediaTypeId] INTEGER  NOT NULL,
    [Name] NVARCHAR(120),
    CONSTRAINT [PK_MediaType] PRIMARY KEY  ([MediaTypeId])
);

CREATE TABLE [Playlists]
(
    [PlaylistId] INTEGER  NOT NULL,
    [Name] NVARCHAR(120),
    CONSTRAINT [PK_Playlist] PRIMARY KEY  ([PlaylistId])
);

CREATE TABLE [Playlist_Track]
(
    [PlaylistId] INTEGER  NOT NULL,
    [TrackId] INTEGER  NOT NULL,
    CONSTRAINT [PK_PlaylistTrack] PRIMARY KEY  ([PlaylistId], [TrackId]),
    FOREIGN KEY ([PlaylistId]) REFERENCES [Playlist] ([PlaylistId]) 
		ON DELETE NO ACTION ON UPDATE NO ACTION,
    FOREIGN KEY ([TrackId]) REFERENCES [Track] ([TrackId]) 
		ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TABLE [Tracks]
(
    [TrackId] INTEGER  NOT NULL,
    [Name] NVARCHAR(200)  NOT NULL,
    [AlbumId] INTEGER,
    [MediaTypeId] INTEGER  NOT NULL,
    [GenreId] INTEGER,
    [Composer] NVARCHAR(220),
    [Milliseconds] INTEGER  NOT NULL,
    [Bytes] INTEGER,
    [UnitPrice] NUMERIC(10,2)  NOT NULL,
    CONSTRAINT [PK_Track] PRIMARY KEY  ([TrackId]),
    FOREIGN KEY ([AlbumId]) REFERENCES [Album] ([AlbumId]) 
		ON DELETE NO ACTION ON UPDATE NO ACTION,
    FOREIGN KEY ([GenreId]) REFERENCES [Genre] ([GenreId]) 
		ON DELETE NO ACTION ON UPDATE NO ACTION,
    FOREIGN KEY ([MediaTypeId]) REFERENCES [MediaType] ([MediaTypeId]) 
		ON DELETE NO ACTION ON UPDATE NO ACTION
);
`;

// Streaming Chat 
export async function continueTextConversation(messages: CoreMessage[]) {
  const result = await streamText({
    model: openai('gpt-4-turbo'),
    messages,
  });

  const stream = createStreamableValue(result.textStream);
  //console.log(stream.value)
  return stream.value;
}

export async function continueTextConversationGemini(messages: CoreMessage[]) {
  
  const result = await streamText({
    model: google('gemini-1.5-flash-latest'),
    messages,
  });

  const stream = createStreamableValue(result.textStream);
  //console.log(stream.value)
  return stream.value;
}
export async function continueTextConversationRAG(messages: CoreMessage[]) {
  console.log("RAG for: ", messages[messages.length - 1].content)
  const lastMessageContent = messages[messages.length - 1].content;
  if (typeof lastMessageContent !== 'string') {
    throw new Error('Last message content must be a string');
  }
  const context = await getContext(lastMessageContent, "pinecone" as string);
  console.log("Context Length: ", context.length)

  const prompt = [
    {
      role: 'system',
      content: `AI assistant is an expert and reliable source of knowledge.
      START CONTEXT BLOCK
      ${context}
      END OF CONTEXT BLOCK
      AI assistant will strictly follow the provided context for responses.
      If the context does not provide an answer, AI will respond with: "I'm sorry, but I don't know the answer to that question."
      `,
    },
  ];

  try {
    const model = "gemini-1.5-flash"
    console.log("RAG model: ", model);
    const result = await streamText({
      model: google(model),
      // model: openai(model),
      messages: [...(prompt as CoreMessage[]), ...messages.filter((message) => message.role === 'user')],
    });

    console.log("RAG response streaming...");

    return createStreamableValue(result.text).value;
  } catch (error) {
    console.error("Error in RAG conversation:", error);
    throw new Error("Failed to fetch AI response.");
  }
}

export async function continueTextConversationSQL(messages: CoreMessage[]) {
  
  const lastMessageContent = messages[messages.length - 1].content;
  if (typeof lastMessageContent !== 'string') {
    throw new Error('Last message content must be a string');
  }
  const context = ""
  

  const prompt = [
    {
      role: 'system',
      content: `Given the following SQL tables, your job is to write only SELECT queries given a user’s request.
      START SQL SCHEMA BLOCK
      ${sqlSchema}
      END OF SQL SCHEMA BLOCK
      AI assistant will strictly follow the provided schema to write queries. The select queries syntax should be compatible with sqllite3.
      If the SQL cannot be generated then , AI will respond with: "Error while generating SQL query. The output must be only query text without any additional information. Do not include '''sql at the beginning of the query."
      `,
    },
  ];

  try {
    const model = "gemini-1.5-flash"
    console.log("RAG model: ", model);
    const result = await streamText({
      model: google(model),
      // model: openai(model),
      messages: [...(prompt as CoreMessage[]), ...messages.filter((message) => message.role === 'user')],
    });

    return createStreamableValue(result.textStream).value;
  } catch (error) {
    console.error("Error in SQL conversation:", error);
    throw new Error("Failed to fetch AI response.");
  }
}
export async function getSQLfromText(messages: CoreMessage[]) {
  
  const lastMessageContent = messages[messages.length - 1].content;
  if (typeof lastMessageContent !== 'string') {
    throw new Error('Last message content must be a string');
  }
  const context = ""
  

  const prompt = [
    {
      role: 'system',
      content: `Given the following SQL tables, your job is to write only SELECT queries given a user’s request.
      START SQL SCHEMA BLOCK
      ${sqlSchema}
      END OF SQL SCHEMA BLOCK
      AI assistant will strictly follow the provided schema to write queries. Do not generate non existant column name from schema.  The select queries syntax should be compatible with sqllite3.
      If the SQL cannot be generated then , AI will respond with: "Error while generating SQL query. The output must be only query text without any additional information. Do not include sql string at the beginning of the query. The query output must contain only select statement and no other pre or post characters.Please provide the answer in plain text, without any code formatting."
      `,
    },
  ];

  try {
    const model = "gemini-1.5-flash"
    console.log("RAG model: ", model);
    const result = await generateText({
      model: google(model),
      // model: openai(model),
      messages: [...(prompt as CoreMessage[]), ...messages.filter((message) => message.role === 'user')],
    });
    
    return result.text.replace(/`/g, "").replace(/sql/g, "").replaceAll('\n', ' ').trim();
  } catch (error) {
    console.error("Error in SQL conversation:", error);
    throw new Error("Failed to fetch AI response.");
  }
}

// Utils
export async function checkAIAvailability() {
  const envVarExists = !!process.env.OPENAI_API_KEY;
  return envVarExists;
}