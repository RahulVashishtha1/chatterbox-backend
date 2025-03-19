const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const OTPTemplate = require("../Template/OTP");

// dotenv.config({ path: "./../config.env" });
const NODEMAILER_USER="chatterbox00100@gmail.com"
const NODEMAILER_APP_PASSWORD = "kxevynmlzvntdnyb"

// console.log(NODEMAILER_APP_PASSWORD, NODEMAILER_USER)

// Create a transport using your email service
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
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
    from: `"ChatterBox" <${NODEMAILER_USER}>`, 
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
