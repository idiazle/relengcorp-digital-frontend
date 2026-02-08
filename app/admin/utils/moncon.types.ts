export interface Report {
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

/* {
        -"id": 2,
        -"entity": 4,
        -"name": "",
        -"execution_date": "2025-11-28T00:00:00Z",
        -"program": 1,
        -"service_type": null,
        -"task_type": 1,
        -"execution_status": 1
        -"observations": "",
        -"condition": 2,
        -"attachment": "/media/reports/2/AV_R723_22082024_120-PMP-OI_001A_PRECAUCION.pdf",
        -"diagnostic": "Revision de pernos completa",
        -"recomendations": "",
        -"created_by": null,
        -"deleted": false,
        "created_at": "2025-10-01T17:15:55.005799Z",
        "deleted_at": null,
        "updated_at": "2025-11-26T20:00:48.866214Z"
    }, */