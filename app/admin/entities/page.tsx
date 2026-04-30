'use client'
import useActionsModal from "./_hooks/useActionsModal"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { FaEye, FaTrash } from "react-icons/fa6"
import { FaEdit } from "react-icons/fa"
import HeaderForm from "@/components/admin/HeaderForm"
import { Entity } from "./_models/entity.model"
import useGetPlantsAndAreas from "./_hooks/useGetPlantsAndAreas.hook"
import { useEntityActions } from "./_hooks/useEntityActions.hook"
import EntityFormModal from "./_components/organisms/EntityFormModal"

const EntitiesPage = () => {
  const { openModal, modalMode, selectedEntity, setOpenModal, openCreateModal, openEditModal, openViewModal } = useActionsModal()
  const {data, refetch} = useGetPlantsAndAreas()
  const { handleDelete, isLoading } = useEntityActions(refetch)

  return (
    <div className="flex flex-col h-full">
      <HeaderForm setOpenModal={openCreateModal} nameModule="Entidad" />
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
          {data?.map((entity: Entity, index:number) => (
            <TableRow key={entity.id}>
              <TableCell>{index+1}</TableCell>
              <TableCell>{entity?.type === 1 ? "Planta" : "Área"}</TableCell>
              <TableCell>{entity?.tag ? entity?.tag : "[S/T]"}</TableCell>
              <TableCell>{entity.name}</TableCell>
              <TableCell>{data?.find((ent: Entity) => ent.id === entity.parent)?.name || '--'}</TableCell>
              <TableCell>
                <div className="flex flex-row gap-2">
                  <Button size="sm" onClick={() => openViewModal(entity)}><FaEye /></Button>
                  <Button size="sm" onClick={() => openEditModal(entity)}><FaEdit /></Button>
                  <Button onClick={() => handleDelete(entity.id!)} size="sm" variant="destructive" disabled={isLoading}><FaTrash /></Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {
        <EntityFormModal
          openModal={openModal}
          setOpenModal={setOpenModal}
          onEntityCreated={refetch}
          mode={modalMode ?? 'create'}
          selectedEntity={selectedEntity}
        />
      }
    </div>
  )
}

export default EntitiesPage;
