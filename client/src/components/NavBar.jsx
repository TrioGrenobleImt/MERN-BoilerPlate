import { Link } from "react-router-dom";
import { useAuthContext } from "../contexts/authContext";

export const NavBar = () => {
  const { authUser } = useAuthContext();

  return (
    <>
      <Link to="/">Home</Link>
      {authUser ? (
        <>
          <Link to="/account">Account</Link>
          {authUser.role === "admin" && <Link to="/admin">Dashboard</Link>}
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </>
  );
};
