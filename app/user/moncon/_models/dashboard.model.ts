export type PieItem = {
  name: string
  value: number
  fill?: string
}

export type CondCompItem = {
  name: string
  normal: number
  tolerable: number
  precaucion: number
  critico: number
}

export type CumplimientoItem = {
  name: string
  value: number
}

export type EqMonitoreoItem = {
  name: string
  mon: number
  no_mon: number
}

export type NoProgramWorksItem = {
  name: string
  value: number
}

export type HhDataItem = {
  name: string
  hh_programado: number
  hh_ejecutado: number
  hh_fuera_ruta: number
}

export type AvisosOtItem = {
  name: string
  avisos: number
  ot: number
}

export type AvisosOtCerrAbItem = {
  name: string
  abierto: number
  cerrado: number
}

export type DashboardData = {
  equipPie: PieItem[]
  condCompPercentage: CondCompItem[]
  cumplimiento: CumplimientoItem[]
  eqMonitoreo: EqMonitoreoItem[]
  noProgramWorks: NoProgramWorksItem[]
  hhData: HhDataItem[]
  avisosOt: AvisosOtItem[]
  avisosOtCerrAb: AvisosOtCerrAbItem[]
}
