// MODULE IMPORTS
const Joi = require("joi");

// HELPERS
const messages = require("./controllers/internal/messageConstructor");
// LOGIC
const loginProcessor = require("./controllers/auth/login");
const validationProcessor = require("./controllers/auth/validate");

// VALIDATION SCHEMA IMPORT
const loginSchema = require("./controllers/validation/schema/login");
const headerSchema = require("./controllers/validation/schema/header");

module.exports = function (app) {
  app.get("/", function (_, res) {
    res
      .status(200)
      .json(messages.externalMessage(`Server is up at ${Date.now()}`, "/"));
  });

  app.post("/login", async function (req, res) {
    // default login route.
    let validation;
    try {
      validation = await loginSchema.validateAsync(req.body);
    } catch (e) {
      return res
        .status(400)
        .json(
          messages.externalMessage(`Input Validation Error: ${e}`, "/login")
        );
    }
    // means that the input is fine, we can continue on with the main logic!
    let userObject = {
      email: validation.email,
      password: validation.password,
    };
    try {
      let response = await loginProcessor(userObject);
      if (response["status"] === 200) {
        return res
          .status(200)
          .json(
            messages.externalObjectReturn(
              `Logged in successfully`,
              response["object"],
              "/login"
            )
          );
      } else {
        // must have errored out somewhere.
        return res
          .status(response["status"])
          .json(messages.externalMessage(response["message"], "/login"));
      }
    } catch (e) {
      return res
        .status(500)
        .json(messages.externalMessage(`Uncaught exception ${e}`, "/login"));
    }
  });

  app.get("/validate", async function (req, res) {
    // this will be the most general route that will be used for almost every request that we try here on out.
    // all other routes will internally call this.
    // the header will be forwarded onto joi, and then to the validation function
    let validation;
    try {
      validation = headerSchema.validate(req.headers);
    } catch (e) {
      return res
        .status(400)
        .json(
          messages.externalMessage(`Input Validation Error: ${e}`, "/login")
        );
    }
    // if we reach this point it means that the validation worked without any errors.
    // let us extract the token and send it
    try {
      let response = await validationProcessor(
        validation["value"]["authorization"]
      );
      if (response["status"] === 200) {
        // means that the signing has worked
        return res
          .status(200)
          .json(
            messages.externalObjectReturn(
              "Signed Token",
              response["object"],
              "/validate"
            )
          );
      } else {
        return res
          .status(response["status"])
          .json(messages.externalMessage(response["message"], "/validate"));
      }
    } catch (e) {
      return res
        .status(500)
        .json(messages.externalMessage(`Uncaught exception ${e}`, "/validate"));
    }
  });
  return app;
};
