import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { getLoginSchema } from "@/lib/zod/schemas/auth/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useAuthContext } from "@/contexts/authContext";
import axiosConfig from "@/config/axiosConfig";
import { toast } from "sonner";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setAuthUser } = useAuthContext();
  const { t } = useTranslation();

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
      const data = await response.data;

      toast.success(data.message);
      setAuthUser(data.user);
      navigate("/");
    } catch (error: any) {
      toast.error(error.response.data.error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-6 min-h-svh bg-muted md:p-10">
      <div className="flex flex-col w-full max-w-md gap-6 px-4 md:px-0">
        <div className="flex items-center self-center gap-2 text-xl font-medium">MERN-Boilerplate</div>
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-xl md:text-2xl">{t("pages.login.welcome_back")}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6">
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(login)} className="w-full space-y-4">
                <FormField
                  control={loginForm.control}
                  name="loginName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("pages.login.username")}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>{t("pages.login.username_description")}</FormDescription>
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
              </form>
            </Form>

            <div className="text-sm text-center md:text-base">
              {t("pages.login.no_account")}{" "}
              <Link to="/register" className="underline underline-offset-4">
                {t("pages.login.sign_up")}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
