import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useForm, Controller } from 'react-hook-form'
import { Entity } from '../models/entity.model'
import { createEntity } from '@/app/services/entitiesServices'

interface EntityData {
  name: string
  type: number
  tag: string
  attachment?: string
  parent?: number | null
  extra_info?: Record<string, unknown> | null
  deleted?: boolean
}

interface CreateEntityModalProps {
  openModal: boolean
  setOpenModal: (open: boolean) => void
  entities: Entity[]
  onEntityCreated?: () => void
} 

const CreateEntityModal = ({ openModal, setOpenModal, entities, onEntityCreated }: CreateEntityModalProps) => {
  const { register, control, handleSubmit, reset } = useForm<EntityData>({
    defaultValues: {
      name: '',
      type: 1,
      tag: '',
      attachment: '',
      parent: null,
      extra_info: null,
      deleted: false
    }
  })

  const onSubmit = async (data: EntityData) => {
    try {
      console.log('Form data:', data)
      await createEntity(data)
      console.log('Entidad creada exitosamente')
      handleClose()
      onEntityCreated?.()
    } catch (error) {
      console.error('Error al crear entidad:', error)
    }
  }

  const handleClose = () => {
    reset()
    setOpenModal(false)
  }

  return (
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="min-w-[500px]">
          <DialogHeader>
            <DialogTitle>Crear Nueva Entidad</DialogTitle>
            <DialogDescription>
              Complete el siguiente formulario para crear una nueva planta o área.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-1">
                <Label>TAG(*):</Label>
                <Input
                  {...register('tag')}
                  className="bg-white"
                  placeholder="Ingrese el tag de la entidad"
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label>Nombre de planta/área(*):</Label>
                <Input
                  {...register('name')}
                  className="bg-white"
                  placeholder="Ingrese el nombre de la entidad"
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label>Tipo(*):</Label>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={String(field.value)}
                      onValueChange={(value) => field.onChange(parseInt(value))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccione el tipo de entidad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Planta</SelectItem>
                        <SelectItem value="2">Área</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="flex flex-col gap-1">
                <Label>Entidad superior:</Label>
                <Controller
                  name="parent"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value ? String(field.value) : undefined}
                      onValueChange={(value) => field.onChange(parseInt(value) || null)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccione la entidad superior" />
                      </SelectTrigger>
                      <SelectContent>
                        {entities.filter((ent) => ent.type === 1 || ent.type === 2).map((entity) => (
                          <SelectItem key={entity.id} value={entity.id!.toString()}>
                            {entity?.tag ? "[" + entity?.tag + "] - " + entity.name : "[S/T] - " + entity.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="destructive" onClick={handleClose}>Cancelar</Button>
              <Button type="submit">Crear Entidad</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
  )
}

export default CreateEntityModal