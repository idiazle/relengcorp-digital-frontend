import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { useForm, Controller, useWatch } from 'react-hook-form'
import { createMonconReport } from '@/app/services/monconServices'
import { Entity } from '../../../entities/models/entity.model'
import type { Report } from '../../_models/moncon.model'
import { works, services } from '../../_config/options'

interface CreateReportDialogProps {
  openNewRegister: boolean
  setOpenNewRegister: (open: boolean) => void
  getAllReport: () => void
  entities: Entity[]
}

const CreateReportDialog = ({ openNewRegister, setOpenNewRegister, getAllReport, entities }: CreateReportDialogProps) => {
  const [selectedPlant, setSelectedPlant] = useState<number | undefined>(undefined)
  const [selectedArea, setSelectedArea] = useState<number | undefined>(undefined)
  const [selectedRoute, setSelectedRoute] = useState<number | undefined>(undefined)
  const [selectedEquipment, setSelectedEquipment] = useState<number | undefined>(undefined)
  const [selectedItem, setSelectedItem] = useState<number | undefined>(undefined)

  const plants = entities.filter((entity) => entity.type === 1);
  const areas = entities.filter((entity) => entity.type === 2);
  const routes = entities.filter((entity) => entity.type === 3);
  const equipments = entities.filter((entity) => entity.type === 4);
  const items = entities.filter((entity) => entity.type === 5);
  const components = entities.filter((entity) => entity.type === 6);

  const filteredAreas = selectedPlant ? areas.filter((entity) => entity.parent === selectedPlant) : []
  const filteredRoutes = selectedArea ? routes.filter((entity) => entity.parent === selectedArea) : []
  const filteredEquipments = selectedRoute ? equipments.filter((entity) => entity.parent === selectedRoute) : []
  const filteredItems = selectedRoute ? items.filter((entity) => entity.parent === selectedRoute) : []

  const { register, control, handleSubmit, reset, setValue } = useForm<Report>({
    defaultValues: {
      entity: 0,
      program: 2,
      work_type: 0,
      service_type: 0,
      execution_status: 2,
      condition: 1,
      observations: "",
    }
  });

  const selectedWorkType = useWatch({ control, name: 'work_type' })
  const useEquipmentFlow = selectedWorkType === 1
  const useItemFlow = selectedWorkType === 2
  const filteredComponents = useEquipmentFlow
    ? (selectedEquipment ? components.filter((entity) => entity.parent === selectedEquipment) : [])
    : (selectedItem ? components.filter((entity) => entity.parent === selectedItem) : [])

  const onSubmit = async (formData: Report) => {
    try {
      const temp = {
        entity: formData.entity || 0,
        program: formData.program,
        service_type: formData.service_type,
        work_type: formData.work_type,
        execution_status: formData.execution_status,
        condition: formData.condition,
        observations: formData.observations
      }
      const response = await createMonconReport(temp);
      console.log("Report created successfully:", response.data);
      handleClose();
      getAllReport();
    } catch (error) {
      console.error("Error creating report:", error);
    }
  }

  const handleClose = () => {
    reset();
    setSelectedPlant(undefined)
    setSelectedArea(undefined)
    setSelectedRoute(undefined)
    setSelectedEquipment(undefined)
    setSelectedItem(undefined)
    setOpenNewRegister(false);
  }

  return (
    <Dialog open={openNewRegister} onOpenChange={setOpenNewRegister}>
      <DialogContent className='min-w-5xl bg-slate-200'>
        <DialogHeader>
          <DialogTitle>NUEVO REGISTRO </DialogTitle>
          <DialogDescription>Nuevo registro no programado que no esta registrado en ruta semanal</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
          <div className='w-full p-2 rounded-md gap-4 flex flex-col mt-4'>
            <div className='w-full flex flex-row gap-2'>
              <div className='flex flex-col gap-2 w-1/5'>
                <Label className='font-semibold'>Planta:</Label>
                <Select
                  onValueChange={(value) => {
                    setSelectedPlant(parseInt(value))
                    setSelectedArea(undefined)
                    setSelectedRoute(undefined)
                    setSelectedEquipment(undefined)
                    setSelectedItem(undefined)
                    setValue('entity', 0)
                  }}
                  value={selectedPlant ? String(selectedPlant) : ""}
                >
                  <SelectTrigger className='w-full bg-white'>
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                  <SelectContent>
                    {
                      plants?.map((plant) => (
                        <SelectItem key={plant.id} value={String(plant.id)}>{plant.name}</SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
              <div className='flex flex-col gap-2 w-1/5'>
                <Label className='font-semibold'>Área:</Label>
                <Select
                  disabled={!selectedPlant}
                  onValueChange={(value) => {
                    setSelectedArea(parseInt(value))
                    setSelectedRoute(undefined)
                    setSelectedEquipment(undefined)
                    setSelectedItem(undefined)
                    setValue('entity', 0)
                  }}
                  value={selectedArea ? String(selectedArea) : ""}
                >
                  <SelectTrigger className='w-full bg-white'>
                    <SelectValue placeholder={!selectedPlant ? "Selecciona planta" : "Seleccionar..."} />
                  </SelectTrigger>
                  <SelectContent>
                    {
                      filteredAreas?.map((area) => (
                        <SelectItem key={area.id} value={String(area.id)}>{area.name}</SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
              <div className='flex flex-col gap-2 w-1/5'>
                <Label className='font-semibold'>Ruta:</Label>
                <Select
                  disabled={!selectedArea}
                  onValueChange={(value) => {
                    setSelectedRoute(parseInt(value))
                    setSelectedEquipment(undefined)
                    setSelectedItem(undefined)
                    setValue('entity', 0)
                  }}
                  value={selectedRoute ? String(selectedRoute) : ""}
                >
                  <SelectTrigger className='w-full bg-white'>
                    <SelectValue placeholder={!selectedArea ? "Selecciona área" : "Seleccionar..."} />
                  </SelectTrigger>
                  <SelectContent>
                    {
                      filteredRoutes?.map((route) => (
                        <SelectItem key={route.id} value={String(route.id)}>{route.name}</SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
              {useEquipmentFlow && (
                <div className='flex flex-col gap-2 w-1/5'>
                  <Label className='font-semibold'>Equipo:</Label>
                  <Select
                    disabled={!selectedRoute}
                    onValueChange={(value) => {
                      setSelectedEquipment(parseInt(value))
                      setSelectedItem(undefined)
                      setValue('entity', 0)
                    }}
                    value={selectedEquipment ? String(selectedEquipment) : ""}
                  >
                    <SelectTrigger className='bg-white w-full'>
                      <SelectValue placeholder={!selectedRoute ? "Selecciona ruta" : "Seleccionar..."} />
                    </SelectTrigger>
                    <SelectContent>
                      {
                        filteredEquipments?.map((equipment) => (
                          <SelectItem key={equipment.id} value={String(equipment.id)}>
                            {equipment.tag}/{equipment.name}
                          </SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                </div>
              )}
              {useItemFlow && (
                <div className='flex flex-col gap-2 w-1/5'>
                  <Label className='font-semibold'>Ítem:</Label>
                  <Select
                    disabled={!selectedRoute}
                    onValueChange={(value) => {
                      setSelectedItem(parseInt(value))
                      setSelectedEquipment(undefined)
                      setValue('entity', 0)
                    }}
                    value={selectedItem ? String(selectedItem) : ""}
                  >
                    <SelectTrigger className='w-full bg-white'>
                      <SelectValue placeholder={!selectedRoute ? "Selecciona ruta" : "Seleccionar..."} />
                    </SelectTrigger>
                    <SelectContent>
                      {
                        filteredItems?.map((item) => (
                          <SelectItem key={item.id} value={String(item.id)}>{item.name}</SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className='flex flex-col gap-2 w-1/5'>
                <Label className='font-semibold'>Componente:</Label>
                <Controller
                  name="entity"
                  control={control}
                  render={({ field }) => (
                    <Select
                      disabled={useEquipmentFlow ? !selectedEquipment : useItemFlow ? !selectedItem : true}
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value ? String(field.value) : ""}
                    >
                      <SelectTrigger className='bg-white w-full'>
                        <SelectValue placeholder={useEquipmentFlow ? (!selectedEquipment ? "Selecciona equipo" : "Seleccionar...") : useItemFlow ? (!selectedItem ? "Selecciona ítem" : "Seleccionar...") : "Selecciona tipo de trabajo"} />
                      </SelectTrigger>
                      <SelectContent>
                        {
                          filteredComponents?.map((component) => (
                            <SelectItem key={component.id} value={String(component.id)}>{component.name}</SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
            <div className='w-full flex flex-row gap-2'>
              <div className='flex flex-col gap-2 w-1/3'>
                <Label className='font-semibold'>Tipo de Trabajo:</Label>
                <Controller
                  name="work_type"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={String(field.value)}
                      onValueChange={(value) => {
                        field.onChange(parseInt(value))
                        setSelectedEquipment(undefined)
                        setSelectedItem(undefined)
                        setValue('entity', 0)
                      }}
                    >
                      <SelectTrigger className='w-full bg-white'>
                        <SelectValue placeholder="Seleccionar..." />
                      </SelectTrigger>
                      <SelectContent>
                        {
                          works.map((work) => (
                            <SelectItem key={work.id} value={String(work.id)}>{work.name}</SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className='flex flex-col gap-2 w-1/3'>
                <Label className='font-semibold'>Fecha de programación:</Label>
                <h1 className='p-2 text-sm bg-gray-100 text-gray-500 rounded-md'>{format(new Date(), "dd/MM/yyyy")}</h1>
              </div>
              <div className='flex flex-col gap-2 w-1/3'>
                <Label className='font-semibold'>Programación:</Label>
                <Controller
                  name="program"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={String(field.value)}
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      disabled
                    >
                      <SelectTrigger className='w-full bg-white'>
                        <SelectValue placeholder="Seleccionar..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Programado</SelectItem>
                        <SelectItem value="2">No Programado</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className='flex flex-col gap-2 w-1/3'>
                <Label className='font-semibold'>Condición:</Label>
                <Controller
                  name="condition"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={String(field.value)}
                      onValueChange={(value) => field.onChange(parseInt(value))}
                    >
                      <SelectTrigger className='w-full bg-white'>
                        <SelectValue placeholder="Seleccionar..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Normal</SelectItem>
                        <SelectItem value="2">Tolerable</SelectItem>
                        <SelectItem value="3">Precaución</SelectItem>
                        <SelectItem value="4">Crítico</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
            <div className='w-full flex flex-row gap-2'>
              <div className='flex flex-col gap-2 w-1/4'>
                <Label className='font-semibold'>Tipo de servicio:</Label>
                <Controller
                  name="service_type"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={String(field.value)}
                      onValueChange={(value) => field.onChange(parseInt(value))}
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
                  )}
                />
              </div>
              <div className='flex flex-col gap-2 w-1/4'>
                <Label className='font-semibold'>Status de ejecución:</Label>
                <Controller
                  name="execution_status"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={String(field.value)}
                      onValueChange={(value) => field.onChange(parseInt(value))}
                    >
                      <SelectTrigger className='w-full bg-white'>
                        <SelectValue placeholder="Seleccionar..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Ejecutado</SelectItem>
                        <SelectItem value="2">No ejecutado</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className='flex flex-col gap-2 w-2/4'>
                <Label className='font-semibold'>Observación:</Label>
                <Input
                  className='bg-white'
                  {...register('observations')}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="destructive" onClick={handleClose}>Cancelar</Button>
            <Button type="submit">Guardar y salir</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateReportDialog