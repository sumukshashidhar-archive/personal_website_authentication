const password = require("./password");

describe("Password Test Suite", function () {
  let passw;
  let hashed;
  test("Test Hashing", async function () {
    passw = "TestPassword";
    hashed = await password.hash(passw);
    expect(hashed).toMatch(new RegExp("^\\$2[ayb]\\$.{56}$"));
  });

  test("Test Validation with right password", async function () {
    expect(await password.compare(passw, hashed)).toEqual(true);
  });

  test("Test Validation with wrong password", async function () {
    expect(await password.compare(passw + "wrongString", hashed)).toEqual(
      false
    );
  });
});
