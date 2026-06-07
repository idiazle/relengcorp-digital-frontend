import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { UseFormRegisterReturn } from 'react-hook-form'

interface EntityFileFieldProps {
  label: string
  disabled?: boolean
  register: UseFormRegisterReturn
  accept?: string
}

const EntityFileField = ({
  label,
  disabled = false,
  register,
  accept = '.pdf,.doc,.docx,.xls,.xlsx'
}: EntityFileFieldProps) => {
  return (
    <div className="flex flex-col gap-1">
      <Label>{label}</Label>
      <Input
        {...register}
        disabled={disabled}
        type="file"
        accept={accept}
        className="bg-white cursor-pointer"
      />
    </div>
  )
}

export default EntityFileField
