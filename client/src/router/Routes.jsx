import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from '../pages/Home/Home'
import Login from '../pages/Authentication/Login'
import Register from '../pages/Authentication/Register'
import Account from '../pages/Account/Account'

export const Router = () => {
  //Implement a user authentication check
  const user = true
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/register' element={user ? <Navigate to={'/'} /> : <Register />} />
      <Route path='/login' element={user ? <Navigate to={'/'} /> : <Login />} />
      <Route path='/account' element={!user ? <Navigate to={'/login'} /> : <Account />} />
    </Routes>
  )
}
