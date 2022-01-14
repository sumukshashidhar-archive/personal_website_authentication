const messages = require("./controllers/internal/messageConstructor");
module.exports = function (app) {
  app.get("/", function (_, res) {
    res
      .status(200)
      .json(messages.externalMessage(`Server is up at ${Date.now()}`, "/"));
  });
  return app;
};
