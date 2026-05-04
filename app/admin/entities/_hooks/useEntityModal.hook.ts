import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import useGetPlantsAndAreas from './useGetPlantsAndAreas.hook'
import { useEntityActions } from './useEntityActions.hook'
import type { Entity } from '../_models/entity.model'
import { emptyEntityForm } from '../_config/entityFormDefaults'

export type EntityModalMode = 'create' | 'edit' | 'view'

interface UseEntityModalParams {
  openModal: boolean
  setOpenModal: (open: boolean) => void
  onEntitySaved?: () => void
  mode?: EntityModalMode
  selectedEntity?: Entity | null
}

const useEntityModal = ({
  openModal,
  setOpenModal,
  onEntitySaved,
  mode = 'create',
  selectedEntity = null
}: UseEntityModalParams) => {
  const isViewMode = mode === 'view'
  const isEditMode = mode === 'edit'
  const isCreateMode = mode === 'create'
  
  const { data: plantsAndAreas } = useGetPlantsAndAreas()
  const parents: Entity[] = plantsAndAreas ?? []

  const { handleCreate, handleUpdate, isLoading, error } = useEntityActions(onEntitySaved)

  const { register, control, handleSubmit, reset, setValue } = useForm<Entity>({
    defaultValues: emptyEntityForm
  })

  const getParentId = (parent: Entity['parent'] | { id?: number } | null | undefined) => {
    if (parent && typeof parent === 'object') {
      return parent.id ?? null
    }

    return parent ?? null
  }

  useEffect(() => {
    if (!openModal) return

    if ((isEditMode || isViewMode) && selectedEntity) {
      // populate form with selectedEntity (exclude server-only fields)
      setValue('name', selectedEntity.name ?? '')
      setValue('type', selectedEntity.type ?? 1)
      setValue('tag', selectedEntity.tag ?? '')
      setValue('attachment', selectedEntity.attachment ?? '')
      setValue('parent', getParentId(selectedEntity.parent as Entity['parent'] | { id?: number } | null | undefined))
      setValue('extra_info', selectedEntity.extra_info ?? null)
      setValue('deleted', selectedEntity.deleted ?? false)
      return
    }

    reset()
  }, [openModal, isEditMode, isViewMode, selectedEntity, reset, setValue])

  const handleClose = () => {
    reset()
    setOpenModal(false)
  }

  const saveEntity = async (data: Entity) => {
    try {
      if (isEditMode && selectedEntity?.id) {
        await handleUpdate(selectedEntity.id, data as unknown as Entity)
      } else if (isCreateMode) {
        console.log("Creating entity with data:", data)
        await handleCreate(data as unknown as Entity)
      }
    } catch (err) {
      console.error('Error saving entity:', err)
      throw err
    }
  }

  const handleFormSubmit = isViewMode
    ? (event: React.FormEvent<HTMLFormElement>) => event.preventDefault()
    : handleSubmit(async (data) => {
      await saveEntity(data)
      handleClose()
      onEntitySaved?.()
    }, (errors) => {
      console.error('Form errors:', errors)
    })

  const modalTitle = isViewMode ? 'VER ENTIDAD' : isEditMode ? 'EDITAR ENTIDAD' : 'CREAR ENTIDAD'
  const submitLabel = isEditMode ? 'Actualizar' : 'Guardar'

  return {
    register,
    control,
    parents,
    isViewMode,
    isEditMode,
    modalTitle,
    submitLabel,
    handleClose,
    handleFormSubmit,
    isLoading,
    error,
    reset
  }
}

export default useEntityModal
