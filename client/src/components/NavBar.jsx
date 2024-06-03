import { Link } from 'react-router-dom'
import { useAuthContext } from '../contexts/authContext'

const NavBar = () => {
  const { authUser } = useAuthContext()
  return (
    <>
      <Link to='/'>Home</Link>

      {authUser ? (
        <Link to='/account'>Account</Link>
      ) : (
        <>
          <Link to='/login'>Login</Link>
          <Link to='/register'>Register</Link>
        </>
      )}
    </>
  )
}

export default NavBar
