import { useState } from "react";
import { axiosConfig } from "../config/axiosConfig";
import { useAuthContext } from "../contexts/authContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const useLogout = () => {
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setAuthUser } = useAuthContext();

  const logout = async () => {
    setLoading(true);
    try {
      const response = await axiosConfig.get("/auth/logout");
      localStorage.removeItem("accessToken");
      setAuthUser(null);
      navigate("/login");
      toast.success(t(response.data.message));
    } catch (error: any) {
      toast.error(t(error.response.data.error));
    } finally {
      setLoading(false);
    }
  };
  return { loading, logout };
};
