const tokenExtract = require("./../token/tokenExtractor");
const validate = require("./../token/signAndValidate").validate;
const messages = require("./../internal/messageConstructor");
module.exports = async function (header) {
  let extractedToken = tokenExtract(header);
  if (extractedToken === false) {
    // means that something went wrong in the token extraction process.
    // we return an error for that
    return messages.generalMessage(
      "Failed token extraction",
      "tokenExtract",
      400
    );
  } else {
    // the header is fine and the token has been extracted.
    try {
      let response = await validate(extractedToken);
      return messages.objectReturn(
        "Successfully Extracted",
        "jwtValidate",
        200,
        response
      );
    } catch (e) {
      return messages.generalMessage(
        "Failed to validate token",
        "validate",
        403
      );
    }
  }
};
