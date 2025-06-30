import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { axiosConfig } from "@/config/axiosConfig";
import { toast } from "sonner";
import { useConfigContext } from "@/contexts/configContext";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useTranslation } from "react-i18next";
import { Loading } from "@/components/customs/loading";
import ColorPicker from "@/components/customs/colorPicker";

const configurationFormSchema = z.object({
  APP_NAME: z.string().trim(),
  ACCENT_COLOR: z.string().trim(),
});

type ConfigurationFormValues = z.infer<typeof configurationFormSchema>;

export const Config = () => {
  const { configValues, getConfigValue, updateConfigValues } = useConfigContext();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { t } = useTranslation();

  const form = useForm<ConfigurationFormValues>({
    resolver: zodResolver(configurationFormSchema),
    defaultValues: configValues,
    mode: "onChange",
  });

  useEffect(() => {
    const fetchConfigValues = async () => {
      const values = await getConfigValue(["APP_NAME", "ACCENT_COLOR"]);
      form.reset(values);
      setIsLoading(false);
    };

    fetchConfigValues();
  }, [getConfigValue, form]);

  const onSubmit = async (values: ConfigurationFormValues) => {
    const keys = Object.keys(values);
    const config = Object.fromEntries(Object.entries(values).map(([key, value]) => [key, value.trim()]));

    try {
      const response = await axiosConfig.put("/config", { keys, config });
      updateConfigValues(config);
      form.reset({ ...configValues, ...config });
      toast.success(t(`server.admin.messages.${response.data.message}`));
    } catch (error: any) {
      toast.error(t(error.response.data.error));
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <div className="container px-4 mx-auto">
        <Card className="p-6 rounded-lg shadow-lg">
          <CardTitle className="mb-2 text-2xl font-semibold">{t("pages.admin.config_page.title")}</CardTitle>
          <CardDescription className="mb-6">{t("pages.admin.config_page.description")}</CardDescription>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="APP_NAME"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("pages.admin.config_page.app_name")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("pages.admin.config_page.app_name")} {...field} />
                    </FormControl>
                    <FormDescription>{t("pages.admin.config_page.app_name_description")}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ACCENT_COLOR"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("pages.admin.config_page.accent_color")}</FormLabel>
                    <FormControl>
                      <ColorPicker {...field} />
                    </FormControl>
                    <FormDescription>{t("pages.admin.config_page.accent_color_description")}</FormDescription>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">{t("global.buttons.save")}</Button>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
};
