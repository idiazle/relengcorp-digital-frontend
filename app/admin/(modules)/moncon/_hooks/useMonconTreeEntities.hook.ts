import { useQuery } from '@tanstack/react-query'
import { getTreeEntities } from '@/app/_services/entitiesServices'
import type { Entity } from '../../(modules)/entities/_models/entity.model'

const useGetTreeEntities = () => {
  return useQuery({
    queryKey: ['monconTreeEntities'],
    queryFn: async () => {
      const response = await getTreeEntities()
      return (response.data ?? response.data ?? []) as Entity[]
    },
    refetchOnWindowFocus: false,
  })
}

export default useGetTreeEntities
