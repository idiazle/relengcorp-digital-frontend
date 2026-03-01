import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useForm, Controller } from 'react-hook-form'
import { createMonconReport } from '@/app/services/monconServices'
import { Entity } from '../../entities/models/entity.model'
import type { ReportFormData } from '../models/moncon.models'
import { works, services } from '../models/moncon.models'

interface CreateReportDialogProps {
  openNewRegister: boolean
  setOpenNewRegister: (open: boolean) => void
  getAllReport: () => void
  entities: Entity[]
}

const CreateReportDialog = ({
  openNewRegister,
  setOpenNewRegister,
  getAllReport,
  entities
}: CreateReportDialogProps) => {
  const plants = entities.filter((entity) => entity.type === 1);
  const areas = entities.filter((entity) => entity.type === 2);
  const equipments = entities.filter((entity) => entity.type === 3);
  const components = entities.filter((entity) => entity.type === 4);

  const { register, control, handleSubmit, reset } = useForm<ReportFormData>({
    defaultValues: {
      entity: 0,
      program: 2,
      service_type: 0,
      task_type: 0,
      execution_status: 2,
      condition: 1,
      observations: "",
      area: undefined,
      equipment: undefined,
      component: undefined
    }
  });

  const onSubmit = async (formData: ReportFormData) => {
    try {
      const temp = {
        entity: formData.component || 0,
        program: formData.program,
        service_type: formData.service_type,
        task_type: formData.task_type,
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
              <div className='flex flex-col gap-2 w-1/3'>
                <Label className='font-semibold'>Planta:</Label>
                <Input
                  className='bg-white' value={plants?.length > 0 ? plants[0].name : ""} disabled></Input>
              </div>
              <div className='flex flex-col gap-2 w-1/3'>
                <Label className='font-semibold'>Área:</Label>
                <Controller
                  name="area"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value ? String(field.value) : ""}
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
                  )}
                />
              </div>
              <div className='flex flex-col gap-2 w-1/4'>
                <Label className='font-semibold'>Equipo:</Label>
                <Controller
                  name="equipment"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value ? String(field.value) : ""}
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
                  )}
                />
              </div>
              <div className='flex flex-col gap-2 w-1/4'>
                <Label className='font-semibold'>Componente:</Label>
                <Controller
                  name="component"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value ? String(field.value) : ""}
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
                  )}
                />
              </div>
            </div>
            <div className='w-full flex flex-row gap-2'>
              <div className='flex flex-col gap-2 w-1/3'>
                <Label className='font-semibold'>Tipo de Servicio:</Label>
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
                <h1 className='p-2 text-sm bg-white rounded-md'>{format(new Date(), "dd/MM/yyyy")}</h1>
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
                <Label className='font-semibold'>Tipo de tarea:</Label>
                <Controller
                  name="task_type"
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