import { Link } from "react-router-dom";
import { useAuthContext } from "../../contexts/authContext";
import { LanguageChanger } from "./LanguageChanger";

export const NavBar = () => {
  const { authUser } = useAuthContext();

  return (
    <div className="flex flex-row h-24 gap-24">
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
      <LanguageChanger />
    </div>
  );
};
