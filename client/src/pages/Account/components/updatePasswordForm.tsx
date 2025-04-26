import { Button } from "@/components/ui/button";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { axiosConfig } from "@/config/axiosConfig";
import { useAuthContext } from "@/contexts/authContext";
import { getUpdatePasswordSchema } from "@/lib/zod/schemas/account/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";

interface UpdatePasswordProps {
  setOpen: (open: boolean) => void;
}

export const UpdatePasswordForm = ({ setOpen }: UpdatePasswordProps) => {
  const { authUser } = useAuthContext();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);

  const updatePasswordSchema = getUpdatePasswordSchema(t);
  const updatePasswordForm = useForm<z.infer<typeof updatePasswordSchema>>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      newPasswordConfirm: "",
    },
  });

  const onUpdatePasswordSubmit = async (values: z.infer<typeof updatePasswordSchema>) => {
    try {
      setLoading(true);
      const response = await axiosConfig.put(`/users/${authUser?._id}/password`, values);
      toast.success(t(response.data.message));
      setOpen(false);
      updatePasswordForm.reset();
    } catch (error: any) {
      toast.error(t(error.response.data.error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-[525px]">
      <Form {...updatePasswordForm}>
        <form onSubmit={updatePasswordForm.handleSubmit(onUpdatePasswordSubmit)} className="space-y-6">
          <DialogHeader>
            <DialogTitle>{t("pages.account.edit_profile_title")}</DialogTitle>
            <DialogDescription>{t("pages.account.edit_profile_description")}</DialogDescription>
          </DialogHeader>
          <FormField
            control={updatePasswordForm.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>{t("pages.account.current_password_label")}</FormLabel>
                <FormControl>
                  <Input type="password" placeholder={t("pages.account.password_placeholder")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={updatePasswordForm.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>{t("pages.account.new_password_label")}</FormLabel>
                <FormControl>
                  <Input type="password" placeholder={t("pages.account.password_placeholder")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={updatePasswordForm.control}
            name="newPasswordConfirm"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>{t("pages.account.new_password_confirm_label")}</FormLabel>
                <FormControl>
                  <Input type="password" placeholder={t("pages.account.password_placeholder")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter>
            <Button disabled={loading} type="submit">
              {t("global.buttons.save")}
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)} type="button">
              {t("global.buttons.cancel")}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};
