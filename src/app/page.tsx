
import { LuBrain } from "react-icons/lu";
import Link from 'next/link'

export default function Home() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg px-6 py-8 ring shadow-xl ring-gray-900/5">
      <div>
        <span className="inline-flex items-center justify-center rounded-md bg-indigo-500 p-2 shadow-lg">
        <LuBrain />
        </span>
      </div>
      <h3 className="text-gray-900 dark:text-white mt-5 text-base font-medium tracking-tight">
        <Link className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300" href='/SimplePrompt'>Basic Prompt demo</Link>
      </h3> 
      <h3 className="text-gray-900 dark:text-white mt-5 text-base font-medium tracking-tight">
        <Link className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300" href='/ChatRag'>Chat RAG using pinecone demo</Link>
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
          
      </p>
    </div>
  );
}
