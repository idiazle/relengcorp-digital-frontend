'use client'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Table, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { FaPlus } from 'react-icons/fa6'

const StaticEquipmentPage = () => {
  return (
     <div className='flex flex-col h-full'>
      <div className='flex justify-between items-center'>
        <h1 className='font-bold text-lg'>GESTIÓN DE EQUIPOS ESTÁTICOS</h1>
          <Button onClick={() => {console.log('Agregando equipo')}}><FaPlus /> Nuevo equipo</Button>
      </div>
      <Separator className='my-2' />
       <Table className="bg-white">
        <TableHeader className="bg-gray-300 sticky top-0 z-10">
          <TableRow>
            <TableHead>N°</TableHead>
            <TableHead>Equipo</TableHead>
            <TableHead>Tipo de Equipo</TableHead>
            <TableHead>Ubicación</TableHead>
            <TableHead>Marca</TableHead>
            <TableHead>Modelo</TableHead>
            <TableHead>N° de Serie</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
       </Table>
    </div>
  )
}

export default StaticEquipmentPage;
