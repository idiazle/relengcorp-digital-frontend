import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Calendar as CalendarIcon } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Notices, Report } from '../_models/moncon.model'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import PDFViewer from '@/components/admin/PDFViewer'
import { getNoticesByReportId } from '@/app/services/monconServices'
import { getEntities } from '@/app/services/entitiesServices'
import { Entity } from '../../entities/_models/entity.model'
import { works, services } from '../_config/options'

interface ReportViewFormData {
  name: string
  execution_date: string | Date | undefined
  program: number
  work_type: number
  service_type: number
  execution_status: number
  observations: string
  condition: number
  diagnostic: string
  recomendations: string
}

type ReportDialogViewProps = {
  openViewRegister: boolean
  setOpenViewRegister: (open: boolean) => void
  registerSelected: Report | null
  setRegisterSelected: (report: Report | null) => void
}

const ViewReportDialog = ({ openViewRegister, setOpenViewRegister, setRegisterSelected, registerSelected }: ReportDialogViewProps) => {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [noticesData, setNoticesData] = useState<Notices[]>([]);
  const [openPDF, setOpenPDF] = useState<boolean>(false);

  const { register, control, reset } = useForm<ReportViewFormData>({
    defaultValues: {
      name: '',
      execution_date: undefined,
      program: 2,
      work_type: 0,
      service_type: 0,
      execution_status: 2,
      observations: '',
      condition: 1,
      diagnostic: '',
      recomendations: '',
    }
  })

  const plant = registerSelected?.parents?.find((entity) => entity.type === 1)
  const area = registerSelected?.parents?.find((entity) => entity.type === 2)
  const routeOrEquipment = registerSelected?.parents?.find((entity) => entity.type === 4 || entity.type === 3)
  const currentEntity = entities.find((entity) => entity.id === registerSelected?.entity)

  const plantLabel = plant ? `${plant.name} (${plant.tag})` : ''
  const areaLabel = area ? `${area.name} (${area.tag})` : ''
  const equipmentLabel = routeOrEquipment ? `${routeOrEquipment.name} (${routeOrEquipment.tag})` : ''
  const componentLabel = currentEntity ? `${currentEntity.name} (${currentEntity.tag})` : ''

  useEffect(() => {
    getEntities().then((response) => {
      setEntities(response.data.results || response.data)
    }).catch(error => {
      console.error('Error al obtener entidades:', error)
    })
  }, []);

  useEffect(() => {
    if (registerSelected) {
      reset({
        name: registerSelected.name ?? '',
        execution_date: registerSelected.execution_date ? registerSelected.execution_date : undefined,
        program: registerSelected.program,
        work_type: registerSelected.work_type,
        service_type: registerSelected.service_type,
        execution_status: registerSelected.execution_status,
        observations: registerSelected.observations ?? '',
        condition: registerSelected.condition,
        diagnostic: registerSelected.diagnostic ?? '',
        recomendations: registerSelected.recomendations ?? '',
      })
      getNoticesByReportId(registerSelected.id).then((response) => {
        setNoticesData(response.data);
      }).catch((error) => {
        console.error("Error fetching notices:", error);
      });
    }
  }, [registerSelected, reset]);

  const handleClose = () => {
    setOpenViewRegister(false)
    setRegisterSelected(null)
    reset()
  }

  return (
    <>
      <Dialog open={openViewRegister} onOpenChange={handleClose}>
        <DialogContent className='min-w-5xl bg-slate-200'>
          <DialogHeader>
            <DialogTitle className='font-bold'>DETALLE DE REGISTRO</DialogTitle>
          </DialogHeader>
          <div className='w-full p-2 rounded-md gap-4 flex flex-col mt-4'>
            <div className='w-full flex flex-row gap-2'>
              <div className='flex flex-col gap-2 w-1/3'>
                <Label className='font-semibold'>Fecha de programación:</Label>
                <Input
                  disabled
                  className='bg-white'
                  value={registerSelected?.created_at?.slice(0, 10) ?? ""}
                />
              </div>
              <div className='flex flex-col gap-2 w-1/3'>
                <Label className='font-semibold'>Fecha de ejecución:</Label>
                <Controller
                  name="execution_date"
                  control={control}
                  render={({ field }) => {
                    const dateValue = typeof field.value === 'object' && field.value ? field.value : field.value ? new Date(field.value as string) : undefined;
                    return (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            disabled
                            data-empty={!field.value}
                            className="data-[empty=true]:text-muted-foreground justify-start text-left font-normal w-full"
                          >
                            <CalendarIcon />
                            {field.value ? format(dateValue || new Date(), "dd/MM/yyyy", { locale: es }) : <span>Selecciona una fecha</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={dateValue} disabled locale={es} />
                        </PopoverContent>
                      </Popover>
                    )
                  }}
                />
              </div>
              <div className='flex flex-col gap-2 w-1/3'>
                <Label className='font-semibold'>Programación:</Label>
                <Select disabled value={registerSelected ? registerSelected.program.toString() : ""}>
                  <SelectTrigger className='w-full bg-white'>
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Programado</SelectItem>
                    <SelectItem value="2">No Programado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className='w-full flex flex-row gap-2'>
              <div className='flex flex-col gap-2 w-1/3'>
                <Label className='font-semibold'>Planta:</Label>
                <Input disabled className='bg-white' value={plantLabel} />
              </div>
              <div className='flex flex-col gap-2 w-2/3'>
                <Label className='font-semibold'>Área:</Label>
                <Input disabled className='bg-white' value={areaLabel} />
              </div>
            </div>
            <div className='w-full flex flex-row gap-2'>
              <div className='flex flex-col gap-2 w-1/3'>
                <Label className='font-semibold'>Equipo:</Label>
                <Input disabled className='bg-white' value={equipmentLabel} />
              </div>
              <div className='flex flex-col gap-2 w-2/3'>
                <Label className='font-semibold'>Componente:</Label>
                <Input disabled className='bg-white' value={componentLabel} />
              </div>
            </div>
            <div className='w-full flex flex-row gap-2'>
              <div className='flex flex-col gap-2 w-1/4'>
                <Label className='font-semibold'>Servicio:</Label>
                <Controller
                  name="work_type"
                  control={control}
                  render={({ field }) => (
                    <Select disabled value={String(field.value)}>
                      <SelectTrigger className='bg-white w-full'>
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
              <div className='flex flex-col gap-2 w-1/4'>
                <Label className='font-semibold'>Tarea:</Label>
                <Controller
                  name="service_type"
                  control={control}
                  render={({ field }) => (
                    <Select disabled value={String(field.value)}>
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
                    <Select disabled value={String(field.value)}>
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
                <Input disabled className='bg-white' {...register('observations')} />
              </div>
            </div>
            <div className='w-full flex flex-row gap-2'>
              <div className='flex flex-col gap-2 w-1/5'>
                <Label className='font-semibold'>Condición:</Label>
                <Controller
                  name="condition"
                  control={control}
                  render={({ field }) => (
                    <Select disabled value={String(field.value)}>
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
              <div className='flex flex-col gap-2 w-2/5'>
                <Label className='font-semibold'>Diagnóstico:</Label>
                <Input disabled className='bg-white' {...register('diagnostic')} />
              </div>
              <div className='flex flex-col gap-2 w-2/5'>
                <Label className='font-semibold'>Recomendación:</Label>
                <Input disabled className='bg-white' {...register('recomendations')} />
              </div>
            </div>
            <div className='w-full flex flex-row gap-2'>
              <div className='flex flex-col gap-2 w-1/3'>
                <Label className='font-semibold'>N° de reporte:</Label>
                <Input disabled className='bg-white' {...register('name')} />
              </div>
              <div className='flex flex-col gap-2 w-2/3'>
                <Label className='font-semibold'>Reporte adjunto:</Label>
                <Button disabled={!registerSelected?.attachment} onClick={() => { setOpenPDF(true) }} className='justify-start'>
                  {registerSelected ? (Array.isArray(registerSelected?.attachment) ? registerSelected?.attachment[0]?.name : registerSelected?.attachment) : "Sin archivo"}
                </Button>
              </div>
            </div>

            {/* Status de aviso */}
            <div className='w-full flex flex-row gap-2 mt-5'>
              <div className='flex flex-col gap-2 w-2/3'>
                <Label className='font-semibold'>N° de avisos:</Label>
                <h1 className='bg-white p-1.5 rounded-md'>{noticesData[0]?.name ? noticesData[0]?.name : "---"}</h1>
              </div>
              <div className='flex flex-col gap-2 w-2/3'>
                <Label className='font-semibold'>Fecha de aviso:</Label>
                <h1 className='bg-white p-1.5 rounded-md'>{noticesData[0]?.date ? noticesData[0]?.date : "---"}</h1>
              </div>
              <div className='flex flex-col gap-2 w-2/3'>
                <Label className='font-semibold'>Status de aviso:</Label>
                <Select disabled value={String(noticesData[0]?.status)}>
                  <SelectTrigger className='w-full bg-white'>
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Abierto</SelectItem>
                    <SelectItem value="2">Cerrado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className='w-full flex flex-row gap-2'>
              <div className='flex flex-col gap-2 w-2/3'>
                <Label className='font-semibold'>N° de OT:</Label>
                <h1 className='bg-white p-1.5 rounded-md'>{noticesData[0]?.ot_number ? noticesData[0]?.ot_number : "---"}</h1>
              </div>
              <div className='flex flex-col gap-2 w-2/3'>
                <Label className='font-semibold'>Fecha de OT:</Label>
                <h1 className='bg-white p-1.5 rounded-md'>{noticesData[0]?.ot_date ? noticesData[0]?.ot_date : "---"}</h1>
              </div>
              <div className='flex flex-col gap-2 w-2/3'>
                <Label className='font-semibold'>Status de OT:</Label>
                <Select disabled value={String(noticesData[0]?.ot_status)}>
                  <SelectTrigger className='w-full bg-white'>
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Abierto</SelectItem>
                    <SelectItem value="2">Cerrado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className='w-full flex flex-row gap-2'>
              <div className='flex flex-col gap-2 w-2/3'>
                <Label className='font-semibold'>Status Real:</Label>
                <Select disabled value={noticesData[0]?.status_real ? String(noticesData[0]?.status_real) : ""}>
                  <SelectTrigger className='w-full bg-white'>
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Atendido</SelectItem>
                    <SelectItem value="2">No atendido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='flex flex-col gap-2 w-2/3'>
                <Label className='font-semibold'>Comentario:</Label>
                <Input disabled value={noticesData[0]?.comment ? noticesData[0]?.comment : ""} className='bg-white p-1.5 rounded-md' />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {openPDF && <PDFViewer urlPDF={registerSelected?.attachment} openDialog={openPDF} setOpenDialog={setOpenPDF} />}
    </>
  )
}

export default ViewReportDialog;
