import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Calendar as CalendarIcon } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Notices, Report, services, tareas } from '@/lib/types'
import { useEffect, useState } from 'react'
import { createNotice, deleteNotice, getNoticesByReportId, updateReport } from '@/app/services/monconServices'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { FaTrash } from 'react-icons/fa6'
import { Equipment } from '../../utils/types'
import { getEntities } from '@/app/services/entitiesServices'


interface ReportDialogEditProps {
  openEditRegister: boolean
  setOpenEditRegister: (open: boolean) => void
  registerSelected: Report | null
  setRegisterSelected: (report: Report | null) => void
  getAllReport: () => void
}

const ReportDialogEdit = ({ openEditRegister, setOpenEditRegister, setRegisterSelected, registerSelected, getAllReport }: ReportDialogEditProps) => {
  console.log("registerSelected", registerSelected)
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(false);
  const [noticesData, setNoticesData] = useState<Notices[]>([]);
  const [date, setDate] = useState<Date | undefined>(registerSelected?.execution_date ? new Date(registerSelected.execution_date) : undefined)
  const [date_status, setDateStatus] = useState<Date | undefined>(new Date())
  const [date_ot, setDateOt] = useState<Date | undefined>(new Date())
  const [file, setFile] = useState<File | null>(null);

  const entityDetail = registerSelected?.entity_detail
  const plantLabel = entityDetail?.plant ? `${entityDetail.plant.name} (${entityDetail.plant.tag})` : ""
  const areaLabel = entityDetail?.area ? `${entityDetail.area.name} (${entityDetail.area.tag})` : ""
  const equipmentLabel = entityDetail?.equipment ? `${entityDetail.equipment.name} (${entityDetail.equipment.tag})` : ""
  const componentLabel = entityDetail?.current ? `${entityDetail.current.name} (${entityDetail.current.tag})` : ""

  console.log("noticesData", plantLabel, areaLabel, equipmentLabel, componentLabel)

  const editReport = (reportId: number, updatedData: Report) => {
    setLoading(true);
    // Aquí puedes hacer la llamada a la API para editar el reporte
    if (!updatedData) return;
    console.log('Editing report:', reportId, updatedData);
    const formData = new FormData()
    formData.append("condition", String(updatedData.condition ?? ""))
    formData.append("diagnostic", String(updatedData.diagnostic ?? ""))
    formData.append("execution_status", String(updatedData.execution_status ?? ""))
    formData.append("name", String(updatedData.name ?? ""))
    formData.append("observations", String(updatedData.observations ?? ""))
    formData.append("program", String(updatedData.program ?? ""))
    formData.append("recomendations", String(updatedData.recomendations ?? ""))
    formData.append("task_type", String(updatedData.task_type ?? ""))
    if (date) {
      formData.append("execution_date", date.toISOString().slice(0, 10))
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
      // Aquí puedes manejar la respuesta después de la actualización
    }).catch((error) => {
      console.error("Error updating report:", error);
    });
  };

  useEffect(() => {
    getEntities().then(response => {
      setEquipments(response.data.filter((entity: Equipment) => entity.type === 3 || entity.type === 4))
    }).catch(error => {
      console.error('Error al obtener los equipos y componentes:', error)
    })
  }, []);

  const searchInfoComponent = () => {
    const component = equipments.find(item => item.id === registerSelected?.entity);
    console.log("component", component)
  }

  useEffect(() => {
    if (registerSelected) {
      searchInfoComponent();
    }
  }, [equipments]);

  const handleAddNotice = () => {
    // Lógica para añadir un nuevo aviso
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
      console.log("Notices fetched successfully:", response);
      setNoticesData(response.data);
    }).catch((error) => {
      console.error("Error fetching notices:", error);
    });
    // Lógica para obtener los avisos relacionados con un reporte
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

  return (
    <Dialog open={openEditRegister} onOpenChange={() => { setOpenEditRegister(false); setRegisterSelected(null) }}>
      <DialogContent className='min-w-5xl bg-slate-200'>
        <DialogHeader>
          <DialogTitle>Editar Registro</DialogTitle>
        </DialogHeader>
        <div className='w-full p-2 rounded-md gap-4 flex flex-col mt-4'>
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
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    data-empty={!date}
                    className="data-[empty=true]:text-muted-foreground justify-start text-left font-normal w-full"
                  >
                    <CalendarIcon />
                    {date ? format(date, "dd/MM/yyyy", { locale: es }) : <span>Selecciona una fecha</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} locale={es} />
                </PopoverContent>
              </Popover>
            </div>
            <div className='flex flex-col gap-2 w-1/3'>
              <Label className='font-semibold'>Programación:</Label>
              <Select
                disabled
                value={registerSelected ? registerSelected.program.toString() : ""} >
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
              <Select
                disabled
                value={registerSelected ? registerSelected.service_type.toString() : ""}
              >
                <SelectTrigger className='bg-white w-full'>
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
            <div className='flex flex-col gap-2 w-1/4'>
              <Label className='font-semibold'>Tarea:</Label>
              <Select
                disabled
                value={registerSelected ? registerSelected.task_type.toString() : ""}
                onValueChange={(value) => {
                  setRegisterSelected({
                    ...registerSelected!,
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
                      <SelectItem key={tarea.id} value={tarea.id.toString()}>{tarea.name}</SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>
            <div className='flex flex-col gap-2 w-1/4'>
              <Label className='font-semibold'>Status de ejecución:</Label>
              <Select
                value={registerSelected ? String(registerSelected.execution_status) : ""}
                onValueChange={(value) => {
                  console.log("execuion", value)
                  setRegisterSelected({
                    ...registerSelected!,
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
                value={registerSelected ? registerSelected.observations : ""}
                onChange={(e) => {
                  setRegisterSelected({
                    ...registerSelected!,
                    observations: e.target.value
                  })
                }}
              />
            </div>
          </div>
          <div className='w-full flex flex-row gap-2'>
            <div className='flex flex-col gap-2 w-1/5'>
              <Label className='font-semibold'>Condición:</Label>
              <Select
                value={registerSelected ? registerSelected.condition.toString() : ""}
                onValueChange={(value) => {
                  setRegisterSelected({
                    ...registerSelected!,
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
                  <SelectItem value="3">Precaución</SelectItem>
                  <SelectItem value="4">Crítico</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='flex flex-col gap-2 w-2/5'>
              <Label className='font-semibold'>Diagnóstico:</Label>
              <Input
                className='bg-white'
                value={registerSelected ? registerSelected.diagnostic : ""}
                onChange={(e) => {
                  setRegisterSelected({
                    ...registerSelected!,
                    diagnostic: e.target.value
                  })
                }}
              />
            </div>
            <div className='flex flex-col gap-2 w-2/5'>
              <Label className='font-semibold'>Recomendación:</Label>
              <Input
                className='bg-white'
                value={registerSelected ? registerSelected.recomendations : ""}
                onChange={(e) => {
                  setRegisterSelected({
                    ...registerSelected!,
                    recomendations: e.target.value
                  })
                }}
              />
            </div>
          </div>
          <div className='w-full flex flex-row gap-2'>
            <div className='flex flex-col gap-2 w-1/3'>
              <Label className='font-semibold'>N° de reporte:</Label>
              <Input
                className='bg-white'
                value={registerSelected ? registerSelected.name : ""}
                onChange={(e) => {
                  setRegisterSelected({
                    ...registerSelected!,
                    name: e.target.value
                  })
                }}
              />
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
                <Button asChild onClick={() => handleSubmitNotices()}>
                  <div className='bg-blue-600'>
                    Guardar aviso
                  </div>
                </Button>
                <Button asChild onClick={() => handleAddNotice()}>
                  <div className='bg-blue-600'>
                    Añadir aviso
                  </div>
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
        </div>
        <DialogFooter>
          <Button
            onClick={() => {
              if (registerSelected && registerSelected.id) {
                editReport(registerSelected.id, registerSelected);
              }
            }}
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

  )
}

export default ReportDialogEdit