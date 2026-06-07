import { Button } from '@/components/ui/button'
import { Calendar as CalendarIcon } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { FaTrash } from 'react-icons/fa6'
import { Calendar } from '@/components/ui/calendar'
import type { Notices } from '../../_models/moncon.model'

type EditableNoticeField = 'name' | 'date' | 'status' | 'ot_number' | 'ot_date' | 'ot_status' | 'status_real' | 'comment'

interface ReportNoticesTableProps {
  noticesData: Notices[]
  setNoticesData: (notices: Notices[]) => void
  date_status: Date | undefined
  setDateStatus: (date: Date | undefined) => void
  date_ot: Date | undefined
  setDateOt: (date: Date | undefined) => void
  onAddNotice: () => void
  onSubmitNotices: () => void
  onDeleteNotice: (index: number) => void
}

const ReportNoticesTable = ({
  noticesData,
  setNoticesData,
  date_status,
  setDateStatus,
  date_ot,
  setDateOt,
  onAddNotice,
  onSubmitNotices,
  onDeleteNotice,
}: ReportNoticesTableProps) => {
  const handleNoticeChange = (index: number, field: EditableNoticeField, value: Notices[EditableNoticeField]) => {
    const updated = [...noticesData]
    updated[index] = { ...updated[index], [field]: value }
    setNoticesData(updated)
  }

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="w-full flex flex-row justify-between items-center">
        <label className="font-semibold">Status de avisos relacionados:</label>
        <div className="flex flex-row gap-1">
          <Button type="button" onClick={onSubmitNotices} className="bg-blue-600">
            Guardar aviso
          </Button>
          <Button type="button" onClick={onAddNotice} className="bg-blue-600">
            Añadir aviso
          </Button>
        </div>
      </div>
      <Table className="bg-white">
        <TableHeader className="bg-gray-300">
          <TableRow>
            <TableHead>N° aviso</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>N° OT</TableHead>
            <TableHead>Fecha OT</TableHead>
            <TableHead>Status OT</TableHead>
            <TableHead>Status Real</TableHead>
            <TableHead>Comentario</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {noticesData.length > 0 ? (
            noticesData.map((data, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Input
                    className="bg-white"
                    value={data.name || ''}
                    onChange={(e) => handleNoticeChange(index, 'name', e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        data-empty={!date_status}
                        className="data-[empty=true]:text-muted-foreground justify-start text-left font-normal w-full"
                      >
                        <CalendarIcon className="w-4 h-4" />
                        {date_status ? format(date_status, 'dd/MM/yyyy', { locale: es }) : 'Selecciona'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={date_status} onSelect={setDateStatus} locale={es} />
                    </PopoverContent>
                  </Popover>
                </TableCell>
                <TableCell>
                  <Select
                    value={data.status?.toString() || '1'}
                    onValueChange={(v) => handleNoticeChange(index, 'status', parseInt(v))}
                  >
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Abierto</SelectItem>
                      <SelectItem value="2">Cerrado</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Input
                    className="bg-white"
                    value={data.ot_number || ''}
                    onChange={(e) => handleNoticeChange(index, 'ot_number', e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        data-empty={!date_ot}
                        className="data-[empty=true]:text-muted-foreground justify-start text-left font-normal w-full"
                      >
                        <CalendarIcon className="w-4 h-4" />
                        {date_ot ? format(date_ot, 'dd/MM/yyyy', { locale: es }) : 'Selecciona'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={date_ot} onSelect={setDateOt} locale={es} />
                    </PopoverContent>
                  </Popover>
                </TableCell>
                <TableCell>
                  <Select
                    value={data.ot_status?.toString() || '1'}
                    onValueChange={(v) => handleNoticeChange(index, 'ot_status', parseInt(v))}
                  >
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Abierto</SelectItem>
                      <SelectItem value="2">Cerrado</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Select
                    value={data.status_real?.toString() || '1'}
                    onValueChange={(v) => handleNoticeChange(index, 'status_real', parseInt(v))}
                  >
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Atendido</SelectItem>
                      <SelectItem value="2">No atendido</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Input
                    className="bg-white"
                    value={data.comment || ''}
                    onChange={(e) => handleNoticeChange(index, 'comment', e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onDeleteNotice(index)}
                  >
                    <FaTrash />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9} className="text-center">
                No hay avisos registrados
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default ReportNoticesTable
