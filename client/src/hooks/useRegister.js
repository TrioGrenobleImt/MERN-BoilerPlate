import { useState } from 'react'
import axiosConfig from '../config/axiosConfig'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuthContext } from '../contexts/authContext'

export const useRegister = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { authUser, setAuthUser } = useAuthContext()

  const register = async ({ username, password, confirmPassword, email }) => {
    const success = handleInputsError(username, password, confirmPassword, email)
    if (!success) return
    setLoading(true)
    try {
      const response = await axiosConfig.post('/auth/register', {
        username,
        password,
        confirmPassword,
        email,
      })

      const data = await response.data
      if (data.error) {
        throw new Error(data.error)
      }

      toast.success(data.message)

      setAuthUser(data.user)
      navigate('/')
    } catch (error) {
      toast.error(error.response.data.error)
    } finally {
      setLoading(false)
    }
  }

  return { loading, register }
}

function handleInputsError(username, password, confirmPassword, email) {
  if (!username || !password || !confirmPassword || !email) {
    toast.error('Please fill in all fields')
    return false
  }

  if (password !== confirmPassword) {
    toast.error('Passwords do not match')
    return false
  }

  // Mettre regex mdp etc...

  return true
}
