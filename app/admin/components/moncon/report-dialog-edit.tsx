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
import { NoticesType, ReportType } from '@/lib/types'
import { useState } from 'react'
import { updateReport } from '@/app/services/monconServices'


type ReportDialogEditProps = {
  openEditRegister: boolean
  setOpenEditRegister: (open: boolean) => void
  registerSelected: ReportType | null
  setRegisterSelected: (report: ReportType | null) => void
  getAllReport: () => void
}

const ReportDialogEdit = ({ openEditRegister, setOpenEditRegister, setRegisterSelected, registerSelected, getAllReport }: ReportDialogEditProps) => {
  const [noticesData, setNoticesData] = useState<NoticesType[]>([]);
  const [date, setDate] = useState<Date | undefined>(new Date())

  const editReport = (reportId: number, updatedData: ReportType) => {
    // Aquí puedes hacer la llamada a la API para editar el reporte
    if (!updatedData) return;
    console.log('Editing report:', reportId, updatedData);
    const formData = new FormData()
    formData.append("name", String(updatedData.name ?? ""))
    formData.append("condition", String(updatedData.condition ?? ""))
    formData.append("diagnostic", String(updatedData.diagnostic ?? ""))
    formData.append("recomendations", String(updatedData.recomendations ?? ""))
    formData.append("program", String(updatedData.program ?? ""))
    formData.append("observations", String(updatedData.observations ?? ""))
    formData.append("execution_status", String(updatedData.execution_status ?? ""))

    updateReport(reportId, formData).then((response) => {
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
    <Dialog open={openEditRegister} onOpenChange={() => { setOpenEditRegister(false); setRegisterSelected(null) }}>
      <DialogContent className='min-w-5xl bg-slate-200'>
        <DialogHeader>
          <DialogTitle>Editar Registro</DialogTitle>
        </DialogHeader>
        <div className='w-full p-2 rounded-md gap-4 flex flex-col mt-4'>
          <div className='w-full flex flex-row gap-2'>
            <div className='flex flex-col gap-2 w-1/3'>
              <Label>Fecha de programación:</Label>
              <Input className='bg-white' value={registerSelected?.created_at?.slice(0, 10) ?? ""} disabled />
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
              {/* <Input className='bg-white' disabled></Input> */}
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
              if (registerSelected && registerSelected.id != null) {
                editReport(registerSelected.id, registerSelected);
              }
            }}
          >Guardar y salir</Button>
          {/* <Button>Guardar y agregar nuevo</Button> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>

  )
}

export default ReportDialogEdit