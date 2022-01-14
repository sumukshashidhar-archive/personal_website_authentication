const tokenExtractor = require("./tokenExtractor");

test("Test the token extraction function", function () {
  expect(tokenExtractor("Bearer test")).toBe("test");
});
