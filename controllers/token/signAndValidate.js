// PACKAGE IMPORTS
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

// MODULE IMPORTS
const logger = require("./../../config/logger");
const tokenOptions = require("./../../config/tokenOptions");

// SET KEY PATHS
const publicKeyPath = path.join(__dirname, "./../../keys/public.key");
const privateKeyPath = path.join(__dirname, "./../../keys/private.key");

// IMPORT KEYS
const publicKEY = fs.readFileSync(publicKeyPath, "utf-8");
const privateKEY = fs.readFileSync(privateKeyPath, "utf-8");

module.exports = {
  sign: function (userObject) {
    /*
     *    Signing function that takes in a user object with 3 fields. email, role and data,
     *    and returns a signed JWT token
     */
    return new Promise(function (resolve, reject) {
      logger.silly(`Function JWT signer called for userobject ${userObject}`);
      jwt.sign(
        {
          email: userObject["email"],
          role: userObject["role"],
          data: userObject["data"],
        },
        privateKEY,
        tokenOptions.signOptions,
        function (error, signedToken) {
          if (error) {
            logger.error(`Error in JWT Signer: ${error}`);
            reject(error);
          } else {
            logger.silly(`Returning ${signedToken}`);
            resolve(signedToken);
          }
        }
      );
    });
  },

  validate: function (token) {
    /*
     *  Validation function that takes in a JSON Web Token, and validates it, returning a decoded object
     *  if it is valid
     */
    return new Promise(function (resolve, reject) {
      logger.silly(`Function JWT validator called for token ${token}`);
      jwt.verify(
        token,
        publicKEY,
        tokenOptions.verifyOptions,
        function (error, decodedToken) {
          if (error) {
            logger.error(`Error in JWT validator: ${error}`);
            reject(error);
          } else {
            logger.silly(`Decoded token into ${decodedToken}`);
            resolve(decodedToken);
          }
        }
      );
    });
  },
};
