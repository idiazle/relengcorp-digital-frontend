
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TabsContent } from '@radix-ui/react-tabs'
import Link from 'next/link'
import React from 'react'
import { FaHouse } from 'react-icons/fa6'

const Moncon = () => {
  return (
    <div className='w-full h-full gap-2 flex flex-col'>
      {/* <div className='flex flex-row gap-2 items-center'>
        <Link href='/menu' ><FaHouse className='text-lg' /></Link>
        <h1>/</h1>
        <h1 className='font-bold text-2xl uppercase'>Dashboard - Monitoreo de Condiciones</h1>
      </div> */}
      <Tabs defaultValue='pdmp' className='w-full h-full flex flex-col'>
        <TabsList className='w-full flex flex-row bg-gray-200'>
          <TabsTrigger value='pdmp'>PDM PTAE</TabsTrigger>
          <TabsTrigger value='pdma'>PDM ANTAPACCAY</TabsTrigger>
          <TabsTrigger value='ndtp'>NDT TUBERIAS PTAE</TabsTrigger>
          <TabsTrigger value='ndta'>NDT TUBERIAS ANTAPACCAY</TabsTrigger>
          <TabsTrigger value='ndtt'>NDT TUBERIAS TINTAYA</TabsTrigger>
        </TabsList>
        <TabsContent value='pdmp' className='flex flex-row w-full h-full gap-2'>
          <div className=' flex flex-col w-1/2 h-full gap-2'>
            <div className='flex flex-col w-full h-1/3 bg-white rounded-md'>
              <div className='w-full flex justify-center bg-gray-200 font-bold p-1 rounded-t-md'><h1>CONDICION DE EQUIPOS/COMPONENTES</h1></div>
              <div className='flex flex-row gap-1'>
                <div className='flex w-1/2'>
                  <h1>Grafica Circular</h1>
                </div>
                <div className='flex w-1/2'>
                  <h1>Grafica de barras</h1>
                </div>
              </div>
            </div>
            <div className='flex flex-col w-full h-2/3 bg-white rounded-md'>
              <div className='flex flex-row gap-1'>
                <div className='flex flex-col w-1/2'>
                  <div className='w-full flex justify-center bg-gray-200 font-bold p-1 rounded-t-md'><h1>CUMPLIMIENTO</h1></div>
                  <div className='w-full flex justify-center font-bold p-1 rounded-t-md gap-2 flex-row'>
                    <button className='w-1/3 border border-black bg-gray-100'>Dia</button>
                    <button className='w-1/3 border border-black bg-gray-100'>Semana</button>
                    <button className='w-1/3 border border-black bg-gray-100'>Mes</button>
                  </div>
                </div>
                <div className='flex flex-col w-1/2'>
                  <div className='w-full flex justify-center bg-gray-200 font-bold p-1 rounded-t-md'><h1>TAREAS NO PROGRAMADAS</h1></div>
                  <div className='w-full flex justify-center font-bold p-1 rounded-t-md gap-2 flex-row'>
                    <button className='w-1/3 border border-black bg-gray-100'>Semana</button>
                    <button className='w-1/3 border border-black bg-gray-100'>Mes</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className=' flex flex-col w-1/2 h-full gap-2'>
            <div className='flex flex-col w-full h-2/3 bg-white rounded-md'>

            </div>
            <div className='flex flex-col w-full h-1/3 bg-white rounded-md'>
              <div className='w-full flex justify-center bg-gray-200 font-bold p-1 rounded-t-md'><h1>AVISOS & OT</h1></div>
              <div className='flex flex-row gap-1'>
                <div className='flex w-1/2'>
                  <h1>Grafica Circular</h1>
                </div>
                <div className='flex w-1/2'>
                  <h1>Grafica de barras</h1>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value='pdma'>
          <h1>PDM ANTAPACCAY</h1>
        </TabsContent>
        <TabsContent value='ndtp'>
          <h1>NDT TUBERIAS PTAE</h1>
        </TabsContent>
        <TabsContent value='ndta'>
          <h1>NDT TUBERIAS ANTAPACCAY</h1>
        </TabsContent>
        <TabsContent value='ndtt'>
          <h1>NDT TUBERIAS TINTAYA</h1>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Moncon