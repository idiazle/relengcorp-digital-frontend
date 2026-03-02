'use client'
import { useEffect, useState } from "react"
import { deleteEntity, getEntities } from "@/app/services/entitiesServices"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { FaEye, FaTrash } from "react-icons/fa6"
import { FaEdit } from "react-icons/fa"
import HeaderForm from "../components/HeaderForm"
import { Entity } from "./models/entity.model"
import CreateEntityModal from "./components/CreateEntityModal"

const EntitiesPage = () => {
  const [entities, setEntities] = useState<Entity[]>([])
  const [openModal, setOpenModal] = useState<boolean>(false)

  const getPlantsAndAreas = () => {
    getEntities()
      .then((response) => {
        const resp = response.data.results
        const filtered = resp.filter((ent: Entity) => ent.type === 1 || ent.type === 2)
        const ordered = filtered.sort((a: Entity, b: Entity) => a.type - b.type)
        setEntities(ordered)
      })
      .catch((error) => {
        console.error("Error fetching entities:", error)
      })
  }

  useEffect(() => {
    getPlantsAndAreas()
  }, [])

  const handleDeleteEntity = (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta entidad?")) {
      deleteEntity(id).then((response) => {
        console.log("Entity deleted successfully:", response)
        getPlantsAndAreas()
      })
        .catch((error) => {
          console.error("Error deleting entity:", error)
        })
    }
  }

  return (
    <div className="flex flex-col h-full">
      <HeaderForm setOpenModal={setOpenModal} nameModule="Entidad" />
      <Table className="max-h-[90vh]">
        <TableHeader className="bg-gray-300 sticky top-0">
          <TableRow>
            <TableHead className="font-bold">Id</TableHead>
            <TableHead className="font-bold">Tipo</TableHead>
            <TableHead className="font-bold">Tag</TableHead>
            <TableHead className="font-bold">Nombre</TableHead>
            <TableHead className="font-bold">Superior</TableHead>
            <TableHead className="font-bold">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="overflow-y-auto">
          {entities?.map((entity: Entity, index:number) => (
            <TableRow key={entity.id}>
              <TableCell>{index+1}</TableCell>
              <TableCell>{entity?.type === 1 ? "Planta" : "Área"}</TableCell>
              <TableCell>{entity?.tag ? entity?.tag : "[S/T]"}</TableCell>
              <TableCell>{entity.name}</TableCell>
              <TableCell>{entities.find(ent => ent.id === entity.parent)?.name || '--'}</TableCell>
              <TableCell>
                <div className="flex flex-row gap-2">
                  <Button size="sm"><FaEye /></Button>
                  <Button size="sm"><FaEdit /></Button>
                  <Button onClick={() => handleDeleteEntity(entity.id!)} size="sm" variant="destructive"><FaTrash /></Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {
        <CreateEntityModal
          openModal={openModal}
          setOpenModal={setOpenModal}
          entities={entities}
          onEntityCreated={getPlantsAndAreas}
        />
      }
    </div>
  )
}

export default EntitiesPage;
