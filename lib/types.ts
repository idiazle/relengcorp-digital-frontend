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
  recommendations?: string;
  created_by?: number;
  deleted?: string;
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