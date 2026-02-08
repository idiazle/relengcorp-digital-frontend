export interface Property {
  name: string
  value: string
}

export type EntityType = 1 | 2 | 3 | 4 | 5 // 1: Planta, 2: Area, 3: Equipo, 4: Componente, 5: Subcomponente

export interface Plant {
  id?: number
  name: string
  tag: string
  type: EntityType
  parent?: number | null
  attachment?: File | null
  extra_info?: {
    description: string
    location?: string
  }
}

export interface Area {
  id?: number
  name: string
  tag: string
  type: EntityType
  parent?: number | null
  attachment?: File | null
  extra_info?: {
    description: string
    location?: string
  }
}

export interface Equipment {
  id?: number
  name: string
  tag: string
  type: EntityType
  parent?: number | null
  attachment?: File | null
  children: Equipment[]
  created_by?: string | null
  extra_info: {
    name_en?: string
    description?: string
    properties?: Property[]
  }
  deleted: boolean
}

export interface Component {
  id: number
  name: string
  tag: string
  type: EntityType
  parent: number
  attachment?: File | null
  extra_info?: {
    name_en?: string
    description: string
    properties?: Property[]
  }
}