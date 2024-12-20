/**
 * @constant Constants
 * @description Contains application-wide constants for various configurations.
 * This object includes constants such as expiration times, limits, and other fixed values.
 * @type {Object}
 * @property {number} MAX_AGE - The maximum age (in milliseconds) for tokens or sessions, set to 30 days.
 */
export const Constants = {
  MAX_AGE: 30 * 24 * 60 * 60 * 1000,
};
