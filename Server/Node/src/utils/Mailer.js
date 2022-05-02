import { address, password } from "../config/Config";

const nodemailer = require("nodemailer");

export async function sendMail(dest, id) {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: address,
      pass: password,
    },
  });

  function makeLink(id) {
    return `http://ionic-application.app/activation/${id}`;
  }
  var mailOptions = {
    from: "appActivationMailer",
    to: dest,
    subject: "Activation email",
    html: `Please use the following link to activate your account: <a href="${makeLink(
      id
    )}"> activate</a>`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("mail error");
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}
