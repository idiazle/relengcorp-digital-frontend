import { DashboardData } from "../../_models/dashboard.model"

export type DashboardResponse = {
  status: string,
  message: string,
  timestamp: string,
  data: DashboardData
}
