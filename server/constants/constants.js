/**
 * @constant Constants
 * @description Contains application-wide constants for various configurations.
 * This object includes constants such as expiration times, limits, and other fixed values.
 * @type {Object}
 * @property {number} MAX_AGE - The maximum age (in milliseconds) for tokens or sessions, set to 30 days.
 * @property {number} AVATAR_MAX_SIZE - The maximum size (in bytes) for an avatar file, set to 3 MB.
 */
export const Constants = {
  MAX_AGE: 30 * 24 * 60 * 60 * 1000,
  AVATAR_MAX_SIZE: 3 * 1024 * 1024,
};
