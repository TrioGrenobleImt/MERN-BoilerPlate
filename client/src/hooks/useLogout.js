import axiosConfig from '../config/axiosConfig'

export const useLogout = () => {
  const [loading, setLoading] = useState(false)

  const logout = async () => {
    setLoading(true)
    try {
      const response = await axiosConfig.post('/auth/logout')
      const data = await response.data

      if (data.error) {
        throw new Error(data.error)
      }

      toast.success(data.message)
      setAuthUser(null)
      navigate('/')
    } catch (error) {
      return error
    } finally {
      setLoading(false)
    }
  }
  return { loading, logout }
}
