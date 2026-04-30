'use client'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Controller } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CalendarIcon } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import PDFViewer from '@/components/admin/PDFViewer'
import { useState } from 'react'
import type { Entity } from '../../../entities/_models/entity.model'
import type { Report, Notices } from '../../_models/moncon.model'
import { works, services } from '../../_config/options'
import useMonconReportModal, { type ReportModalMode } from '../../_hooks/useMonconReportModal'
import ReportHierarchySelect from '../molecules/ReportHierarchySelect'
import ReportNoticesTable from '../molecules/ReportNoticesTable'
import ReportViewSummary from '../molecules/ReportViewSummary'

interface ReportFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode?: ReportModalMode
  selectedReport?: Report | null
  entities: Entity[]
  onSubmit: (data: Report, file?: File | null, notices?: Notices[]) => Promise<void>
  onAddNotice?: (notice: Notices) => void
  onSubmitNotices?: () => void
  onDeleteNotice?: (id: number) => void
}

const ReportFormModal = ({
  open,
  onOpenChange,
  mode = 'create',
  selectedReport,
  entities,
  onSubmit,
  onAddNotice,
  onSubmitNotices,
  onDeleteNotice,
}: ReportFormModalProps) => {
  const [openPDF, setOpenPDF] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    isCreateMode,
    isEditMode,
    isViewMode,
    modalTitle,
    submitLabel,
    handleClose,
    file,
    setFile,
    selectedPlant,
    setSelectedPlant,
    selectedArea,
    setSelectedArea,
    selectedRoute,
    setSelectedRoute,
    selectedEquipment,
    setSelectedEquipment,
    selectedItem,
    setSelectedItem,
    noticesData,
    setNoticesData,
    date_status,
    setDateStatus,
    date_ot,
    setDateOt,
  } = useMonconReportModal({
    openModal: open,
    setOpenModal: onOpenChange,
    selectedReport: selectedReport || undefined,
    mode,
  })

  const formOnSubmit = async (formData: Report) => {
    try {
      await onSubmit(formData, file, noticesData)
      handleClose()
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  const handleAddNoticeClick = () => {
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
      report: selectedReport?.id || 0,
    }
    setNoticesData([...noticesData, newNotice])
  }

  const handleDeleteNoticeClick = (index: number) => {
    if (confirm('¿Estás seguro de que deseas eliminar este aviso?')) {
      setNoticesData(noticesData.filter((_, i) => i !== index))
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="min-w-5xl bg-slate-200">
          <DialogHeader>
            <DialogTitle>{modalTitle}</DialogTitle>
            {isCreateMode && <DialogDescription>Nuevo registro no programado que no está registrado en ruta semanal</DialogDescription>}
          </DialogHeader>

          <form onSubmit={handleSubmit(formOnSubmit)} className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
            {/* CREATE MODE - Hierarchy Select */}
            {isCreateMode && (
              <ReportHierarchySelect
                control={control}
                setValue={setValue}
                entities={entities}
                selectedPlant={selectedPlant}
                setSelectedPlant={setSelectedPlant}
                selectedArea={selectedArea}
                setSelectedArea={setSelectedArea}
                selectedRoute={selectedRoute}
                setSelectedRoute={setSelectedRoute}
                selectedEquipment={selectedEquipment}
                setSelectedEquipment={setSelectedEquipment}
                selectedItem={selectedItem}
                setSelectedItem={setSelectedItem}
              />
            )}

            {/* CREATE & EDIT MODE - Common Fields */}
            {(isCreateMode || isEditMode) && (
              <>
                <div className="w-full flex flex-row gap-2">
                  <div className="flex flex-col gap-2 w-1/4">
                    <Label className="font-semibold">Programación:</Label>
                    <Select disabled value={selectedReport?.program?.toString() || '2'}>
                      <SelectTrigger className="w-full bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Programado</SelectItem>
                        <SelectItem value="2">No Programado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2 w-1/4">
                    <Label className="font-semibold">Status de ejecución:</Label>
                    <Controller
                      name="execution_status"
                      control={control}
                      render={({ field }) => (
                        <Select value={String(field.value)} onValueChange={(v) => field.onChange(parseInt(v))}>
                          <SelectTrigger className="w-full bg-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Ejecutado</SelectItem>
                            <SelectItem value="2">No ejecutado</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <div className="flex flex-col gap-2 w-2/4">
                    <Label className="font-semibold">Observación:</Label>
                    <Input className="bg-white" {...register('observations')} />
                  </div>
                </div>

                <div className="w-full flex flex-row gap-2">
                  <div className="flex flex-col gap-2 w-1/4">
                    <Label className="font-semibold">Condición:</Label>
                    <Controller
                      name="condition"
                      control={control}
                      render={({ field }) => (
                        <Select value={String(field.value)} onValueChange={(v) => field.onChange(parseInt(v))}>
                          <SelectTrigger className="w-full bg-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Normal</SelectItem>
                            <SelectItem value="2">Tolerable</SelectItem>
                            <SelectItem value="3">Precaución</SelectItem>
                            <SelectItem value="4">Crítico</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <div className="flex flex-col gap-2 w-2/4">
                    <Label className="font-semibold">Diagnóstico:</Label>
                    <Input className="bg-white" {...register('diagnostic')} />
                  </div>
                  <div className="flex flex-col gap-2 w-2/4">
                    <Label className="font-semibold">Recomendación:</Label>
                    <Input className="bg-white" {...register('recomendations')} />
                  </div>
                </div>

                {isEditMode && (
                  <div className="w-full flex flex-row gap-2">
                    <div className="flex flex-col gap-2 w-1/3">
                      <Label className="font-semibold">N° de reporte:</Label>
                      <Input className="bg-white" {...register('name')} />
                    </div>
                    <div className="flex flex-col gap-2 w-1/3">
                      <Label className="font-semibold">Fecha de ejecución:</Label>
                      <Controller
                        name="execution_date"
                        control={control}
                        render={({ field }) => {
                          const dateValue = typeof field.value === 'object' ? field.value : field.value ? new Date(field.value as string) : undefined
                          return (
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" className="justify-start text-left font-normal w-full">
                                  <CalendarIcon className="w-4 h-4" />
                                  {field.value ? format(dateValue || new Date(), 'dd/MM/yyyy', { locale: es }) : 'Selecciona una fecha'}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar mode="single" selected={dateValue} onSelect={(date) => field.onChange(date)} locale={es} />
                              </PopoverContent>
                            </Popover>
                          )
                        }}
                      />
                    </div>
                    <div className="flex flex-col gap-2 w-1/3">
                      <Label className="font-semibold">Archivo PDF:</Label>
                      <Input
                        className="bg-white"
                        type="file"
                        accept=".pdf"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            {/* EDIT MODE - Notices Table */}
            {isEditMode && (
              <ReportNoticesTable
                noticesData={noticesData}
                setNoticesData={setNoticesData}
                date_status={date_status}
                setDateStatus={setDateStatus}
                date_ot={date_ot}
                setDateOt={setDateOt}
                onAddNotice={handleAddNoticeClick}
                onSubmitNotices={onSubmitNotices || (() => {})}
                onDeleteNotice={handleDeleteNoticeClick}
              />
            )}

            {/* VIEW MODE - Summary */}
            {isViewMode && (
              <ReportViewSummary
                selectedReport={selectedReport}
                entities={entities}
                noticesData={noticesData}
                onOpenPDF={() => setOpenPDF(true)}
              />
            )}
          </form>

          <DialogFooter>
            <Button variant="destructive" onClick={handleClose}>
              Cancelar
            </Button>
            {!isViewMode && (
              <Button type="submit" onClick={handleSubmit(formOnSubmit)}>
                {submitLabel}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {openPDF && selectedReport?.attachment && (
        <PDFViewer urlPDF={selectedReport.attachment} openDialog={openPDF} setOpenDialog={setOpenPDF} />
      )}
    </>
  )
}

export default ReportFormModal
