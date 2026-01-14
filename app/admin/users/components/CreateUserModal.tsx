import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { IoReload } from 'react-icons/io5'
import { FaEye } from 'react-icons/fa6'
import { Checkbox } from '@/components/ui/checkbox'

type CreateUserModalProps = {
  openModal: boolean
  setOpenModal: (open: boolean) => void
}

const CreateUserModal = ({ openModal, setOpenModal }: CreateUserModalProps) => {
  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogContent className='bg-slate-200'>
        <DialogHeader>
          <DialogTitle className='font-bold'>CREAR USUARIO</DialogTitle>
        </DialogHeader>
        <div className='flex flex-col gap-4'>
          <div className='flex flex-col gap-2'>
            <div className='flex flex-row justify-center items-center gap-2'>
              <Label className='font-bold'>Código:</Label>
              <Input placeholder='AUTH-000' className='bg-white' disabled />
            </div>
            <div className='flex flex-row justify-center items-center gap-2'>
              <Label className='font-bold'>DNI:</Label>
              <Input placeholder='DNI del usuario' className='bg-white' />
            </div>
            <div className='flex flex-row justify-center items-center gap-2'>
              <Label className='font-bold'>Nombres:</Label>
              <Input placeholder='Nombres del usuario' className='bg-white' />
            </div>
            <div className='flex flex-row justify-center items-center gap-2'>
              <Label className='font-bold'>Apellidos:</Label>
              <Input placeholder='Apellidos del usuario' className='bg-white' />
            </div>
            <div className='flex flex-row justify-center items-center gap-2'>
              <Label className='font-bold'>Nombre corto:</Label>
              <Input placeholder='Nombre corto del usuario' className='bg-white' />
            </div>
            <div className='flex flex-row justify-center items-center gap-2'>
              <Label className='font-bold'>Correo electrónico:</Label>
              <Input placeholder='Correo electrónico del usuario' className='bg-white' />
            </div>
            <div className='flex flex-row justify-center items-center gap-2'>
              <Label className='font-bold'>Teléfono:</Label>
              <Input placeholder='Teléfono del usuario' className='bg-white' />
            </div>
            <div className='flex flex-row justify-center items-center gap-2'>
              <Label className='font-bold'>Usuario:</Label>
              <Input placeholder='Usuario del usuario' className='bg-white' />
            </div>
            <div className='flex flex-row justify-center items-center gap-2'>
              <Label className='font-bold'>Contraseña:</Label>
              <Input placeholder='Contraseña del usuario' className='bg-white' />
              <Button variant='outline'><FaEye /></Button>
              <Button variant='outline'><IoReload /></Button>
            </div>
            <div className='flex flex-row items-center gap-2'>
              <Label className='font-bold'>Permisos:</Label>
              <div className='flex flex-col gap-2 bg-white p-2 rounded-md w-full'>
                <div className="flex gap-3">
                  <Checkbox id="1" className='bg-white' />
                  <Label htmlFor="1">Administrador General</Label>
                </div>
                <div className="flex gap-3">
                  <Checkbox id="2" className='bg-white' />
                  <Label htmlFor="2">Administrador</Label>
                </div>
                <div className="flex gap-3">
                  <Checkbox id="3" className='bg-white' />
                  <Label htmlFor="3">Editor</Label>
                </div>
                <div className="flex gap-3">
                  <Checkbox id="4" className='bg-white' />
                  <Label htmlFor="4">Usuario</Label>
                </div>
              </div>
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

export default CreateUserModal