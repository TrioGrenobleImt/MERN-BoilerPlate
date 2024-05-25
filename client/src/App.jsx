import { BrowserRouter } from 'react-router-dom'
import NavBar from './components/NavBar.jsx'
import { Router } from './router/Routes.jsx'

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Router />
    </BrowserRouter>
  )
}

export default App
