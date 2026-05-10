import { useEffect, useMemo, useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import * as XLSX from 'xlsx'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Progress } from '@/components/ui/progress'
import { getTreeEntities } from '@/app/services/entitiesServices'
import { createMonconReport } from '@/app/services/monconServices'

type Props = {
  openUploadReports: boolean
  setOpenUploadReports: (open: boolean) => void
}

type TreeEntity = {
  id?: number
  tag?: string
  name?: string
  type?: number
  children?: TreeEntity[]
}

type ExcelCellValue = string | number | boolean | null | undefined | Date

type PreviewRow = {
  planta: string
  area: string
  ruta: string
  equipo: string
  componente: string
  idEntity: number | ''
  condicion: string
}

const normalizeKey = (value: string) =>
  String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[\/\-]/g, '')

const normalizeTag = (value: ExcelCellValue) => normalizeKey(String(value ?? ''))

const normalizeText = (value: ExcelCellValue) =>
  String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')

const excelSerialToString = (serial: ExcelCellValue) => {
  if (serial === null || serial === undefined || serial === '') return ''
  const numeric = typeof serial === 'number' ? serial : Number(serial)
  if (Number.isNaN(numeric)) return String(serial)
  if (numeric > 1 && numeric < 60000) {
    const excelEpoch = new Date(Date.UTC(1899, 11, 30))
    const date = new Date(excelEpoch.getTime() + numeric * 24 * 60 * 60 * 1000)
    const day = String(date.getUTCDate()).padStart(2, '0')
    const month = String(date.getUTCMonth() + 1).padStart(2, '0')
    const year = date.getUTCFullYear()
    return `${day}/${month}/${year}`
  }
  return String(serial)
}

const getValueFromRow = (row: Record<string, ExcelCellValue>, candidates: string[]) => {
  const normalizedCandidates = candidates.map((candidate) => normalizeKey(candidate))
  const rowKey = Object.keys(row).find((key) => normalizedCandidates.includes(normalizeKey(key)))
  return rowKey ? row[rowKey] : null
}

const findNodeByTag = (nodes: TreeEntity[], tagToFind: ExcelCellValue): TreeEntity | undefined => {
  if (!Array.isArray(nodes)) return undefined
  const target = normalizeTag(tagToFind)
  if (!target) return undefined

  for (const node of nodes) {
    if (normalizeTag(node.tag) === target) return node
    const childMatch = node.children ? findNodeByTag(node.children, tagToFind) : undefined
    if (childMatch) return childMatch
  }

  return undefined
}

const findPathByTag = (nodes: TreeEntity[], tagToFind: ExcelCellValue, path: TreeEntity[] = []): TreeEntity[] | undefined => {
  if (!Array.isArray(nodes)) return undefined
  const target = normalizeTag(tagToFind)
  if (!target) return undefined

  for (const node of nodes) {
    const currentPath = [...path, node]
    if (normalizeTag(node.tag) === target) return currentPath

    const childMatch = node.children ? findPathByTag(node.children, tagToFind, currentPath) : undefined
    if (childMatch) return childMatch
  }

  return undefined
}

const findComponentByNameOrTag = (nodes: TreeEntity[], componentValue: ExcelCellValue): TreeEntity | undefined => {
  if (!Array.isArray(nodes)) return undefined

  const targetName = normalizeText(componentValue)
  const targetTag = normalizeTag(componentValue)
  if (!targetName && !targetTag) return undefined

  for (const node of nodes) {
    const nodeName = normalizeText(node.name)
    const nodeTag = normalizeTag(node.tag)

    if (node.type === 6 && (nodeName === targetName || nodeTag === targetTag)) {
      return node
    }

    const childMatch = node.children ? findComponentByNameOrTag(node.children, componentValue) : undefined
    if (childMatch) return childMatch
  }

  return undefined
}

