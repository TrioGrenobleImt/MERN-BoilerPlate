import { Loading } from "@/components/Loading";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuthContext } from "@/contexts/authContext";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { updateAccountSchema } from "@/lib/zod/schemas/account/zod";
import { useState } from "react";
import { toast } from "sonner";
import axiosConfig from "@/config/axiosConfig";
import { Avatar } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";

const Account = () => {
  const { authUser, setAuthUser, loading } = useAuthContext();
  const [updateLoading, setUpdateLoading] = useState(false);

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
      toast.success(response.data.message);
      setAuthUser(response.data.user);
    } catch (error: any) {
      toast.error(error.response.data.error);
    } finally {
      setUpdateLoading(false);
    }
  };
  const updateProfilePic = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Si tu veux l'envoyer ensuite :
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const response = await axiosConfig.put(`/uploads/avatar/${authUser?._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setAuthUser(response.data.user);
      toast.success("Avatar updated successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Upload failed");
    }
  };

  return loading ? (
    <Loading />
  ) : (
    <div className="flex justify-center mt-10">
      <Card className="w-full max-w-2xl p-4 shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>Update your personal information and account details.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6 mb-8">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <img src={authUser?.avatar} alt="avatar" />
              </Avatar>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {authUser?.forename} {authUser?.name}
              </h2>
              <p className="text-muted-foreground">{authUser?.email}</p>
              <Input type="file" className="cursor-pointer" onChange={updateProfilePic} />
            </div>
          </div>
          <Form {...updateForm}>
            <form onSubmit={updateForm.handleSubmit(onUpdateSubmit)} className="space-y-6">
              <div className="flex flex-col gap-4 md:flex-row">
                <FormField
                  control={updateForm.control}
                  name="forename"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Forename</FormLabel>
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
                      <FormLabel>Name</FormLabel>
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
                    <FormLabel>Username</FormLabel>
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="john.doe@gmail.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <CardFooter className="px-0">
                <Button type="submit" disabled={updateLoading} className="w-full">
                  Update
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Account;
