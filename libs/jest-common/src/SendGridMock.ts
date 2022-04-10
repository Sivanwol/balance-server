
const sgMail = require("@sendgrid/mail");

jest.mock("@sendgrid/mail", () => {
  return {
    setApiKey: jest.fn(),
    send: jest.fn()
  };
});
