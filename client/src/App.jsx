import { BrowserRouter } from 'react-router-dom'
import NavBar from './src/components/NavBar.jsx'
import { Router } from './src/router/Routes.jsx'

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Router />
    </BrowserRouter>
  )
}

export default App
