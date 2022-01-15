const signAndValidate = require("./signAndValidate");

describe("JWT Test Suite", function () {
  const usrObj = {
    email: "sumuk@sumuk.org",
    role: "admin",
    data: { test: "Data" },
  };
  let signed;
  test("Test signing JWT", async function () {
    signed = await signAndValidate.sign(usrObj);
    expect(signed).toMatch(
      new RegExp("(^[A-Za-z0-9-_]*.[A-Za-z0-9-_]*.[A-Za-z0-9-_]*$)")
    );
  });
  test("JWT Verification", async function () {
    let decoded = await signAndValidate.validate(signed);
    expect(decoded).toMatchObject(usrObj);
  });
});
