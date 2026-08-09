import { useQuery } from '@tanstack/react-query'
import { getDashboard } from '../_services/getDashboard.service'

export const useGetDashboard = (codeArea: number, workType: number) => {
  const query = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => getDashboard({ codeArea, workType }),
    // enabled: false, // Se comenta o elimina para que la carga sea automática
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  })

  return {
    data: query.data, // Accedemos directamente a DashboardData dentro de DashboardResponse
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}