import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { registerSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuthContext } from "@/contexts/authContext";
import axiosConfig from "@/config/axiosConfig";
import { useState } from "react";
import TermsAndConditions from "./TermsAndConditions";

export default function RegisterPage() {
  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      forename: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { setAuthUser } = useAuthContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  async function register(values: z.infer<typeof registerSchema>) {
    try {
      setLoading(true);
      const response = await axiosConfig.post("/auth/register", values);
      const data = await response.data;

      if (data.error) {
        throw new Error(data.error);
      }
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
      <div className="flex flex-col gap-6">
        <div className="flex items-center self-center gap-2 text-xl font-medium">MERN-Boilerplate</div>
        <Card className="w-[650px] md:w-[500px]">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Create an account</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6">
            <Form {...registerForm}>
              <form onSubmit={registerForm.handleSubmit(register)} className="space-y-4">
                <div className="flex items-center gap-6">
                  <FormField
                    control={registerForm.control}
                    name="forename"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Forename</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={registerForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>Enter your username</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={registerForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>Enter your email</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={registerForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormDescription>Enter your password</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={registerForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormDescription>Enter your password again for verification</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={loading}>
                  Register
                </Button>
              </form>
            </Form>
            <div className="text-sm text-center">
              Already have an account?{" "}
              <Link to="/login" className="underline underline-offset-4">
                Login
              </Link>
            </div>
          </CardContent>
        </Card>
        <div
          onClick={() => setOpen(true)}
          className="cursor-pointer text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  "
        >
          By clicking register, you agree to our <span className="font-bold">Terms of Service</span> and{" "}
          <span className="font-bold">Conditions</span>.
        </div>
      </div>
      {open && <TermsAndConditions open={open} setOpen={setOpen} />}
    </div>
  );
}
