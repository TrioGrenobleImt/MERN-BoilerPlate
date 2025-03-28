import { z } from "zod";

export const getLoginSchema = (t: (key: string) => string) =>
  z.object({
    username: z
      .string()
      .min(2, { message: t("pages.login.errors.username_min") })
      .max(25, { message: t("pages.login.errors.username_max") }),
    password: z
      .string()
      .min(6, { message: t("pages.login.errors.password_min") })
      .max(255, { message: t("pages.login.errors.password_max") }),
  });

export const getRegisterSchema = (t: (key: string) => string) =>
  z
    .object({
      name: z
        .string()
        .min(2, { message: t("pages.register.errors.name_min") })
        .max(25, { message: t("pages.register.errors.name_max") }),
      forename: z
        .string()
        .min(2, { message: t("pages.register.errors.forename_min") })
        .max(25, { message: t("pages.register.errors.forename_max") }),
      username: z
        .string()
        .min(2, { message: t("pages.register.errors.username_min") })
        .max(25, { message: t("pages.register.errors.username_max") }),
      email: z.string().email({ message: t("pages.register.errors.invalid_email") }),
      password: z
        .string()
        .max(255, { message: t("pages.register.errors.password_max") })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&:.]).{8,}$/, {
          message: t("pages.register.errors.password_invalid"),
        }), // Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("pages.register.errors.passwords_mismatch"),
      path: ["confirmPassword"],
    });
