import * as React from 'react'
import Link from 'next/link'

import { IconSeparator, IconVercel } from '@/components/ui/icons'


export async function Header() {
  return (
    <header className="bg-white dark:bg-gray-800 sticky top-0 z-50 flex items-center justify-between w-full h-16 px-4 border-b shrink-0">  
     
      <Link href="/" rel="nofollow" className="mr-2 font-bold">
        GenAI Examples
      </Link>
      <IconSeparator />
      
    </header>
  )
}
