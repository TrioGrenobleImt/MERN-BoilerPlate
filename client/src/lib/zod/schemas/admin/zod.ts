import { z } from "zod";

export const getCreateUserSchema = (t: (key: string) => string) =>
  z.object({
    name: z
      .string()
      .min(2, { message: t("pages.admin.users_page.form.name_min") })
      .max(25, { message: t("pages.admin.users_page.form.name_max") }),
    forename: z
      .string()
      .min(2, { message: t("pages.admin.users_page.form.forename_min") })
      .max(25, { message: t("pages.admin.users_page.form.forename_max") }),
    username: z
      .string()
      .min(2, { message: t("pages.admin.users_page.form.username_min") })
      .max(25, { message: t("pages.admin.users_page.form.username_max") })
      .regex(/^[^A-Z\s]+$/, { message: t("pages.admin.users_page.form.username_no_spaces") }),
    email: z.string().email({ message: t("pages.admin.users_page.form.invalid_email") }),
    password: z.string().min(1, { message: t("pages.admin.users_page.form.password_required") }),
    role: z.string(),
  });

export const getUpdateUserSchema = (t: (key: string) => string) =>
  z.object({
    name: z
      .string()
      .min(2, { message: t("pages.admin.users_page.form.name_min") })
      .max(25, { message: t("pages.admin.users_page.form.name_max") }),
    forename: z
      .string()
      .min(2, { message: t("pages.admin.users_page.form.forename_min") })
      .max(25, { message: t("pages.admin.users_page.form.forename_max") }),
    username: z
      .string()
      .min(2, { message: t("pages.admin.users_page.form.username_min") })
      .max(25, { message: t("pages.admin.users_page.form.username_max") })
      .regex(/^[^A-Z\s]+$/, { message: t("pages.admin.users_page.form.username_no_spaces") }),
    email: z.string().email({ message: t("pages.admin.users_page.form.invalid_email") }),
    role: z.string(),
    password: z.string().optional(),
  });

export const getDeleteUserSchema = (t: (key: string) => string) =>
  z.object({
    confirmDelete: z
      .string()
      .min(1, { message: t("pages.admin.users_page.form.confirm_delete_required") })
      .transform((val) => val.toUpperCase()),
  });
