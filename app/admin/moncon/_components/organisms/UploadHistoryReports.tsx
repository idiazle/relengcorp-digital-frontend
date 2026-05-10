import { useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import * as XLSX from 'xlsx'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

type UploadHistoryReportsProps = {
  open: boolean
  setOpen: (open: boolean) => void
}

const UploadHistoryReports = ({ open, setOpen }: UploadHistoryReportsProps) => {
  const [rows, setRows] = useState<Record<string, any>[]>([])
  const [columns, setColumns] = useState<string[]>([])

  function excelDateToString(serial: any) {
    if (serial === null || serial === undefined || serial === '') return ''
    const numeric = typeof serial === 'number' ? serial : Number(serial)
    if (Number.isNaN(numeric)) return String(serial)
    const excelEpoch = new Date(Date.UTC(1899, 11, 30))
    const date = new Date(excelEpoch.getTime() + numeric * 24 * 60 * 60 * 1000)
    const day = String(date.getUTCDate()).padStart(2, '0')
    const month = String(date.getUTCMonth() + 1).padStart(2, '0')
    const year = date.getUTCFullYear()
    return `${day}/${month}/${year}`
  }

  const handleFile = (file: File | null) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const data = e.target?.result
      if (!data) return
      const wb = XLSX.read(data, { type: 'array' })
      const wsname = wb.SheetNames[0]
      const ws = wb.Sheets[wsname]
      // uso defval:null para mantener claves aunque haya celdas vacías
      const json = XLSX.utils.sheet_to_json(ws, { defval: null }) as Record<string, any>[]

      // Normalizar claves: convertir a string y mantener orden
      const colsSet = new Set<string>()
      json.forEach((r) => Object.keys(r).forEach((k) => colsSet.add(String(k))))
      const cols = Array.from(colsSet)

      // Intentar convertir fechas tipo excel (números) a formato legible
      const normalized = json.map((r) => {
        const out: Record<string, any> = {}
        cols.forEach((c) => {
          const v = r[c]
          if (typeof v === 'number') {
            // si parece un serial excel (entre 1 y 50000), convertir
            if (v > 1 && v < 60000) out[c] = excelDateToString(v)
            else out[c] = v
          } else {
            out[c] = v
          }
        })
        return out
      })

      setColumns(cols)
      setRows(normalized)
    }
    reader.readAsArrayBuffer(file)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='min-w-2/3 bg-slate-100'>
        <DialogHeader>
          <DialogTitle>Vista previa: Historial (Excel)</DialogTitle>
        </DialogHeader>

        <div className='flex flex-col gap-3'>
          <div className='flex flex-col gap-2'>
            <Label className='font-semibold'>Subir archivo de ejemplo (Excel): <a className='hover:text-gray-500 font-normal' href='/example_moncon.xlsx'>example.xlsx</a></Label>
            <Input
              className='bg-white'
              type='file'
              accept='.xlsx,.xls'
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null
                handleFile(file)
              }}
            />
          </div>

          <div className='bg-white rounded shadow max-h-96 overflow-auto'>
            <Table>
              <TableHeader className='bg-gray-200 sticky top-0'>
                <TableRow>
                  <TableHead>N°</TableHead>
                  {columns.map((col) => (
                    <TableHead key={col}>{col}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length > 0 ? (
                  rows.map((row, i) => (
                    <TableRow key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <TableCell>{i + 1}</TableCell>
                      {columns.map((col) => (
                        <TableCell key={col} className='whitespace-pre-wrap'>
                          {row[col] === null || row[col] === undefined ? '' : String(row[col])}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length + 1} className='text-center'>
                      No hay datos cargados
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <DialogFooter>
          <Button variant='destructive' onClick={() => { setOpen(false); setRows([]); setColumns([]) }}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default UploadHistoryReports
