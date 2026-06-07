import { getUsers } from '@/app/services/userServices'
import { useQuery } from '@tanstack/react-query'
import { PaginatedResponse, User,  } from '../_models/user.models'

const useGetUsers = () => {
  const fetchUsers = async () => {
    const response = await getUsers()
    return response.data
  }
  return useQuery<PaginatedResponse<User>>({
    queryKey: ['users'],
    queryFn: fetchUsers,
    refetchOnWindowFocus: false
  })
}

export default useGetUsers;
