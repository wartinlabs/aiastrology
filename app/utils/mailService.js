const nodemailer = require("nodemailer");
const { EMAIL_PASS_OTP, EMAIL_OTP } = require("../config/env");

const sendEmailForOtp = async (email, otp) => {
  try {
    var transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: EMAIL_OTP,
        pass: EMAIL_PASS_OTP,
      },
    });
    let mailOptions = {
      from: "webstaredu@gmail.com",
      to: email,
      subject: "MyG: OTP for Signin",
      html: `<body style="font-family: 'Arial', sans-serif; text-align: center; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 20px auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
          <h1 style="color: #333333; font-size: 28px;">Welcome to MyG!</h1>
          <p style="color: #555555; font-size: 16px;">Dear User,</p>
          <p style="color: #555555; font-size: 16px;">Your Forgot Password OTP is: <strong style="font-weight: bold;">${otp}</strong></p>
      </div>
    </body>
    `,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) console.log(err.message);
      if (info) console.log("email send successfully:", info);
    });

    return { status: true, message: "Send OTP Successfully!" };
  } catch (err) {
    console.log("err", err);
    return { status: false, message: err };
  }
};

module.exports = {
  sendEmailForOtp,
};
