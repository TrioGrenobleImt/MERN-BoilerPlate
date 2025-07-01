/**
 * @constant Constants
 * @description Contains application-wide constants for various configurations.
 * This object includes constants such as expiration times, limits, and other fixed values.
 * @type {Object}
 * @property {number} MAX_AGE - The maximum age (in seconds) for tokens or sessions, set to 30 days.
 * @property {number} AVATAR_MAX_SIZE - The maximum size (in bytes) for an avatar file, set to 3 MB.
 * @property {RegExp} REGEX_PASSWORD - Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character.
 */
export const Constants = {
  MAX_AGE: 30 * 24 * 60 * 60, // in seconds (30 days)
  AVATAR_MAX_SIZE: 3 * 1024 * 1024, // in bytes (3 MB)
  REGEX_PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}/,
} as const;

export type ConstantsType = typeof Constants;
