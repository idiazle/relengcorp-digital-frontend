import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { CalendarIcon } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Notices, Report, services, works } from '../models/moncon.models'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { createNotice, deleteNotice, getNoticesByReportId, updateReport } from '@/app/services/monconServices'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { FaTrash } from 'react-icons/fa6'
import { getEntities } from '@/app/services/entitiesServices'
import { Entity } from '../../entities/models/entity.model'


interface ReportDialogEditProps {
  openEditRegister: boolean
  setOpenEditRegister: (open: boolean) => void
  registerSelected: Report | null
  setRegisterSelected: (report: Report | null) => void
  getAllReport: () => void
}

const EditReportDialog = ({ openEditRegister, setOpenEditRegister, setRegisterSelected, registerSelected, getAllReport }: ReportDialogEditProps) => {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(false);
  const [noticesData, setNoticesData] = useState<Notices[]>([]);
  const [date_status, setDateStatus] = useState<Date | undefined>(new Date())
  const [date_ot, setDateOt] = useState<Date | undefined>(new Date())
  const [file, setFile] = useState<File | null>(null);

  const { register, control, handleSubmit, reset } = useForm<Report>({
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

  const editReport = (reportId: number, updatedData: Report) => {
    setLoading(true);

    const formData = new FormData()
    formData.append("condition", String(updatedData.condition ?? ""))
    formData.append("diagnostic", String(updatedData.diagnostic ?? ""))
    formData.append("execution_status", String(updatedData.execution_status ?? ""))
    formData.append("name", String(updatedData.name ?? ""))
    formData.append("observations", String(updatedData.observations ?? ""))
    formData.append("program", String(updatedData.program ?? ""))
    formData.append("recomendations", String(updatedData.recomendations ?? ""))
    formData.append("work_type", String(updatedData.work_type ?? ""))
    formData.append("service_type", String(updatedData.service_type ?? ""))

    if (updatedData.execution_date) {
      let dateString: string;
      if (typeof updatedData.execution_date === 'object' && updatedData.execution_date !== null) {
        dateString = (updatedData.execution_date as Date).toISOString().slice(0, 10);
      } else {
        dateString = String(updatedData.execution_date);
      }
      formData.append("execution_date", dateString)
    }

    if (file) {
      formData.append("attachment", file)
    }

    updateReport(reportId, formData).then((response) => {
      console.log("Report updated successfully:", response);
      alert("Reporte actualizado exitosamente");
      setLoading(false);
      setOpenEditRegister(false);
      getAllReport();
      setRegisterSelected(null)
    }).catch((error) => {
      console.error("Error updating report:", error);
      setLoading(false)
    });
  };

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
    }
  }, [registerSelected, reset]);

  const handleAddNotice = () => {
    const newNotice: Notices = {
      name: '',
      date: '',
      status: 1,
      ot_number: '',
      ot_date: '',
      ot_status: 1,
      status_real: 1,
      comment: '',
      created_by: '',
      report: registerSelected ? registerSelected.id || 0 : 0,
    };
    setNoticesData([...noticesData, newNotice]);
  }

  const noticesByReport = (idReport: number) => {
    getNoticesByReportId(idReport).then((response) => {
      setNoticesData(response.data);
    }).catch((error) => {
      console.error("Error fetching notices:", error);
    });
  }
  useEffect(() => {
    if (registerSelected && registerSelected.id) {
      noticesByReport(registerSelected.id);
    }
  }, [registerSelected]);

  const handleSubmitNotices = () => {
    const idReport = registerSelected?.id;
    noticesData.forEach((notice, index) => {
      const temp = { ...notice, report: idReport, date: date_status?.toISOString().slice(0, 10), ot_date: date_ot?.toISOString().slice(0, 10) }
      console.log(`Submitting notice ${index + 1}:`, temp);
      createNotice(temp).then((response) => {
        console.log(`Notice ${index + 1} created successfully:`, response);
        alert("Aviso creado exitosamente");
      }).catch((error) => {
        console.error(`Error creating notice ${index + 1}:`, error);
      });
    });
  }

  const handleDeleteNotice = (index: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar este aviso?")) {
      const noticeToDelete = noticesData[index];
      if (noticeToDelete.id) {
        deleteNotice(noticeToDelete.id).then((response) => {
          console.log("Notice deleted successfully:", response);
          const updatedNotices = noticesData.filter((_, i) => i !== index);
          setNoticesData(updatedNotices);
        }).catch((error) => {
          console.error("Error deleting notice:", error);
        });
      } else {
        const updatedNotices = noticesData.filter((_, i) => i !== index);
        setNoticesData(updatedNotices);
      }
    }
  }

  const handleClose = () => {
    setOpenEditRegister(false)
    setRegisterSelected(null)
    reset()
  }

  const onSubmit = (formData: Report) => {
    if (registerSelected?.id) {
      editReport(registerSelected.id, formData)
    }
  }

  return (
    <Dialog open={openEditRegister} onOpenChange={handleClose}>
      <DialogContent className='min-w-5xl bg-slate-200'>
        <DialogHeader>
          <DialogTitle>Editar Registro</DialogTitle>
        </DialogHeader>
        <form id="report-form" onSubmit={handleSubmit(onSubmit)} className='w-full p-2 rounded-md gap-4 flex flex-col mt-4'>
          <div className='w-full flex flex-row gap-2'>
            <div className='flex flex-col gap-2 w-1/3'>
              <Label>Fecha de programación:</Label>
              <Input
                disabled
                className='bg-white'
                value={registerSelected?.created_at?.slice(0, 10) ?? ""} />
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
                          data-empty={!field.value}
                          className="data-[empty=true]:text-muted-foreground justify-start text-left font-normal w-full"
                        >
                          <CalendarIcon />
                          {field.value ? format(dateValue || new Date(), "dd/MM/yyyy", { locale: es }) : <span>Selecciona una fecha</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={dateValue} onSelect={(date) => field.onChange(date)} locale={es} />
                      </PopoverContent>
                    </Popover>
                  )
                }}
              />
            </div>
            <div className='flex flex-col gap-2 w-1/3'>
              <Label className='font-semibold'>Programación:</Label>
              <Select
                disabled
                value={registerSelected ? registerSelected.program.toString() : ""}>
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
            <div className='flex flex-col gap-2 w-2/3'>
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
                  <Select
                    value={String(field.value)}
                    onValueChange={(value) => field.onChange(parseInt(value))}
                  >
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
              <Input className='bg-white' {...register('observations')} />
            </div>
          </div>
          <div className='w-full flex flex-row gap-2'>
            <div className='flex flex-col gap-2 w-1/5'>
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
            <div className='flex flex-col gap-2 w-2/5'>
              <Label className='font-semibold'>Diagnóstico:</Label>
              <Input className='bg-white' {...register('diagnostic')} />
            </div>
            <div className='flex flex-col gap-2 w-2/5'>
              <Label className='font-semibold'>Recomendación:</Label>
              <Input className='bg-white' {...register('recomendations')} />
            </div>
          </div>
          <div className='w-full flex flex-row gap-2'>
            <div className='flex flex-col gap-2 w-1/3'>
              <Label className='font-semibold'>N° de reporte:</Label>
              <Input className='bg-white' {...register('name')} />
            </div>
            <div className='flex flex-col gap-2 w-2/3'>
              <Label className='font-semibold'>Archivo:</Label>
              <Input
                className='bg-white'
                type='file'
                accept='.pdf'
                onChange={(e) => {
                  if (e.target.files) {
                    setFile(e.target.files[0]);
                  }
                }} />
            </div>
          </div>

          {/* Status de aviso */}
          <div className='w-full flex flex-col gap-2'>
            <div className='w-full flex flex-row justify-between items-center'>
              <Label className='font-semibold'>Status de avisos relacionados:</Label>
              <div className='flex flex-row gap-1'>
                <Button type='button' onClick={() => handleSubmitNotices()} className='bg-blue-600'>
                  Guardar aviso
                </Button>
                <Button type='button' onClick={() => handleAddNotice()} className='bg-blue-600'>
                  Añadir aviso
                </Button>
              </div>
            </div>
            <Table className=" bg-white">
              <TableHeader className="bg-gray-300">
                <TableRow>
                  <TableHead >N° aviso</TableHead>
                  <TableHead >Fecha</TableHead>
                  <TableHead >Status</TableHead>
                  <TableHead >N° OT</TableHead>
                  <TableHead >Fecha OT</TableHead>
                  <TableHead >Status OT</TableHead>
                  <TableHead >Status Real</TableHead>
                  <TableHead >Comentario</TableHead>
                  <TableHead ></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {noticesData.length > 0 ? (
                  noticesData.map((data, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Input
                          className='bg-white'
                          value={data.name ? data.name : ""}
                          onChange={(e) => {
                            const updatedNotices = [...noticesData];
                            updatedNotices[index].name = e.target.value;
                            setNoticesData(updatedNotices);
                          }} />
                      </TableCell>
                      <TableCell>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              data-empty={!date_status}
                              className="data-[empty=true]:text-muted-foreground justify-start text-left font-normal w-full"
                            >
                              <CalendarIcon />
                              {date_status ? format(date_status, "dd/MM/yyyy", { locale: es }) : <span>Selecciona una fecha</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={date_status} onSelect={setDateStatus} locale={es} />
                          </PopoverContent>
                        </Popover>
                      </TableCell>
                      <TableCell>
                        <Select value={data.status.toString()} onValueChange={(value) => {
                          const updatedNotices = [...noticesData];
                          updatedNotices[index].status = parseInt(value);
                          setNoticesData(updatedNotices);
                        }}>
                          <SelectTrigger className='w-full bg-white'>
                            <SelectValue placeholder="Seleccionar..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Abierto</SelectItem>
                            <SelectItem value="2">Cerrado</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input
                          className='bg-white'
                          value={data.ot_number ? data.ot_number : ""}
                          onChange={(e) => {
                            const updatedNotices = [...noticesData];
                            updatedNotices[index].ot_number = e.target.value;
                            setNoticesData(updatedNotices);
                          }} />
                      </TableCell>
                      <TableCell>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              data-empty={!date_ot}
                              className="data-[empty=true]:text-muted-foreground justify-start text-left font-normal w-full"
                            >
                              <CalendarIcon />
                              {date_ot ? format(date_ot, "dd/MM/yyyy", { locale: es }) : <span>Selecciona una fecha</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={date_ot} onSelect={setDateOt} locale={es} />
                          </PopoverContent>
                        </Popover>
                      </TableCell>
                      <TableCell>
                        <Select value={(data.ot_status ?? 1).toString()} onValueChange={(value) => {
                          const updatedNotices = [...noticesData];
                          updatedNotices[index].ot_status = parseInt(value);
                          setNoticesData(updatedNotices);
                        }}>
                          <SelectTrigger className='w-full bg-white'>
                            <SelectValue placeholder="Seleccionar..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Abierto</SelectItem>
                            <SelectItem value="2">Cerrado</SelectItem>
                          </SelectContent>
                        </Select>

                      </TableCell>
                      <TableCell>
                        <Select value={(data.status_real ?? 1).toString()} onValueChange={(value) => {
                          const updatedNotices = [...noticesData];
                          updatedNotices[index].status_real = parseInt(value);
                          setNoticesData(updatedNotices);
                        }}>
                          <SelectTrigger className='w-full bg-white'>
                            <SelectValue placeholder="Seleccionar..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Atendido</SelectItem>
                            <SelectItem value="2">No atendido</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input
                          className='bg-white'
                          value={data.comment ? data.comment : ""}
                          onChange={(e) => {
                            const updatedNotices = [...noticesData];
                            updatedNotices[index].comment = e.target.value;
                            setNoticesData(updatedNotices);
                          }} />
                      </TableCell>
                      <TableCell>
                        <button
                          type='button'
                          onClick={() => {
                            if (noticesData[index].id) {
                              handleDeleteNotice(index);
                            } else {
                              const updatedNotices = noticesData.filter((_, i) => i !== index);
                              setNoticesData(updatedNotices);
                            }
                          }}>
                          <FaTrash className='text-red-600' />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">No hay datos de avisos disponibles.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </form>
        <DialogFooter>
          <Button type='submit' form='report-form'>
            {loading ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

  )
}

export default EditReportDialog;
