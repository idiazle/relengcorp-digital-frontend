'use client'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TabsContent } from '@radix-ui/react-tabs'
import Dashboard from './_components/organism/Dashboard';

const sections = [
  { id: 1, name: 'PDM PTAE', value: 'pdmp' },
  { id: 2, name: 'PDM ANTAPACCAY', value: 'pdma' },
  { id: 3, name: 'NDT TUBERIAS PTAE', value: 'ndtp' },
  { id: 4, name: 'NDT TUBERIAS ANTAPACCAY', value: 'ndta' },
  { id: 5, name: 'NDT TUBERIAS TINTAYA', value: 'ndtt' },
]

const Moncon = () => {
  return (
    <div className='w-full h-full p-2'>
      <Tabs defaultValue='pdma' className='w-full h-full flex flex-col'>
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
              <Dashboard area={section.value} />
            </TabsContent>
          ))
        }
      </Tabs>
    </div >
  )
}

export default Moncon