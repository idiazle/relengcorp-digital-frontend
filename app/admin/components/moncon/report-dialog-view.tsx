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
import { NoticesType, ReportType } from '@/lib/types'
import { useState } from 'react'

type ReportDialogViewProps = {
  openViewRegister: boolean
  setOpenViewRegister: (open: boolean) => void
  registerSelected: ReportType | null
  setRegisterSelected: (report: ReportType | null) => void
}

const ReportDialogView = ({ openViewRegister, setOpenViewRegister, setRegisterSelected, registerSelected }: ReportDialogViewProps) => {
  const [noticesData, setNoticesData] = useState<NoticesType[]>([]);
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <Dialog open={openViewRegister} onOpenChange={() => { setOpenViewRegister(false); setRegisterSelected(null); }}>
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
                    disabled
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
              <Select disabled value={registerSelected ? registerSelected.program.toString() : ""} >
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
              <Select disabled>
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
              <Select disabled>
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
                disabled
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
            {/* <div className='flex flex-col gap-2 w-1/4'>
              <Label className='font-semibold'>Tipo de componente:</Label>
              <Input
                disabled
                className='bg-white'
                value={registerSelected ? registerSelected.entity : ""}
                onChange={(e) => {
                  setRegisterSelected({
                    ...registerSelected!,
                    entity: e.target.value
                  })
                }}
              />
            </div> */}
          </div>
          <div className='w-full flex flex-row gap-2'>
            <div className='flex flex-col gap-2 w-1/4'>
              <Label className='font-semibold'>Tipo de tarea:</Label>
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
                disabled
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
                disabled
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
                disabled
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
                disabled
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
                disabled
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
            {/* <div className='flex flex-col gap-2 w-1/3'>
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
            </div> */}
            <div className='flex flex-col gap-2 w-2/3'>
              <Label className='font-semibold'>Archivo:</Label>
              <a href={registerSelected ? 'http://192.168.100.8:8000' + registerSelected.attachment : "#"} target="_blank" rel="noopener noreferrer" className='bg-white p-1.5 rounded-md underline'>
                Archivo 1
              </a>
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
                  <SelectItem value="1">Abierto</SelectItem>
                  <SelectItem value="2">Cerrado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='flex flex-col gap-2 w-2/3'>
              <Label className='font-semibold'>Comentario:</Label>
              <Input disabled className='bg-white p-1.5 rounded-md'>{noticesData[0]?.comment}</Input>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>

  )
}

export default ReportDialogView