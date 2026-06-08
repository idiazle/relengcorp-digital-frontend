import { EquipmentListData } from "../../_models/EquipmentList.model"

export type EquipmentListResponse = {
  status: string,
  message: string,
  timestamp: string,
  data: EquipmentListData
}
  