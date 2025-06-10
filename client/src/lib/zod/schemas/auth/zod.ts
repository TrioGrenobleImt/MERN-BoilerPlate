import { z } from "zod";

export const getLoginSchema = (t: (key: string) => string) =>
  z.object({
    loginName: z
      .string()
      .min(2, { message: t("pages.login.errors.login_name_min") })
      .regex(/^[^A-Z\s]+$/, { message: t("pages.login.errors.login_name_no_spaces") }),
    password: z
      .string()
      .min(1, { message: t("pages.login.errors.password_min") })
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
        .max(25, { message: t("pages.register.errors.username_max") })
        .regex(/^[^A-Z\s]+$/, { message: t("pages.register.errors.username_no_spaces") }),
      email: z.string().email({ message: t("pages.register.errors.invalid_email") }),
      password: z
        .string()
        .max(255, { message: t("pages.register.errors.password_max") })
        .min(1, { message: t("pages.register.errors.password_invalid") }),
      confirmPassword: z.string(),
      photoURL: z.string().optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("pages.register.errors.passwords_mismatch"),
      path: ["confirmPassword"],
    });
