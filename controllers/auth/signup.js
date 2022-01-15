// MODULE IMPORTS
const logger = require("./../../config/logger");
const messages = require("./../internal/messageConstructor");
const createUser = require("./../db/createUser");
module.exports = async function (user) {
  /**
   * Takes in a user object with the following keys
   * {
   *     "email"
   *     "password"
   * }
   * and adds it to the database
   */
  logger.silly(`Request to add the user with ${user["email"]} to the database`);
  // we're not going to do any of the checking, we're going to pass off the work to the createUser module
  // this is just to maintain a similar level of abstraction
  try {
    // directly return the response unless you fail somewhere
    return await createUser(user);
  } catch (e) {
    return messages.serviceError(`Unexpected Service error ${e}`, "createUser");
  }
};
