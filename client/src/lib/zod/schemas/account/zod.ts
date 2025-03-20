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
