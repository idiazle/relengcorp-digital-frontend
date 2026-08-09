import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { DialogTitle } from '@radix-ui/react-dialog'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { FaMinus, FaPlus } from 'react-icons/fa6'
import { createEntity } from '@/app/_services/entitiesServices'
import { Entity } from '../entities/_models/entity.model'

interface ItemCreateModalProps {
  openModal: boolean
  setOpenModal: (open: boolean) => void
  routes: Entity[]
}

const ItemCreateModal = ({ openModal, setOpenModal, routes }: ItemCreateModalProps) => {
  const { register, control, handleSubmit, reset, setValue } = useForm<Entity>({
    defaultValues: {
      name: '',
      tag: '',
      parent: 0,
      extra_info: {
        name_en: '',
        description: '',
        properties: []
      }
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'extra_info.properties'
  })

  const handleSelectRoute = (routeName: string) => {
    const selectedRoute = routes.find(entity => entity.name === routeName)
    if (selectedRoute) {
      setValue('parent', selectedRoute.id || 0)
    }
  }

  const onSubmit = async (formData: Entity) => {
    console.log('Form data to submit:', formData)
    try {
      const itemData = {
        ...formData,
        type: 5, // Tipo 5 para items genéricos
        extra_info: {
          ...formData.extra_info,
          properties: formData.extra_info?.properties || []
        }
      }
      const response = await createEntity(itemData)
      console.log('Item creado:', response)
      reset()
      setOpenModal(false)
    } catch (error) {
      console.error('Error al crear el item:', error)
    }
  }

  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogContent className='bg-slate-200'>
        <DialogHeader>
          <DialogTitle className='font-bold'>CREAR ITEM</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
          <div className='flex flex-col gap-2'>
            {/* <h1 className='font-bold'>Información</h1> */}
            <div className='flex flex-row justify-center items-center gap-2'>
              <Label className='font-bold'>Nombre español:</Label>
              <Input
                {...register('name')}
                className='bg-white'
                placeholder='Nombre del item'
              />
            </div>
            <div className='flex flex-row justify-center items-center gap-2'>
              <Label className='font-bold'>Nombre inglés:</Label>
              <Input
                {...register('extra_info.name_en')}
                className='bg-white'
                placeholder='Item name'
              />
            </div>
            <div className='flex flex-row justify-center items-center gap-2'>
              <Label className='font-bold'>TAG:</Label>
              <Input
                {...register('tag')}
                className='bg-white'
                placeholder='TAG del item'
              />
            </div>
            <div className='flex flex-row justify-center items-center gap-2'>
              <Label className='font-bold'>Ruta:</Label>
              <Controller
                name="parent"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => handleSelectRoute(value)}
                    value={routes.find(entity => entity.id === field.value)?.name || ''}
                  >
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="Seleccione una ruta" />
                    </SelectTrigger>
                    <SelectContent>
                      {routes.map((entity) => (
                        <SelectItem key={entity.id} value={entity.name || ''}>
                          {entity?.tag ? "[" + entity?.tag + "] - " + entity.name : "[S/T] - " + entity.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className='flex flex-row justify-center items-center gap-2'>
              <Label className='font-bold'>Descripción:</Label>
              <Controller
                name="extra_info.description"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    placeholder='Descripción del item'
                    className='bg-white resize-none'
                  />
                )}
              />
            </div>
          </div>
          <div className='flex flex-col gap-2'>
            <div className='flex flex-row items-center gap-2'>
              <h1 className='font-bold'>Propiedades</h1>
              <button type='button' onClick={() => append({ name: '', value: '' })} className='bg-blue-700 p-1 rounded-sm'><FaPlus color='white' /></button>
            </div>
            <div>
              {
                fields.length === 0 ?
                  <p className='italic'>No hay propiedades agregadas.</p>
                  :
                  fields.map((field, index) => (
                    <div key={field.id} className='flex flex-row gap-2 mb-2'>
                      <Input
                        {...register(`extra_info.properties.${index}.name`)}
                        placeholder='Nombre'
                        className='bg-white'
                      />
                      <Input
                        {...register(`extra_info.properties.${index}.value`)}
                        placeholder='Valor'
                        className='bg-white'
                      />
                      <button type='button' onClick={() => remove(index)} className='bg-red-700 p-1 rounded-sm'><FaMinus color='white' /></button>
                    </div>
                  ))
              }
            </div>
          </div>
          <DialogFooter>
            <Button
              type='button'
              variant='destructive'
              onClick={() => {
                reset()
                setOpenModal(false)
              }}>
              Cancelar
            </Button>
            <Button type='submit'>Guardar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ItemCreateModal;
