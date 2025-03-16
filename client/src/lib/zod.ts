import { useTranslation } from "react-i18next";
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
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(255, { message: "Password must be at most 255 characters long" }),
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
        .min(6, { message: t("pages.register.errors.password_min") })
        .max(255, { message: t("pages.register.errors.password_max") }),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("pages.register.errors.passwords_mismatch"),
      path: ["confirmPassword"],
    });
