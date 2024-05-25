import { Link } from 'react-router-dom'

const NavBar = () => {
  return (
    <>
      <Link to='/'>Home</Link>
      <Link to='/login'>Login</Link>
      <Link to='/register'>Register</Link>
    </>
  )
}

export default NavBar
