export type ReportType = {
  id?: number;
  entity: number | string;
  name: string;
  attachment?: File[];
  program: number;
  service_type: number;
  task_type: number;
  execution_status: number;
  execution_date?: string;
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
  type: number
  attachment?: File
  parent?: number
  children?: Entity[]
  extra_info?: { tag: string, component?: boolean }
  deleted?: boolean
}

export type NoticesType = {
  id?: number;
  name : string; //numero de aviso
  date: string; //fecha de aviso
  status: number; //estado del aviso
  ot_status?: number; //estado de la ot relacionada
  ot_number?: string; //numero de la ot relacionada
  ot_date?: string; //fecha de la ot relacionada
  status_real?: number; //estado real del aviso despues de inspeccion en terreno
  comment?: string; //comentario adicional del estado real
  report: number; //id de reporte asociado
  created_by?: string; //usuario que creo el aviso
}