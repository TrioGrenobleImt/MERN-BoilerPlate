import React, { useState } from "react";
import { useRegister } from "../../hooks/useRegister";

const Register = () => {
  const { loading, register } = useRegister();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    register({ username, password, confirmPassword, email });
  };

  return (
    <>
      <form action="submit">
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm password"
        />
        <button type="submit" onClick={handleSubmit} disabled={loading}>
          Register
        </button>
      </form>
    </>
  );
};

export default Register;
