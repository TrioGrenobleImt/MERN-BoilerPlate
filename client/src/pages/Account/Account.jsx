import React from 'react'
import { useLogout } from '../../hooks/useLogout'

const Account = () => {
  const { logout, loading } = useLogout()

  const handleClick = async (e) => {
    e.preventDefault()
    await logout()
  }

  return (
    <div>
      <h1>Hello from Account</h1>
      <button onClick={handleClick} disabled={loading}>
        Logout
      </button>
    </div>
  )
}

export default Account
