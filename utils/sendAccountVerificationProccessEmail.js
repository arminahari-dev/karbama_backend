const nodemailer = require("nodemailer");

const sendAccountVerificationProccessEmail = async ({
  to,
  name,
}) => {
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
    subject: "روال تایید حساب",
    html: `
    <h2>سلام ${name} عزیز 👋</h2>
    <p>از ثبت‌نام شما در پلتفرم <strong>کارباما</strong> متشکریم.</p>
    <p>حساب کاربری شما در حال بررسی است و نتیجه آن به زودی از طریق ایمیل به شما اطلاع داده خواهد شد.</p>
    <p>در این مدت، اگر سوالی دارید می‌توانید با پشتیبانی در ارتباط باشید.</p>
    <p>با احترام،<br>تیم کارباما</p>
    `,
  });
};

module.exports = sendAccountVerificationProccessEmail;
