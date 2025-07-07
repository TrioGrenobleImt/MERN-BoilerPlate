import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { getLoginSchema } from "@/lib/zod/schemas/auth/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useAuthContext } from "@/contexts/authContext";
import { axiosConfig } from "@/config/axiosConfig";
import { toast } from "sonner";
import { useConfigContext } from "@/contexts/configContext";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { OAuth } from "@/components/customs/oauth";

export const Login = () => {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { t } = useTranslation();
  const { setAuthUser } = useAuthContext();

  const loginSchema = getLoginSchema(t);
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      loginName: "",
      password: "",
    },
  });

  async function login(values: z.infer<typeof loginSchema>) {
    try {
      setLoading(true);

      const isEmail = /\S+@\S+\.\S+/.test(values.loginName);
      const payload = {
        password: values.password,
        ...(isEmail ? { email: values.loginName } : { username: values.loginName }),
      };
      const response = await axiosConfig.post("/auth/login", payload);

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

  const { getConfigValue } = useConfigContext();
  const [configValues, setConfigValues] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchConfigValues = async () => {
      const values = await getConfigValue(["APP_NAME"]);
      setConfigValues(values);
    };

    fetchConfigValues();
  }, [getConfigValue]);

  return (
    <div className="flex flex-col items-center justify-center min-h-svh gap-6 px-2 py-4 md:px-10 md:py-10">
      <div className="flex items-center self-center gap-2 text-3xl font-medium sm:text-4xl text-accent">{configValues["APP_NAME"]}</div>
      <div className="flex flex-col w-full max-w-md gap-6 bg-background p-4 md:p-8 lg:rounded-2xl lg:shadow">
        <div className="text-center">
          <h1 className="text-xl md:text-2xl font-semibold">{t("pages.login.welcome_back")}</h1>
        </div>
        <div className="flex flex-col items-center gap-6">
          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(login)} className="w-full space-y-4">
              <FormField
                control={loginForm.control}
                name="loginName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("pages.login.field")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>{t("pages.login.field_description")}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("pages.login.password")}</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormDescription>{t("pages.login.password_description")}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={loading}>
                {t("pages.login.login_button")}
              </Button>

              {import.meta.env.VITE_FIREBASE_API_KEY && (
                <>
                  <div className="relative text-sm text-center after:border-border after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                    <span className="relative z-10 px-2 bg-background text-muted-foreground">{t("pages.login.or_continue_with")}</span>
                  </div>
                  <OAuth message="pages.login.login_button" />
                </>
              )}
            </form>
          </Form>

          <div className="text-sm text-center md:text-base">
            {t("pages.login.no_account")}{" "}
            <Link to="/register" className="underline underline-offset-4 text-accent">
              {t("pages.login.sign_up")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
