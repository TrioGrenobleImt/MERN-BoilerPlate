import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { axiosConfig } from "@/config/axiosConfig";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useAuthContext } from "@/contexts/authContext";

export const useAxiosInterceptor = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { setAuthUser } = useAuthContext();

  useEffect(() => {
    const interceptor = axiosConfig.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          const path = location.pathname;

          if (path !== "/login" && path !== "/register" && path !== "/register/google") {
            setAuthUser(null);

            navigate("/login");
          }
        }
        return Promise.reject(error);
      },
    );

    return () => {
      axiosConfig.interceptors.response.eject(interceptor);
    };
  }, [navigate, location]);
};
