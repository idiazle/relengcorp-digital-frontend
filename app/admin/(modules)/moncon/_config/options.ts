export const services = [
  { id: 1, name: "Vibraciones y Temperatura", parent_id: 1 },
  { id: 2, name: "Alineamiento de Ejes", parent_id: 1 },
  { id: 3, name: "Termografía infrarroja", parent_id: 1 },
  { id: 4, name: "Ultrasonido Convencional", parent_id: 2 },
  { id: 5, name: "Tintes penetrantes", parent_id: 2 },
  { id: 6, name: "Ultrasonido avanzado", parent_id: 2 },
  { id: 7, name: "Metrología", parent_id: 2 },
  { id: 8, name: "Inspección visual", parent_id: 2 },
]

export const works = [
  {
    id: 1,
    name: "PDM",
    service_types: [1, 2, 3, 8]
  },
  {
    id: 2,
    name: "NDT",
    service_types: [4, 5, 6, 7, 8]
  },
]

export const typeServiceOptions = [
  { id: 1, name: 'PDM PTAE' },
  { id: 2, name: 'PDM Antapaccay' },
  { id: 3, name: 'NDT PTAE' },
  { id: 4, name: 'NDT Antapaccay' },
  { id: 5, name: 'NDT Tintaya' },
];


export const tareaTypeOptions = [
  { id: 1, name: 'Vibraciones y Temperatura' },
  { id: 2, name: 'Alineamiento de ejes' },
  { id: 3, name: 'Alineamiento de poleas' },
  { id: 4, name: 'Ultrasonido acústico' },
  { id: 5, name: 'Termografía infrarroja' },
  { id: 6, name: 'Fuga de corriente' },
  { id: 7, name: 'Vibraciones fases' },
  { id: 8, name: 'Vibraciones ODS' },
  { id: 9, name: 'Vibraciones Pump Test' },
  { id: 10, name: 'Ultrasonido convencional' },
  { id: 11, name: 'Tintes penetrantes' },
  { id: 12, name: 'Partículas magnéticas' },
  { id: 13, name: 'Ultrasonido avanzado' },
  { id: 14, name: 'Metrología' },
  { id: 15, name: 'Inspección visual' },
]