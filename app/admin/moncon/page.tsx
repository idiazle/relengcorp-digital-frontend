'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import * as XLSX from "xlsx";
import { FaPencil, FaPlus, FaTrash, FaUpload } from 'react-icons/fa6'
import { register } from 'module'

const MonitoreoCondiciones = () => {
  const [date, setDate] = useState<Date>()
  const [openRegister, setOpenRegister] = useState<boolean>(false);
  const [openPDF, setOpenPDF] = useState<boolean>(false);
  const [openUploadRoute, setOpenUploadRoute] = useState<boolean>(false);
  const [registerSelected, setRegisterSelected] = useState(null);
  const [openEditRegister, setOpenEditRegister] = useState<boolean>(false);

  const [routeData, setRouteData] = useState<any[]>([]);
  const [generalData, setGeneralData] = useState<any[]>([]);

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

  const handleDeleteRegister = (index: number, dataName: string) => {
    if (confirm(`¿Estás seguro de que deseas eliminar este registro: ${dataName}?`)) {
      const updatedData = generalData.filter((_, i) => i !== index);
      setGeneralData(updatedData);
    }
  };

  return (
    <div>
      {/* Cabecera */}
      <div className='w-full flex flex-row justify-between items-center mb-4'>
        <h1 className='font-bold text-lg'>MONITOREO DE CONDICIONES</h1>
        <div className='flex flex-row items-center gap-2'>
          {/* <Input type='file' accept='.xlsx' className='' /> */}
          <Button onClick={() => { console.log('Subiendo archivo', setOpenUploadRoute(true)) }}><FaUpload /> Crear ruta</Button>
          <Button onClick={() => { setOpenRegister(true) }}><FaPlus /> Agregar registro</Button>
        </div>
      </div>
      <Separator className='my-4' />
      <Table className='bg-white sticky top-0 z-10'>
        <TableHeader className='bg-gray-300'>
          <TableRow>
            <TableHead>N°</TableHead>
            <TableHead>FECHA EJECUCIÓN</TableHead>
            <TableHead>PROGRAMA</TableHead>
            <TableHead>PLANTA</TableHead>
            <TableHead>AREA</TableHead>
            <TableHead>TAG</TableHead>
            <TableHead>EQUIPO/ITEM</TableHead>
            <TableHead>COMPONENTE</TableHead>
            <TableHead>TIPO TAREA</TableHead>
            <TableHead className='w-[3%]'>ACCIONES</TableHead>
          </TableRow>
        </TableHeader>
      </Table>
      <div className='h-[85vh] overflow-auto'>
        <Table>
          <TableBody>
            {
              generalData.map((data, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {
                      new Date((data["FECHA EJECUCION"] - 25569) * 86400 * 1000)
                        .toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' })
                    }
                  </TableCell>
                  <TableCell>{data["PROGRAMA"]}</TableCell>
                  <TableCell>{data["PLANTA"]}</TableCell>
                  <TableCell>{data["AREA"]}</TableCell>
                  <TableCell>{data["TAG"]}</TableCell>
                  <TableCell>{data["EQUIPO / ITEM"]}</TableCell>
                  <TableCell>{data["COMPONENTE"]}</TableCell>
                  <TableCell>{data["TIPO TAREA"]}</TableCell>
                  <TableCell className='gap-2 flex flex-col'>
                    <Button size="sm" onClick={() => setOpenPDF(true)}>Ver reporte</Button>
                    <Button size="sm">Agregar info</Button>
                    <Button size="sm" onClick={() => { setRegisterSelected(data); setOpenEditRegister(true) }}>Editar</Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteRegister(index, data["EQUIPO / ITEM"])}>Eliminar</Button>
                  </TableCell>
                </TableRow>
              ))
            }
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
      <Dialog open={openRegister} onOpenChange={setOpenRegister}>
        <DialogContent className='min-w-5xl bg-slate-200'>
          <DialogHeader>
            <DialogTitle>Nuevo Registro</DialogTitle>
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
                      className="data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal w-full"
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
                <Select>
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
                <Input className='bg-white' value='Antapaccay' disabled></Input>
              </div>
              <div className='flex flex-col gap-2 w-2/3'>
                <Label className='font-semibold'>Área:</Label>
                <Select>
                  <SelectTrigger className='w-full bg-white'>
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">PTAE</SelectItem>
                    <SelectItem value="2">Molienda</SelectItem>
                    <SelectItem value="3">Chancado Primario</SelectItem>
                    <SelectItem value="4">Flotación y Remolienda</SelectItem>
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
                <Input className='bg-white'></Input>
              </div>
              <div className='flex flex-col gap-2 w-1/4'>
                <Label className='font-semibold'>Tipo de componente:</Label>
                <Input className='bg-white'></Input>
              </div>
            </div>
            <div className='w-full flex flex-row gap-2'>
              <div className='flex flex-col gap-2 w-1/4'>
                <Label className='font-semibold'>Tipo de tarea:</Label>
                <Select>
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
                <Select>
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
                <Input className='bg-white'></Input>
              </div>
            </div>
            <div className='w-full flex flex-row gap-2'>
              <div className='flex flex-col gap-2 w-1/5'>
                <Label className='font-semibold'>Condición:</Label>
                <Select>
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
              <div className='flex flex-col gap-2 w-2/5'>
                <Label className='font-semibold'>Diagnóstico:</Label>
                <Input className='bg-white'></Input>
              </div>
              <div className='flex flex-col gap-2 w-2/5'>
                <Label className='font-semibold'>Recomendación:</Label>
                <Input className='bg-white'></Input>
              </div>
            </div>
            <div className='w-full flex flex-row gap-2'>
              <div className='flex flex-col gap-2 w-1/3'>
                <Label className='font-semibold'>N° de reporte:</Label>
                <Input className='bg-white'></Input>
              </div>
              <div className='flex flex-col gap-2 w-2/3'>
                <Label className='font-semibold'>Archivo:</Label>
                <Input className='bg-white' type='file' accept='.pdf'></Input>
              </div>
            </div>
            {/* <div className="relative w-full border border-gray-400 rounded-md p-4 mt-4 "> */}
            <div className="relative w-full">
              {/* Título de la sección */}
              {/* <span className="absolute -top-3 left-3 bg-gray-400 rounded-sm px-2 text-sm font-semibold text-gray-700"> */}
              {/* AVISOS */}
              {/* </span> */}
              {/* Contenido de la sección */}
              <div className="flex flex-row gap-4">
                <div className="flex flex-col gap-2">
                  <Label className="font-semibold">N° de aviso:</Label>
                  <Input className="bg-white" />
                </div>

                <div className="flex flex-col gap-2">
                  <Label className="font-semibold">Fecha de aviso:</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        data-empty={!date}
                        className="data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal"
                      >
                        <CalendarIcon />
                        {date ? format(date, "dd/MM/yyyy", { locale: es }) : (
                          <span>Selecciona una fecha</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={date} onSelect={setDate} locale={es} />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex flex-col gap-2">
                  <Label className="font-semibold">Status de aviso:</Label>
                  <Select>
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Abierto</SelectItem>
                      <SelectItem value="2">Cerrado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className='w-full flex flex-row gap-2 p-2 border rounded-md'>
              <div className='flex flex-col gap-2 '>
                <Label className='font-semibold'>N° de OT:</Label>
                <Input className='bg-white'></Input>
              </div>
              <div className='flex flex-col gap-2'>
                <Label className='font-semibold'>Fecha de OT:</Label>
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
            <div className='w-full flex flex-row gap-2 p-2 border rounded-md'>
              <div className='flex flex-col gap-2 w-1/3'>
                <Label className='font-semibold'>Status Real:</Label>
                <Select>
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Abierto</SelectItem>
                    <SelectItem value="2">Cerrado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='flex flex-col gap-2 w-2/3'>
                <Label className='font-semibold'>Comentarios:</Label>
                <Input className='bg-white'></Input>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button>Guardar y salir</Button>
            <Button>Guardar y agregar nuevo</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {
        openEditRegister && (
          <Dialog open={openEditRegister} onOpenChange={setOpenEditRegister}>
            <DialogContent className='min-w-5xl bg-slate-200'>
              <DialogHeader>
                <DialogTitle>Editar Registro</DialogTitle>
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
                          className="data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal w-full"
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
                    <Select value={registerSelected ? registerSelected["PROGRAMA"] : ""}>
                      <SelectTrigger className='w-full bg-white'>
                        <SelectValue placeholder="Seleccionar..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PROGRAMADO">Programado</SelectItem>
                        <SelectItem value="NO_PROGRAMADO">No Programado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className='w-full flex flex-row gap-2'>
                  <div className='flex flex-col gap-2 w_-1/3'>
                    <Label className='font-semibold'>Planta:</Label>
                    <Input className='bg-white' value={registerSelected ? registerSelected["PLANTA"] : ""} disabled></Input>
                  </div>
                  <div className='flex flex-col gap-2 w-2/3'>
                    <Label className='font-semibold'>Área:</Label>
                    <Select value={registerSelected ? registerSelected["AREA"] : ""}>
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
                    <Input className='bg-white' value={registerSelected ? registerSelected["EQUIPO / ITEM"] : ""}></Input>
                  </div>
                  <div className='flex flex-col gap-2 w-1/4'>
                    <Label className='font-semibold'>Tipo de componente:</Label>
                    <Input className='bg-white' value={registerSelected ? registerSelected["COMPONENTE"] : ""}></Input>
                  </div>
                </div>
                <div className='w-full flex flex-row gap-2'>
                  <div className='flex flex-col gap-2 w-1/4'>
                    <Label className='font-semibold'>Tipo de tarea:</Label>
                    <Select value={registerSelected ? registerSelected["TIPO TAREA"] : ""}>
                      <SelectTrigger className='w-full bg-white'>
                        <SelectValue placeholder="Seleccionar..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PDM">PDM</SelectItem>
                        <SelectItem value="NDT">NDT</SelectItem>
                        <SelectItem value="AL">Alineamiento</SelectItem>
                        <SelectItem value="IV">Insp. visual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className='flex flex-col gap-2 w-1/4'>
                    <Label className='font-semibold'>Status de ejecución:</Label>
                    <Select value={registerSelected ? registerSelected["STATUS EJECUCION"] : ""}>
                      <SelectTrigger className='w-full bg-white'>
                        <SelectValue placeholder="Seleccionar..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EJECUTADO">Ejecutado</SelectItem>
                        <SelectItem value="NO EJECUTADO">No ejecutado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className='flex flex-col gap-2 w-2/4'>
                    <Label className='font-semibold'>Observación:</Label>
                    <Input className='bg-white' value={registerSelected ? registerSelected["OBSERVACION"] : ""}></Input>
                  </div>
                </div>
                <div className='w-full flex flex-row gap-2'>
                  <div className='flex flex-col gap-2 w-1/5'>
                    <Label className='font-semibold'>Condición:</Label>
                    <Select value={registerSelected ? registerSelected["CONDICION"] : ""}>
                      <SelectTrigger className='w-full bg-white'>
                        <SelectValue placeholder="Seleccionar..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NORMAL">Normal</SelectItem>
                        <SelectItem value="TOLERABLE">Tolerable</SelectItem>
                        <SelectItem value="PRECAUCION">Precaución</SelectItem>
                        <SelectItem value="CRITICO">Crítico</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className='flex flex-col gap-2 w-2/5'>
                    <Label className='font-semibold'>Diagnóstico:</Label>
                    <Input className='bg-white' value={registerSelected ? registerSelected["DIAGNOSTICO"] : ""}></Input>
                  </div>
                  <div className='flex flex-col gap-2 w-2/5'>
                    <Label className='font-semibold'>Recomendación:</Label>
                    <Input className='bg-white' value={registerSelected ? registerSelected["RECOMENDACION"] : ""}></Input>
                  </div>
                </div>
                <div className='w-full flex flex-row gap-2'>
                  <div className='flex flex-col gap-2 w-1/3'>
                    <Label className='font-semibold'>N° de reporte:</Label>
                    <Input className='bg-white' value={registerSelected ? registerSelected["N° REPORTE"] : ""}></Input>
                  </div>
                  <div className='flex flex-col gap-2 w-2/3'>
                    <Label className='font-semibold'>Archivo:</Label>
                    <Input className='bg-white' type='file' accept='.pdf'></Input>
                  </div>
                </div>
                {/* <div className="relative w-full border border-gray-400 rounded-md p-4 mt-4 "> */}
                <div className="relative w-full">
                  {/* Título de la sección */}
                  {/* <span className="absolute -top-3 left-3 bg-gray-400 rounded-sm px-2 text-sm font-semibold text-gray-700"> */}
                  {/* AVISOS */}
                  {/* </span> */}
                  {/* Contenido de la sección */}
                  <div className="flex flex-row gap-4">
                    <div className="flex flex-col gap-2">
                      <Label className="font-semibold">N° de aviso:</Label>
                      <Input className="bg-white" value={registerSelected ? registerSelected["AVISO"] : ""} />
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label className="font-semibold">Fecha de aviso:</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            data-empty={!date}
                            className="data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal"
                          >
                            <CalendarIcon />
                            {date ? format(date, "dd/MM/yyyy", { locale: es }) : (
                              <span>Selecciona una fecha</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={date} onSelect={setDate} locale={es} />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label className="font-semibold">Status de aviso:</Label>
                      <Select value={registerSelected ? registerSelected["STATUS AVISO"] : ""}>
                        <SelectTrigger className="w-full bg-white">
                          <SelectValue placeholder="Seleccionar..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ABIERTO">Abierto</SelectItem>
                          <SelectItem value="CERRADO">Cerrado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <div className='w-full flex flex-row gap-2 p-2 border rounded-md'>
                  <div className='flex flex-col gap-2 '>
                    <Label className='font-semibold'>N° de OT:</Label>
                    <Input className='bg-white' value={registerSelected ? registerSelected["N° OT"] : ""}></Input>
                  </div>
                  <div className='flex flex-col gap-2'>
                    <Label className='font-semibold'>Fecha de OT:</Label>
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
                    <Label className='font-semibold'>Status de OT:</Label>
                    <Select value={registerSelected ? registerSelected["STATUS OT"] : ""}>
                      <SelectTrigger className='w-full bg-white'>
                        <SelectValue placeholder="Seleccionar..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ABIERTO">Abierto</SelectItem>
                        <SelectItem value="CERRADO">Cerrado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className='w-full flex flex-row gap-2 p-2 border rounded-md'>
                  <div className='flex flex-col gap-2 w-1/3'>
                    <Label className='font-semibold'>Status Real:</Label>
                    <Select value={registerSelected ? registerSelected["STATUS REAL"] : ""}>
                      <SelectTrigger className="w-full bg-white">
                        <SelectValue placeholder="Seleccionar..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ATENDIDO">Atendido</SelectItem>
                        <SelectItem value="NO ATENDIDO">No Atendido</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className='flex flex-col gap-2 w-2/3'>
                    <Label className='font-semibold'>Comentarios:</Label>
                    <Input className='bg-white'></Input>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button>Guardar y salir</Button>
                <Button>Guardar y agregar nuevo</Button>
              </DialogFooter>
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
    </div >

  )
}

export default MonitoreoCondiciones