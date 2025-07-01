/**
 * @description Contains the different roles that a user can have in the application.
 * These roles are used to manage access control and authorization.
 * @type {Object}
 * @property {string} ADMIN - The role for administrative users with elevated privileges.
 * @property {string} USER - The role for regular users with standard access.
 */
export enum userRoles {
  ADMIN = "admin",
  USER = "user",
}
