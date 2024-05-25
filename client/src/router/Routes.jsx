import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from '../pages/Home/Home'
import Login from '../pages/Authentication/Login'
import Register from '../pages/Authentication/Register'
import Account from '../pages/Account/Account'
import { useAuthContext } from '../contexts/authContext'

export const Router = () => {
  const { authUser } = useAuthContext()

  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/register' element={authUser ? <Navigate to={'/'} /> : <Register />} />
      <Route path='/login' element={authUser ? <Navigate to={'/'} /> : <Login />} />
      <Route path='/account' element={!authUser ? <Navigate to={'/login'} /> : <Account />} />
    </Routes>
  )
}
