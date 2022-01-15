const User = require("./../../models/user");
const hash = require("./../auth/password").hash;
const conflictCheck = require("./../db/checkUserExists");
const messages = require("./../internal/messageConstructor");
module.exports = function (user) {
  return new Promise(async function (resolve, reject) {
    // first check if the user exists in the database
    let dbObject;
    try {
      dbObject = await conflictCheck(user["email"]);
    } catch (e) {
      return reject(
        messages.serviceError(`Mongo error likely ${e}`, "conflict check")
      );
    }
    if (dbObject !== false) {
      return resolve(
        messages.generalMessage(
          "User exists, can't make another",
          "conflictCheck",
          403
        )
      );
    }
    // this means that the user does not exist, we can go ahead with the creation
    try {
      let hashedPassword = await hash(user["password"]);
      let newUser = new User({
        email: user["email"],
        password: hashedPassword,
        role: "user",
      });
      newUser.save(function (error, object) {
        if (error) {
          throw new Error(error);
        } else {
          return resolve(
            messages.objectReturn(
              "Successfully created user",
              "createUser",
              200,
              object
            )
          );
        }
      });
    } catch (e) {
      resolve(
        messages.serviceError(`Ran into unexpected error: ${e}`, "createUser")
      );
    }
  });
};
