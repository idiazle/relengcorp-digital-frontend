import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import type { Entity } from '../../../entities/_models/entity.model'
import type { Report, Notices } from '../../_models/moncon.model'

interface ReportViewSummaryProps {
  selectedReport: Report | null
  entities: Entity[]
  noticesData: Notices[]
  onOpenPDF?: () => void
}

const ReportViewSummary = ({
  selectedReport,
  entities,
  noticesData,
  onOpenPDF,
}: ReportViewSummaryProps) => {
  const plant = selectedReport?.parents?.find((e) => e.type === 1)
  const area = selectedReport?.parents?.find((e) => e.type === 2)
  const routeOrEquipment = selectedReport?.parents?.find((e) => e.type === 3 || e.type === 4)
  const currentEntity = entities.find((e) => e.id === selectedReport?.entity)

  const plantLabel = plant ? `${plant.name} (${plant.tag})` : ''
  const areaLabel = area ? `${area.name} (${area.tag})` : ''
  const equipmentLabel = routeOrEquipment ? `${routeOrEquipment.name} (${routeOrEquipment.tag})` : ''
  const componentLabel = currentEntity ? `${currentEntity.name} (${currentEntity.tag})` : ''

  return (
    <div className="w-full p-2 rounded-md gap-4 flex flex-col">
      <div className="w-full flex flex-row gap-2">
        <div className="flex flex-col gap-2 w-1/3">
          <Label className="font-semibold">Planta:</Label>
          <Input disabled className="bg-white" value={plantLabel} />
        </div>
        <div className="flex flex-col gap-2 w-2/3">
          <Label className="font-semibold">Área:</Label>
          <Input disabled className="bg-white" value={areaLabel} />
        </div>
      </div>

      <div className="w-full flex flex-row gap-2">
        <div className="flex flex-col gap-2 w-1/3">
          <Label className="font-semibold">Equipo:</Label>
          <Input disabled className="bg-white" value={equipmentLabel} />
        </div>
        <div className="flex flex-col gap-2 w-2/3">
          <Label className="font-semibold">Componente:</Label>
          <Input disabled className="bg-white" value={componentLabel} />
        </div>
      </div>

      <div className="w-full flex flex-row gap-2">
        <div className="flex flex-col gap-2 w-1/3">
          <Label className="font-semibold">N° de reporte:</Label>
          <Input disabled className="bg-white" value={selectedReport?.name || ''} />
        </div>
        <div className="flex flex-col gap-2 w-2/3">
          <Label className="font-semibold">Reporte adjunto:</Label>
          <Button
            disabled={!selectedReport?.attachment}
            onClick={onOpenPDF}
            className="justify-start"
          >
            {selectedReport?.attachment
              ? Array.isArray(selectedReport.attachment)
                ? selectedReport.attachment[0]?.name
                : selectedReport.attachment
              : 'Sin archivo'}
          </Button>
        </div>
      </div>

      <div className="w-full flex flex-row gap-2">
        <div className="flex flex-col gap-2 w-2/3">
          <Label className="font-semibold">N° de avisos:</Label>
          <h1 className="bg-white p-1.5 rounded-md">{noticesData[0]?.name || '---'}</h1>
        </div>
        <div className="flex flex-col gap-2 w-2/3">
          <Label className="font-semibold">Fecha de aviso:</Label>
          <h1 className="bg-white p-1.5 rounded-md">{noticesData[0]?.date || '---'}</h1>
        </div>
        <div className="flex flex-col gap-2 w-2/3">
          <Label className="font-semibold">Status de aviso:</Label>
          <Select disabled value={String(noticesData[0]?.status || '')}>
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="---" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Abierto</SelectItem>
              <SelectItem value="2">Cerrado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="w-full flex flex-row gap-2">
        <div className="flex flex-col gap-2 w-2/3">
          <Label className="font-semibold">N° de OT:</Label>
          <h1 className="bg-white p-1.5 rounded-md">{noticesData[0]?.ot_number || '---'}</h1>
        </div>
        <div className="flex flex-col gap-2 w-2/3">
          <Label className="font-semibold">Fecha de OT:</Label>
          <h1 className="bg-white p-1.5 rounded-md">{noticesData[0]?.ot_date || '---'}</h1>
        </div>
        <div className="flex flex-col gap-2 w-2/3">
          <Label className="font-semibold">Status de OT:</Label>
          <Select disabled value={String(noticesData[0]?.ot_status || '')}>
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="---" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Abierto</SelectItem>
              <SelectItem value="2">Cerrado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="w-full flex flex-row gap-2">
        <div className="flex flex-col gap-2 w-2/3">
          <Label className="font-semibold">Status Real:</Label>
          <Select disabled value={String(noticesData[0]?.status_real || '')}>
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="---" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Atendido</SelectItem>
              <SelectItem value="2">No atendido</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2 w-2/3">
          <Label className="font-semibold">Comentario:</Label>
          <Input disabled value={noticesData[0]?.comment || ''} className="bg-white" />
        </div>
      </div>
    </div>
  )
}

export default ReportViewSummary
