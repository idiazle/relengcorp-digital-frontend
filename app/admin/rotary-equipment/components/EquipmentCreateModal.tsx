import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { DialogTitle } from '@radix-ui/react-dialog'
import { useState } from 'react'
import { FaMinus, FaPlus } from 'react-icons/fa6'

type EquipmentCreateModalProps = {
  openModal: boolean
  setOpenModal: (open: boolean) => void
}

type Property = {
  name: string
  value: string
}

const areas = [
  {
    id: 1,
    name: 'Chancado primario',
    description: 'Descripción del área 1'
  },
  {
    id: 2,
    name: 'Molienda',
    description: 'Descripción del área 2'
  },
  {
    id: 3,
    name: 'Flotación y remolienda',
    description: 'Descripción del área 3'
  },
  {
    id: 4,
    name: 'Relaves',
    description: 'Descripción del área 4'
  }
]

const EquipmentCreateModal = ({ openModal, setOpenModal }: EquipmentCreateModalProps) => {
  const [properties, setProperties] = useState<Property[]>([])
  const [property, setProperty] = useState<Property>({
    name: '',
    value: ''
  })

  const handleChangeProperty = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProperty({
      ...property,
      [name]: value
    })
  }

  const handleAddProperty = () => {
    setProperties([...properties, property])
    setProperty({
      name: '',
      value: ''
    })
  }

  const handleRemoveProperty = (index: number) => {
    const newProperties = properties.filter((_, i) => i !== index)
    setProperties(newProperties)
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
              <Input placeholder='Nombre del equipo' className='bg-white' />
            </div>
            <div className='flex flex-row justify-center items-center gap-2'>
              <Label className='font-bold'>Nombre inglés:</Label>
              <Input placeholder='Equipment name' className='bg-white' />
            </div>
            <div className='flex flex-row justify-center items-center gap-2'>
              <Label className='font-bold'>TAG:</Label>
              <Input placeholder='TAG del equipo' className='bg-white' />
            </div>
            <div className='flex flex-row justify-center items-center gap-2'>
              <Label className='font-bold'>Área:</Label>
              <Select>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Seleccione un área" />
                </SelectTrigger>
                <SelectContent>
                  {areas.map((area) => (
                    <SelectItem key={area.id} value={area.name}>{area.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='flex flex-row justify-center items-center gap-2'>
              <Label className='font-bold'>Descripción:</Label>
              <Textarea placeholder='Descripción del equipo' className='bg-white resize-none' />
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
                        onChange={handleChangeProperty}
                        name='name'
                        placeholder='Nombre'
                        className='bg-white'
                      />
                      <Input
                        value={property.value}
                        name='value'
                        onChange={handleChangeProperty}
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
          <Button>Guardar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EquipmentCreateModal