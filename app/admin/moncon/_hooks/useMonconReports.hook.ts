import { useQuery } from '@tanstack/react-query'
import { getMonconReports } from '@/app/services/monconServices'
import type { Report } from '../_models/moncon.model'

interface PaginatedResponse {
  results: Report[]
  total: number
  page: number
  limit: number
  next: string | null
  previous: string | null
}

const useMonconReports = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['monconReports', page, limit],
    queryFn: async () => {
      const response = await getMonconReports(page, limit)
      const data = response.data
      return {
        results: (data?.results ?? []) as Report[],
        total: data?.count ?? 0,
        page: page,
        limit: limit,
        next: data?.next ?? null,
        previous: data?.previous ?? null
      } as PaginatedResponse
    },
    refetchOnWindowFocus: false,
  })
}

export default useMonconReports
export type { PaginatedResponse }
