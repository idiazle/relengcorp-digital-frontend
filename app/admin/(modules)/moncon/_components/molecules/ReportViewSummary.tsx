import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import type { Entity } from '../../../(modules)/entities/_models/entity.model'
import type { Report, Notices } from '../../_models/moncon.model'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { works, services } from '../../_config/options'

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

  const formatDate = (value?: string | null) => {
    if (!value) return '---'

    const dateValue = new Date(value)

    return Number.isNaN(dateValue.getTime())
      ? value
      : format(dateValue, 'dd/MM/yyyy', { locale: es })
  }

  const formatDateTime = (value?: string | null) => {
    if (!value) return '---'

    const dateValue = new Date(value)

    return Number.isNaN(dateValue.getTime())
      ? value
      : format(dateValue, 'dd/MM/yyyy HH:mm', { locale: es })
  }

  const getProgramLabel = (program?: number) => {
    if (program === 1) return 'Programado'
    if (program === 2) return 'No Programado'
    return '---'
  }

  const getExecutionStatusLabel = (status?: number) => {
    if (status === 1) return 'Ejecutado'
    if (status === 2) return 'No ejecutado'
    return '---'
  }

  const getConditionLabel = (condition?: number) => {
    if (condition === 1) return 'Normal'
    if (condition === 2) return 'Tolerable'
    if (condition === 3) return 'Precaución'
    if (condition === 4) return 'Crítico'
    if (condition === 5) return 'No Monitoreado'
    return '---'
  }

  const getNoticeStatusLabel = (status?: number) => {
    if (status === 1) return 'Abierto'
    if (status === 2) return 'Cerrado'
    return '---'
  }

  const getStatusRealLabel = (status?: number) => {
    if (status === 1) return 'Atendido'
    if (status === 2) return 'No atendido'
    return '---'
  }

  const getWorkLabel = (workType?: number) => {
    return works.find((work) => work.id === workType)?.name ?? '---'
  }

  const getServiceLabel = (serviceType?: number) => {
    return services.find((service) => service.id === serviceType)?.name ?? '---'
  }

  const renderField = (label: string, value?: string | number | null) => (
    <div className="flex flex-col gap-2 min-w-0">
      <Label className="font-semibold">{label}</Label>
      <div className="bg-white border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-900 min-h-10 flex items-center break-words">
        {value === null || value === undefined || value === '' ? '---' : value}
      </div>
    </div>
  )

  return (
    <div className="w-full p-2 rounded-md gap-6 flex flex-col">
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {renderField('Planta', plantLabel)}
        {renderField('Área', areaLabel)}
        {renderField('Equipo', equipmentLabel)}
        {renderField('Componente', componentLabel)}
        {renderField('N° de reporte', selectedReport?.name)}
        {renderField('Fecha de ejecución', formatDate(selectedReport?.execution_date ?? null))}
        {renderField('Programación', getProgramLabel(selectedReport?.program))}
        {renderField('Status de ejecución', getExecutionStatusLabel(selectedReport?.execution_status))}
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {renderField('Servicio', getWorkLabel(selectedReport?.work_type))}
        {renderField('Tarea', getServiceLabel(selectedReport?.service_type))}
        {renderField('Condición', getConditionLabel(selectedReport?.condition))}
        {renderField('Observación', selectedReport?.observations)}
        {renderField('Diagnóstico', selectedReport?.diagnostic)}
        {renderField('Recomendación', selectedReport?.recomendations)}
      </section>

      <section className="flex flex-col gap-2">
        <Label className="font-semibold">Fecha de programación:</Label>
        <div className="bg-white border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-900 min-h-10 flex items-center break-words">
          {formatDateTime(selectedReport?.created_at ?? null)}
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <Label className="font-semibold">Reporte adjunto:</Label>
        <Button
          disabled={!selectedReport?.attachment}
          onClick={onOpenPDF}
          className="justify-start w-fit"
        >
          {selectedReport?.attachment
            ? Array.isArray(selectedReport.attachment)
              ? selectedReport.attachment[0]?.name
              : selectedReport.attachment
            : 'Sin archivo'}
        </Button>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-semibold text-slate-900">Avisos relacionados</h3>
          <span className="text-sm text-slate-600">{noticesData.length} registro(s)</span>
        </div>

        {noticesData.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {noticesData.map((notice, index) => (
              <div key={`${notice.id ?? index}-${notice.name}`} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <h4 className="font-semibold text-slate-900">Aviso {notice.name || '---'}</h4>
                  <span className="text-xs rounded-full bg-slate-100 px-2 py-1 text-slate-700">
                    {getNoticeStatusLabel(notice.status)}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {renderField('Fecha de aviso', formatDate(notice.date))}
                  {renderField('N° de OT', notice.ot_number)}
                  {renderField('Fecha de OT', formatDate(notice.ot_date))}
                  {renderField('Status de OT', getNoticeStatusLabel(notice.ot_status))}
                  {renderField('Status real', getStatusRealLabel(notice.status_real))}
                  {renderField('Comentario', notice.comment)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-md border border-dashed border-slate-300 bg-white px-4 py-6 text-sm text-slate-500">
            No hay avisos asociados a este reporte.
          </div>
        )}
      </section>
    </div>
  )
}

export default ReportViewSummary
