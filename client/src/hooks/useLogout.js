import axiosConfig from '../config/axiosConfig'

const useLogout = async () => {
  try {
    const response = await axiosConfig.post('/auth/logout')
    return response.data
  } catch (error) {
    return error
  }
}

export { useLogout }
