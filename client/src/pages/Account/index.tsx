import { Loading } from "@/components/customs/loading";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuthContext } from "@/contexts/authContext";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { getUpdateAccountSchema } from "@/lib/zod/schemas/account/zod";
import { useState } from "react";
import { toast } from "sonner";
import { axiosConfig } from "@/config/axiosConfig";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { InputFile } from "@/components/customs/inputFile";
import { UpdatePasswordForm } from "./components/updatePasswordForm";
import { Dialog } from "@radix-ui/react-dialog";
import { EllipsisVertical, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteAccountForm } from "./components/deleteAccountForm";
import { useTranslation } from "react-i18next";

export const Account = () => {
  const { authUser, setAuthUser, loading } = useAuthContext();
  const { t } = useTranslation();

  const [updateLoading, setUpdateLoading] = useState(false);
  const [openUpdatePasswordDialog, setOpenUpdatePasswordDialog] = useState(false);
  const [openDeleteAccountDialog, setOpenDeleteAccountDialog] = useState(false);

  const updateAccountSchema = getUpdateAccountSchema(t);
  const updateForm = useForm<z.infer<typeof updateAccountSchema>>({
    resolver: zodResolver(updateAccountSchema),
    defaultValues: {
      name: authUser?.name,
      forename: authUser?.forename,
      username: authUser?.username,
      email: authUser?.email,
    },
  });

  const onUpdateSubmit: SubmitHandler<z.infer<typeof updateAccountSchema>> = async (values) => {
    try {
      setUpdateLoading(true);
      const response = await axiosConfig.put(`/users/${authUser?._id}`, values);
      toast.success(t(response.data.message));
      setAuthUser(response.data.user);
    } catch (error: any) {
      toast.error(t(error.response.data.error));
    } finally {
      setUpdateLoading(false);
    }
  };

  const updateProfilePic = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdateLoading(true);

    const file = e.target.files?.[0];

    if (!file?.type.includes("image")) {
      toast.error(t("pages.account.errors.invalid_file_type"));
      setUpdateLoading(false);
      return;
    }

    if (!file) {
      toast.error(t("pages.account.errors.no_file_selected"));
      setUpdateLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const response = await axiosConfig.post(`/uploads/avatar/${authUser?._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(t(response.data.message));
      setAuthUser(response.data.user);
    } catch (error: any) {
      toast.error(t(error.response?.data?.error));
    } finally {
      setUpdateLoading(false);
    }
  };

  return loading ? (
    <Loading />
  ) : (
    <div className="flex justify-center p-8">
      <Card className="w-full max-w-4xl p-4 shadow-xl rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between ">
          <div>
            <CardTitle>{t("pages.account.account_settings_title")}</CardTitle>
            <CardDescription>{t("pages.account.account_settings_description")}</CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="cursor-pointer">
              <Button variant="outline" size="sm">
                <EllipsisVertical className="w-5 h-5 text-primary" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-auto">
              <DropdownMenuLabel>{t("pages.account.actions")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" onClick={() => setOpenDeleteAccountDialog(true)}>
                <Trash className="w-4 h-4 text-destructive" />
                <span className="text-destructive ">{t("pages.account.delete_account")}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-4 mb-8">
            <div className="relative">
              <Avatar className="w-28 h-28 ">
                <AvatarImage src={authUser?.avatar} alt="User Avatar" className="object-cover object-center w-full h-full rounded-full" />
              </Avatar>
            </div>
            <div>
              <InputFile buttonText={t("choose_image")} id="profile-picture" disabled={loading} onChange={updateProfilePic} />
            </div>
          </div>
          <Form {...updateForm}>
            <form onSubmit={updateForm.handleSubmit(onUpdateSubmit)} className="space-y-6">
              <div className="flex flex-col gap-4 md:flex-row ">
                <FormField
                  control={updateForm.control}
                  name="forename"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>{t("pages.account.forename_label")}</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
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
                      <FormLabel>{t("pages.account.name_label")}</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
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
                    <FormLabel>{t("pages.account.username_label")}</FormLabel>
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
                    <FormLabel>{t("pages.account.email_label")}</FormLabel>
                    <FormControl>
                      <Input placeholder="john.doe@gmail.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem>
                <div className="flex flex-col w-full gap-2">
                  <FormLabel>{t("pages.account.password_label")}</FormLabel>
                  <div className="flex items-center justify-between gap-4">
                    <FormControl>
                      <Input type="password" placeholder={t("pages.account.password_placeholder")} disabled />
                    </FormControl>
                    <Button type="button" variant="outline" onClick={() => setOpenUpdatePasswordDialog(true)} disabled={updateLoading}>
                      {t("pages.account.change_password")}
                    </Button>
                  </div>
                </div>
              </FormItem>

              <CardFooter className="px-0">
                <Button type="submit" disabled={updateLoading} className="w-full">
                  {t("global.buttons.update")}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Dialog open={openUpdatePasswordDialog} onOpenChange={setOpenUpdatePasswordDialog}>
        <UpdatePasswordForm setOpen={setOpenUpdatePasswordDialog} />
      </Dialog>

      <Dialog open={openDeleteAccountDialog} onOpenChange={setOpenDeleteAccountDialog}>
        <DeleteAccountForm setOpen={setOpenDeleteAccountDialog} />
      </Dialog>
    </div>
  );
};
