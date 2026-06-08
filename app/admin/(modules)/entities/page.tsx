'use client'
import useActionsModal from "./_hooks/useActionsModal"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { FaEye, FaTrash } from "react-icons/fa6"
import { FaEdit } from "react-icons/fa"
import HeaderForm from "@/app/admin/_components/molecules/HeaderForm"
import { Entity } from "./_models/entity.model"
import useGetPlantsAndAreas from "./_hooks/useGetPlantsAndAreas.hook"
import { useEntityActions } from "./_hooks/useEntityActions.hook"
import EntityFormModal from "./_components/organisms/EntityFormModal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const EntitiesPage = () => {
  const { openModal, modalMode, selectedEntity, setOpenModal, openCreateModal, openEditModal, openViewModal } = useActionsModal()
  const { data, refetch } = useGetPlantsAndAreas()
  const plants = data?.filter((entity: Entity) => entity.type === 1) || []
  const areas = data?.filter((entity: Entity) => entity.type === 2) || []
  const routes = data?.filter((entity: Entity) => entity.type === 3) || []
  const { handleDelete, isLoading } = useEntityActions(refetch)

  return (
    <div className="flex flex-col h-full">
      <HeaderForm setOpenModal={openCreateModal} nameModule="Entidad" />
      <Tabs defaultValue="plants" className="w-full">
        <TabsList className="bg-gray-200 justify-start sticky top-0 z-20">
          <TabsTrigger value='plants'>Plantas</TabsTrigger>
          <TabsTrigger value='areas'>Áreas</TabsTrigger>
          <TabsTrigger value='routes'>Rutas</TabsTrigger>
        </TabsList>
        <TabsContent value='plants'>
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
              {plants?.map((entity: Entity, index: number) => (
                <TableRow key={entity.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{entity?.type === 1 ? "Planta" : "No reconocido"}</TableCell>
                  <TableCell>{entity?.tag ? entity?.tag : "[S/T]"}</TableCell>
                  <TableCell>{entity.name}</TableCell>
                  <TableCell>{entity.parent?.name || '--'}</TableCell>
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
        </TabsContent>
        <TabsContent value='areas'>
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
              {areas?.map((entity: Entity, index: number) => (
                <TableRow key={entity.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{entity?.type === 2 ? "Área" : "No reconocido"}</TableCell>
                  <TableCell>{entity?.tag ? entity?.tag : "[S/T]"}</TableCell>
                  <TableCell>{entity.name}</TableCell>
                  <TableCell>{entity.parent?.name || '--'}</TableCell>
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
        </TabsContent>
        <TabsContent value='routes'>
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
              {routes?.map((entity: Entity, index: number) => (
                <TableRow key={entity.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{entity?.type === 3 ? "Ruta" : "No reconocido"}</TableCell>
                  <TableCell>{entity?.tag ? entity?.tag : "[S/T]"}</TableCell>
                  <TableCell>{entity.name}</TableCell>
                  <TableCell>{entity.parent?.name || '--'}</TableCell>
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
        </TabsContent>
      </Tabs>
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
