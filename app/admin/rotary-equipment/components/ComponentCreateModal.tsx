import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { DialogTitle } from '@radix-ui/react-dialog'
import { useState } from 'react'
import { FaMinus, FaPlus } from 'react-icons/fa6'
import { Equipment, Property } from '../../utils/types'
import { createEntity } from '@/app/services/entitiesServices'

interface ComponentCreateModalProps {
  openModal: boolean
  setOpenModal: (open: boolean) => void
  equipments: Equipment[]
}

const ComponentCreateModal = ({ openModal, setOpenModal, equipments }: ComponentCreateModalProps) => {
  const [properties, setProperties] = useState<Property[]>([])
  const [componentData, setComponentData] = useState<Equipment>({
    name: '',
    tag: '',
    type: 4,
    children: [],
    extra_info: {
      properties: []
    },
    deleted: false
  })

  const handleChangeProperty = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProperties((prev) => {
      const updated = prev.map((item, i) => (i === index ? { ...item, [name]: value } : item))
      setComponentData((prevData) => ({
        ...prevData,
        extra_info: {
          ...prevData.extra_info,
          properties: updated
        }
      }))
      return updated
    })
  }

  const handleAddProperty = () => {
    setProperties((prev) => {
      const updated = [...prev, { name: '', value: '' }]
      setComponentData((prevData) => ({
        ...prevData,
        extra_info: {
          ...prevData.extra_info,
          properties: updated
        }
      }))
      return updated
    })
  }

  const handleRemoveProperty = (idComponent: number) => {
    setProperties((prev) => {
      const updated = prev.filter((_, i) => i !== idComponent)
      setComponentData((prevData) => ({
        ...prevData,
        extra_info: {
          ...prevData.extra_info,
          properties: updated
        }
      }))
      return updated
    })
  }

  const handleSelectArea = (equipmentName: string) => {
    const equipmentSelected = equipments.find(equipment => equipment.name === equipmentName)
    if (equipmentSelected) {
      setComponentData({
        ...componentData,
        parent: equipmentSelected.id
      })
    }
  }

  const handleSubmit = () => {
    console.log('Equipo a guardar:', componentData)
    createEntity(componentData).then(response => {
      console.log('Equipo creado:', response)
      setOpenModal(false)
      setComponentData({
        name: '',
        tag: '',
        type: 4,
        children: [],
        extra_info: {
          properties: []
        },
        deleted: false
      })
      setProperties([])
    }).catch(error => {
      console.error('Error al crear el equipo:', error)
    })
  }

  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogContent className='bg-slate-200'>
        <DialogHeader>
          <DialogTitle className='font-bold'>CREAR COMPONENTE</DialogTitle>
        </DialogHeader>
        <div className='flex flex-col gap-4'>
          <div className='flex flex-col gap-2'>
            {/* <h1 className='font-bold'>Información</h1> */}
            <div className='flex flex-row justify-center items-center gap-2'>
              <Label className='font-bold'>Nombre español:</Label>
              <Input
                value={componentData.name}
                onChange={(e) => setComponentData({ ...componentData, name: e.target.value })}
                className='bg-white'
                placeholder='Nombre del componente'
              />
            </div>
            <div className='flex flex-row justify-center items-center gap-2'>
              <Label className='font-bold'>Nombre inglés:</Label>
              <Input
                value={componentData.extra_info?.name_en || ''}
                onChange={(e) => setComponentData({ ...componentData, extra_info: { ...componentData.extra_info, name_en: e.target.value } })}
                className='bg-white'
                placeholder='Component name'
              />
            </div>
            <div className='flex flex-row justify-center items-center gap-2'>
              <Label className='font-bold'>TAG:</Label>
              <Input
                value={componentData.tag}
                onChange={(e) => setComponentData({ ...componentData, tag: e.target.value })}
                className='bg-white'
                placeholder='TAG del componente'
              />
            </div>
            <div className='flex flex-row justify-center items-center gap-2'>
              <Label className='font-bold'>Equipo:</Label>
              <Select
                onValueChange={(value) => handleSelectArea(value)}
                value={equipments.find(equipment => equipment.id === componentData.parent)?.name || ''}
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Seleccione equipo" />
                </SelectTrigger>
                <SelectContent>
                  {equipments.map((equipment) => (
                    <SelectItem key={equipment.id} value={equipment.name}>
                      {equipment?.tag ? "[" + equipment?.tag + "] - " + equipment.name : "[S/T] - " + equipment.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='flex flex-row justify-center items-center gap-2'>
              <Label className='font-bold'>Descripción:</Label>
              <Textarea
                value={componentData.extra_info?.description || ''}
                onChange={(e) => setComponentData({ ...componentData, extra_info: { ...componentData.extra_info, description: e.target.value } })}
                placeholder='Descripción del componente' className='bg-white resize-none' />
            </div>
          </div>
          <div className='flex flex-col gap-2'>
            <div className='flex flex-row items-center gap-2'>
              <h1 className='font-bold'>Propiedades</h1>
              <button
                onClick={() => handleAddProperty()}
                className='bg-blue-700 p-1 rounded-sm'>
                <FaPlus color='white' />
              </button>
            </div>
            <div>
              {
                properties.length === 0 ?
                  <p className='italic'>No hay propiedades agregadas.</p>
                  :
                  properties.map((property, index) => (
                    <div key={index} className='flex flex-row gap-2 mb-2'>
                      <Input
                        value={property.name}
                        onChange={(e) => handleChangeProperty(index, e)}
                        name='name'
                        placeholder='Nombre'
                        className='bg-white'
                      />
                      <Input
                        value={property.value}
                        name='value'
                        onChange={(e) => handleChangeProperty(index, e)}
                        placeholder='Valor'
                        className='bg-white'
                      />
                      <button
                        onClick={() => handleRemoveProperty(index)}
                        className='bg-red-700 p-1 rounded-sm'>
                        <FaMinus color='white' />
                      </button>
                    </div>
                  ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant='destructive'
            onClick={() => setOpenModal(false)}>
            Cancelar
          </Button>
          <Button
            onClick={() => handleSubmit()}
          >Guardar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ComponentCreateModal;
