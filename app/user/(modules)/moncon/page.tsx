'use client'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TabsContent } from '@radix-ui/react-tabs'
import Dashboard from './_components/organism/Dashboard';
import { sections } from './_utils/moncon.constant';

const Moncon = () => {
  return (
    <div className='w-full h-full p-2'>
      <Tabs defaultValue={sections[0].value} className='w-full flex flex-col'>
        <TabsList className='w-full flex flex-row bg-gray-300 '>
          {
            sections.map(section => (
              <TabsTrigger key={section.id} value={section.value} className='cursor-pointer hover:bg-gray-400'>{section.name}</TabsTrigger>
            ))
          }
        </TabsList>
        {
          sections.map(section => (
            <TabsContent key={section.id} value={section.value} className='w-full h-full'>
              <Dashboard codeArea={section.value} />
            </TabsContent>
          ))
        }
      </Tabs>
    </div >
  )
}

export default Moncon;
