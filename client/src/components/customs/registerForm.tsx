import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getRegisterSchema } from "@/lib/zod/schemas/auth/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { OAuth } from "./oauth";
import { useConfigContext } from "@/contexts/configContext";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type RegisterFormProps = {
  onSubmit: (values: z.infer<any>) => Promise<void>;
  defaultValues?: Partial<z.infer<any>>;
  disabledFields?: string[];
  submitLabel?: string;
  loading?: boolean;
  oauth?: boolean;
};

export const RegisterForm = ({
  onSubmit,
  defaultValues = {},
  disabledFields = [],
  submitLabel,
  loading = false,
  oauth = false,
}: RegisterFormProps) => {
  const { t } = useTranslation();
  const registerSchema = getRegisterSchema(t);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      forename: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      ...defaultValues,
    },
  });

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
      <div className="flex items-center self-center gap-2 text-2xl font-medium sm:text-4xl text-accent">{configValues["APP_NAME"]}</div>
      <div className="flex flex-col w-full max-w-2xl gap-6 bg-background p-4 md:p-8 sm:rounded-2xl sm:shadow">
        <div className="text-center">
          <h1 className="text-xl md:text-2xl">{oauth ? t("pages.register.title") : t("pages.register.password_creation")}</h1>
        </div>
        <div className="flex flex-col items-center gap-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                {["forename", "name"].map((fieldName) => (
                  <FormField
                    key={fieldName}
                    control={form.control}
                    name={fieldName as any}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>{t(`pages.register.${fieldName}`)}</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={disabledFields.includes(fieldName)} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>

              {["username", "email"].map((fieldName) => (
                <FormField
                  key={fieldName}
                  control={form.control}
                  name={fieldName as any}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t(`pages.register.${fieldName}`)}</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={disabledFields.includes(fieldName)} />
                      </FormControl>
                      {fieldName === "username" && <FormDescription>{t("pages.register.username_description")}</FormDescription>}
                      {fieldName === "email" && <FormDescription>{t("pages.register.email_description")}</FormDescription>}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}

              {["password", "confirmPassword"].map((fieldName) => (
                <FormField
                  key={fieldName}
                  control={form.control}
                  name={fieldName as any}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t(`pages.register.${fieldName}`)}</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} disabled={disabledFields.includes(fieldName)} />
                      </FormControl>
                      <FormDescription>{t(`pages.register.${fieldName}_description`)}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}

              <Button type="submit" className="w-full" disabled={loading}>
                {submitLabel || t("pages.register.register")}
              </Button>

              {import.meta.env.VITE_FIREBASE_API_KEY && oauth && (
                <>
                  <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                    <span className="relative z-10 bg-background px-2 text-muted-foreground">{t("pages.login.or_continue_with")}</span>
                  </div>
                  <OAuth message="pages.register.register" />
                </>
              )}
            </form>
          </Form>
          {oauth && (
            <div className="text-center text-sm md:text-base">
              {t("pages.register.already_have_account")}{" "}
              <Link to="/login" className="underline underline-offset-4 text-accent">
                {t("pages.register.login")}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
