import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Controller } from 'react-hook-form'
import type { Control, FieldValues, Path } from 'react-hook-form'

interface SelectOption {
  id: string | number
  label: string
}

interface EntitySelectFieldProps<T extends FieldValues> {
  label: string
  placeholder: string
  name: Path<T>
  control: Control<T>
  options: SelectOption[]
  disabled?: boolean
  required?: boolean
  onValueChange?: (value: string) => void
}

const EntitySelectField = <T extends FieldValues>({
  label,
  placeholder,
  name,
  control,
  options,
  disabled = false,
  required = false,
  onValueChange
}: EntitySelectFieldProps<T>) => {
  return (
    <div className="flex flex-col gap-1">
      <Label>{label}{required && '(*)'}</Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            value={field.value ? String(field.value) : ''}
            onValueChange={(value) => {
              field.onChange(value === '' ? null : parseInt(value))
              onValueChange?.(value)
            }}
            disabled={disabled}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.id} value={String(option.id)}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </div>
  )
}

export default EntitySelectField
