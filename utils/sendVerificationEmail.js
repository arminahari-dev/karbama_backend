const nodemailer = require("nodemailer");

const sendVerificationEmail = async ({ to, name, dashboardUrl }) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"کارباما" <${process.env.MAIL_USERNAME}>`,
    to,
    subject: "تایید حساب کاربری",
    html: `
      <h2>سلام ${name} عزیز 👋</h2>
      <p>حساب شما در پلتفرم کارباما تایید شد.</p>
      <p>برای ورود به داشبورد، روی لینک زیر کلیک کنید:</p>
      <a href="${dashboardUrl}/auth" target="_blank">ورود به داشبورد</a>
    `,
  });
};

module.exports = sendVerificationEmail;
