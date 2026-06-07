export type EquipmentListItem = {
  id: number
  name: string
  status: string
  lastMaintenance: string
  nextMaintenance: string
}

export type EquipmentListData = {
  data: EquipmentListItem[]
}