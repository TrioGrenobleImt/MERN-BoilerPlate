import { useState } from "react";
import axiosConfig from "../config/axiosConfig";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuthContext } from "../contexts/authContext";

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuthUser } = useAuthContext();

  const login = async ({ username, password }: { username: string; password: string }) => {
    const success = handleInputsError(username, password);
    if (!success) return;
    setLoading(true);
    try {
      const response = await axiosConfig.post("/auth/login", {
        username,
        password,
      });

      const data = await response.data;
      if (data.error) {
        throw new Error(data.error);
      }

      toast.success(data.message);

      setAuthUser(data.user);
      navigate("/");
    } catch (error: any) {
      toast.error(error.response.data.error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, login };
};

function handleInputsError(username: String, password: String) {
  if (!username || !password) {
    toast.error("Please fill in all fields");
    return false;
  }

  // Mettre regex mdp etc...

  return true;
}
