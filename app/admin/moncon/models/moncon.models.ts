import { User } from "../../users/models/user.models";

export interface Report {
    id: number;
    entity: number;
    entity_detail: string | null;
    name: string | null;
    execution_date: string | null;
    program: number;
    service_type: number;
    work_type: number;
    execution_status: number;
    observations: string;
    condition: number;
    attachment: string | null;
    diagnostic: string | null;
    recomendations: string | null;
    created_by: User | null;
    is_active: boolean;
    deleted: boolean;
    created_at: string;
    deleted_at: string | null;
    updated_at: string;
}

export interface ReportFormData {
  entity: number
  program: number
  service_type: number
  task_type: number
  execution_status: number
  condition: number
  observations: string
  area?: number
  equipment?: number
  component?: number
}

export const services = [
  { id: 1, name: "Vibraciones y Temperatura" },
  { id: 2, name: "Alineamiento de Ejes" },
  { id: 3, name: "Termografía infrarroja" },
  { id: 4, name: "Ultrasonido Convencional" },
  { id: 5, name: "Tintes penetrantes" },
  { id: 6, name: "Ultrasonido avanzado" },
  { id: 7, name: "Metrología" },
  { id: 8, name: "Inspección visual" },
]

export const works = [
  { id: 1, name: "PDM" },
  { id: 2, name: "NDT" },
]



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
