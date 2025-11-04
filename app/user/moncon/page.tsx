
import Link from 'next/link'
import React from 'react'
import { FaHouse } from 'react-icons/fa6'

const Moncon = () => {
  return (
    <div className='w-full h-full gap-2 flex flex-col'>
      <div className='flex flex-row gap-2 items-center'>
        <Link href='/menu' ><FaHouse className='text-lg' /></Link>
        <h1>/</h1>
        <h1 className='font-bold text-2xl uppercase'>Dashboard - Monitoreo de Condiciones</h1>
      </div>
      <div className='w-full h-1/2 flex flex-row gap-2'>
        <div className='w-1/3 h-full p-2 rounded-lg border border-gray-300 flex flex-col bg-slate-200'>
          <h1 className='font-semibold'>RESUMEN DE CONDICIONES</h1>
        </div>
        <div className='w-2/3 h-full p-2 rounded-lg border border-gray-300 flex flex-col bg-slate-200'>
          <h1 className='font-semibold'>STATUS DE AVISOS</h1>
        </div>
      </div>
      <div className='w-full h-1/2 flex flex-row gap-2'>
        <div className='w-2/3 h-full p-2 rounded-lg border border-gray-300 flex flex-col bg-slate-200'>
          <h1 className='font-semibold'>RESUMEN CONDICION TANQUES</h1>
        </div>
        <div className='w-1/3 h-full p-2 rounded-lg border border-gray-300 flex flex-col bg-slate-200'>
          <h1 className='font-semibold'>ITEM 4</h1>
        </div>
      </div>
    </div>
  )
}

export default Moncon