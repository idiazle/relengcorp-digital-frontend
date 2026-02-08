'use client'
import { useEffect, useState } from "react"
import { createEntity, deleteEntity, getEntities } from "@/app/services/entitiesServices"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { FaEye, FaPlus, FaTrash } from "react-icons/fa6"
import { FaEdit } from "react-icons/fa"
import { Area, EntityType, Plant } from "../utils/types"

const EntitiesPage = () => {
  const [entities, setEntities] = useState<(Plant | Area)[]>([])
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [entityData, setEntityData] = useState<Plant | Area>({
    name: '',
    tag: '',
    type: 1,
  })

  const getPlantsAndAreas = () => {
    getEntities()
      .then((response) => {
        const resp = response.data
        const filtered = resp.filter((ent: Plant | Area) => ent.type === 1 || ent.type === 2)
        setEntities(filtered)
      })
      .catch((error) => {
        console.error("Error fetching entities:", error)
      })
  }

  useEffect(() => {
    getPlantsAndAreas()
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
    createEntity(entityData).then((response) => {
        console.log("Entity created successfully:", response)
        setOpenModal(false)
        getPlantsAndAreas()
        setEntityData({
          name: '',
          type: 1,
          tag: '',
        })
      })
      .catch((error) => {
        console.error("Error creating entity:", error)
      })

  }

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
      <div className='flex justify-between items-center'>
        <h1 className='font-bold text-lg'>GESTIÓN DE ENTIDADES</h1>
        <Button className='' onClick={() => { setOpenModal(true) }}><FaPlus /> Nueva entidad</Button>
      </div>
      <Separator className='my-2' />
      <Table className="max-h-[90vh]">
        <TableHeader className="bg-gray-300 sticky top-0">
          <TableRow>
            <TableHead className="font-bold">Id</TableHead>
            <TableHead className="font-bold">Tipo</TableHead>
            <TableHead className="font-bold">Tag</TableHead>
            <TableHead className="font-bold">Nombre</TableHead>
            <TableHead className="font-bold">Superior</TableHead>
            {/* <TableHead className="font-bold">Info. extra</TableHead> */}
            <TableHead className="font-bold">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="overflow-y-auto">
          {entities?.map((entity) => (
            <TableRow key={entity.id}>
              <TableCell>{entity.id}</TableCell>
              <TableCell>{entity?.type === 1 ? "Planta" : "Área"}</TableCell>
              <TableCell>{entity?.tag ? entity?.tag : "[S/T]"}</TableCell>
              <TableCell>{entity.name}</TableCell>
              <TableCell>{entities.find(ent => ent.id === entity.parent)?.name || '--'}</TableCell>
              {/* <TableCell>{entity.extra_info ? "--" : JSON.stringify(entity.extra_info)}</TableCell> */}
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
                <Label>TAG(*):</Label>
                <Input name="tag" className="bg-white" placeholder="Ingrese el tag de la entidad"
                  value={entityData.tag || ''}
                  onChange={(e) => handleInputChange({ ...e, target: { ...e.target, name: 'tag' } })
                  }
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label>Nombre de planta/área(*):</Label>
                <Input name="name" className="bg-white" placeholder="Ingrese el nombre de la entidad"
                  value={entityData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label>Tipo(*):</Label>
                <Select
                  value={String(entityData.type)}
                  onValueChange={(value) => setEntityData((prevData) => ({
                    ...prevData,
                    type: parseInt(value) as EntityType,
                  }))}
                >
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
                <Label>Entidad superior:</Label>
                <Select
                  value={entityData.parent ? String(entityData.parent) : undefined}
                  onValueChange={(value) => setEntityData((prevData) => ({
                    ...prevData,
                    parent: parseInt(value) || null,
                  }))}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccione la entidad superior" />
                  </SelectTrigger>
                  <SelectContent>
                    {entities.filter((ent) => ent.type === 1 || ent.type === 2).map((entity) => (
                      <SelectItem key={entity.id} value={entity.id!.toString()}>
                        {entity?.tag ? "[" + entity?.tag + "] - " + entity.name : "[S/T] - " + entity.name}
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
