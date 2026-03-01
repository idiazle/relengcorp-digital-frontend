export interface User {
  id?: number;
  code: string;
  name: string;
  last_name: string;
  username: string;
  dui: string;
  short_name: string;
  position: string;
  email: string;
  password: string;
  phone: string;
  extra_emails?: string;
  deleted: boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface Entity {
  id?: number
  name: string
  type: number
  attachment?: File
  parent?: number
  children?: Entity[]
  extra_info?: { tag: string, component?: boolean }
  deleted?: boolean
}

export interface Report {
  id?: number;
  entity: number | string;
  entity_detail?: {
    plant?: { name: string; tag: string };
    area?: { name: string; tag: string };
    equipment?: { name: string; tag: string };
    current?: { name: string; tag: string };
  };
  name: string;
  program: number;
  service_type: number;
  task_type: number;
  execution_status: number;
  execution_date?: string;
  observations?: string;
  condition: number;
  diagnostic?: string;
  recomendations?: string;
  is_active?: boolean;
  attachment?: File[];
  created_by?: number;
  deleted?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface Notices {
  id?: number;
  name: string;
  date: string;
  status: number;
  ot_status?: number;
  ot_number?: string;
  ot_date?: string;
  status_real?: number;
  comment?: string;
  report: number;
  created_by?: string;
}

export const tareas = [
  { id: 1, name: "Vibraciones y Temperatura" },
  { id: 2, name: "Alineamiento de Ejes" },
  { id: 3, name: "Alineamiento de Poleas" },
  { id: 4, name: "Ultrasonido acústico" },
  { id: 5, name: "Termografía infrarroja" },
  { id: 6, name: "Fuga de corriente" },
  { id: 7, name: "Vibraciones fases" },
  { id: 8, name: "Vibraciones ODS" },
  { id: 9, name: "Vibraciones Pump Test" },
  { id: 10, name: "Ultrasonido Convencional" },
  { id: 11, name: "Tintes penetrantes" },
  { id: 12, name: "Partículas magnéticas" },
  { id: 13, name: "Ultrasonido avanzado" },
  { id: 14, name: "Metrología" },
  { id: 15, name: "Inspección visual" },
]

export const services = [
  { id: 1, name: "PDM PTAE" },
  { id: 2, name: "PDM Antapaccay" },
  { id: 5, name: "PDM PTAE" },
  { id: 4, name: "NDT Antapaccay" },
  { id: 3, name: "NDT Tintaya" },
]