import { useQuery } from '@tanstack/react-query'
import { getEntities } from '@/app/_services/entitiesServices'
import type { Entity } from '../../entities/_models/entity.model'

const useMonconEntities = () => {
  return useQuery({
    queryKey: ['monconEntities'],
    queryFn: async () => {
      const response = await getEntities()
      return (response.data?.results ?? response.data ?? []) as Entity[]
    },
    refetchOnWindowFocus: false,
  })
}

export default useMonconEntities