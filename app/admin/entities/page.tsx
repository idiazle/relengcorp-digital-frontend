'use client'
import { useEffect, useState } from "react"
import { createEntity, deleteEntity, getEntities } from "@/app/services/entitiesServices"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Entity } from "@/lib/types"
import { Separator } from "@/components/ui/separator"
import { FaEye, FaPlus, FaTrash } from "react-icons/fa6"
import { FaEdit } from "react-icons/fa"

const EntitiesPage = () => {
  const [entities, setEntities] = useState<Entity[]>([])
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [entityData, setEntityData] = useState<Entity>({
    name: '',
    type: 1,
  })

  useEffect(() => {
    getEntities()
      .then((response) => {
        const resp = response.data;
        console.log("Fetched entities:", resp)
        setEntities(resp)
      })
      .catch((error) => {
        console.error("Error fetching entities:", error)
      })
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEntityData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = () => {
    console.log("Submitting entity data:", entityData)
    createEntity(entityData)
      .then((response) => {
        console.log("Entity created successfully:", response)
        return getEntities()
      })
      .then((response) => {
        setEntities(response.data)
        setOpenModal(false)
        // Resetear el formulario
        setEntityData({
          name: '',
          type: 1,
        })
      })
      .catch((error) => {
        console.error("Error creating entity:", error)
      })

  }

  const handleDeleteEntity = (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta entidad?")) {
      deleteEntity(id).then((response) => {
        setEntities((prevEntities) => prevEntities.filter((entity) => entity.id !== id))
        console.log("Entity deleted successfully:", response)
      })
        .catch((error) => {
          console.error("Error deleting entity:", error)
        })
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className='flex justify-between items-center'>
        <h1 className='font-bold text-lg'>GESTIÓN DE ENTIDADES</h1>
        <Button className='' onClick={() => { setOpenModal(true) }}><FaPlus /> Nueva entidad</Button>
      </div>
      <Separator className='my-2' />
      <Table className="max-h-[90vh]">
        <TableHeader className="bg-gray-300 sticky top-0">
          <TableRow>
            <TableHead className="font-bold">ID</TableHead>
            <TableHead className="font-bold">TAG</TableHead>
            <TableHead className="font-bold">NOMBRE</TableHead>
            <TableHead className="font-bold">INFO. EXTRA</TableHead>
            <TableHead className="font-bold">TIPO</TableHead>
            <TableHead className="font-bold">ACCIONES</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="overflow-y-auto">
          {entities.filter((ent) => ent.type === 1 || ent.type === 2).map((entity) => (
            <TableRow key={entity.id}>
              <TableCell>{entity.id}</TableCell>
              <TableCell>{entity.extra_info?.tag ? entity.extra_info.tag : "[S/T]"}</TableCell>
              <TableCell>{entity.name}</TableCell>
              <TableCell>{entity.extra_info ? "No hay información extra" : JSON.stringify(entity.extra_info)}</TableCell>
              <TableCell>{entity?.type === 1 ? "Planta" : "Área"}</TableCell>
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
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="min-w-[500px]">
          <DialogHeader>
            <DialogTitle>Crear Nueva Entidad</DialogTitle>
            <DialogDescription>
              Complete el siguiente formulario para crear una nueva planta o área.
            </DialogDescription>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-1">
                <Label>TAG:</Label>
                <Input name="tag" className="bg-white" placeholder="Ingrese el tag de la entidad"
                  value={entityData.extra_info?.tag || ''}
                  onChange={
                    (e) => setEntityData((prevData) => ({
                      ...prevData,
                      extra_info: {
                        ...prevData.extra_info,
                        tag: e.target.value,
                      }
                    }))
                  }
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label>Nombre de planta/área:</Label>
                <Input name="name" className="bg-white" placeholder="Ingrese el nombre de la entidad"
                  value={entityData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label>Tipo:</Label>
                <Select value={String(entityData.type)} onValueChange={(value) => setEntityData((prevData) => ({
                  ...prevData,
                  type: parseInt(value),
                }))}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccione el tipo de entidad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Planta</SelectItem>
                    <SelectItem value="2">Area</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1">
                <Label>Superior:</Label>
                <Select
                  value={entityData.parent ? String(entityData.parent) : undefined}
                  onValueChange={(value) => setEntityData((prevData) => ({
                    ...prevData,
                    parent: parseInt(value),
                  }))}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccione la entidad superior" />
                  </SelectTrigger>
                  <SelectContent>
                    {entities.filter((ent) => ent.type === 1 || ent.type === 2).map((entity) => (
                      <SelectItem key={entity.id} value={entity.id!.toString()}>
                        {entity.extra_info?.tag ? "[" + entity.extra_info.tag + "] - " + entity.name : "[S/T] - " + entity.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </DialogHeader>
          <DialogFooter>
            <Button variant="destructive" onClick={() => setOpenModal(false)}>Cancelar</Button>
            <Button onClick={() => { handleSubmit() }}>Crear Entidad</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default EntitiesPage;
