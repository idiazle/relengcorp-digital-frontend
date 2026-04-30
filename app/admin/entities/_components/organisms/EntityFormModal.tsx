import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import type { Entity } from '../../models/entity.model'
import useEntityModal from '../../_hooks/useEntityModal.hook'
import EntityFieldRow from '../molecules/EntityFieldRow'
import EntitySelectField from '../molecules/EntitySelectField'
import { entityFormFieldsConfig } from '../../_config/entityFormFields.config'

interface EntityFormModalProps {
  openModal: boolean
  setOpenModal: (open: boolean) => void
  onEntityCreated?: () => void
  mode?: 'create' | 'edit' | 'view'
  selectedEntity?: Entity | null
}

const EntityFormModal = ({
  openModal,
  setOpenModal,
  onEntityCreated,
  mode = 'create',
  selectedEntity = null
}: EntityFormModalProps) => {
  const {
    register,
    control,
    parents,
    isViewMode,
    modalTitle,
    submitLabel,
    handleClose,
    handleFormSubmit,
    isLoading,
    error
  } = useEntityModal({
    openModal,
    setOpenModal,
    onEntitySaved: onEntityCreated,
    mode,
    selectedEntity
  })

  const typeOptions = [
    { id: 1, label: 'Planta' },
    { id: 2, label: 'Área' }
  ]

  const parentOptions = parents
    .filter((ent) => ent.type === 1 || ent.type === 2)
    .map((entity) => ({
      id: entity.id!,
      label: entity?.tag ? `[${entity?.tag}] - ${entity.name}` : `[S/T] - ${entity.name}`
    }))

  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogContent className="min-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-bold">{modalTitle}</DialogTitle>
          <DialogDescription>
            {isViewMode
              ? 'Visualice los datos de la entidad.'
              : 'Complete el siguiente formulario para crear una nueva planta o área.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            {entityFormFieldsConfig.map((field) => (
              <EntityFieldRow
                key={field.name}
                label={field.label}
                placeholder={field.placeholder}
                register={register(field.name)}
                type={field.type}
                disabled={isViewMode}
                required={field.required}
              />
            ))}
            <EntitySelectField
              label="Tipo"
              placeholder="Seleccione el tipo de entidad"
              name="type"
              control={control}
              options={typeOptions}
              disabled={isViewMode}
              required
            />
            <EntitySelectField
              label="Entidad superior"
              placeholder="Seleccione la entidad superior"
              name="parent"
              control={control}
              options={parentOptions}
              disabled={isViewMode}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="destructive" onClick={handleClose}>
              {isViewMode ? 'Cerrar' : 'Cancelar'}
            </Button>
            {!isViewMode && (
              <Button type="submit" disabled={isLoading}>
                {submitLabel}
              </Button>
            )}
          </DialogFooter>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EntityFormModal;
