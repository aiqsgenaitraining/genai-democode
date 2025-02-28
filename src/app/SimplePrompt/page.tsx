'use client';
import React, { useState, ChangeEvent } from 'react';

async function fetchData(query: string): Promise<any> {
  const res = await fetch(`/api/VercelSimplePrompt`, { method: "POST", body: JSON.stringify({ prompt: query }) });
  if (!res.ok) {
    throw new Error('API request failed');
  }


  return await res.json();
}

async function fetchGeminiData(query: string): Promise<any> {
  const res = await fetch(`/api/GeminiSimplePrompt`, { method: "POST", body: JSON.stringify({ prompt: query }) });
  if (!res.ok) {
    throw new Error('API request failed');
  }


  return await res.json();
}

const TextInputWithApiCall: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(event.target.value);
    setResponse("")
  };

  const handleSubmit = async () => {
    setResponse("")
    if (!inputText.trim()) {
      setError('Input cannot be empty');
      return;
    }
    setError(null);
    try {
      const data = await fetchData(inputText);


      setResponse(data.replace(/"/g, ''));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGeminiSubmit = async () => {
    setResponse("")
    if (!inputText.trim()) {
      setError('Input cannot be empty');
      return;
    }
    setError(null);
    try {
      const data = await fetchGeminiData(inputText);


      setResponse(data.replace(/"/g, ''));
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="bg-white dark:bg-gray-800 rounded-lg px-6 py-8 ring shadow-xl ring-gray-900/5">



        <div className="flex flex-col items-center gap-4 p-6 bg-white shadow-lg rounded-lg w-full">
          <textarea
            value={inputText}
            onChange={handleInputChange}
            placeholder="Enter prompt text here"
            className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          />
          <div className="flex space-x-4">
            <button onClick={handleSubmit}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Fire the prompt Vercel AI SDK
            </button>

            <button onClick={handleGeminiSubmit}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Fire the prompt Gemini Node lib
            </button>
          </div>

          {error && <p style={{ color: 'red' }}>{error}</p>}
          {response && (
            <div className="w-full">
              <h3>Response:</h3>
              <div className="w-full p-6 bg-white shadow-lg rounded-lg">
                <textarea
                  id="output"
                  value={JSON.stringify(response, null, 2).replace(/"/g, '').replace(/\\n/g, '\n')}
                  readOnly
                  className="w-full  border border-gray-300 rounded-lg bg-gray-100 text-gray-800 overflow-y-auto whitespace-pre-wrap resize-y"

                  rows={10}
                />
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};





export default TextInputWithApiCall;
