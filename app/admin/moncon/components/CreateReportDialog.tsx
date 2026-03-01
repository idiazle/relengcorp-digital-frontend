import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useEffect, useState } from 'react'
import { getEntities } from '../../../services/entitiesServices'
import { createMonconReport } from '@/app/services/monconServices'
import { Area, Component, Equipment, Plant } from '../../utils/types'
import { Report } from '../../../../lib/types'
import { services, tareas } from '../../../../lib/types'

interface CreateReportDialogProps {
  openNewRegister: boolean
  setOpenNewRegister: (open: boolean) => void
  getAllReport: () => void
}

const CreateReportDialog = ({
  openNewRegister,
  setOpenNewRegister,
  getAllReport,
}: CreateReportDialogProps) => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [components, setComponents] = useState<Component[]>([]);

  const [areaSelected, setAreaSelected] = useState<Area | null>(null)
  const [equipmentSelected, setEquipmentSelected] = useState<Equipment | null>(null)
  const [componentSelected, setComponentSelected] = useState<Component | null>(null)
  const [data, setData] = useState<Report>({
    id: 0,
    entity: 0,
    name: "",
    program: 2,
    service_type: 0,
    task_type: 0,
    execution_status: 2,
    condition: 1,
    diagnostic: "",
    recomendations: "",
    observations: "",
    attachment: [],
    created_at: "",
  });

  useEffect(() => {
    if (openNewRegister) {
      getEntities().then((response) => {
        const filteredEquipments = response.data.filter((ent: Equipment) => ent.type === 3)
        const filteredPlants = response.data.filter((ent: Plant) => ent.type === 1)
        const filteredAreas = response.data.filter((ent: Area) => ent.type === 2)
        const filteredComponents = response.data.filter((ent: Component) => ent.type === 4)
        setPlants(filteredPlants)
        setAreas(filteredAreas)
        setEquipments(filteredEquipments)
        setComponents(filteredComponents)
      }).catch((error) => {
        console.error("Error fetching entities:", error)
      })
    }
  }, [openNewRegister])

  const createSingleRegister = () => {
    const temp = {
      entity: componentSelected ? componentSelected.id : 0,
      program: data ? data.program : 2,
      service_type: data ? data.service_type : 0,
      task_type: data ? data.task_type : 0,
      execution_status: data ? data.execution_status : 2,
      condition: data ? data.condition : 1,
      observations: data ? data.observations : ""
    }
    createMonconReport(temp)
      .then((response) => {
        console.log("Report created successfully:", response.data);
        setOpenNewRegister(false);
        getAllReport();
      })
      .catch((error) => {
        console.error("Error creating report:", error);
      })
  }



  return (
    <Dialog open={openNewRegister} onOpenChange={setOpenNewRegister}>
      <DialogContent className='min-w-5xl bg-slate-200'>
        <DialogHeader>
          <DialogTitle>NUEVO REGISTRO </DialogTitle>
          <DialogDescription>Nuevo registro no programado que no esta registrado en ruta semanal</DialogDescription>
        </DialogHeader>
        <div className='w-full p-2 rounded-md gap-4 flex flex-col mt-4'>
          <div className='w-full flex flex-row gap-2'>
            <div className='flex flex-col gap-2 w-1/3'>
              <Label className='font-semibold'>Planta:</Label>
              <Input
                className='bg-white' value={plants?.length > 0 ? plants[0].name : ""} disabled></Input>
            </div>
            <div className='flex flex-col gap-2 w-1/3'>
              <Label className='font-semibold'>Área:</Label>
              <Select
                onValueChange={(value: string) => {
                  const selectedArea = areas.find((area) => String(area.id) === value);
                  setAreaSelected(selectedArea || null);
                }}
                value={areaSelected ? String(areaSelected.id) : ""}
              >
                <SelectTrigger className='w-full bg-white'>
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  {
                    areas?.map((area) => (
                      <SelectItem key={area.id} value={String(area.id)}>{area.name}</SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>
            <div className='flex flex-col gap-2 w-1/4'>
              <Label className='font-semibold'>Equipo:</Label>
              <Select
                onValueChange={(value: string) => {
                  const selectedEquipment = equipments.find((equipment) => String(equipment.id) === value);
                  setEquipmentSelected(selectedEquipment || null);
                }}
                value={equipmentSelected ? String(equipmentSelected.id) : ""}
              >
                <SelectTrigger className='bg-white w-full'>
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  {
                    equipments?.map((equipment) => (
                      <SelectItem key={equipment.id} value={String(equipment.id)}>
                        {equipment.tag}/{equipment.name}
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>
            <div className='flex flex-col gap-2 w-1/4'>
              <Label className='font-semibold'>Componente:</Label>
              <Select
                onValueChange={(value: string) => {
                  const selectedComponent = components.find((component) => String(component.id) === value);
                  setComponentSelected(selectedComponent || null);
                }}
                value={componentSelected ? String(componentSelected.id) : ""}
              >
                <SelectTrigger className='bg-white w-full'>
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  {
                    components?.map((component) => (
                      <SelectItem key={component.id} value={String(component.id)}>{component.name}</SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className='w-full flex flex-row gap-2'>
            <div className='flex flex-col gap-2 w-1/3'>
              <Label className='font-semibold'>Tipo de Servicio:</Label>
              <Select
                value={data ? String(data.service_type) : ""}
                onValueChange={(value) => {
                  setData({
                    ...data!,
                    service_type: parseInt(value)
                  })
                }}
              >
                <SelectTrigger className='w-full bg-white'>
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  {
                    services.map((service) => (
                      <SelectItem key={service.id} value={String(service.id)}>{service.name}</SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>
            <div className='flex flex-col gap-2 w-1/3'>
              <Label className='font-semibold'>Fecha de programación:</Label>
              <h1 className='p-2 text-sm bg-white rounded-md'>{format(new Date(), "dd/MM/yyyy")}</h1>
            </div>
            <div className='flex flex-col gap-2 w-1/3'>
              <Label className='font-semibold'>Programación:</Label>
              <Select
                value={data ? String(data.program) : ""}
                onValueChange={(value) => {
                  setData({
                    ...data!,
                    program: parseInt(value)
                  })
                }}
              >
                <SelectTrigger className='w-full bg-white'>
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Programado</SelectItem>
                  <SelectItem value="2">No Programado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='flex flex-col gap-2 w-1/3'>
              <Label className='font-semibold'>Condición:</Label>
              <Select
                value={data ? String(data.condition) : ""}
                onValueChange={(value) => {
                  setData({
                    ...data!,
                    condition: parseInt(value)
                  })
                }}
              >
                <SelectTrigger className='w-full bg-white'>
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Normal</SelectItem>
                  <SelectItem value="2">Tolerable</SelectItem>
                  <SelectItem value="3">Precacución</SelectItem>
                  <SelectItem value="4">Crítico</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className='w-full flex flex-row gap-2'>
            <div className='flex flex-col gap-2 w-1/4'>
              <Label className='font-semibold'>Tipo de tarea:</Label>
              <Select
                value={data ? String(data?.task_type) : ""}
                onValueChange={(value) => {
                  setData({
                    ...data!,
                    task_type: parseInt(value)
                  })
                }}
              >
                <SelectTrigger className='w-full bg-white'>
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  {
                    tareas.map((tarea) => (
                      <SelectItem key={tarea.id} value={String(tarea.id)}>{tarea.name}</SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>
            <div className='flex flex-col gap-2 w-1/4'>
              <Label className='font-semibold'>Status de ejecución:</Label>
              <Select
                value={data ? String(data.execution_status) : ""}
                onValueChange={(value) => {
                  setData({
                    ...data!,
                    execution_status: parseInt(value)
                  })
                }}
              >
                <SelectTrigger className='w-full bg-white'>
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Ejecutado</SelectItem>
                  <SelectItem value="2">No ejecutado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='flex flex-col gap-2 w-2/4'>
              <Label className='font-semibold'>Observación:</Label>
              <Input
                className='bg-white'
                value={data ? data.observations : ""}
                onChange={(e) => {
                  setData({
                    ...data!,
                    observations: e.target.value
                  })
                }}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => createSingleRegister()}>Guardar y salir</Button>
          {/* <Button>Guardar y agregar nuevo</Button> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CreateReportDialog