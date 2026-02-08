import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { DialogTitle } from '@radix-ui/react-dialog'
import { useState } from 'react'
import { FaMinus, FaPlus } from 'react-icons/fa6'
import { Area, Equipment, Property } from '../../utils/types'
import { createEntity } from '@/app/services/entitiesServices'

interface EquipmentCreateModalProps {
  openModal: boolean
  setOpenModal: (open: boolean) => void
  areas: Area[]
}

const EquipmentCreateModal = ({ openModal, setOpenModal, areas }: EquipmentCreateModalProps) => {
  const [properties, setProperties] = useState<Property[]>([])
  const [equipmentData, setEquipmentData] = useState<Equipment>({
    name: '',
    tag: '',
    type: 3,
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
      setEquipmentData((prevData) => ({
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
      setEquipmentData((prevData) => ({
        ...prevData,
        extra_info: {
          ...prevData.extra_info,
          properties: updated
        }
      }))
      return updated
    })
  }

  const handleRemoveProperty = (index: number) => {
    setProperties((prev) => {
      const updated = prev.filter((_, i) => i !== index)
      setEquipmentData((prevData) => ({
        ...prevData,
        extra_info: {
          ...prevData.extra_info,
          properties: updated
        }
      }))
      return updated
    })
  }

  const handleSelectArea = (areaName: string) => {
    const selectedArea = areas.find(area => area.name === areaName)
    if (selectedArea) {
      setEquipmentData({
        ...equipmentData,
        parent: selectedArea.id
      })
    }
  }

  const handleSubmit = () => {
    console.log('Equipo a guardar:', equipmentData)
    createEntity(equipmentData).then(response => {
      console.log('Equipo creado:', response)
      setOpenModal(false)
      setEquipmentData({
        name: '',
        tag: '',
        type: 3,
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
          <DialogTitle className='font-bold'>CREAR EQUIPO</DialogTitle>
        </DialogHeader>
        <div className='flex flex-col gap-4'>
          <div className='flex flex-col gap-2'>
            {/* <h1 className='font-bold'>Información</h1> */}
            <div className='flex flex-row justify-center items-center gap-2'>
              <Label className='font-bold'>Nombre español:</Label>
              <Input
                value={equipmentData.name}
                onChange={(e) => setEquipmentData({ ...equipmentData, name: e.target.value })}
                className='bg-white'
                placeholder='Nombre del equipo'
              />
            </div>
            <div className='flex flex-row justify-center items-center gap-2'>
              <Label className='font-bold'>Nombre inglés:</Label>
              <Input
                value={equipmentData.extra_info?.name_en || ''}
                onChange={(e) => setEquipmentData({ ...equipmentData, extra_info: { ...equipmentData.extra_info, name_en: e.target.value } })}
                className='bg-white'
                placeholder='Equipment name'
              />
            </div>
            <div className='flex flex-row justify-center items-center gap-2'>
              <Label className='font-bold'>TAG:</Label>
              <Input
                value={equipmentData.tag}
                onChange={(e) => setEquipmentData({ ...equipmentData, tag: e.target.value })}
                className='bg-white'
                placeholder='TAG del equipo'
              />
            </div>
            <div className='flex flex-row justify-center items-center gap-2'>
              <Label className='font-bold'>Área:</Label>
              <Select
                onValueChange={(value) => handleSelectArea(value)}
                value={areas.find(area => area.id === equipmentData.parent)?.name || ''}
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Seleccione un área" />
                </SelectTrigger>
                <SelectContent>
                  {areas.map((area) => (
                    <SelectItem key={area.id} value={area.name}>
                      {area?.tag ? "[" + area?.tag + "] - " + area.name : "[S/T] - " + area.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='flex flex-row justify-center items-center gap-2'>
              <Label className='font-bold'>Descripción:</Label>
              <Textarea
                value={equipmentData.extra_info?.description || ''}
                onChange={(e) => setEquipmentData({ ...equipmentData, extra_info: { ...equipmentData.extra_info, description: e.target.value } })}
                placeholder='Descripción del equipo' className='bg-white resize-none' />
            </div>
          </div>
          <div className='flex flex-col gap-2'>
            <div className='flex flex-row items-center gap-2'>
              <h1 className='font-bold'>Propiedades</h1>
              <button onClick={() => handleAddProperty()} className='bg-blue-700 p-1 rounded-sm'><FaPlus color='white' /></button>
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
                      <button onClick={() => handleRemoveProperty(index)} className='bg-red-700 p-1 rounded-sm'><FaMinus color='white' /></button>
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

export default EquipmentCreateModal