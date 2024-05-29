import { useState } from 'react'
import axiosConfig from '../config/axiosConfig'
import { useAuthContext } from '../contexts/authContext'
import toast from 'react-hot-toast'

export const useLogout = () => {
  const [loading, setLoading] = useState(false)
  const { authUser, setAuthUser } = useAuthContext()

  const logout = async () => {
    setLoading(true)
    try {
      const response = await axiosConfig.get('/auth/logout')
      const data = await response.data

      if (data.error) {
        throw new Error(data.error)
      }

      toast.success(data.message)
      setAuthUser(null)
      navigate('/')
    } catch (error) {
      toast.error(error.response.data.error)
    } finally {
      setLoading(false)
    }
  }
  return { loading, logout }
}
