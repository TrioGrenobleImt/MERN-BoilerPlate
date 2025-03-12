import { z } from "zod";

export const createPlayerSchema = z
  .object({
    username: z
      .string()
      .min(2, { message: "Username must be at least 2 characters long" })
      .max(25, { message: "Username must be at most 25 characters long" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" })
      .max(255, { message: "Password must be at most 255 characters long" })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\W]{6,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      ),
    confirmPassword: z.string(),
    role: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const updatePlayerSchema = z.object({
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters long" })
    .max(25, { message: "Username must be at most 25 characters long" }),
  email: z.string().email({ message: "Invalid email address" }),
  role: z.string(),
});

export const deletePlayerSchema = z.object({
  confirmDelete: z.string(),
});
