'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'

const MonitoreoCondiciones = () => {
  return (
    <div>
      <h1>Monitoreo de Condiciones</h1>
      <div className='bg-slate-200 w-1/3 p-2 rounded-md gap-4 flex flex-col mt-4'>
        <div className='flex flex-col gap-2'>
          <Label className='font-semibold'>Fecha:</Label>
          <Input className='bg-white'></Input>
        </div>
        <div className='flex flex-col gap-2'>
          <Label className='font-semibold'>Fecha:</Label>
          <Input className='bg-white'></Input>
        </div>
        <div className='flex flex-col gap-2'>
          <Label className='font-semibold'>Fecha:</Label>
          <Input className='bg-white'></Input>
        </div>
        <div className='flex flex-col gap-2'>
          <Label className='font-semibold'>Fecha:</Label>
          <Input className='bg-white'></Input>
        </div>
        <div className='flex flex-row gap-2'>
          <Button variant='destructive' className='mt-2'>Cancelar</Button>
          <Button className='mt-2'>Buscar</Button>
        </div>
      </div>
    </div>
  )
}

export default MonitoreoCondiciones