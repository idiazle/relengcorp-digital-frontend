import { useQuery } from '@tanstack/react-query'
import { getDashboard } from '../_services/getDashboard.service'

export const useGetDashboard = (codeArea: string) => {
  const query = useQuery({
    queryKey: ['dashboard', codeArea],
    queryFn: () => getDashboard(codeArea),
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