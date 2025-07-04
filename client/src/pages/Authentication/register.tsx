import { getRegisterSchema } from "@/lib/zod/schemas/auth/zod";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";
import { useAuthContext } from "@/contexts/authContext";
import { axiosConfig } from "@/config/axiosConfig";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { RegisterForm } from "@/components/customs/registerForm";
import { Link } from "react-router-dom";

export const Register = () => {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setAuthUser } = useAuthContext();
  const { t } = useTranslation();

  const registerSchema = getRegisterSchema(t);

  async function register(values: z.infer<typeof registerSchema>) {
    try {
      setLoading(true);
      const response = await axiosConfig.post("/auth/register", values);
      toast.success(t(response.data.message));
      setAuthUser(response.data.user);
      localStorage.setItem("accessToken", response.data.accessToken);
      navigate("/");
    } catch (error: any) {
      toast.error(t(error.response.data.error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <RegisterForm onSubmit={register} disabledFields={[]} loading={loading} oauth={true} />
    </>
  );
};
