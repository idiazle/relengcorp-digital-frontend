import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import type { Report, Notices } from '../_models/moncon.model'
import type { Entity } from '../../entities/_models/entity.model'

export type ReportModalMode = 'create' | 'edit' | 'view'

interface UseMonconReportModalParams {
  openModal: boolean
  setOpenModal: (open: boolean) => void
  selectedReport?: Report | null
  onReportSaved?: () => void
  mode?: ReportModalMode
}

const useMonconReportModal = ({
  openModal,
  setOpenModal,
  selectedReport = null,
  onReportSaved,
  mode = 'create'
}: UseMonconReportModalParams) => {
  const isCreateMode = mode === 'create'
  const isEditMode = mode === 'edit'
  const isViewMode = mode === 'view'

  const [file, setFile] = useState<File | null>(null)
  const [selectedPlant, setSelectedPlant] = useState<number | undefined>(undefined)
  const [selectedArea, setSelectedArea] = useState<number | undefined>(undefined)
  const [selectedRoute, setSelectedRoute] = useState<number | undefined>(undefined)
  const [selectedEquipment, setSelectedEquipment] = useState<number | undefined>(undefined)
  const [selectedItem, setSelectedItem] = useState<number | undefined>(undefined)
  const [noticesData, setNoticesData] = useState<Notices[]>([])
  const [date_status, setDateStatus] = useState<Date | undefined>(new Date())
  const [date_ot, setDateOt] = useState<Date | undefined>(new Date())

  const resetHierarchy = () => {
    setSelectedPlant(undefined)
    setSelectedArea(undefined)
    setSelectedRoute(undefined)
    setSelectedEquipment(undefined)
    setSelectedItem(undefined)
    setFile(null)
    setNoticesData([])
  }

  const applyHierarchyFromParents = (parents: Entity[] = []) => {
    const plant = parents.find((entity) => entity.type === 1)
    const area = parents.find((entity) => entity.type === 2)
    const route = parents.find((entity) => entity.type === 3)
    const equipment = parents.find((entity) => entity.type === 4)
    const item = parents.find((entity) => entity.type === 5)

    setSelectedPlant(plant?.id)
    setSelectedArea(area?.id)
    setSelectedRoute(route?.id)

    if (selectedReport?.work_type === 1) {
      setSelectedEquipment(equipment?.id)
      setSelectedItem(undefined)
    } else if (selectedReport?.work_type === 2) {
      setSelectedEquipment(undefined)
      setSelectedItem(item?.id)
    } else {
      setSelectedEquipment(equipment?.id)
      setSelectedItem(item?.id)
    }
  }

  const { register, control, handleSubmit, reset, setValue } = useForm<Report>({
    defaultValues: {
      entity: 0,
      program: 2,
      work_type: 0,
      service_type: 0,
      execution_status: 2,
      condition: 1,
      observations: '',
      name: '',
      diagnostic: '',
      recomendations: '',
    }
  })

  useEffect(() => {
    if (!openModal) return

    if ((isEditMode || isViewMode) && selectedReport) {
      reset({
        entity: selectedReport.entity ?? 0,
        program: selectedReport.program,
        work_type: selectedReport.work_type,
        service_type: selectedReport.service_type,
        execution_status: selectedReport.execution_status,
        condition: selectedReport.condition,
        observations: selectedReport.observations ?? '',
        name: selectedReport.name ?? '',
        execution_date: selectedReport.execution_date,
        diagnostic: selectedReport.diagnostic ?? '',
        recomendations: selectedReport.recomendations ?? '',
      })
      resetHierarchy()
      applyHierarchyFromParents(selectedReport.parents)
      return
    }

    reset()
    resetHierarchy()
  }, [openModal, isEditMode, isViewMode, selectedReport, reset])

  const handleClose = () => {
    reset()
    resetHierarchy()
    setOpenModal(false)
  }

  const modalTitle = isViewMode ? 'DETALLE DE REGISTRO' : isEditMode ? 'EDITAR REGISTRO' : 'NUEVO REGISTRO'
  const submitLabel = isEditMode ? 'Actualizar' : 'Guardar'

  return {
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
  }
}

export default useMonconReportModal
