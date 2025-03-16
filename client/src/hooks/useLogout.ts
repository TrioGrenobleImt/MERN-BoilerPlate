import { useState } from "react";
import axiosConfig from "../config/axiosConfig";
import { useAuthContext } from "../contexts/authContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const useLogout = () => {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setAuthUser } = useAuthContext();

  const logout = async () => {
    setLoading(true);
    try {
      const response = await axiosConfig.get("/auth/logout");
      const data = await response.data;

      if (data.error) {
        throw new Error(data.error);
      }

      toast.success(data.message);
      setAuthUser(null);
      navigate("/");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  return { loading, logout };
};
