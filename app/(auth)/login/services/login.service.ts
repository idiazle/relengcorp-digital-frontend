import axios from 'axios'

export type LoginServiceError = {
  status: number
  message: string
}

export const login = async (username: string, password: string) => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      username,
      password
    })
    return response
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const serviceError: LoginServiceError = {
        status: error.response?.status || 500,
        message: error.response?.data?.message || 'No se pudo iniciar sesion'
      }

      throw serviceError
    }

    throw {
      status: 500,
      message: 'Ocurrio un error inesperado'
    } as LoginServiceError
  }
}