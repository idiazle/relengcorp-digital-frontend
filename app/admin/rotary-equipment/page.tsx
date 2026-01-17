'use client';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { FaPlus } from "react-icons/fa6";
import EquipmentCreateModal from "./components/EquipmentCreateModal";

const RotaryEquipmentPage = () => {
  const [equipments, setEquipments] = useState([]);
  const [openCreateModal, setOpenCreateModal] = useState(false)

  return (
    <div>
       <div className='w-full flex flex-row justify-between items-center mb-4'>
        <h1 className='font-bold text-lg'>GESTIÓN DE EQUIPOS ROTATORIOS</h1>
        <div className='flex flex-row items-center gap-2'>
          <Button onClick={() => setOpenCreateModal(true)}><FaPlus /> Agregar equipo</Button>
        </div>
      </div>
       <Separator className='my-4' />
       <Table className="bg-white">
        <TableHeader className="bg-gray-300 sticky top-0 z-10">
          <TableRow>
            <TableHead>N°</TableHead>
            <TableHead>Area</TableHead>
            <TableHead>TAG</TableHead>
            <TableHead>Nombre Español</TableHead>
            <TableHead>Nombre Inglés</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Propiedades</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {equipments.length === 0 ? 
            <TableRow>
              <TableCell colSpan={8} className="text-center italic">No hay equipos rotatorios registrados.</TableCell>
            </TableRow>
            :
            equipments.map((equipment: any, index: number) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{equipment.area}</TableCell>
                <TableCell>{equipment.tag}</TableCell>
                <TableCell>{equipment.name_spanish}</TableCell>
                <TableCell>{equipment.name_english}</TableCell>
                <TableCell>{equipment.description}</TableCell>
                <TableCell>
                  {equipment.properties.map((property: any, propIndex: number) => (
                    <div key={propIndex}>
                      <strong>{property.name}:</strong> {property.value}
                    </div>
                  ))}
                </TableCell>
                <TableCell>
                  {/* Aquí puedes agregar botones para editar o eliminar el equipo */}
                </TableCell>
              </TableRow>
            ))
          }
        </TableBody>
       </Table>
    {
      <EquipmentCreateModal openModal={openCreateModal} setOpenModal={setOpenCreateModal} />
    }     
    </div>

  )
}

export default RotaryEquipmentPage
