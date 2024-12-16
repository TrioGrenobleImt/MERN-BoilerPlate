import { Link } from "react-router-dom";
import { useAuthContext } from "../contexts/authContext";

const NavBar = () => {
  const { authUser } = useAuthContext();

  // if (loading) {
  //   return <Loading />;
  // }

  return (
    <>
      <Link to="/">Home</Link>

      {authUser ? (
        <Link to="/account">Account</Link>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </>
  );
};

export default NavBar;
