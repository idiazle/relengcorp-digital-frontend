import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { IoReload } from 'react-icons/io5'
import { FaEye, FaEyeSlash } from 'react-icons/fa6'
import { Checkbox } from '@/components/ui/checkbox'
import { useState } from 'react'

type CreateUserModalProps = {
  openModal: boolean
  setOpenModal: (open: boolean) => void
}

type UserData = {
  code: string
  dni: string
  firstName: string
  lastName: string
  shortName: string
  email: string
  phone: string
  username: string
  password: string
  permissions: string[]
}

const CreateUserModal = ({ openModal, setOpenModal }: CreateUserModalProps) => {
  const [viewPassword, setViewPassword] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData>({
    code: '',
    dni: '',
    firstName: '',
    lastName: '',
    shortName: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    permissions: [] as string[]
  });

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      password += chars[randomIndex];
    }
    return password;
  }

  const resetValues = () => {
    setUserData({
      code: '',
      dni: '',
      firstName: '',
      lastName: '',
      shortName: '',
      email: '',
      phone: '',
      username: '',
      password: '',
      permissions: [] as string[]
    });
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  }

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
              <Input
                name='code'
                onChange={(e) => { handleInputChange(e) }}
                placeholder='AUTH-000' className='bg-white' />
            </div>
            <div className='flex flex-row justify-center items-center gap-2'>
              <Label className='font-bold'>DNI:</Label>
              <Input
                name='dni'
                onChange={(e) => { handleInputChange(e) }}
                placeholder='DNI del usuario' className='bg-white' />
            </div>
            <div className='flex flex-row justify-center items-center gap-2'>
              <Label className='font-bold'>Nombres:</Label>
              <Input
                name='firstName'
                onChange={(e) => { handleInputChange(e) }}
                placeholder='Nombres del usuario' className='bg-white' />
            </div>
            <div className='flex flex-row justify-center items-center gap-2'>
              <Label className='font-bold'>Apellidos:</Label>
              <Input
                name='lastName'
                onChange={(e) => { handleInputChange(e) }}
                placeholder='Apellidos del usuario' className='bg-white' />
            </div>
            <div className='flex flex-row justify-center items-center gap-2'>
              <Label className='font-bold'>Nombre corto:</Label>
              <Input
                name='shortName'
                onChange={(e) => { handleInputChange(e) }}
                placeholder='Nombre corto del usuario' className='bg-white' />
            </div>
            <div className='flex flex-row justify-center items-center gap-2'>
              <Label className='font-bold'>Correo electrónico:</Label>
              <Input
                name='email'
                onChange={(e) => { handleInputChange(e) }}
                placeholder='Correo electrónico del usuario' className='bg-white' />
            </div>
            <div className='flex flex-row justify-center items-center gap-2'>
              <Label className='font-bold'>Teléfono:</Label>
              <Input
                name='phone'
                onChange={(e) => { handleInputChange(e) }}
                placeholder='Teléfono del usuario' className='bg-white' />
            </div>
            <div className='flex flex-row justify-center items-center gap-2'>
              <Label className='font-bold'>Usuario:</Label>
              <Input
                name='username'
                onChange={(e) => { handleInputChange(e) }}
                placeholder='Usuario del usuario' className='bg-white' />
            </div>
            <div className='flex flex-row justify-center items-center gap-2'>
              <Label className='font-bold'>Contraseña:</Label>
              <Input
                name='password'
                onChange={(e) => { handleInputChange(e) }}
                type={viewPassword ? 'text' : 'password'} placeholder='Contraseña del usuario' className='bg-white' />
              <Button variant='outline' onClick={() => setViewPassword(!viewPassword)}>
                {viewPassword ? <FaEyeSlash /> : <FaEye />}
              </Button>
              <Button
                onClick={() => {
                  const newPassword = generateRandomPassword();
                  setUserData({ ...userData, password: newPassword });
                }}
                variant='outline'><IoReload /></Button>
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
            onClick={() => {
              setOpenModal(false);
              resetValues();
            }}>
            Cancelar
          </Button>
          <Button>Guardar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CreateUserModal