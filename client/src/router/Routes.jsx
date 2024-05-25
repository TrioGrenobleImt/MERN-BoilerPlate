import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home/Home'
import Login from '../pages/Authentication/Login'
import Register from '../pages/Authentication/Register'

export const Router = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
    </Routes>
  )
}
