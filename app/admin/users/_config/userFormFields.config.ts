import type { FieldPath } from 'react-hook-form'
import type { User } from '../_models/user.models'

export interface UserFieldConfig {
  name: FieldPath<User>
  label: string
  placeholder: string
  type?: 'text' | 'email'
}

export const userFieldsConfig: UserFieldConfig[] = [
  { name: 'code', label: 'Código', placeholder: 'AUTH-000' },
  { name: 'dui', label: 'DUI', placeholder: 'DUI del usuario' },
  { name: 'name', label: 'Nombres', placeholder: 'Nombres del usuario' },
  { name: 'last_name', label: 'Apellidos', placeholder: 'Apellidos del usuario' },
  { name: 'short_name', label: 'Nombre corto', placeholder: 'Nombre corto del usuario' },
  { name: 'position', label: 'Posición', placeholder: 'Posición del usuario' },
  { name: 'email', label: 'Correo electrónico', placeholder: 'Correo electrónico del usuario', type: 'email' },
  { name: 'phone', label: 'Teléfono', placeholder: 'Teléfono del usuario' },
  { name: 'username', label: 'Usuario', placeholder: 'Usuario del usuario' }
]
