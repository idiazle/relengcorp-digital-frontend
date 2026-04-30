import { Entity } from "../../entities/_models/entity.model";
import { User } from "../../users/_models/user.models";

export interface Report {
    id: number;
    entity: number;
    parents?: Entity[];
    name: string | null;
    execution_date?: string | null;
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
