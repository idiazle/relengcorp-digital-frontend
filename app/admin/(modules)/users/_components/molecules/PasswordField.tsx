import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { IoReload } from 'react-icons/io5'
import { FaEye, FaEyeSlash } from 'react-icons/fa6'
import type { UseFormRegisterReturn } from 'react-hook-form'

interface PasswordFieldProps {
  register: UseFormRegisterReturn
  disabled?: boolean
  viewPassword: boolean
  onToggleViewPassword: () => void
  onGeneratePassword: () => void
}

const PasswordField = ({
  register,
  disabled = false,
  viewPassword,
  onToggleViewPassword,
  onGeneratePassword
}: PasswordFieldProps) => {
  return (
    <div className='flex flex-row justify-center items-center gap-2'>
      <Label className='font-bold'>Contraseña:</Label>
      <Input
        {...register}
        disabled={disabled}
        type={viewPassword ? 'text' : 'password'}
        placeholder='Contraseña del usuario'
        className='bg-white'
      />
      {!disabled && (
        <>
          <Button type='button' variant='outline' onClick={onToggleViewPassword}>
            {viewPassword ? <FaEyeSlash /> : <FaEye />}
          </Button>
          <Button type='button' onClick={onGeneratePassword} variant='outline'>
            <IoReload />
          </Button>
        </>
      )}
    </div>
  )
}

export default PasswordField
