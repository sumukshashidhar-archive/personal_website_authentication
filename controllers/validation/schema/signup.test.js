const signupSchema = require("./signup");

describe("Testing Signup Schema", function () {
  test("Complete Valid Input Test", async function () {
    // testing first for valid input
    const object = {
      email: "test@test.com",
      password: "Hello@12345",
    };
    let validation;
    try {
      await signupSchema.validateAsync(object);
    } catch (e) {
      throw new Error(e);
    }
  });
  test("Invalid Email Input Test", async function () {
    // testing first for valid input
    const object = {
      email: "test.com",
      password: "Hello@12345",
    };
    try {
      await signupSchema.validateAsync(object);
      expect(true).toBe(false);
    } catch (ValidationError) {
      expect(true).toBe(true);
    }
  });
  test("Invalid Password Input Test", async function () {
    // testing first for valid input
    const object = {
      email: "test@test.com",
      password: 12344,
    };
    try {
      await signupSchema.validateAsync(object);
      expect(true).toBe(false);
    } catch (ValidationError) {
      expect(true).toBe(true);
    }
  });
  test("Missing Email", async function () {
    // testing first for valid input
    const object = {
      password: "12344",
    };
    try {
      await signupSchema.validateAsync(object);
      expect(true).toBe(false);
    } catch (ValidationError) {
      expect(true).toBe(true);
    }
  });
});
