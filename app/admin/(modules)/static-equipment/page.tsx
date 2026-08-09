'use client'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { FaPlus } from 'react-icons/fa6'
import ItemCreateModal from './ItemCreateModal'
import { useEffect, useState } from 'react'
import { Entity } from '../entities/_models/entity.model'
import { getEntities, getEquipments } from '@/app/_services/entitiesServices'

const StaticEquipmentPage = () => {
  const [routes, setRoutes] = useState<Entity[]>([])
  const [openCreateModal, setOpenCreateModal] = useState(false)
  const [items, setItems] = useState<Entity[]>([])

  const getItemsData = () => {
    getEntities().then(response => {
      console.log('Entities fetched:', response.status, response)
      setRoutes(response.data.filter((entity: Entity) => entity.type === 3))
    }).catch(error => {
      console.error('Error al obtener las rutas:', error)
    })
    getEquipments().then(response => {
      console.log('Equipment fetched:', response.status, response)
      setItems(response.data.filter((entity: Entity) => entity.type === 5))
    }).catch(error => {
      console.error('Error al obtener los items:', error)
    })
  }

  useEffect(() => {
    if (!openCreateModal) {
      getItemsData()
    }
  }, [openCreateModal])

  return (
    <div className='flex flex-col h-full'>
      <div className='flex justify-between items-center'>
        <h1 className='font-bold text-lg'>GESTIÓN DE ITEMS</h1>
        <Button onClick={() => { setOpenCreateModal(true) }}><FaPlus /> Nuevo item</Button>
      </div>
      <Separator className='my-2' />
      <Table className="bg-white">
        <TableHeader className="bg-gray-300 sticky top-0 z-10">
          <TableRow>
            <TableHead>N°</TableHead>
            <TableHead>Item</TableHead>
            <TableHead>Tipo de Item</TableHead>
            <TableHead>Ubicación</TableHead>
            <TableHead>Marca</TableHead>
            <TableHead>Modelo</TableHead>
            <TableHead>N° de Serie</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ?
            <TableRow>
              <TableCell colSpan={8} className="text-center italic">No hay equipos estaticos (items) registrados.</TableCell>
            </TableRow>
            :
            items.map((item, index) => (
              <TableRow key={item.id}>
                <TableHead>{index + 1}</TableHead>
                <TableHead>{item.name}</TableHead>
                <TableHead>{item.type}</TableHead>
                <TableHead>{item.name}</TableHead>
                <TableHead>{item.name}</TableHead>
                <TableHead>{item.name}</TableHead>
                <TableHead>{item.name}</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>

      <ItemCreateModal
        routes={routes}
        openModal={openCreateModal}
        setOpenModal={setOpenCreateModal}
      />
    </div>
  )
}

export default StaticEquipmentPage;
