const messages = require("./messageConstructor");

describe("Message Constructor Testing", function () {
  test("Service Error Function", function () {
    expect(messages.serviceError("Test Message", "Test")).toStrictEqual({
      error: "Internal service error: Test",
      message: "Test Message",
      status: 500,
    });
  });

  test("General Message Function", function () {
    expect(messages.generalMessage("Test Message", "Test", 400)).toStrictEqual({
      message: "Test Message",
      status: 400,
    });
  });

  test("Object Return Function", function () {
    expect(
      messages.objectReturn("Test Message", "Test", 200, { obj: "TestOBJ" })
    ).toStrictEqual({
      message: "Test Message",
      status: 200,
      object: { obj: "TestOBJ" },
    });
  });

  test("External Message Function", function () {
    expect(messages.externalMessage("Test Message", "/test")).toStrictEqual({
      message: "Test Message",
    });
  });

  test("External Object Return Function", function () {
    expect(
      messages.externalObjectReturn("Test Message", { obj: "TestObj" }, "/test")
    ).toStrictEqual({
      message: "Test Message",
      object: { obj: "TestObj" },
    });
  });
});
