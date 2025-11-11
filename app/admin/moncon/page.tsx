'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useEffect, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import * as XLSX from "xlsx";
import { FaBell, FaCircle, FaEye, FaFilePdf, FaPencil, FaPlus, FaTrash, FaUpload } from 'react-icons/fa6'
import { createMonconReport, deleteMonconReport, getMonconReports, getNoticesByReportId, updateReport } from '../../services/monconServices'
import { getEntities } from '@/app/services/entitiesServices'
import { Entity, ReportType } from '@/lib/types'

const MonitoreoCondiciones = () => {
  const [openNewRegister, setOpenNewRegister] = useState<boolean>(false);
  const [openPDF, setOpenPDF] = useState<boolean>(false);
  const [openUploadRoute, setOpenUploadRoute] = useState<boolean>(false);
  const [registerSelected, setRegisterSelected] = useState<ReportType>({
    id: 0,
    entity: 0,
    name: "",
    program: 2,
    program_date: "",
    task_type: 0,
    execution_status: 2,
    execution_date: "",
    condition: 1,
    diagnostic: "",
    recomendations: "",
    observations: "",
    attachment: [],
    created_at: "",
  });
  const [openEditRegister, setOpenEditRegister] = useState<boolean>(false);
  const [openViewRegister, setOpenViewRegister] = useState<boolean>(false);
  const [openNoticesDialog, setOpenNoticesDialog] = useState<boolean>(false);
  const [data, setData] = useState<ReportType>({
    id: 0,
    entity: 0,
    name: "",
    program: 2,
    program_date: "",
    task_type: 0,
    execution_status: 2,
    execution_date: "",
    condition: 1,
    diagnostic: "",
    recomendations: "",
    observations: "",
    attachment: [],
    created_at: "",
  });

  const [routeData, setRouteData] = useState<any[]>([]);
  const [generalData, setGeneralData] = useState<any[]>([]);
  const [noticesData, setNoticesData] = useState<any[]>([]);

  const [date, setDate] = useState<Date | undefined>(new Date())

  const getAllReport = () => {
    getMonconReports()
      .then((response) => {
        setGeneralData(response.data);
      });
  }

  useEffect(() => {
    getAllReport();
  }, []);

  const chargeDataFromFile = (file: File | null) => {
    if (!file) {
      alert("Debe seleccionar un archivo Excel");
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target?.result;
      if (!data) return;
      // 📘 Leer el libro de Excel
      const wb = XLSX.read(data, { type: "array" });
      // 📗 Tomar la primera hoja
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      // 🔄 Convertir a JSON
      const json: any[] = XLSX.utils.sheet_to_json(ws);
      console.log(json);
      setRouteData(json);
    };
    // Leer el archivo como array buffer (necesario para XLSX)
    reader.readAsArrayBuffer(file);
  };

  const addReportsInGeneralData = (newReports: any[]) => {
    setGeneralData((prevData) => [...prevData, ...newReports]);
    setOpenUploadRoute(false);
  }

  const handleDeleteRegister = (index: number, dataId: string) => {
    if (confirm(`¿Estás seguro de que deseas eliminar este registro?`)) {
      deleteMonconReport(dataId).then((response) => {
        console.log("eliminado", response)
        getAllReport()
      })

      //setGeneralData(updatedData);
    }
  };

  const getTaskTypeName = (taskTypeCode: number) => {
    switch (taskTypeCode) {
      case 1:
        return 'NTD';
      case 2:
        return 'PDM';
      case 3:
        return 'Alineacion';
      case 4:
        return 'Insp. Visual';
      default:
        return 'Desconocido';
    }
  };

  const getConditionName = (conditionCode: number) => {
    switch (conditionCode) {
      case 1:
        return (
          <div className='flex flex-row gap-1 items-center'>
            <FaCircle className='text-green-500' />
            <h1>Normal</h1>
          </div>
        );
      case 2:
        return (
          <div className='flex flex-row gap-1 items-center'>
            <FaCircle className='text-yellow-500' />
            <h1>Tolerable</h1>
          </div>
        );
      case 3:
        return (
          <div className='flex flex-row gap-1 items-center'>
            <FaCircle className='text-orange-500' />
            <h1>Precaución</h1>
          </div>
        );
      case 4:
        return (
          <div className='flex flex-row gap-1 items-center'>
            <FaCircle className='text-red-500' />
            <h1>Crítico</h1>
          </div>
        );
      default:
        return (
          <div className='flex flex-row gap-1 items-center'>
            <FaCircle className='text-gray-500' />
            <h1>Desconocido</h1>
          </div>
        );
    }
  };

  const searchNotices = (reportId: number) => {
    getNoticesByReportId(reportId)
      .then((response) => {
        setNoticesData(response.data);
        setOpenNoticesDialog(true);
      });
  }

  //SECCION ENTIDADES
  const [entities, setEntities] = useState<Entity[]>([])

  const createSingleRegister = () => {
    createMonconReport(data)
      .then((response) => {
        console.log("Report created successfully:", response);
        setOpenNewRegister(false);
        getAllReport();
        // Optionally, you can reset the form or update the UI
      })
      .catch((error) => {
        console.error("Error creating report:", error);
      });
  }

  useEffect(() => {
    getEntities()
      .then((response) => {
        console.log("Fetched entities:", response)
        setEntities(response.data)
      })
      .catch((error) => {
        console.error("Error fetching entities:", error)
      })
  }, [])

  const handleSubmit = () => {
    console.log('Submitting data:', {
      ...data,
      program_date: date ? format(date, "yyyy-MM-dd") : "",
    });
    // const formData = new FormData();
    // formData.append("name", data.name || "");
    // formData.append("diagnostic", data.diagnostic || "");
    // formData.append("recommendations", data.recommendations || "");
    // formData.append("task_type", data.task_type);
    // formData.append("execution_status", data.execution_status);
    // formData.append("condition", data.condition);

    // Aquí puedes hacer la llamada a la API para enviar los datos
  }

  // edit report
  const editReport = (reportId: number, updatedData: ReportType) => {
    // Aquí puedes hacer la llamada a la API para editar el reporte
    console.log('Editing report:', reportId, updatedData);
    const formData = new FormData()
    formData.append("name", registerSelected.name)
    formData.append("condition", registerSelected.condition)
    formData.append("diagnostic", registerSelected.diagnostic)
    formData.append("recomendations", registerSelected.recomendations)
    formData.append("program", registerSelected.program)
    formData.append("observations", registerSelected.observations)
    formData.append("execution_status", registerSelected?.execution_status)

    updateReport(registerSelected?.id, formData).then((response) => {
      console.log("Report updated successfully:", response);
      setOpenEditRegister(false);
      getAllReport();
      setRegisterSelected(null)
      // Aquí puedes manejar la respuesta después de la actualización
    }).catch((error) => {
      console.error("Error updating report:", error);
    });
  };

  return (
    <div>
      {/* Cabecera */}
      <div className='w-full flex flex-row justify-between items-center mb-4'>
        <h1 className='font-bold text-lg'>MONITOREO DE CONDICIONES</h1>
        <div className='flex flex-row items-center gap-2'>
          {/* <Input type='file' accept='.xlsx' className='' /> */}
          <Button onClick={() => { console.log('Subiendo archivo', setOpenUploadRoute(true)) }}><FaUpload /> Crear ruta</Button>
          <Button onClick={() => { setOpenNewRegister(true) }}><FaPlus /> Agregar registro</Button>
        </div>
      </div>
      <Separator className='my-4' />
      <div className="h-[85vh] overflow-auto">
        <Table className="bg-white">
          <TableHeader className="bg-gray-300 sticky top-0 z-10">
            <TableRow>
              <TableHead className="w-[50px]">N°</TableHead>
              <TableHead>NOMBRE REPORTE</TableHead>
              <TableHead>PROGRAMA</TableHead>
              <TableHead>FECHA PROGR.</TableHead>
              <TableHead>EJECUCIÓN</TableHead>
              <TableHead>FECHA EJEC.</TableHead>
              <TableHead>EQUIPO/FAMILIA.</TableHead>
              <TableHead>TAG (Comp.)</TableHead>
              <TableHead>COMP/ITEM</TableHead>
              <TableHead>TIPO TAREA</TableHead>
              <TableHead>CONDICIÓN</TableHead>
              <TableHead>ACCIONES</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {generalData.map((data, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{data.name}</TableCell>
                <TableCell>{data.program == 1 ? 'Programado' : 'No Programado'}</TableCell>
                <TableCell>{data.created_at.slice(0, 10)}</TableCell>
                <TableCell>{data.execution_status === 1 ? 'Ejecutado' : 'No Ejecutado'}</TableCell>
                <TableCell>{data?.execution_date}</TableCell>
                <TableCell>Molino SAG</TableCell>
                <TableCell>MLS-001-B1</TableCell>
                <TableCell>Bomba</TableCell>
                <TableCell>{getTaskTypeName(data.task_type)}</TableCell>
                <TableCell>{getConditionName(data.condition)}</TableCell>
                <TableCell className="flex flex-row gap-2">
                  <Button size="sm"
                    disabled={!data.attachments || data.attachments.length === 0}
                    onClick={() => setOpenPDF(true)}>
                    <FaFilePdf />
                  </Button>
                  {/* <Button size="sm"
                    onClick={() => { searchNotices(data.id) }}>
                    <FaBell />
                  </Button> */}
                  <Button size="sm"
                    onClick={() => {
                      setRegisterSelected(data);
                      setOpenViewRegister(true)
                      searchNotices(data.id)
                    }}>
                    <FaEye />
                  </Button>
                  <Button size="sm"
                    onClick={() => {
                      setRegisterSelected(data);
                      setOpenEditRegister(true)
                      // searchNotices(data.id)
                    }}>
                    <FaPencil />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteRegister(index, data.id)}>
                    <FaTrash />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Visualizar archivos PDF */}
      <Dialog open={openPDF} onOpenChange={setOpenPDF}>
        <DialogContent className='min-w-3xl bg-slate-200'>
          <DialogHeader>
            <DialogTitle>Archivos PDF</DialogTitle>
          </DialogHeader>
          <div className='w-full p-2 rounded-md gap-4 flex flex-col mt-4'>
            <embed src="/sample.pdf#toolbar=0&navpanes=0&scrollbar=0" type="application/pdf" width="100%" height="600px" />
          </div>
        </DialogContent>
      </Dialog>

      {/* Nuevo registro individual */}
      <Dialog open={openNewRegister} onOpenChange={setOpenNewRegister}>
        <DialogContent className='min-w-5xl bg-slate-200'>
          <DialogHeader>
            <DialogTitle>NUEVO REGISTRO </DialogTitle>
            <DialogDescription>Nuevo registro no programado que no esta registrado en ruta semanal</DialogDescription>
          </DialogHeader>
          <div className='w-full p-2 rounded-md gap-4 flex flex-col mt-4'>
            <div className='w-full flex flex-row gap-2'>
              <div className='flex flex-col gap-2 w_-1/3'>
                <Label className='font-semibold'>Planta:</Label>
                <Input
                  className='bg-white' value={String(entities.find(entity => entity.parent === null)?.name)} disabled></Input>
              </div>
              <div className='flex flex-col gap-2 w-1/3'>
                <Label className='font-semibold'>Área:</Label>
                <Select>
                  <SelectTrigger className='w-full bg-white'>
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                  <SelectContent>
                    {
                      entities.filter((entity) => entity.parent === 1).map((entity) => (
                        <SelectItem key={entity.id} value={String(entity.id)}>{entity.name}</SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
              <div className='flex flex-col gap-2 w-1/4'>
                <Label className='font-semibold'>TAG:</Label>
                <Select

                  value={data ? String(data.entity) : ""}
                  onValueChange={(value) => {
                    setData({
                      ...data!,
                      entity: parseInt(value)
                    })
                  }}
                >
                  <SelectTrigger className='bg-white w-full'>
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Componente1</SelectItem>
                    <SelectItem value="2"></SelectItem>
                    <SelectItem value="3"></SelectItem>
                    <SelectItem value="4"></SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='flex flex-col gap-2 w-2/4'>
                <Label className='font-semibold'>Nombre de equipo:</Label>
                <Input className='bg-white' />
              </div>
            </div>
            <div className='w-full flex flex-row gap-2'>
              <div className='flex flex-col gap-2 w-1/3'>
                <Label className='font-semibold'>Fecha de programación:</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      data-empty={!date}
                      className="data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "dd/MM/yyyy", { locale: es }) : <span>Selecciona una fecha</span>}
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      locale={es}
                      defaultMonth={date} // ✅ Muestra el mes actual
                    />
                  </PopoverContent>
                </Popover>
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
                    <SelectItem value="1">PDM</SelectItem>
                    <SelectItem value="2">NDT</SelectItem>
                    <SelectItem value="3">Alineamiento</SelectItem>
                    <SelectItem value="4">Visual</SelectItem>
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
            <Button>Guardar y agregar nuevo</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Editar registro individual */}
      {
        openEditRegister && (
          <Dialog open={openEditRegister} onOpenChange={setOpenEditRegister}>
            <DialogContent className='min-w-5xl bg-slate-200'>
              <DialogHeader>
                <DialogTitle>Editar Registro</DialogTitle>
              </DialogHeader>
              <div className='w-full p-2 rounded-md gap-4 flex flex-col mt-4'>
                <div className='w-full flex flex-row gap-2'>
                  <div className='flex flex-col gap-2 w-1/3'>
                    <Label>Fecha de programación:</Label>
                    <Input className='bg-white' value={registerSelected ? registerSelected.created_at.slice(0, 10) : ""} disabled />
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
                    <Select value={registerSelected ? registerSelected.program.toString() : ""}>
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
                  <div className='flex flex-col gap-2 w_-1/3'>
                    <Label className='font-semibold'>Planta:</Label>
                    <Input className='bg-white' disabled></Input>
                  </div>
                  <div className='flex flex-col gap-2 w-2/3'>
                    <Label className='font-semibold'>Área:</Label>
                    <Select>
                      <SelectTrigger className='w-full bg-white'>
                        <SelectValue placeholder="Seleccionar..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PTAE">PTAE</SelectItem>
                        <SelectItem value="MOLIENDA">Molienda</SelectItem>
                        <SelectItem value="CHANCADO_PRIMARIO">Chancado Primario</SelectItem>
                        <SelectItem value="FLOTACION_Y_REMOLIENDA">Flotación y Remolienda</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className='w-full flex flex-row gap-2'>
                  <div className='flex flex-col gap-2 w-1/4'>
                    <Label className='font-semibold'>TAG:</Label>
                    <Select>
                      <SelectTrigger className='bg-white w-full'>
                        <SelectValue placeholder="Seleccionar..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1"></SelectItem>
                        <SelectItem value="2"></SelectItem>
                        <SelectItem value="3"></SelectItem>
                        <SelectItem value="4"></SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className='flex flex-col gap-2 w-2/4'>
                    <Label className='font-semibold'>Nombre de equipo:</Label>
                    <Input
                      className='bg-white'
                      value={registerSelected ? registerSelected.entity : ""}
                      onChange={(e) => {
                        setRegisterSelected({
                          ...registerSelected!,
                          entity: e.target.value
                        })
                      }}
                    />
                  </div>
                  <div className='flex flex-col gap-2 w-1/4'>
                    <Label className='font-semibold'>Tipo de componente:</Label>
                    <Input
                      className='bg-white'
                      value={registerSelected ? registerSelected.entity : ""}
                      onChange={(e) => {
                        setRegisterSelected({
                          ...registerSelected!,
                          entity: e.target.value
                        })
                      }}
                    />
                  </div>
                </div>
                <div className='w-full flex flex-row gap-2'>
                  <div className='flex flex-col gap-2 w-1/4'>
                    <Label className='font-semibold'>Tipo de tarea:</Label>
                    <Select
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
                        <SelectItem value="1">PDM</SelectItem>
                        <SelectItem value="2">NDT</SelectItem>
                        <SelectItem value="3">Alineamiento</SelectItem>
                        <SelectItem value="4">Insp. visual</SelectItem>
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
                    <Input className='bg-white' type='file' accept='.pdf'></Input>
                  </div>
                </div>

                {/* Status de aviso */}
                <div className='w-full flex flex-row gap-2 mt-5'>
                  <div className='flex flex-col gap-2 w-2/3'>
                    <Label className='font-semibold'>N° de avisos:</Label>
                    <Input className='bg-white' />
                  </div>
                  <div className='flex flex-col gap-2 w-2/3'>
                    <Label className='font-semibold'>Fecha de aviso:</Label>
                    <Input className='bg-white' />
                  </div>
                  <div className='flex flex-col gap-2 w-2/3'>
                    <Label className='font-semibold'>Status de aviso:</Label>
                    <Select>
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
                    <Input className='bg-white' />
                  </div>
                  <div className='flex flex-col gap-2 w-2/3'>
                    <Label className='font-semibold'>Fecha de OT:</Label>
                    <Input className='bg-white' />
                  </div>
                  <div className='flex flex-col gap-2 w-2/3'>
                    <Label className='font-semibold'>Status de OT:</Label>
                    <Select>
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
                    <Select>
                      <SelectTrigger className='w-full bg-white'>
                        <SelectValue placeholder="Seleccionar..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Abierto</SelectItem>
                        <SelectItem value="2">Cerrado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className='flex flex-col gap-2 w-2/3'>
                    <Label className='font-semibold'>Comentario:</Label>
                    <Input className='bg-white' />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={() => {
                    if (registerSelected) {
                      editReport(registerSelected?.id, registerSelected);
                    }
                  }}
                >Guardar y salir</Button>
                {/* <Button>Guardar y agregar nuevo</Button> */}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )
      }
      {/* Ver registro individual */}
      {
        openViewRegister && (
          <Dialog open={openViewRegister} onOpenChange={setOpenViewRegister}>
            <DialogContent className='min-w-5xl bg-slate-200'>
              <DialogHeader>
                <DialogTitle className='font-bold'>DETALLE DE REGISTRO</DialogTitle>
              </DialogHeader>
              <div className='w-full p-2 rounded-md gap-4 flex flex-col mt-4'>
                <div className='w-full flex flex-row gap-2'>
                  <div className='flex flex-col gap-2 w-2/3'>
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
                    <Select value={registerSelected ? registerSelected.program.toString() : ""} >
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
                  <div className='flex flex-col gap-2 w_-1/3'>
                    <Label className='font-semibold'>Planta:</Label>
                    <Input className='bg-white' disabled></Input>
                  </div>
                  <div className='flex flex-col gap-2 w-2/3'>
                    <Label className='font-semibold'>Área:</Label>
                    <Select>
                      <SelectTrigger className='w-full bg-white'>
                        <SelectValue placeholder="Seleccionar..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PTAE">PTAE</SelectItem>
                        <SelectItem value="MOLIENDA">Molienda</SelectItem>
                        <SelectItem value="CHANCADO_PRIMARIO">Chancado Primario</SelectItem>
                        <SelectItem value="FLOTACION_Y_REMOLIENDA">Flotación y Remolienda</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className='w-full flex flex-row gap-2'>
                  <div className='flex flex-col gap-2 w-1/4'>
                    <Label className='font-semibold'>TAG:</Label>
                    <Select>
                      <SelectTrigger className='bg-white w-full'>
                        <SelectValue placeholder="Seleccionar..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1"></SelectItem>
                        <SelectItem value="2"></SelectItem>
                        <SelectItem value="3"></SelectItem>
                        <SelectItem value="4"></SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className='flex flex-col gap-2 w-2/4'>
                    <Label className='font-semibold'>Nombre de equipo:</Label>
                    <Input
                      className='bg-white'
                      value={registerSelected ? registerSelected.entity : ""}
                      onChange={(e) => {
                        setRegisterSelected({
                          ...registerSelected!,
                          entity: e.target.value
                        })
                      }}
                    />
                  </div>
                  <div className='flex flex-col gap-2 w-1/4'>
                    <Label className='font-semibold'>Tipo de componente:</Label>
                    <Input
                      className='bg-white'
                      value={registerSelected ? registerSelected.entity : ""}
                      onChange={(e) => {
                        setRegisterSelected({
                          ...registerSelected!,
                          entity: e.target.value
                        })
                      }}
                    />
                  </div>
                </div>
                <div className='w-full flex flex-row gap-2'>
                  <div className='flex flex-col gap-2 w-1/4'>
                    <Label className='font-semibold'>Tipo de tarea:</Label>
                    <Select
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
                        <SelectItem value="1">PDM</SelectItem>
                        <SelectItem value="2">NDT</SelectItem>
                        <SelectItem value="3">Alineamiento</SelectItem>
                        <SelectItem value="4">Insp. visual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className='flex flex-col gap-2 w-1/4'>
                    <Label className='font-semibold'>Status de ejecución:</Label>
                    <Select
                      value={registerSelected ? registerSelected.execution_status.toString() : ""}
                      onValueChange={(value) => {
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
                    {/* Obtiene nombre de archivo subido */}
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
                    {/* Subir PDF con información detallada, lo que están realizando en estos momentos */}
                    <Label className='font-semibold'>Archivo:</Label>
                    <Input className='bg-white' type='file' accept='.pdf'></Input>
                  </div>
                </div>

                {/* Status de aviso */}
                <div className='w-full flex flex-row gap-2 mt-5'>
                  <div className='flex flex-col gap-2 w-2/3'>
                    <Label className='font-semibold'>N° de avisos:</Label>
                    <Input className='bg-white' value={noticesData[0]?.name} />
                  </div>
                  <div className='flex flex-col gap-2 w-2/3'>
                    <Label className='font-semibold'>Fecha de aviso:</Label>
                    <Input className='bg-white' value={noticesData[0]?.date} />
                  </div>
                  <div className='flex flex-col gap-2 w-2/3'>
                    <Label className='font-semibold'>Status de aviso:</Label>
                    <Select value={String(noticesData[0]?.status)}>
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
                    <Input disabled className='bg-white' value={noticesData[0]?.ot_number} />
                  </div>
                  <div className='flex flex-col gap-2 w-2/3'>
                    <Label className='font-semibold'>Fecha de OT:</Label>
                    <Input disabled className='bg-white' value={noticesData[0]?.ot_date} />
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
                    <Select value={noticesData[0]?.real_status}>
                      <SelectTrigger className='w-full bg-white'>
                        <SelectValue placeholder="Seleccionar..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Abierto</SelectItem>
                        <SelectItem value="2">Cerrado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className='flex flex-col gap-2 w-2/3'>
                    <Label className='font-semibold'>Comentario:</Label>
                    <Input className='bg-white' value={noticesData[0]?.comment} />
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )
      }

      {/* Añadir ruta de trabajo */}
      <Dialog open={openUploadRoute} onOpenChange={setOpenUploadRoute}>
        <DialogContent className='min-w-[1000px] max-h-[50%] bg-slate-200'>
          <DialogHeader>
            <DialogTitle>Crear Ruta de Monitoreo</DialogTitle>
          </DialogHeader>
          <div className='flex flex-col gap-2 w-full justify-start'>
            <div className='flex flex-row gap-2'>
              <div className='flex flex-col gap-2'>
                <Label className='font-semibold'>Fecha:</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      data-empty={!date}
                      className="data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal"
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
              <div className='flex flex-col gap-2'>
                <Label className='font-semibold'>Planta:</Label>
                <Input className='bg-white' placeholder='Ejemplo: Molienda' value={'Antapaccay'} disabled />
              </div>
              <div className='flex flex-col gap-2'>
                <Label className='font-semibold'>Subir plantilla <a className='hover:text-gray-500 font-normal' href='/example_moncon.xlsx'>example.xlsx</a>:</Label>
                <Input className='bg-white' type='file' accept='.xlsx' onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  chargeDataFromFile(file)
                }}
                />
              </div>
            </div>
            <div className="bg-white mt-4 rounded-lg shadow">
              <Table>
                <TableHeader className="bg-gray-300 sticky top-0 z-10">
                  <TableRow>
                    <TableHead className='w-[2%]'>N°</TableHead>
                    <TableHead className='w-[10%]'>FECHA EJECUCION</TableHead>
                    <TableHead className='w-[10%]'>TAG</TableHead>
                    <TableHead className='w-[10%]'>EQUIPO/ITEM</TableHead>
                    <TableHead className='w-[10%]'>COMPONENTE</TableHead>
                    <TableHead className='w-[10%]'>TIPO DE TAREA</TableHead>
                    <TableHead className='w-[10%]'>ACCIONES</TableHead>
                  </TableRow>
                </TableHeader>
              </Table>

              {/* Contenedor con scroll */}
              <div className="max-h-[200px] overflow-auto">
                <Table>
                  <TableBody>
                    {routeData.length > 0 ? (
                      routeData.map((data, index) => (
                        <TableRow key={index}>
                          <TableCell className='w-[2%]'>{index + 1}</TableCell>
                          <TableCell className='w-[10%]'>
                            {
                              new Date((data["FECHA EJECUCION"] - 25569) * 86400 * 1000)
                                .toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' })
                            }
                          </TableCell>
                          <TableCell className='w-[10%]'>{data["TAG"]}</TableCell>
                          <TableCell className='w-[10%]'>{data["EQUIPO / ITEM"]}</TableCell>
                          <TableCell className='w-[10%]'>{data["COMPONENTE"]}</TableCell>
                          <TableCell className='w-[10%]'>{data["TIPO TAREA"]}</TableCell>
                          <TableCell className='w-[10%]'>
                            <div className='flex flex-row gap-1'>
                              <Button size="sm"><FaPencil /></Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => { console.log("Eliminando...") }}>
                                <FaTrash />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center">
                          No hay datos cargados
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="destructive" onClick={() => { setOpenUploadRoute(false); setRouteData([]); }}>Cancelar</Button>
            <Button onClick={() => { addReportsInGeneralData(routeData); setRouteData([]); }}>Crear registros</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* <Dialog open={openNoticesDialog} onOpenChange={() => { setOpenNoticesDialog(false); setNoticesData([]); }}>
        <DialogContent className='min-w-1/2 max-h-[600px] bg-slate-200'>
          <DialogHeader>
            <DialogTitle>Avisos para </DialogTitle>
          </DialogHeader>
          <div>
            <Table className='bg-white'>
              <TableHeader className="bg-gray-300 sticky top-0 z-10">
                <TableRow>
                  <TableHead>N° AVISO</TableHead>
                  <TableHead>STATUS AVISO</TableHead>
                  <TableHead>FECHA AVISO</TableHead>
                  <TableHead>N° OT</TableHead>
                  <TableHead>STATUS OT</TableHead>
                  <TableHead>FECHA OT</TableHead>
                  <TableHead>STATUS REAL</TableHead>
                  <TableHead>COMENTARIO</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {noticesData.length > 0 ? (
                  noticesData.map((data, index) => (
                    <TableRow key={index}>
                      <TableCell>{data.name}</TableCell>
                      <TableCell>{data.status === 1 ? 'Abierto' : 'Cerrado'}</TableCell>
                      <TableCell>{data.date ? data.date : 'N/A'}</TableCell>
                      <TableCell>{data.ot_number ? data.ot_number : 'N/A'}</TableCell>
                      <TableCell>{data.ot_status === 1 ? 'Abierto' : 'Cerrado'}</TableCell>
                      <TableCell>{data.ot_date ? data.ot_date : 'N/A'}</TableCell>
                      <TableCell>{data.status_real === 1 ? 'Atendido' : 'No atendido'}</TableCell>
                      <TableCell>{data.comment ? data.comment : 'N/A'}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No hay avisos disponibles
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog> */}
    </div >

  )
}

export default MonitoreoCondiciones