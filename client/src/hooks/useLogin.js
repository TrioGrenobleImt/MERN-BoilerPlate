import { useState } from 'react'
import axiosConfig from '../config/axiosConfig'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export const useLogin = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  // Declare the useAuthContext hook and extract the setAuthUser functions

  const login = async ({ username, password }) => {
    const success = handleInputsError(username, password)
    if (!success) return
    setLoading(true)
    try {
      const response = await axiosConfig.post('/auth/login', {
        username,
        password,
      })

      const data = await response.data
      if (data.error) {
        throw new Error(data.error)
      }

      toast.success(data.message)
      navigate('/')

      //Store the user
      // setAuthUser(data.user)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return { loading, login }
}

function handleInputsError(username, password) {
  if (!username || !password) {
    toast.error('Please fill in all fields')
    return false
  }

  // Mettre regex mdp etc...

  return true
}
