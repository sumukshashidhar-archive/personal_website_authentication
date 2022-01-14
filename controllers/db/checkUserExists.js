const user = require("./../../models/user");
const logger = require("./../../config/logger");

module.exports = function (email) {
  /*
   *   Function that takes in an email, and returns whether or not the user exists in the database.
   *   If the user exists, the user object is returned. If not, then false is returned
   *
   *  */
  return new Promise(function (resolve, reject) {
    logger.silly(`Got request to checkUserExists with email: ${email}`);
    user.findOne({ email: email }, function (error, object) {
      if (error) {
        logger.error(`Error in checkUserExists ${error}`);
        reject(error);
      } else {
        logger.silly(`Object returned from MongoDB: ${object}`);
        if (object) {
          logger.silly(`User exists in db.`);
          resolve(object);
        } else {
          logger.silly(`User does not exist in db`);
          resolve(false);
        }
      }
    });
  });
};
