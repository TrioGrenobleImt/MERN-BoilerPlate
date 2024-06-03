import React from 'react'
import { useLogout } from '../../hooks/useLogout'
import { useAuthContext } from '../../contexts/authContext'

const Account = () => {
  const { logout, loading } = useLogout()
  const { authUser } = useAuthContext()

  const handleClick = async (e) => {
    e.preventDefault()
    await logout()
  }

  return (
    <div>
      <h1>User informations</h1>

      <p>Username: {authUser.username}</p>
      <p>Email: {authUser.email}</p>

      <button onClick={handleClick} disabled={loading}>
        Logout
      </button>
    </div>
  )
}

export default Account
