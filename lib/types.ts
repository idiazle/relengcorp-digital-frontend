export type ReportType = {
  id?: number;
  entity: number | string;
  name: string;
  attachment?: File[];
  program: number;
  program_date: string;
  task_type: number;
  execution_status: number;
  execution_date: string;
  observations?: string;
  condition: number;
  diagnostic?: string;
  recomendations?: string;
  created_by?: number;
  deleted?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export type Entity = {
  id: number
  name: string
  type: string
  attachment?: File
  parent?: number
  children?: Entity[]
  extra_info?: string
  deleted?: boolean
}