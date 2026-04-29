import { useCallback, useState } from 'react'
import type { Entity } from '../models/entity.model'

export type ModalMode = 'create' | 'edit' | 'view' | null

const useActionsModal = () => {
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [modalMode, setModalMode] = useState<ModalMode>(null)
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null)

  const openCreateModal = useCallback(() => {
    setModalMode('create')
    setSelectedEntity(null)
    setOpenModal(true)
  }, [])

  const openEditModal = useCallback((entity: Entity) => {
    setModalMode('edit')
    setSelectedEntity(entity)
    setOpenModal(true)
  }, [])

  const openViewModal = useCallback((entity: Entity) => {
    setModalMode('view')
    setSelectedEntity(entity)
    setOpenModal(true)
  }, [])

  const closeModal = useCallback(() => {
    setOpenModal(false)
    setModalMode(null)
    setSelectedEntity(null)
  }, [])

  return {
    openModal,
    modalMode,
    selectedEntity,
    setOpenModal,
    openCreateModal,
    openEditModal,
    openViewModal,
    closeModal,
  }
}

export default useActionsModal
