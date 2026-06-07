import { useCallback, useState } from 'react'
import type { User } from '../_models/user.models'

export type ModalMode = 'create' | 'edit' | 'view' | null

const useActionsModal = () => {
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [modalMode, setModalMode] = useState<ModalMode>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const openCreateModal = useCallback(() => {
    setModalMode('create')
    setSelectedUser(null)
    setOpenModal(true)
  }, [])

  const openEditModal = useCallback((user: User) => {
    setModalMode('edit')
    setSelectedUser(user)
    setOpenModal(true)
  }, [])

  const openViewModal = useCallback((user: User) => {
    setModalMode('view')
    setSelectedUser(user)
    setOpenModal(true)
  }, [])

  const closeModal = useCallback(() => {
    setOpenModal(false)
    setModalMode(null)
    setSelectedUser(null)
  }, [])

  return {
    openModal,
    modalMode,
    selectedUser,
    setOpenModal,
    openCreateModal,
    openEditModal,
    openViewModal,
    closeModal,
  }
}

export default useActionsModal