const UploadReports = ({ openUploadReports, setOpenUploadReports }: Props) => {
  const [rows, setRows] = useState<Record<string, ExcelCellValue>[]>([])
  const [treeEntities, setTreeEntities] = useState<TreeEntity[]>([])
  const [treeLoaded, setTreeLoaded] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    getTreeEntities()
      .then((response) => {
        const entitiesData = response.data?.results ?? response.data ?? []
        setTreeEntities(Array.isArray(entitiesData) ? (entitiesData as TreeEntity[]) : [])
        setTreeLoaded(true)
      })
      .catch((error) => {
        console.error('Error fetching tree entities:', error)
        setTreeEntities([])
        setTreeLoaded(true)
      })
  }, [])

  const conditionMap: Record<string, number> = {
    'normal': 1,
    'tolerable': 2,
    'precaución': 3,
    'crítico': 4,
    'no monitoreado': 5,
  }

  const getConditionValue = (condicionText: string): number => {
    const normalized = condicionText.toLowerCase().trim()
    return conditionMap[normalized] || 1 // default a Normal si no coincide
  }

  const handleSubmit = async () => {
    const data = previewRows
      .filter(row => row.idEntity) // Solo filas con ID entity válido
      .map((row) => ({
        entity: row.idEntity,
        program: 1,
        service_type: 1,
        work_type: 1,
        execution_status: 2,
        condition: getConditionValue(row.condicion),
        created_by: null,
      }))

    if (data.length === 0) {
      setSubmitMessage({ type: 'error', text: 'No hay reportes válidos para enviar' })
      return
    }

    setIsSubmitting(true)
    setSubmitMessage(null)
    setProgress(0)

    let successCount = 0
    let failureCount = 0

    try {
      // Enviar cada reporte de forma secuencial
      for (let i = 0; i < data.length; i++) {
        try {
          await createMonconReport(data[i])
          successCount++
          console.log(`✓ Reporte ${i + 1}/${data.length} enviado correctamente`)
        } catch (error) {
          failureCount++
          console.error(`✗ Error enviando reporte ${i + 1}/${data.length}:`, error)
        }
        // Actualizar progreso
        const currentProgress = Math.round(((i + 1) / data.length) * 100)
        setProgress(currentProgress)
      }
      
      const message = failureCount === 0 
        ? `${successCount} reporte${successCount !== 1 ? 's' : ''} enviado${successCount !== 1 ? 's' : ''} correctamente`
        : `${successCount} enviado${successCount !== 1 ? 's' : ''}, ${failureCount} fallo${failureCount !== 1 ? 's' : ''} (revisa la consola)`
      
      setSubmitMessage({ 
        type: failureCount === 0 ? 'success' : 'error', 
        text: message
      })
      
      // Limpiar después de 2 segundos y cerrar si fue exitoso
      if (failureCount === 0) {
        setTimeout(() => {
          setOpenUploadReports(false)
          setRows([])
          setSubmitMessage(null)
          setProgress(0)
        }, 2000)
      }
    } catch (error) {
      console.error('Error en el proceso de envío:', error)
      setSubmitMessage({ 
        type: 'error', 
        text: 'Error en el proceso de envío. Revisa la consola para más detalles.' 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const previewRows = useMemo<PreviewRow[]>(() => {
    return rows.map((row) => {
      const rawTag = getValueFromRow(row, ['TAG'])
      const rawComponent = getValueFromRow(row, ['COMPONENTE'])
      const rawCondition = getValueFromRow(row, ['CONDICION', 'CONDICIÓN'])

      const path = findPathByTag(treeEntities, rawTag)
      const matchedEntity = findNodeByTag(treeEntities, rawTag)
      const equipment = path?.find((node) => node.type === 4) ?? matchedEntity
      const plant = path?.find((node) => node.type === 1)
      const area = path?.find((node) => node.type === 2)
      const route = path?.find((node) => node.type === 3)
      const matchedComponent = findComponentByNameOrTag(equipment?.children ?? [], rawComponent)

      return {
        planta: plant ? `${plant.name ?? ''}`.trim() : '',
        area: area ? `${area.name ?? ''}`.trim() : '',
        ruta: route ? `${route.name ?? ''}`.trim() : '',
        equipo: equipment ? `${equipment.name ?? ''}`.trim() : excelSerialToString(rawTag),
        componente: matchedComponent ? `${matchedComponent.name ?? ''}`.trim() : excelSerialToString(rawComponent),
        idEntity: matchedComponent?.id ?? '',
        condicion: excelSerialToString(rawCondition),
      }
    })
  }, [rows, treeEntities])

  const handleFile = (file: File | null) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const data = e.target?.result
      if (!data) return
      const wb = XLSX.read(data, { type: 'array' })
      const ws = wb.Sheets[wb.SheetNames[0]]
      const json = XLSX.utils.sheet_to_json(ws, { defval: null }) as Record<string, ExcelCellValue>[]
      setRows(json)
    }
    reader.readAsArrayBuffer(file)
  }

  return (
    <Dialog open={openUploadReports} onOpenChange={setOpenUploadReports}>
      <DialogContent className='min-w-5/6 bg-slate-200'>
        <DialogHeader>
          <DialogTitle>Previsualizar Excel NDT</DialogTitle>
        </DialogHeader>

        <div className='flex flex-col gap-3'>
          <div className='flex flex-col gap-2'>
            <Label className='font-semibold'>Subir archivo Excel:</Label>
            <Input type='file' accept='.xlsx,.xls' onChange={(e) => handleFile(e.target.files?.[0] ?? null)} />
            {!treeLoaded && <p className='text-sm text-blue-600'>Cargando entidades para resolver `ID Entity`...</p>}
          </div>

          <div className='bg-white rounded-lg shadow max-h-96 overflow-auto'>
            <Table>
              <TableHeader className='bg-gray-200 sticky top-0'>
                <TableRow>
                  <TableHead>Orden</TableHead>
                  <TableHead>Planta</TableHead>
                  <TableHead>Area</TableHead>
                  <TableHead>Ruta</TableHead>
                  <TableHead>Equipo</TableHead>
                  <TableHead>Componente</TableHead>
                  <TableHead>ID Entity</TableHead>
                  <TableHead>Condición</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {previewRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className='text-center'>No hay datos cargados</TableCell>
                  </TableRow>
                ) : (
                  previewRows.map((item, index) => (
                    <TableRow key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <TableCell className='whitespace-pre-wrap'>{index + 1}</TableCell>
                      <TableCell className='whitespace-pre-wrap'>{item.planta}</TableCell>
                      <TableCell className='whitespace-pre-wrap'>{item.area}</TableCell>
                      <TableCell className='whitespace-pre-wrap'>{item.ruta}</TableCell>
                      <TableCell className='whitespace-pre-wrap'>{item.equipo}</TableCell>
                      <TableCell className='whitespace-pre-wrap'>{item.componente}</TableCell>
                      <TableCell>{item.idEntity || 'N/A'}</TableCell>
                      <TableCell className='whitespace-pre-wrap'>{item.condicion}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className='flex flex-col gap-3'>
          {isSubmitting && (
            <div className='flex flex-col gap-2'>
              <div className='flex justify-between text-sm text-gray-600'>
                <span>Creando ruta...</span>
                <span className='font-semibold'>{progress}%</span>
              </div>
              <Progress value={progress} className='w-full' />
            </div>
          )}
          {submitMessage && (
            <div className={`p-3 rounded text-sm ${submitMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {submitMessage.text}
            </div>
          )}
          <DialogFooter>
            <Button variant='destructive' onClick={() => { setOpenUploadReports(false); setRows([]) }} disabled={isSubmitting}>
              Cerrar
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={previewRows.length === 0 || previewRows.some(row => !row.idEntity) || isSubmitting}
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Reportes'}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default UploadReports