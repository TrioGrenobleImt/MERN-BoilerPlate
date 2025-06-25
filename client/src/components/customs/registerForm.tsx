import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getRegisterSchema } from "@/lib/zod/schemas/auth/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { OAuth } from "./oauth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useConfigContext } from "@/contexts/configContext";
import { useEffect, useState } from "react";

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

  // Si tu veux, adapte ton schema pour autoriser ou non le password selon showPassword
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
    <div className="flex flex-col items-center justify-center gap-6 p-6 min-h-svh bg-muted md:p-10">
      <div className="flex flex-col w-full max-w-2xl gap-6 px-4 md:px-0">
        <div className="flex items-center gap-2 self-center sm:text-4xl text-2xl font-medium text-accent">{configValues["APP_NAME"]}</div>
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-xl md:text-2xl">{t("pages.register.title")}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6">
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

                <>
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
                </>

                <Button type="submit" className="w-full" disabled={loading}>
                  {submitLabel || t("pages.register.register")}
                </Button>
                {import.meta.env.VITE_FIREBASE_API_KEY && oauth && (
                  <>
                    <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                      <span className="bg-background text-muted-foreground relative z-10 px-2">{t("pages.login.or_continue_with")}</span>
                    </div>
                    <OAuth message="pages.register.register" />
                  </>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
