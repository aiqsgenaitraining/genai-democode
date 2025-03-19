'use client';

import { Card } from "@/components/ui/card"
import { type CoreMessage } from 'ai';
import { useEffect, useState } from 'react';
import { getSQLfromText} from '@/app/actions';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { IconArrowUp } from '@/components/ui/icons';
import {executeSQL} from '@/lib/sqllib'
import DynamicTable from "./DynamicTable";
import React, { useRef } from 'react';


export const maxDuration = 30;
interface ChatProps {
  chatType?: string;
}
interface TableData {
  [key: string]: any;
}
function scrollDivToBottom(divId: string) {
  const element = document.getElementById(divId);
  
  if (element) {
    element.scrollTop = element.scrollHeight;
    element.scrollIntoView({ behavior: 'smooth' });
    
  }
}
export default function ChatSQL({ chatType = 'SIMPLE' }: ChatProps) {
  const [messages, setMessages] = useState<CoreMessage[]>([]);
  
  const [sqlData, setsqlData] = useState<TableData[]>([]);  
  const input = useRef(null);


  const handleInputChange = () => {
    // Input value is stored in inputRef.current.value
    
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newMessages: CoreMessage[] = [
      ...messages,
      { content: input.current.value, role: 'user' },
    ];
    setMessages(newMessages);
    if (input.current) {
      input.current.value = '';
    }
    let result:any = ''

    let dataRecords:any = ''

    try {
      result = await getSQLfromText(newMessages);
      console.log("result",result)

      if(result.toLowerCase().startsWith('select'))
      {
        try {
          dataRecords = await executeSQL(result)         
          setsqlData(dataRecords)
        } catch (sqlError: Error | any) {
          result = `Error executing SQL query: ${sqlError.message}`
        }
      }
    } catch (error) {
      result = `Error processing request: ${error instanceof Error ? error.message : 'Unknown error occurred'}`
    }
        
    setMessages([
      ...newMessages,
      {
        role: 'assistant',
        content: result as string, 
      },
    ]);
    
   
  }
  useEffect(() => {
    scrollDivToBottom('chatMessages');
  }, [messages]);
  return (   
    
    <>
    <div id="chatMessages" className="h-full overflow-y-auto">
      {messages.length <= 0 ? (
      <p></p>
      )
      : (
        <div className="max-w-xl mx-auto" >
        {messages.map((message, index) => (
          <div key={index} className="whitespace-pre-wrap flex mb-5">
          {message.role === 'user' && (
            <div className="dark:bg-gray-800 bg-slate-200 ml-auto p-2 rounded-lg">
            {message.content as string}
            </div>
          )}
          {message.role === 'assistant' && typeof message.content === 'string' && !message.content.toLowerCase().startsWith('select') && (
            <div className="bg-transparent p-2 rounded-lg">
            {message.content as string}
            </div>
          )}
          {message.role === 'assistant' && typeof message.content === 'string' && message.content.toLowerCase().startsWith('select') && (
            <div className="bg-transparent p-2 rounded-lg">
            <DynamicTable data={sqlData} />
            </div>
          )}
          </div>
        ))}
        </div>
      )}
    </div>
    <div className="">
        <div className="w-full max-w-xl mx-auto">
          <Card className="p-2">
            <form onSubmit={handleSubmit}>
              <div className="flex">
                <Input
                  type="text"
                  ref={input} onChange={handleInputChange}
                  className="w-[95%] mr-2 border-0 ring-offset-0 focus-visible:ring-0 focus-visible:outline-none focus:outline-none focus:ring-0 ring-0 focus-visible:border-none border-transparent focus:border-transparent focus-visible:ring-none"
                  placeholder='Query database using English...' />
                <Button>
                  <IconArrowUp />
                </Button>
              </div>
              {messages.length > 1 && (
                <div className="text-center">
                </div>
              )}
            </form>
          </Card>
        </div>
      </div></>
    
  );
}
