'use client';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import EquipmentCreateModal from "./components/EquipmentCreateModal";
import { deleteEntity, getEntities } from "@/app/services/entitiesServices";
import { Area, Equipment, Property } from "../utils/types";
import ComponentCreateModal from "./components/ComponentCreateModal";

const RotaryEquipmentPage = () => {
  const [areas, setAreas] = useState<Area[]>([])
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [openCreateModal, setOpenCreateModal] = useState(false)
  const [openComponentCreateModal, setOpenComponentCreateModal] = useState(false)
  
  const getEquipmentsData = () => {
    getEntities().then(response => {
      setEquipments(response.data.filter((entity: Equipment) => entity.type === 3))
    }).catch(error => {
      console.error('Error al obtener los equipos:', error)
    })
  }

  useEffect(() => {
    if (!openCreateModal) {
      getEquipmentsData()
    }
  }, [openCreateModal])

  useEffect(() => {
    getEntities().then(response => {
      setAreas(response.data.filter((entity: Area) => entity.type === 2))
    }).catch(error => {
      console.error('Error al obtener las áreas:', error)
    })
  }, [])

  const handleDeleteEquipment = (id: number) => {
    if (confirm(`¿Estás seguro de que deseas eliminar este equipo?`)) {
      deleteEntity(id).then(() => {
        getEquipmentsData()
      }).catch(error => {
        console.error('Error al eliminar el equipo:', error)
      })
      console.log(`Eliminar equipo con ID: ${id}`)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className='flex justify-between items-center'>
        <h1 className='font-bold text-lg'>GESTIÓN DE EQUIPOS ROTATORIOS</h1>
        <div className='flex flex-row gap-2'>
        <Button className='' onClick={() => { setOpenComponentCreateModal(true) }}><FaPlus /> Nuevo Componente</Button>
        <Button className='' onClick={() => { setOpenCreateModal(true) }}><FaPlus /> Nuevo equipo</Button>
        </div>
      </div>
      <Separator className='my-2' />
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
            equipments.map((equipment: Equipment, index: number) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{areas.find(area => area.id === equipment.parent)?.name || 'N/A'}</TableCell>
                <TableCell>{equipment.tag}</TableCell>
                <TableCell>{equipment.name}</TableCell>
                <TableCell>{equipment.extra_info?.name_en}</TableCell>
                <TableCell>{equipment.extra_info?.description}</TableCell>
                <TableCell>
                  {equipment?.extra_info?.properties?.map((property: Property, propIndex: number) => (
                    <div key={propIndex}>
                      <strong>{property.name}:</strong> {property.value}
                    </div>
                  ))}
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="default">
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="ml-2"
                    onClick={() => equipment.id && handleDeleteEquipment(equipment.id)}>
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
      {
        <EquipmentCreateModal openModal={openCreateModal} setOpenModal={setOpenCreateModal} areas={areas} />
      }
      {
        <ComponentCreateModal openModal={openComponentCreateModal} setOpenModal={setOpenComponentCreateModal} equipments={equipments} />
      }
    </div>

  )
}

export default RotaryEquipmentPage
