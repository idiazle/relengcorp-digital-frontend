import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { UseFormRegisterReturn } from 'react-hook-form'

interface FieldRowProps {
  label: string
  placeholder: string
  disabled?: boolean
  type?: 'text' | 'password' | 'email'
  register: UseFormRegisterReturn
}

const FieldRow = ({
  label,
  placeholder,
  disabled = false,
  type = 'text',
  register
}: FieldRowProps) => {
  return (
    <div className='flex flex-row justify-center items-center gap-2'>
      <Label className='font-bold'>{label}:</Label>
      <Input
        {...register}
        disabled={disabled}
        type={type}
        placeholder={placeholder}
        className='bg-white'
      />
    </div>
  )
}

export default FieldRow
