import { Button } from "@/components/ui/button";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { axiosConfig } from "@/config/axiosConfig";
import { useAuthContext } from "@/contexts/authContext";
import { deleteAccountSchema } from "@/lib/zod/schemas/account/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { date, z } from "zod";
import { useNavigate } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";

interface DeleteAccountProps {
  setOpen: (open: boolean) => void;
}

export const DeleteAccountForm = ({ setOpen }: DeleteAccountProps) => {
  const { setAuthUser } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const deleteAccountForm = useForm<z.infer<typeof deleteAccountSchema>>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: {
      checkApproval: false,
      password: "",
    },
  });

  const onDeleteAccountSubmit = async (values: z.infer<typeof deleteAccountSchema>) => {
    const { checkApproval, ...valuesToSend } = values;
    try {
      setLoading(true);
      const response = await axiosConfig.delete(`/users/delete/account`, { data: valuesToSend });
      toast.success(response.data.message);
      deleteAccountForm.reset();
      setAuthUser(null);
      navigate("/login");
    } catch (error: any) {
      toast.error(error.response.data.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-[525px]">
      <Form {...deleteAccountForm}>
        <form onSubmit={deleteAccountForm.handleSubmit(onDeleteAccountSubmit)} className="space-y-6">
          <DialogHeader>
            <DialogTitle>Delete account</DialogTitle>
            <DialogDescription>Please be very mindful of your action, there is no going back</DialogDescription>
          </DialogHeader>
          <FormField
            control={deleteAccountForm.control}
            name="checkApproval"
            render={({ field }) => (
              <FormItem className="flex flex-col p-4 space-y-3 border rounded-md shadow">
                <div className="flex items-start space-x-3">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1">
                    <FormLabel>I accept to delete my account forever</FormLabel>
                    <FormDescription>
                      Please note that this action is irreversible and will delete all your data and settings. If you are sure, please check
                      the box to confirm.
                    </FormDescription>
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={deleteAccountForm.control}
            name="password"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter>
            <Button disabled={loading} type="submit">
              Delete this account
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)} type="button">
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};
