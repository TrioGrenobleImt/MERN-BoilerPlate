import { z } from "zod";

export const updateAccountSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(25, { message: "Name must be at most 25 characters long" }),
  forename: z
    .string()
    .min(2, { message: "Forename must be at least 2 characters long" })
    .max(25, { message: "Forename must be at most 25 characters long" }),
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters long" })
    .max(25, { message: "Username must be at most 25 characters long" }),
  email: z.string().email({ message: "Invalid email address" }),
});

export const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(6, { message: "Current password is atleast 6 characters" }),
    newPassword: z
      .string()
      .min(6, { message: "New password is atleast 6 characters" })
      .max(25, { message: "Password must be at most 25 characters long" }),
    newPasswordConfirm: z.string().min(6, { message: "New password is atleast 6 characters" }),
  })
  .refine((data) => data.newPassword === data.newPasswordConfirm, {
    message: "Passwords do not match",
    path: ["newPasswordConfirm"],
  });
