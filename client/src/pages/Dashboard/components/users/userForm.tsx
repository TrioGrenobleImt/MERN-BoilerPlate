import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import axiosConfig from "@/config/axiosConfig";
import { toast } from "sonner";
import { User } from "./page";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { createPlayerSchema, updatePlayerSchema } from "@/lib/zod";

interface UserFormProps {
  dialog: (isOpen: boolean) => void;
  refresh: () => void;
  action: string;
  user?: User;
}

export const UserForm = ({ dialog, refresh, action, user }: UserFormProps) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof createPlayerSchema> | z.infer<typeof updatePlayerSchema>>({
    resolver: zodResolver(action === "create" ? createPlayerSchema : updatePlayerSchema),
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
      password: "",
      confirmPassword: "",
      role: user?.role || "user",
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof createPlayerSchema> | z.infer<typeof updatePlayerSchema>> = async (values) => {
    if (action === "create") {
      await createUser(values as z.infer<typeof createPlayerSchema>);
    } else if (action === "update") {
      await updateUser(values as z.infer<typeof updatePlayerSchema>);
    }
  };

  async function createUser(values: z.infer<typeof createPlayerSchema>) {
    const { confirmPassword, ...payload } = values;

    try {
      setLoading(true);
      const response = await axiosConfig.post("/users", payload);
      toast.success(response.data.message);
      form.reset();
      dialog(false);
      refresh();
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateUser(values: z.infer<typeof updatePlayerSchema>) {
    try {
      setLoading(true);
      const response = await axiosConfig.put(`/users/${user?._id}`, values);
      toast.success(response.data.message);
      form.reset();
      dialog(false);
      refresh();
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
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
          control={form.control}
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
        {action === "create" && (
          <>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role for the new user" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Utilisateur</SelectItem>
                    <SelectItem value="admin">Administrateur</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading}>
          {action === "create" ? "Save" : "Update"}
        </Button>
      </form>
    </Form>
  );
};
