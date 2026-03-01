export interface User {
  id?: number
  code: string
  name: string
  last_name: string
  username: string
  dui: string
  short_name: string
  position?: string
  email: string
  phone: string
  extra_emails?: string
  groups: number[]
  password: string
  deleted?: boolean
  created_at?: string
  updated_at?: string
  deleted_at?: string
}

export interface Groups {
  id: number
  name: string
}


export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}