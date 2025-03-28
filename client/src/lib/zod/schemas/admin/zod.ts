import { z } from "zod";

export const createPlayerSchema = z.object({
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
  password: z
    .string()
    .max(255, { message: "Password must be at most 255 characters long" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
      message:
        "Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character.",
    }),
  role: z.string(),
});

export const updatePlayerSchema = z.object({
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
  role: z.string(),
});

export const deletePlayerSchema = z.object({
  confirmDelete: z.string(),
});
