import { createContext, useContext, useEffect, useState } from 'react'
import axiosConfig from '../config/axiosConfig'

const AuthContext = createContext()

export const useAuthContext = () => {
  return useContext(AuthContext)
}

export const AuthContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null)

  useEffect(() => {
    const getAuthUser = async () => {
      try {
        const response = await axiosConfig('/auth/me')
        if (response.data) {
          setAuthUser(response.data)
        }
      } catch (error) {
        setAuthUser(null)
      }
    }
    getAuthUser()
  }, [])

  return <AuthContext.Provider value={{ authUser, setAuthUser }}>{children}</AuthContext.Provider>
}
