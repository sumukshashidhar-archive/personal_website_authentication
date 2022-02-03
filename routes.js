// HELPERS
const messages = require("./controllers/internal/messageConstructor");
// LOGIC
const loginProcessor = require("./controllers/auth/login");
const validationProcessor = require("./controllers/token/validate");
const registrationProcessor = require("./controllers/auth/signup");
// VALIDATION SCHEMA IMPORT
const loginSchema = require("./controllers/validation/schema/login");
const headerSchema = require("./controllers/validation/schema/header");
const signupSchema = require("./controllers/validation/schema/signup");
const { ValidationError } = require("joi");
module.exports = function (app) {
  app.get("/", function (_, res) {
    res
      .status(200)
      .json(messages.externalMessage(`Server is up at ${Date.now()}. You are being served from ${process.env.SERVER_IDENTITY}.`, "/"));
  });

  app.post("/register", async function (req, res) {
    /*
     * Default register route to allow the registration of users.
     * We want to allow only the registration of regular users, and control the registration of admins with a set
     * server password later on, where we update the role of a user.
     * For now, everyone will be given the general role.
     * */
    // first, let us validate the input in the traditional sense
    let validation;
    try {
      validation = await signupSchema.validateAsync(req.body);
    } catch (e) {
      if (e instanceof ValidationError) {
        // essentially check if a validation error with JOI has occured, if it has, tell the user about it.
        return res
          .status(400)
          .json(
            messages.externalMessage(`Input Validation Error`, "/register")
          );
      } else {
        return res
          .status(500)
          .json(messages.externalObjectReturn("Unknown Error", e, "/register"));
      }
    }
    // if we reach this point, it means that the validation of input has succeeded
    // we just need to construct a user object and hand over the values to the user create function
    const userObject = {
      email: validation.email,
      password: validation.password,
    };
    // lets pass it onto the registration function
    try {
      let response = await registrationProcessor(userObject);
      res
        .status(response.status)
        .json(messages.externalMessage(response.message, "/register"));
    } catch (e) {
      return res
        .status(500)
        .json(messages.externalMessage(`Unexpected error ${e}`, "/register"));
    }
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
