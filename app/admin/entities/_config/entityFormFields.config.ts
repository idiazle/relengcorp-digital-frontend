export interface EntityFieldConfig {
  name: 'tag' | 'name'
  label: string
  placeholder: string
  type: 'text' | 'email' | 'number'
  required: boolean
}

export const entityFormFieldsConfig: EntityFieldConfig[] = [
  {
    name: 'tag',
    label: 'TAG',
    placeholder: 'Ingrese el tag de la entidad',
    type: 'text',
    required: true
  },
  {
    name: 'name',
    label: 'Nombre de planta/área',
    placeholder: 'Ingrese el nombre de la entidad',
    type: 'text',
    required: true
  }
]
