import { useQuery } from '@tanstack/react-query'
import { getMonconReports } from '@/app/services/monconServices'
import type { Report } from '../_models/moncon.model'

const useMonconReports = () => {
  return useQuery({
    queryKey: ['monconReports'],
    queryFn: async () => {
      const response = await getMonconReports()
      return (response.data?.results ?? response.data ?? []) as Report[]
    },
    refetchOnWindowFocus: false,
  })
}

export default useMonconReports
