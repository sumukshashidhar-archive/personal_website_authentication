// MODULE IMPORTS
const Joi = require("joi");

// HELPERS
const messages = require("./controllers/internal/messageConstructor");

// LOGIC
const loginProcessor = require("./controllers/auth/login");

// VALIDATION SCHEMA IMPORT
const loginSchema = require("./controllers/validation/schema/login");

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
        res
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
        res
          .status(response["status"])
          .json(messages.externalMessage(response["message"], "/login"));
      }
    } catch (e) {
      res
        .status(500)
        .json(messages.externalMessage(`Uncaught exception ${e}`, "/login"));
    }
  });
  return app;
};
