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
    .max(25, { message: "Username must be at most 25 characters long" })
    .regex(/^[^A-Z\s]+$/, { message: "Username cannot contain spaces or uppercases" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }).max(255, { message: "Password must be at most 255 characters long" }),
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
    .max(25, { message: "Username must be at most 25 characters long" })
    .regex(/^[^A-Z\s]+$/, { message: "Username cannot contain spaces or uppercases" }),
  email: z.string().email({ message: "Invalid email address" }),
  role: z.string(),
  password: z.string().max(255, { message: "Password must be at most 255 characters long" }).optional(),
});

export const deletePlayerSchema = z.object({
  confirmDelete: z.string(),
});
