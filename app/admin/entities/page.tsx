'use client'
import { useEffect, useState } from "react"
import { createEntity, deleteEntity, getEntities } from "@/app/services/entitiesServices"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Entity = {
  id: number
  name: string
  type?: number
  attachment?: File
  parent?: number
  children?: Entity[]
  extra_info?: { tag: string }
  deleted?: boolean
}

const Entities = () => {
  const [entities, setEntities] = useState<Entity[]>([])
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [entityData, setEntityData] = useState<Entity>({
    id: 0,
    name: '',
    type: 1,
  })

  useEffect(() => {
    getEntities()
      .then((response) => {
        const resp = response.data.filter(entity => entity.type === 3)
        console.log("Fetched entities:", response)
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
          id: 0,
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
    <div>
      <div className="flex flex-row justify-between">
        <h1 className="text-xl font-bold mb-4">Gestión de Entidades</h1>
        <Button size='sm' onClick={() => setOpenModal(true)} className="mb-4">Crear entidad</Button>
      </div>
      <Table>
        <TableHeader className="bg-gray-300">
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Extra info</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entities.map((entity) => (
            <TableRow key={entity.id}>
              <TableCell>{entity.id}</TableCell>
              <TableCell>{entity.name}</TableCell>
              <TableCell>{entity.extra_info?.name}</TableCell>
              <TableCell>{entity.type === 1 ? "Planta" : entity.type === 2 ? "Area" : entity.type === 3 ? "Equipo" : "Componente"}</TableCell>
              <TableCell>
                <div className="flex flex-row gap-2">
                  <Button size="sm">Editar</Button>
                  <Button onClick={() => handleDeleteEntity(entity.id)} size="sm" variant="destructive">Eliminar</Button>
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
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-1">
                <Label>Nombre de equipo:</Label>
                <Input name="name" className="bg-white" placeholder="Ingrese el nombre de la entidad"
                  value={entityData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label>Tag:</Label>
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
                    <SelectItem value="3">Equipo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex flex-col gap-1">
                <Label>Superior:</Label>
                <Select value={entityData.parent ? String(entityData.parent) : undefined} onValueChange={(value) => setEntityData((prevData) => ({
                  ...prevData,
                  parent: parseInt(value),
                }))}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccione la entidad superior" />
                  </SelectTrigger>
                  <SelectContent>
                    {entities.map((entity) => (
                      <SelectItem key={entity.id} value={entity.id.toString()}>
                        {entity.extra_info?.tag ? entity.extra_info.tag + " - " + entity.name : entity.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* <div className="flex flex-col gap-1">
                <Label>Informacion extra:</Label>
                <Input className="bg-white" placeholder="Ingrese información extra" />
              </div> */}
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

export default Entities
