import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/*' element={<h1>hello World</h1>} />
      </Routes>
    </BrowserRouter>
  )
}
