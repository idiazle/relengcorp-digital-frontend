import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { User } from '../../_models/user.models'
import FieldRow from '../molecules/FieldRow'
import PasswordField from '../molecules/PasswordField'
import GroupsSelector from '../molecules/GroupsSelector'
import { userFieldsConfig } from '../../_config/userFormFields.config'
import useUserModalLogic, { type UserModalMode } from '../../_hooks/useUserModalLogic'

interface CreateUserModalProps {
  openModal: boolean
  setOpenModal: (open: boolean) => void
  onUserCreated: () => void
  mode?: UserModalMode
  selectedUser?: User | null
}

const CreateUserModal = ({
  openModal,
  setOpenModal,
  onUserCreated,
  mode = 'create',
  selectedUser = null
}: CreateUserModalProps) => {
  const {
    register,
    control,
    groups,
    viewPassword,
    isViewMode,
    modalTitle,
    submitLabel,
    handleClose,
    handleFormSubmit,
    toggleViewPassword,
    handleGeneratePassword
  } = useUserModalLogic({
    openModal,
    setOpenModal,
    onUserCreated,
    mode,
    selectedUser
  })

  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogContent className='bg-slate-200'>
        <DialogHeader>
          <DialogTitle className='font-bold'>{modalTitle}</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleFormSubmit}
          className='flex flex-col gap-4'>
          <div className='flex flex-col gap-2'>
            {userFieldsConfig.map((field) => (
              <FieldRow
                key={field.name}
                label={field.label}
                placeholder={field.placeholder}
                register={register(field.name)}
                type={field.type}
                disabled={isViewMode}
              />
            ))}
            <PasswordField
              register={register('password')}
              disabled={isViewMode}
              viewPassword={viewPassword}
              onToggleViewPassword={toggleViewPassword}
              onGeneratePassword={handleGeneratePassword}
            />
            <GroupsSelector
              groups={groups}
              control={control}
              disabled={isViewMode}
            />
          </div>
          <DialogFooter>
            <Button
              type='button'
              variant='destructive'
              onClick={handleClose}>
              {isViewMode ? 'Cerrar' : 'Cancelar'}
            </Button>
            {!isViewMode && <Button type='submit'>{submitLabel}</Button>}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateUserModal