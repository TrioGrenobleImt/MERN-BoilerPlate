import { useState } from 'react'
import axiosConfig from '../config/axiosConfig'
import { useAuthContext } from '../contexts/authContext'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export const useLogout = () => {
  const [loading, setLoading] = useState(false)
  const { setAuthUser } = useAuthContext()
  const navigate = useNavigate()

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
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }
  return { loading, logout }
}
