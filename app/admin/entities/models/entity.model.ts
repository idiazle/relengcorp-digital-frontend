export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface Entity {
  id?: number
  name: string,
  type: number,
  tag: string,
  attachment: string,
  parent: number,
  extra_info: null,
  deleted: boolean,
  created_at?: string
  updated_at?: string
  deleted_at?: string
}