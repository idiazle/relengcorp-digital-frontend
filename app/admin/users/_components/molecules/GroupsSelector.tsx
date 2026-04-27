import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Controller, type Control } from 'react-hook-form'
import type { Groups, User } from '../../_models/user.models'

interface GroupsSelectorProps {
  groups: Groups[]
  control: Control<User>
  disabled?: boolean
}

const GroupsSelector = ({ groups, control, disabled = false }: GroupsSelectorProps) => {
  return (
    <div className='flex flex-row items-center gap-2'>
      <Label className='font-bold'>Grupos:</Label>
      {groups.length === 0 ? (
        <p className='text-sm text-gray-500'>No se pudieron cargar los grupos</p>
      ) : (
        <div className='flex flex-col gap-2 bg-white p-2 rounded-md w-full'>
          {groups.map((group) => (
            <div key={group.id} className='flex gap-3'>
              <Controller
                name='groups'
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id={`group-${group.id}`}
                    className='bg-white'
                    disabled={disabled}
                    checked={field.value?.includes(group.id)}
                    onCheckedChange={(checked) => {
                      const currentValue = field.value || []
                      if (checked) {
                        field.onChange([...currentValue, group.id])
                      } else {
                        field.onChange(currentValue.filter((g) => g !== group.id))
                      }
                    }}
                  />
                )}
              />
              <Label htmlFor={`group-${group.id}`}>{group.name}</Label>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default GroupsSelector
