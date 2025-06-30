import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { axiosConfig } from "@/config/axiosConfig";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Copy } from "lucide-react";
import { UserInterface } from "@/interfaces/User";
import { useTranslation } from "react-i18next";
import { getCreateUserSchema, getDeleteUserSchema, getUpdateUserSchema } from "@/lib/zod/schemas/admin/zod";

interface UserFormProps {
  dialog: (isOpen: boolean) => void;
  refresh: () => void;
  action: string;
  user?: UserInterface;
}

export const UserForm = ({ dialog, refresh, action, user }: UserFormProps) => {
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation();
  const createUserSchema = getCreateUserSchema(t);
  const updateUserSchema = getUpdateUserSchema(t);
  const deleteUserchema = getDeleteUserSchema(t);

  const createForm = useForm<z.infer<typeof createUserSchema>>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      forename: "",
      username: "",
      email: "",
      password: "",
      role: "user",
    },
  });

  const updateForm = useForm<z.infer<typeof updateUserSchema>>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: user?.name,
      forename: user?.forename,
      username: user?.username,
      email: user?.email,
      role: user?.role,
      password: user?.password ?? "",
    },
  });

  const deleteForm = useForm<z.infer<typeof deleteUserchema>>({
    resolver: zodResolver(deleteUserchema),
    defaultValues: {
      confirmDelete: "",
    },
  });

  const onCreateSubmit: SubmitHandler<z.infer<typeof createUserSchema>> = async (values) => {
    try {
      setLoading(true);
      const response = await axiosConfig.post("/users", values);
      toast.success(t(response.data.message));
      dialog(false);
      refresh();
      createForm.reset();
    } catch (error: any) {
      toast.error(t(error.response.data.error));
    } finally {
      setLoading(false);
    }
  };

  const onUpdateSubmit: SubmitHandler<z.infer<typeof updateUserSchema>> = async (values) => {
    try {
      setLoading(true);
      const response = await axiosConfig.put(`/users/${user?._id}`, values);
      toast.success(t(response.data.message));
      dialog(false);
      refresh();
      updateForm.reset();
    } catch (error: any) {
      toast.error(t(error.response.data.error));
    } finally {
      setLoading(false);
    }
  };

  const onDeleteSubmit: SubmitHandler<z.infer<typeof deleteUserchema>> = async (values) => {
    if (values.confirmDelete.toLowerCase() === "delete") {
      try {
        setLoading(true);
        const response = await axiosConfig.delete(`/users/${user?._id}`);
        toast.success(t(response.data.message));
        dialog(false);
        refresh();
      } catch (error: any) {
        toast.error(t(error.response.data.error));
      } finally {
        setLoading(false);
      }
    } else {
      toast.error(t("pages.admin.users_page.form.confirm_text_invalid"));
    }
  };

  const getRandomPassword = async () => {
    try {
      setLoading(true);
      const response = await axiosConfig.get(`/users/utils/generatePassword`);
      toast.success(t(response.data.message));
      if (action === "update") updateForm.setValue("password", response.data.password);
      if (action === "create") createForm.setValue("password", response.data.password);
    } catch (error: any) {
      toast.error(t(error.response.data.error));
    } finally {
      setLoading(false);
    }
  };

  const copyGeneratedPassword = () => {
    const password = action === "update" ? updateForm.getValues("password") : createForm.getValues("password");

    if (!password) {
      toast.error(t("pages.admin.users_page.form.no_password_yet"));
      return;
    }

    navigator.clipboard.writeText(password ?? "");
    toast.success(t("pages.admin.users_page.form.password_copied"));
  };

  if (action === "create") {
    return (
      <Form {...createForm}>
        <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-8">
          <div className="flex items-center justify-center gap-6">
            <FormField
              control={createForm.control}
              name="forename"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>{t("pages.admin.users_page.form.forename")}</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} className="w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={createForm.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>{t("pages.admin.users_page.form.name")}</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} className="w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={createForm.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("pages.admin.users_page.form.username")}</FormLabel>
                <FormControl>
                  <Input placeholder="john_doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={createForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("pages.admin.users_page.form.email")}</FormLabel>
                <FormControl>
                  <Input placeholder="john.doe@gmail.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={createForm.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("pages.admin.users_page.form.role")}</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("pages.admin.users_page.form.select_role_placeholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">{t("pages.admin.users_page.form.user")}</SelectItem>
                      <SelectItem value="admin">{t("pages.admin.users_page.form.admin")}</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={createForm.control}
            name="password"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>{t("pages.admin.users_page.form.password")}</FormLabel>
                <FormControl>
                  <div className="flex items-end justify-end w-full gap-4">
                    <Input type="password" placeholder="************" {...field} disabled />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={copyGeneratedPassword}
                        disabled={loading}
                        aria-label={t("pages.admin.users_page.form.copy_password")}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button type="button" variant="outline" onClick={getRandomPassword} disabled={loading}>
                        {t("pages.admin.users_page.form.generate_password")}
                      </Button>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading}>
            {t("pages.admin.users_page.form.save")}
          </Button>
        </form>
      </Form>
    );
  }

  if (action === "update") {
    return (
      <Form {...updateForm}>
        <form onSubmit={updateForm.handleSubmit(onUpdateSubmit)} className="space-y-8">
          <div className="flex items-center justify-center gap-6">
            <FormField
              control={updateForm.control}
              name="forename"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>{t("pages.admin.users_page.form.forename")}</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} className="w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={updateForm.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>{t("pages.admin.users_page.form.name")}</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} className="w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={updateForm.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("pages.admin.users_page.form.username")}</FormLabel>
                <FormControl>
                  <Input placeholder="john_doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={updateForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("pages.admin.users_page.form.email")}</FormLabel>
                <FormControl>
                  <Input placeholder="john.doe@gmail.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={updateForm.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("pages.admin.users_page.form.role")}</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("pages.admin.users_page.form.select_role_placeholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">{t("pages.admin.users_page.form.user")}</SelectItem>
                      <SelectItem value="admin">{t("pages.admin.users_page.form.admin")}</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-end w-full gap-4">
            <FormField
              control={updateForm.control}
              name="password"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>{t("pages.admin.users_page.form.password")}</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="************" {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={copyGeneratedPassword}
                disabled={loading}
                aria-label={t("pages.admin.users_page.form.copy_password")}
              >
                <Copy className="w-4 h-4" />
              </Button>
              <Button variant="outline" onClick={getRandomPassword} disabled={loading} type="button">
                {t("pages.admin.users_page.form.generate_password")}
              </Button>
            </div>
          </div>
          <Button type="submit" disabled={loading}>
            {t("pages.admin.users_page.form.update")}
          </Button>
        </form>
      </Form>
    );
  }

  if (action === "delete") {
    return (
      <Form {...deleteForm}>
        <form onSubmit={deleteForm.handleSubmit(onDeleteSubmit)} className="space-y-8">
          <FormField
            control={deleteForm.control}
            name="confirmDelete"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("pages.admin.users_page.form.confirm_delete_label")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("pages.admin.users_page.form.confirm_delete_placeholder")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" variant="destructive" disabled={loading}>
            {t("pages.admin.users_page.form.delete")}
          </Button>
        </form>
      </Form>
    );
  }

  return null;
};
