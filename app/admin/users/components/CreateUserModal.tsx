import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { IoReload } from 'react-icons/io5'
import { FaEye, FaEyeSlash } from 'react-icons/fa6'
import { Checkbox } from '@/components/ui/checkbox'
import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { createUser, getUserGroups } from '@/app/services/userServices'
import { generateRandomPassword } from '../utils/utils'
import type { Groups, User } from '../models/user.models'

interface CreateUserModalProps {
  openModal: boolean
  setOpenModal: (open: boolean) => void
  onUserCreated: () => void
}

const CreateUserModal = ({ openModal, setOpenModal, onUserCreated }: CreateUserModalProps) => {
  const [viewPassword, setViewPassword] = useState<boolean>(false);
  const [groups, setGroups] = useState<Groups[]>([]);

  useEffect(() => {
    getUserGroups()
      .then((response) => {
        setGroups(response.data);
      })
      .catch((error) => {
        console.error('Error fetching user groups:', error);
      });
  }, []);

  const { register, control, handleSubmit, reset, setValue,  } = useForm<User>({
    defaultValues: {
      code: '',
      dui: '',
      name: '',
      last_name: '',
      short_name: '',
      email: '',
      phone: '',
      username: '',
      password: '',
      position: '',
      groups: []
    }
  });

  const handleClose = () => {
    reset();
    setOpenModal(false);
  }

  const onSubmit = async (data: User) => {
    try {
      await createUser(data);
      console.log('Usuario creado exitosamente');
      handleClose();
      onUserCreated();
    } catch (error) {
      console.error('Error al crear usuario:', error);
    }
  }

  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogContent className='bg-slate-200'>
        <DialogHeader>
          <DialogTitle className='font-bold'>CREAR USUARIO</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={
            handleSubmit(onSubmit,
              (errors) => {
                console.error('Form errors:', errors);
              })}
          className='flex flex-col gap-4'>
          <div className='flex flex-col gap-2'>
            <div className='flex flex-row justify-center items-center gap-2'>
              <Label className='font-bold'>Código:</Label>
              <Input
                {...register('code')}
                placeholder='AUTH-000' className='bg-white' />
            </div>
            <div className='flex flex-row justify-center items-center gap-2'>
              <Label className='font-bold'>DUI:</Label>
              <Input
                {...register('dui')}
                placeholder='DUI del usuario' className='bg-white' />
            </div>
            <div className='flex flex-row justify-center items-center gap-2'>
              <Label className='font-bold'>Nombres:</Label>
              <Input
                {...register('name')}
                placeholder='Nombres del usuario' className='bg-white' />
            </div>
            <div className='flex flex-row justify-center items-center gap-2'>
              <Label className='font-bold'>Apellidos:</Label>
              <Input
                {...register('last_name')}
                placeholder='Apellidos del usuario' className='bg-white' />
            </div>
            <div className='flex flex-row justify-center items-center gap-2'>
              <Label className='font-bold'>Nombre corto:</Label>
              <Input
                {...register('short_name')}
                placeholder='Nombre corto del usuario' className='bg-white' />
            </div>
            <div className='flex flex-row justify-center items-center gap-2'>
              <Label className='font-bold'>Posición:</Label>
              <Input
                {...register('position')}
                placeholder='Posición del usuario' className='bg-white' />
            </div>
            <div className='flex flex-row justify-center items-center gap-2'>
              <Label className='font-bold'>Correo electrónico:</Label>
              <Input
                {...register('email')}
                placeholder='Correo electrónico del usuario' className='bg-white' />
            </div>
            <div className='flex flex-row justify-center items-center gap-2'>
              <Label className='font-bold'>Teléfono:</Label>
              <Input
                {...register('phone')}
                placeholder='Teléfono del usuario' className='bg-white' />
            </div>
            <div className='flex flex-row justify-center items-center gap-2'>
              <Label className='font-bold'>Usuario:</Label>
              <Input
                {...register('username')}
                placeholder='Usuario del usuario' className='bg-white' />
            </div>
            <div className='flex flex-row justify-center items-center gap-2'>
              <Label className='font-bold'>Contraseña:</Label>
              <Input
                {...register('password')}
                type={viewPassword ? 'text' : 'password'} placeholder='Contraseña del usuario' className='bg-white' />
              <Button type='button' variant='outline' onClick={() => setViewPassword(!viewPassword)}>
                {viewPassword ? <FaEyeSlash /> : <FaEye />}
              </Button>
              <Button
                type='button'
                onClick={() => {
                  const newPassword = generateRandomPassword();
                  setValue('password', newPassword);
                }}
                variant='outline'><IoReload /></Button>
            </div>
            <div className='flex flex-row items-center gap-2'>
              <Label className='font-bold'>Grupos:</Label>
              {
                groups.length === 0 ? <p className='text-sm text-gray-500'>No se pudieron cargar los grupos</p> :
                  <div className='flex flex-col gap-2 bg-white p-2 rounded-md w-full'>
                    {groups.map((group) => (
                      <div key={group.id} className="flex gap-3">
                        <Controller
                          name="groups"
                          control={control}
                          render={({ field }) => (
                            <Checkbox
                              id={`group-${group.id}`}
                              className='bg-white'
                              checked={field.value?.includes(group.id)}
                              onCheckedChange={(checked) => {
                                const currentValue = field.value || [];
                                if (checked) {
                                  field.onChange([...currentValue, group.id]);
                                } else {
                                  field.onChange(currentValue.filter((g) => g !== group.id));
                                }
                              }}
                            />
                          )}
                        />
                        <Label htmlFor={`group-${group.id}`}>{group.name}</Label>
                      </div>
                    ))}
                  </div>
              }
            </div>
          </div>
          <DialogFooter>
            <Button
              type='button'
              variant='destructive'
              onClick={handleClose}>
              Cancelar
            </Button>
            <Button type='submit'>Guardar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateUserModal