const findUser = require("./../db/checkUserExists");
const compareHash = require("./../auth/password").compare;
const signJWT = require("./../token/signAndValidate").sign;
const messages = require("./../internal/messageConstructor");

module.exports = async function (user) {
  /*
   * Takes in a user object, with a username and a password as keys, and returns a signed JWT token, or a error
   * based on whether the user exists.
   * */
  let dbObject;
  try {
    dbObject = await findUser(user["email"]);
  } catch (e) {
    // gracefully caught the error with the db
    return messages.serviceError(`Likely Mongo Error ${e}`, "findUser");
  }
  // this means that the finding succeeded.
  if (dbObject === false) {
    // means that the user was not found in the database
    return messages.generalMessage(`The user does not exist.`, "findUser", 404);
  } else {
    // means that the user was successfully found. we can proceed to now check the password.
    try {
      if (await compareHash(user["password"], dbObject["password"])) {
        // if the response is true, then we proceed with signing the user a token and allowing a login
        let webToken;
        try {
          webToken = await signJWT({
            email: user["email"],
            role: user["role"],
            data: null,
          });
          return messages.objectReturn(
            `Signed a token`,
            "login",
            200,
            webToken
          );
        } catch (e) {
          return messages.serviceError(
            `Likely JSON signing error ${e}`,
            "signJWT"
          );
        }
      } else {
        return messages.generalMessage("Wrong password", "compareHash", 403);
      }
    } catch (e) {
      return messages.serviceError(`Likely bCrypt error ${e}`, "compareHash");
    }
  }
};
