import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { UseFormRegisterReturn } from 'react-hook-form'

interface EntityFieldRowProps {
  label: string
  placeholder: string
  disabled?: boolean
  type?: 'text' | 'email' | 'number'
  register: UseFormRegisterReturn
  required?: boolean
}

const EntityFieldRow = ({
  label,
  placeholder,
  disabled = false,
  type = 'text',
  register,
  required = false
}: EntityFieldRowProps) => {
  return (
    <div className="flex flex-col gap-1">
      <Label>{label}{required && '(*)'}</Label>
      <Input
        {...register}
        disabled={disabled}
        type={type}
        placeholder={placeholder}
        className="bg-white"
      />
    </div>
  )
}

export default EntityFieldRow
