import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { createUser, getUserGroups, updateUser } from '@/app/_services/userServices'
import { generateRandomPassword } from '../_utils/utils'
import type { Groups, User } from '../_models/user.models'
import { emptyUserForm } from '../_config/userFormDefaults'

export type UserModalMode = 'create' | 'edit' | 'view'

interface UseUserModalLogicParams {
  openModal: boolean
  setOpenModal: (open: boolean) => void
  onUserCreated: () => void
  mode?: UserModalMode
  selectedUser?: User | null
}

const useUserModalLogic = ({
  openModal,
  setOpenModal,
  onUserCreated,
  mode = 'create',
  selectedUser = null
}: UseUserModalLogicParams) => {
  const [viewPassword, setViewPassword] = useState<boolean>(false)
  const [groups, setGroups] = useState<Groups[]>([])
  const isViewMode = mode === 'view'
  const isEditMode = mode === 'edit'
  const isCreateMode = mode === 'create'

  useEffect(() => {
    getUserGroups()
      .then((response) => {
        setGroups(response.data)
      })
      .catch((error) => {
        console.error('Error fetching user groups:', error)
      })
  }, [])

  const { register, control, handleSubmit, reset, setValue } = useForm<User>({
    defaultValues: emptyUserForm
  })

  useEffect(() => {
    if (!openModal) return

    if ((isEditMode || isViewMode) && selectedUser) {
      reset({
        ...emptyUserForm,
        ...selectedUser,
        password: ''
      })
      return
    }
    reset(emptyUserForm)
  }, [openModal, isEditMode, isViewMode, selectedUser, reset])

  const handleClose = () => {
    reset(emptyUserForm)
    setViewPassword(false)
    setOpenModal(false)
  }

  const toggleViewPassword = () => {
    setViewPassword((current) => !current)
  }

  const handleGeneratePassword = () => {
    const newPassword = generateRandomPassword()
    setValue('password', newPassword)
  }

  const saveUser = async (data: User) => {
    try {
      if (isEditMode && selectedUser?.id) {
        const payload: Partial<User> = { ...data }
        if (!payload.password?.trim()) {
          delete payload.password
        }
        await updateUser(selectedUser.id, payload)
        console.log('Usuario actualizado exitosamente')
      } else if (isCreateMode) {
        await createUser(data)
        console.log('Usuario creado exitosamente')
      }

      handleClose()
      onUserCreated()
    } catch (error) {
      console.error('Error al guardar usuario:', error)
    }
  }

  const handleFormSubmit = isViewMode
    ? (event: React.FormEvent<HTMLFormElement>) => event.preventDefault()
    : handleSubmit(saveUser, (errors) => {
      console.error('Form errors:', errors)
    })

  const modalTitle = isViewMode ? 'VER USUARIO' : isEditMode ? 'EDITAR USUARIO' : 'CREAR USUARIO'
  const submitLabel = isEditMode ? 'Actualizar' : 'Guardar'

  return {
    register,
    control,
    groups,
    viewPassword,
    isViewMode,
    isEditMode,
    modalTitle,
    submitLabel,
    handleClose,
    handleFormSubmit,
    toggleViewPassword,
    handleGeneratePassword
  }
}

export default useUserModalLogic
