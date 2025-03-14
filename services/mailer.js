const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const OTPTemplate = require("../Template/OTP");

dotenv.config({ path: "./../config.env" });

const NODEMAILER_USER = process.env.NODEMAILER_USER;
const NODEMAILER_APP_PASSWORD = process.env.NODEMAILER_APP_PASSWORD;

// Create a transport using your email service
const transporter = nodemailer.createTransport({
  host: "smtp.google.com",
  port: 465,
  secure: true,
  service: "gmail",
  auth: {
    user: NODEMAILER_USER,
    pass: NODEMAILER_APP_PASSWORD,
  },
});

const Mailer = async ({ name, otp, email }) => {
  const mailOptions = {
    to: email,
    subject: "Verify Your ChatterBox Account",
    html: OTPTemplate({ name, otp }),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email Sent: %s", info.messageId);
  } catch (error) {
    console.log("Error sending email: ", error);
    throw new Error("Error sending mail");
  }
};

module.exports = Mailer;
