// PACKAGE IMPORTS
const bcrypt = require("bcrypt");

// MODULE IMPORTS
const logger = require("./../../config/logger");

module.exports = {
  hash: function (plaintextPassword) {
    /* Given a plaintext password, hashes it and produces a hashed password. */
    return new Promise(function (resolve, reject) {
      logger.silly(
        `Called the password hashing function with ${plaintextPassword}`
      );
      bcrypt.hash(
        plaintextPassword,
        parseInt(process.env.SALT_ROUNDS) || 9,
        function (error, hashedPassword) {
          if (error) {
            logger.error(
              `Failed to hash password: ${plaintextPassword} because of error: ${error}`
            );
            reject(error);
          } else {
            logger.silly(`Hashed a password and got ${hashedPassword}`);
            resolve(hashedPassword);
          }
        }
      );
    });
  },

  compare: function (plaintextPassword, hashedPassword) {
    /*
     * Given a plaintext password and a hashed password, uses bcrypt to compare the two passwords.
     * and returns true or false based on the comparison.
     */
    return new Promise(function (resolve, reject) {
      logger.silly(
        `Got a comparison request for ${hashedPassword} and ${plaintextPassword}`
      );
      bcrypt.compare(
        plaintextPassword,
        hashedPassword,
        function (error, result) {
          if (error) {
            logger.error(`Failed while comparing password with ${error}`);
            reject(error);
          } else {
            logger.silly(
              `Successfully compared password with output of ${result}`
            );
            resolve(result);
          }
        }
      );
    });
  },
};
