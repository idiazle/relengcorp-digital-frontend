'use client';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FaPlus } from "react-icons/fa6";


const MonitoreoEquiposRotatorios = () => {
  return (
    <div>
       <div className='w-full flex flex-row justify-between items-center mb-4'>
        <h1 className='font-bold text-lg'>MONITOREO DE EQUIPOS ROTATORIOS</h1>
        <div className='flex flex-row items-center gap-2'>
          <Button onClick={() => {console.log('Agregando equipo')}}><FaPlus /> Agregar equipo</Button>
        </div>
      </div>
       <Separator className='my-4' />
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

export default MonitoreoEquiposRotatorios;
